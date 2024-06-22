"use client";

import {
  apiCreateUser,
  apiGetAllUsers,
  apiRemoveUser,
  apiUpdateUser,
} from "@/api/user";
import { GetSchema } from "@/types/backend.helper";
import {
  Button,
  Flex,
  Group,
  Modal,
  Table,
  TextInput,
  Title,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Users() {
  const [opened, { open, close }] = useDisclosure(false);
  const [modalMode, setModalMode] = useState<"edit" | "add">("edit");

  const form = useForm<
    (GetSchema<"CreateUserDto"> | GetSchema<"UpdateUserDto">) & { id?: number }
  >({
    transformValues: (v) => ({
      ...v,
      role: v.role,
    }),
  });

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: apiGetAllUsers,
  });

  const { mutate: addUser } = useMutation({
    mutationFn: apiCreateUser,
    onSuccess: ({ error, data }) => {
      if (!error) {
        notifications.show({
          title: "User created",
          message: `User ${data.username} was created`,
        });

        refetch();
      }
    },
  });

  const { mutate: removeUser } = useMutation({
    mutationFn: apiRemoveUser,
    onSuccess: ({ error }) => {
      if (!error) {
        notifications.show({
          title: "User removed",
          message: "User was successfully removed",
        });

        refetch();
      }
    },
  });

  const { mutate: updateUser } = useMutation({
    mutationFn: apiUpdateUser,
    onSuccess: ({ error }) => {
      if (!error) {
        notifications.show({
          title: "User updated",
          message: "User details were updated",
        });

        refetch();
      }
    },
  });

  const rows = isLoading
    ? []
    : users?.data?.map((u) => (
        <Table.Tr key={u.id}>
          <Table.Td>{u.username}</Table.Td>
          <Table.Td>{u.role}</Table.Td>
          <Table.Td>
            <Group>
              <Button
                onClick={() => removeUser({ id: String(u.id) })}
                color="red"
              >
                Remove
              </Button>
              <Button
                onClick={() => {
                  form.setFieldValue("username", u.username);
                  form.setFieldValue("role", u.role as any);
                  form.setFieldValue("id", u.id);
                  setModalMode("edit");
                  open();
                }}
              >
                Edit
              </Button>
            </Group>
          </Table.Td>
        </Table.Tr>
      ));

  return (
    <main>
      <Modal
        opened={opened}
        onClose={() => {
          form.reset();
          close();
        }}
        title={`${modalMode === "add" ? "Add" : "Edit"} User`}
      >
        <form
          onSubmit={form.onSubmit((data) => {
            if (modalMode === "edit") {
              updateUser({
                id: String(data.id),
                data: {
                  username: data.username,
                  role: data.role,
                },
              });
            } else {
              addUser({
                username: data.username!,
                password: data.password!,
                role: data.role!,
              });
            }
            close();
          })}
        >
          <TextInput
            display="none"
            key={form.key("id")}
            {...form.getInputProps("id")}
          />
          <TextInput
            label="Username"
            key={form.key("username")}
            required
            {...form.getInputProps("username")}
          />
          {modalMode === "add" && (
            <TextInput
              label="Password"
              key={form.key("password")}
              required
              {...form.getInputProps("password")}
            />
          )}
          <Select
            label="Role"
            key={form.key("role")}
            required
            {...form.getInputProps("role")}
            data={[
              { label: "User", value: "USER" },
              { label: "Admin", value: "ADMIN" },
            ]}
          />
          <Button type="submit" color="blue" fullWidth radius="md" mt="md">
            Save
          </Button>
        </form>
      </Modal>
      <Flex direction="column" gap="md">
        <Group justify="space-between">
          <Title order={2}>Users</Title>
          <Button
            onClick={() => {
              setModalMode("add");
              open();
            }}
          >
            Add new
          </Button>
        </Group>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Username</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Flex>
    </main>
  );
}
