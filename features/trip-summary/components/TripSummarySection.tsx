type TripSummarySectionProps = {
  title: string;
  children: React.ReactNode;
};

export function TripSummarySection({ title, children }: TripSummarySectionProps) {
  return (
    <section className="break-inside-avoid rounded-2xl border border-border bg-white p-5 shadow-sm print:border-slate-200 print:shadow-none">
      <h2 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
