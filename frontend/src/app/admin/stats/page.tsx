"use client";

import { BASE_URL } from "@/api/global";
import { Card, Title, Text, Flex, LoadingOverlay } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { useEffect, useState } from "react";

type StatsQuery = {
  currentStats: {
    usersCount: number;
    booksCount: number;
    reviewCount: number;
  };
};

const document = gql`
  {
    currentStats {
      usersCount
      booksCount
      reviewCount
    }
  }
`;

export default function StatsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: () => request<StatsQuery>(`${BASE_URL}/graphql`, document),
  });

  const stats = data?.currentStats;

  return (
    <main>
      <Title mb="md" order={2}>
        Statistics
      </Title>
      <Card
        pos="relative"
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        w="500"
      >
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Card.Section p={"md"}>
          <Flex direction="column" gap="sm">
            <Text>Books count: {stats?.booksCount}</Text>
            <Text>Users count: {stats?.usersCount}</Text>
            <Text>Reviews count: {stats?.reviewCount}</Text>
          </Flex>
        </Card.Section>
      </Card>
    </main>
  );
}
