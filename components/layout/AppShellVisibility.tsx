"use client";

import { usePathname } from "next/navigation";

import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { isPublicDemoTripPathname } from "@/components/layout/logo-routing";

type AppShellVisibilityProps = {
  children: React.ReactNode;
};

export function AppShellVisibility({ children }: AppShellVisibilityProps) {
  const pathname = usePathname();

  if (isPublicDemoTripPathname(pathname)) {
    return (
      <main className="min-h-screen bg-surface">
        <PageContainer className="max-w-6xl py-5 sm:py-6 md:py-8">
          {children}
        </PageContainer>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <TopBar />

        <main className="flex-1 pb-24 print:pb-0 md:pb-0">
          <PageContainer>{children}</PageContainer>
        </main>

        <MobileNavigation />
      </div>
    </div>
  );
}
