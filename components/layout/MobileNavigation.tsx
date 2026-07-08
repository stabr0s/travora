"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { mobileNavigation } from "@/lib/config/navigation";
import { cn } from "@/lib/utils";

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/90 backdrop-blur-md print:hidden md:hidden",
        "shadow-nav",
      )}
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom,0px)] pt-1">
        {mobileNavigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[0.6875rem] font-medium transition-all duration-150",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-xl transition-colors duration-150",
                  isActive ? "bg-primary-subtle" : "group-hover:bg-surface",
                )}
              >
                <Icon className="size-[1.125rem] shrink-0" strokeWidth={isActive ? 2 : 1.75} />
              </span>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
