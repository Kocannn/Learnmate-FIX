import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/context/Providers";

export const metadata: Metadata = {
  title: "Learnmate",
  description: "LearnMate - Your companion for effective learning",
  generator: "learnmate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <body>{children}</body>
      </Provider>
    </html>
  );
}
