"use client";

import { usePathname } from "next/navigation";

import { Logo } from "@/components/layout/Logo";
import { navigationItems } from "@/lib/config/navigation";
import { cn } from "@/lib/utils";

export function TopBar() {
  const pathname = usePathname();
  const currentPage = navigationItems.find((item) => item.href === pathname);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-[var(--topbar-height)] shrink-0 items-center justify-between print:hidden",
        "border-b border-border/60 bg-background/80 px-4 backdrop-blur-md md:px-8",
      )}
    >
      <div className="flex min-w-0 items-center gap-4 md:hidden">
        <Logo compact />
      </div>

      <div className="hidden min-w-0 md:block">
        <p className="truncate text-lg font-semibold tracking-tight text-foreground">
          {currentPage?.label ?? "Travora"}
        </p>
        <p className="truncate text-xs text-muted">Private travel planning</p>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="hidden size-9 rounded-xl border border-border bg-surface shadow-xs sm:block"
          aria-hidden
        />
        <div
          className="size-9 rounded-full border-2 border-background bg-surface shadow-sm ring-1 ring-border"
          aria-label="Profile placeholder"
          role="img"
        />
      </div>
    </header>
  );
}
