"use client";

import FeatureProvider from "@/context/feature/FeatureContext";
import { SessionProvider } from "next-auth/react";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SessionProvider>
        <FeatureProvider>{children}</FeatureProvider>
      </SessionProvider>
    </>
  );
}
