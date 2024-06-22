"use client";

import { apiGetAllBooks } from "@/api/books";
import {
  apiCreateReview,
  apiGetAllReviews,
  apiRemoveReview,
} from "@/api/review";
import { apiAllUsers } from "@/api/user";
import { formatDate } from "@/helpers/date.helper";
import { GetSchema } from "@/types/backend.helper";
import {
  Button,
  Flex,
  Group,
  Modal,
  Table,
  TextInput,
  Title,
  NumberInput,
  Select,
  Rating,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function Reviews() {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<GetSchema<"CreateReviewDto">>({
    transformValues: (v) => {
      const newV = { ...v, bookId: Number(v.bookId), userId: Number(v.userId) };

      return newV;
    },
  });

  const {
    data: reviews,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: apiGetAllReviews,
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: apiAllUsers,
  });

  const { data: books } = useQuery({
    queryKey: ["books"],
    queryFn: apiGetAllBooks,
  });

  const { mutate: addReview } = useMutation({
    mutationFn: apiCreateReview,
    onSuccess: () => {
      notifications.show({
        title: "Review Added",
        message: "The review was successfully added",
      });
      refetch();
    },
  });

  const { mutate: removeReview } = useMutation({
    mutationFn: apiRemoveReview,
    onSuccess: () => {
      notifications.show({
        title: "Review Deleted",
        message: "The review was successfully deleted",
      });
      refetch();
    },
  });

  const rows = isLoading
    ? []
    : reviews?.data?.map((review) => (
        <Table.Tr key={review.id}>
          <Table.Td>
            <Rating value={review.rating} />
          </Table.Td>
          <Table.Td>{review.user.username}</Table.Td>
          <Table.Td>{formatDate(review.createdAt)}</Table.Td>
          <Table.Td>
            <Button
              onClick={() => removeReview({ id: String(review.id) })}
              color="red"
            >
              Remove
            </Button>
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
        title="Add Review"
      >
        <form
          onSubmit={form.onSubmit((values) => {
            addReview(values);
            close();
          })}
        >
          <Select
            label="Book"
            key={form.key("bookId")}
            {...form.getInputProps("bookId")}
            data={
              books?.data?.map((b) => ({
                label: b.name,
                value: String(b.id),
              })) || []
            }
          />

          <Select
            label="Reviewer"
            key={form.key("userId")}
            {...form.getInputProps("userId")}
            data={
              users?.data?.map((u) => ({
                label: u.username,
                value: String(u.id),
              })) || []
            }
          />
          <NumberInput
            label="Rating"
            {...form.getInputProps("rating")}
            required
            min={1}
            max={5}
          />
          <Button type="submit" color="blue" fullWidth mt="md">
            Save
          </Button>
        </form>
      </Modal>
      <Flex direction="column" gap="md">
        <Group justify="space-between">
          <Title order={2}>Reviews</Title>
          <Button
            onClick={() => {
              open();
            }}
          >
            Add Review
          </Button>
        </Group>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Rating</Table.Th>
              <Table.Th>User</Table.Th>
              <Table.Th>Created At</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Flex>
    </main>
  );
}
