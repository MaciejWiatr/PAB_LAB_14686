"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      router.push("/admin/books");
      return;
    }

    router.push("login");
  }, [user, isLoading, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>Redirecting...</p>
    </main>
  );
}
