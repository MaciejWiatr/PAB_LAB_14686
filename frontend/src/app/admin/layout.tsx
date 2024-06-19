"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserRole } from "@/types/user.types";
import { AppShell, Burger, NavLink } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { BarChart, Book, NotepadText, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, PropsWithChildren, useEffect } from "react";

const AdminLayout: FC<PropsWithChildren> = ({ children }) => {
  const [opened, { toggle }] = useDisclosure();
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !user) return;

    if (user.role !== UserRole.ADMIN) {
      router.push("/login?message=Users are not allowed in admin panel");
    }
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
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <div>
          Logged in as {user?.username} / {user?.role}
        </div>
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
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default AdminLayout;
