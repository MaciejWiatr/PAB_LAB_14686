"use client";

import { signIn } from "@/api/user";
import { saveToken } from "@/helpers/auth.helper";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserRole } from "@/types/user.types";
import {
  Alert,
  Button,
  Card,
  Flex,
  LoadingOverlay,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { push } = useRouter();
  const sp = useSearchParams();
  const message = sp.get("message");
  const username = sp.get("username");
  const { user, refetch: refetchUser, isLoading } = useCurrentUser();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      username: username || "",
      password: "",
    },
  });

  const onSuccess = (response: Awaited<ReturnType<typeof signIn>>) => {
    const { data } = response || {};

    if (data?.access_token) {
      saveToken(data.access_token);
      refetchUser();

      setTimeout(() => {
        push("/admin/books");
      }, 500);
    } else {
      form.setFieldError("username", "Invalid login");
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: signIn,
    onSuccess,
    onError: (err) => {
      form.setFieldError("username", "Invalid login");
    },
  });

  const onSubmit = async (values: any) => {
    mutate(values);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-neutral-800">
      <Card
        pos="relative"
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        w="500"
      >
        {message && (
          <Alert variant="light" color="red" title="Alert" w="100%" mb="md">
            {message}
          </Alert>
        )}
        {!isEmpty(user) && user.role === UserRole.ADMIN && (
          <Alert mb="md">
            You are currently logged in as admin{" "}
            <Link href="/admin/books" className="no-underline text-blue-500">
              Go back to admin panel
            </Link>
          </Alert>
        )}
        <LoadingOverlay
          visible={isPending}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Text fw={500} size="lg" mb="md">
          BookReview Admin login
        </Text>

        <form onSubmit={form.onSubmit(onSubmit)}>
          <Flex direction="column" gap="md">
            <TextInput
              disabled={isPending}
              label="Username"
              key={form.key("username")}
              required
              {...form.getInputProps("username")}
            />
            <TextInput
              disabled={isPending}
              type="password"
              label="Password"
              key={form.key("password")}
              required
              {...form.getInputProps("password")}
            />

            <Button type="submit" color="blue" fullWidth radius="md">
              Sign in
            </Button>
            <Link
              href="/register"
              className="mx-auto no-underline text-blue-500 text-sm"
            >
              Register
            </Link>
          </Flex>
        </form>
      </Card>
    </main>
  );
}
