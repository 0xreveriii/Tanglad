import type { Metadata } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tanglad | Fair work has weight",
  description:
    "A collaborative project tracker that measures task weight, reveals workload imbalance, and guides fairer task decisions.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" data-motion="system" style={{ colorScheme: "dark" }}>
      <body>{children}</body>
    </html>
  );
}
