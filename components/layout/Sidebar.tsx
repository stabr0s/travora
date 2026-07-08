"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/layout/Logo";
import { sidebarNavigation } from "@/lib/config/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[var(--sidebar-width)] shrink-0 flex-col border-r border-border bg-background print:hidden md:flex">
      <div className="flex h-[var(--topbar-height)] items-center px-5">
        <Logo />
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Menu
        </p>

        {sidebarNavigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary-subtle text-primary shadow-xs"
                  : "text-muted hover:bg-surface hover:text-foreground active:bg-border-subtle",
              )}
            >
              <Icon
                className={cn(
                  "size-[1.125rem] shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                )}
                strokeWidth={isActive ? 2 : 1.75}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border-subtle p-4">
        <div className="rounded-xl bg-surface px-3 py-3">
          <p className="text-xs font-medium text-foreground">Plan your next trip</p>
          <p className="mt-0.5 text-xs text-muted">Start organizing destinations and routes.</p>
        </div>
      </div>
    </aside>
  );
}
