import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lazorkit Passkey Demo",
  description: "Passwordless Solana wallet with passkey technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}