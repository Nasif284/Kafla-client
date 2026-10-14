import type { Metadata } from "next";
import "./globals.css";
import Providers from "./provider";

export const metadata: Metadata = {
  title: "Kafla - Collaborative Group Trip Workspace",
  description:
    "Plan itineraries with AI, split expenses, manage packing checklists, and collaborate with your travel group.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f7faf6] text-[#181d1a] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
