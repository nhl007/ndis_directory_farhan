import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import AppProvider from "@/components/Providers";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Disability Forums Directory",
  description: "Directory application of disability forums",
};

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <AppProvider>
          <NavBar />
          {authModal}
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
