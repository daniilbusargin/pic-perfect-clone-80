import { Link } from "@tanstack/react-router";
import { Lock, Check, AlertTriangle, Clock, Upload, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DocStatus } from "@/lib/visa-case";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("inline-flex items-baseline gap-1", className)}>
      <span className="font-display text-2xl leading-none text-primary">Visitalia</span>
      <span className="h-1.5 w-1.5 rounded-full bg-accent-foreground/70" />
    </Link>
  );
}

export function SectionTitle({
  overline,
  title,
  description,
  children,
}: {
  overline?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {overline ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {overline}
          </p>
        ) : null}
        <h1 className="mt-2 text-3xl leading-tight text-foreground sm:text-4xl">{title}</h1>
        {description ? <p className="mt-3 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}

const statusMap: Record<DocStatus, { label: string; className: string; icon: typeof Check }> = {
  missing: {
    label: "Не загружен",
    className: "bg-muted text-muted-foreground border-border",
    icon: Upload,
  },
  uploaded: {
    label: "Загружен",
    className: "bg-secondary text-secondary-foreground border-border",
    icon: Check,
  },
  checking: {
    label: "Проверяется",
    className: "bg-accent text-accent-foreground border-accent",
    icon: Clock,
  },
  ok: {
    label: "Всё в порядке",
    className: "bg-success/12 text-success border-success/30",
    icon: Check,
  },
  attention: {
    label: "Требует внимания",
    className: "bg-warning/18 text-warning-foreground border-warning/40",
    icon: AlertTriangle,
  },
};

export function StatusPill({ status }: { status: DocStatus }) {
  const s = statusMap[status];
  const Icon = s.icon;
  return (
    <Badge variant="outline" className={cn("gap-1.5 rounded-full px-2.5 py-1", s.className)}>
      <Icon className="h-3.5 w-3.5" />
      {s.label}
    </Badge>
  );
}

export function PlanLock({
  title,
  description,
  plan = "Premium",
  cta = "Перейти на Premium",
}: {
  title: string;
  description: string;
  plan?: string;
  cta?: string;
}) {
  return (
    <div className="surface-panel relative overflow-hidden p-8 text-center">
      <div className="hero-wash pointer-events-none absolute inset-0 opacity-70" />
      <div className="relative mx-auto max-w-xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-premium/30 bg-premium/10 px-3 py-1 text-xs font-semibold text-premium">
          <Lock className="h-3.5 w-3.5" /> Доступно в {plan}
        </span>
        <h2 className="mt-5 text-2xl text-foreground">{title}</h2>
        <p className="mt-3 text-sm text-muted-foreground">{description}</p>
        <Button asChild className="mt-6">
          <Link to="/pricing">
            <Sparkles className="h-4 w-4" /> {cta}
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function CheckRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      {ok ? (
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
      ) : (
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
      )}
      <span className={ok ? "text-foreground" : "text-warning-foreground"}>{label}</span>
    </li>
  );
}

export function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-base font-semibold text-foreground">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-border bg-muted/60 p-3 text-xs text-muted-foreground">
      {children}
    </p>
  );
}
