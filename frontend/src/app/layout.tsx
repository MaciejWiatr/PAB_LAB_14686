import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { QueryProvider } from "@/providers/QueryProvider";
import { Notifications } from "@mantine/notifications";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Projekt PAB Maciej Wiatr",
  description: "Made after working hours with <3 by Maciej Wiatr",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <MantineProvider defaultColorScheme="dark">
            <Notifications />
            {children}
          </MantineProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
