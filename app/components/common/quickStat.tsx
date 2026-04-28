export  default function QuickStat({ label, value, sublabel }: { label: string; value: string; sublabel: string }) {
  return (
    <div className="rounded-xl bg-card p-3 text-center">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{sublabel}</p>
    </div>
  );
}