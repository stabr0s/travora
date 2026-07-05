import { Logo } from "@/components/layout/Logo";

export function TopBar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-4 md:px-8">
      <div className="md:hidden">
        <Logo />
      </div>

      <div className="hidden md:block">
        <p className="text-sm font-medium text-muted">Travel planning</p>
      </div>

      <div className="size-9 rounded-full bg-surface" aria-hidden />
    </header>
  );
}
