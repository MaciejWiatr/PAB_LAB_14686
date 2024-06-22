"use client";

import {
  apiCreateBook,
  apiGetAllBooks,
  apiRemoveBook,
  apiUpdateBook,
} from "@/api/books";
import { apiAllUsers } from "@/api/user";
import { formatDate } from "@/helpers/date.helper";
import { GetSchema } from "@/types/backend.helper";
import {
  Button,
  Flex,
  Group,
  Modal,
  Select,
  Table,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Books() {
  const [opened, { open, close }] = useDisclosure(false);
  const [modalMode, setModalMode] = useState<"edit" | "add">("edit");

  const form = useForm<
    (GetSchema<"CreateBookDto"> | GetSchema<"UpdateBookDto">) & { id?: number }
  >({
    transformValues: (v) => {
      const newV = {
        ...v,
        userId: Number(v.userId),
      };

      return newV;
    },
  });

  const {
    data: books,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["books"],
    queryFn: apiGetAllBooks,
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: apiAllUsers,
  });

  const { mutate: addBook } = useMutation({
    mutationFn: apiCreateBook,
    onSuccess: ({ error, data }) => {
      if (!error) {
        notifications.show({
          title: "Created new book",
          message: `Book #${data.id} was created`,
        });

        refetch();
      }
    },
  });

  const { mutate: removeBook } = useMutation({
    mutationFn: apiRemoveBook,
    onSuccess: ({ error }) => {
      if (!error) {
        notifications.show({
          title: "Removed a book",
          message: "Book was removed",
        });

        refetch();
      }
    },
  });

  const { mutate: updateBook } = useMutation({
    mutationFn: apiUpdateBook,
    onSuccess: ({ error }) => {
      if (!error) {
        refetch();
      }
    },
  });

  const rows = isLoading
    ? []
    : books?.data?.map((b) => (
        <Table.Tr key={b.id}>
          <Table.Td>{b.name}</Table.Td>
          <Table.Td>{b.description}</Table.Td>
          <Table.Td>{formatDate(b.publishedAt)}</Table.Td>
          <Table.Td>{b?.user?.username}</Table.Td>
          <Table.Td>
            <Group>
              <Button
                onClick={() => removeBook({ id: String(b.id) })}
                color="red"
              >
                Remove
              </Button>
              <Button
                onClick={() => {
                  form.setFieldValue("description", b.description);
                  form.setFieldValue("name", b.name);
                  form.setFieldValue("id", b.id);
                  form.setFieldValue(
                    "publishedAt",
                    new Date(b.publishedAt) as unknown as string
                  );
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
        title={`${modalMode === "add" ? "Add" : "Edit"} book`}
      >
        <form
          onSubmit={form.onSubmit((data) => {
            if (modalMode === "edit") {
              updateBook({
                id: String(data.id),
                data: {
                  description: data.description,
                  name: data.name,
                  publishedAt: data.publishedAt,
                  userId: data.userId,
                },
              });
            } else {
              addBook({
                description: data.description!,
                name: data.name!,
                publishedAt: data.publishedAt!,
                userId: data.userId!,
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
            label="Description"
            key={form.key("name")}
            required
            {...form.getInputProps("name")}
          />
          <Textarea
            label="Description"
            key={form.key("description")}
            required
            {...form.getInputProps("description")}
          />
          <DateInput
            label="Published At"
            key={form.key("publishedAt")}
            {...form.getInputProps("publishedAt")}
          />
          <Select
            label="Author"
            key={form.key("userId")}
            {...form.getInputProps("userId")}
            data={
              users?.data?.map((u) => ({
                label: u.username,
                value: String(u.id),
              })) || []
            }
          />
          <Button type="submit" color="blue" fullWidth radius="md" mt="md">
            Save
          </Button>
        </form>
      </Modal>
      <Flex direction="column" gap="md">
        <Group justify="space-between">
          <Title order={2}>Books</Title>
          <Button
            onClick={() => {
              setModalMode("add");
              open();
            }}
          >
            Add new{" "}
          </Button>
        </Group>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Published at</Table.Th>
              <Table.Th>Author name</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Flex>
    </main>
  );
}
