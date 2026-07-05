type AuthFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function AuthField({ label, ...props }: AuthFieldProps) {
  return (
    <label className="block text-sm font-medium text-foreground">
      {label}
      <input
        className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
        {...props}
      />
    </label>
  );
}
