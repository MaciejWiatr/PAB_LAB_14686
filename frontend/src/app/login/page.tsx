"use client";

import { signIn } from "@/api/user";
import { saveToken } from "@/helpers/auth.helper";
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
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const { push } = useRouter();
  const sp = useSearchParams();
  const message = sp.get("message");

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      password: "",
    },
  });

  const onSuccess = (response: Awaited<ReturnType<typeof signIn>>) => {
    const { data } = response;

    saveToken(data.access_token);
    push("/admin/books");
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-blue-100">
      <Card
        pos="relative"
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        w="500"
      >
        {message && (
          <Alert variant="light" color="red" title="Alert" w="100%">
            {message}
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
          </Flex>
        </form>
      </Card>
    </main>
  );
}
