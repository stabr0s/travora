import { AppShellVisibility } from "@/components/layout/AppShellVisibility";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return <AppShellVisibility>{children}</AppShellVisibility>;
}
