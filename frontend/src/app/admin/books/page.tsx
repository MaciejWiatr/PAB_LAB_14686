"use client";

import { getAllBooks } from "@/api/books";
import { formatDate } from "@/helpers/date.helper";
import { Button, Flex, Group, Table, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function Books() {
  const { data: books, isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: getAllBooks,
  });

  const rows = isLoading
    ? []
    : books?.map((b) => (
        <Table.Tr key={b.id}>
          <Table.Td>{b.name}</Table.Td>
          <Table.Td>{b.description}</Table.Td>
          <Table.Td>{formatDate(b.publishedAt)}</Table.Td>
          <Table.Td>{b?.user?.username}</Table.Td>
        </Table.Tr>
      ));

  return (
    <main>
      <Flex direction="column" gap="md">
        <Group justify="space-between">
          <Title order={2}>Books</Title>
          <Button>Add new </Button>
        </Group>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Published at</Table.Th>
              <Table.Th>Author name</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Flex>
    </main>
  );
}
