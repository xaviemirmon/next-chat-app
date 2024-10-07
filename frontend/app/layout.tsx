import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/providers/UserProvider";

export const metadata: Metadata = {
  title: "Chat app",
  description: "Chat chat chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider> {children} </UserProvider>
      </body>
    </html>
  );
}
