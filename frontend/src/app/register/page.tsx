"use client";

import { register } from "@/api/user";
import {
  Card,
  LoadingOverlay,
  Flex,
  TextInput,
  Button,
  Text,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { push } = useRouter();
  const sp = useSearchParams();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: register,
    onSuccess: ({ data }) => {
      push(`/login?username=${data?.username}`);
    },
    onError: (err) => {
      form.setFieldError("username", err.message);
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
        <LoadingOverlay
          visible={isPending}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Alert mb="md">
          For sake of demo all registered users are admins by default
        </Alert>

        <Text fw={500} size="lg" mb="md">
          Register new user
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
              Register
            </Button>

            <Link
              href="/login"
              className="mx-auto no-underline text-blue-500 text-sm"
            >
              Back to login
            </Link>
          </Flex>
        </form>
      </Card>
    </main>
  );
}
