"use client";

import { removeToken } from "@/helpers/auth.helper";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserRole } from "@/types/user.types";
import {
  AppShell,
  Burger,
  Button,
  Flex,
  LoadingOverlay,
  NavLink,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { isEmpty } from "lodash";
import { BarChart, Book, LogOut, NotepadText, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, PropsWithChildren, useEffect } from "react";

const AdminLayout: FC<PropsWithChildren> = ({ children }) => {
  const [opened, { toggle }] = useDisclosure();
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();

  console.log(user, isLoading);

  useEffect(() => {
    if (isLoading) return;

    if (isEmpty(user)) {
      router.push("/login?message=You are not logged in");
      return;
    }

    if (!isEmpty(user) && user.role !== UserRole.ADMIN) {
      router.push("/login?message=Users are not allowed in admin panel");
      return;
    }

    return;
  }, [isLoading, router, user]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Flex justify="space-between" align="center" h="100%" p="sm">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <div>
            Logged in as {user?.username}, role: {user?.role}
          </div>
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavLink
          href="/admin/users"
          label="Users"
          leftSection={<Users size={20} />}
        />
        <NavLink
          href="/admin/books"
          label="Books"
          leftSection={<Book size={20} />}
        />
        <NavLink
          href="/admin/reviews"
          label="Reviews"
          leftSection={<NotepadText size={20} />}
        />
        <NavLink
          href="/admin/stats"
          label="Statistics"
          leftSection={<BarChart size={20} />}
        />
        <Button
          mt="auto"
          color="red"
          variant="light"
          onClick={() => {
            removeToken();
            router.push("/login");
          }}
        >
          <LogOut className="mr-2" size={20} /> Log out
        </Button>
      </AppShell.Navbar>

      <AppShell.Main className="relative">
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        {children}
      </AppShell.Main>
    </AppShell>
  );
};

export default AdminLayout;
