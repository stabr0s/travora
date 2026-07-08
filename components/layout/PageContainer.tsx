import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--content-max-width)] px-4 py-6 print:max-w-none print:p-0 sm:px-6 md:px-8 md:py-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
