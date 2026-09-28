import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  CalendarClock,
  ShieldCheck,
  Send,
  Plane,
  LifeBuoy,
  BriefcaseBusiness,
  ClipboardCheck,
  Menu,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/visitalia";
import { cn } from "@/lib/utils";
import { formatRuDate, planLabel, useVisaCase } from "@/lib/visa-case";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

const nav = [
  { to: "/app", label: "Главная", icon: LayoutDashboard },
  { to: "/app/case", label: "Мой визовый кейс", icon: BriefcaseBusiness },
  { to: "/app/documents", label: "Документы", icon: FolderOpen },
  { to: "/app/form", label: "Анкета", icon: FileText },
  { to: "/app/appointment", label: "Запись", icon: CalendarClock },
  { to: "/app/insurance", label: "Страховка", icon: ShieldCheck },
  { to: "/app/review", label: "Финальная проверка", icon: ClipboardCheck },
  { to: "/app/submission", label: "Подача", icon: Send },
  { to: "/app/trip", label: "Поездка", icon: Plane },
  { to: "/app/help", label: "Помощь", icon: LifeBuoy },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-0.5">
      {nav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: item.to === "/app" }}
          className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:font-medium data-[status=active]:text-foreground"
        >
          <item.icon className="h-4 w-4 text-muted-foreground group-data-[status=active]:text-primary" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function SideFooter() {
  const { state, daysLeft } = useVisaCase();
  return (
    <div className="space-y-3 border-t border-sidebar-border pt-4">
      <Link
        to="/app/account"
        className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-sidebar-accent"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {state.profile.firstName.charAt(0)}
          {state.profile.lastName.charAt(0)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-foreground">
            {state.profile.firstName} {state.profile.lastName}
          </span>
          <span className="block text-xs text-muted-foreground">Профиль и кейс</span>
        </span>
      </Link>
      <div className="rounded-2xl border border-sidebar-border bg-card p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Тариф</span>
          <Badge
            variant="outline"
            className={cn(
              "rounded-full",
              state.plan === "free"
                ? "border-border text-muted-foreground"
                : "border-premium/30 bg-premium/10 text-premium",
            )}
          >
            {planLabel[state.plan]}
          </Badge>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {state.lifecycle === "expired"
            ? "Срок действия кейса закончился"
            : `Кейс активен до ${formatRuDate(state.expiresAt)}`}
        </p>
        {state.lifecycle === "expiring" ? (
          <p className="mt-1 text-xs font-semibold text-warning-foreground">
            До окончания кейса осталось {daysLeft} дней
          </p>
        ) : null}
        {state.plan === "free" ? (
          <Button asChild size="sm" className="mt-3 w-full">
            <Link to="/pricing">Подключить тариф</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function AppLayout() {
  const { state } = useVisaCase();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!state.authed) navigate({ to: "/auth" });
    else if (!state.onboarded) navigate({ to: "/onboarding" });
  }, [state.authed, state.onboarded, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-68 shrink-0 flex-col justify-between border-r border-sidebar-border bg-sidebar p-4 lg:flex">
          <div>
            <Logo className="px-2 pt-1" />
            <p className="mt-2 mb-6 px-2 text-xs text-muted-foreground">
              Туристическая виза в Италию · Москва
            </p>
            <NavList />
          </div>
          <SideFooter />
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex items-center justify-between gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
            <Logo />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Меню">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-sidebar p-5">
                <div className="mt-6 flex h-full flex-col justify-between">
                  <NavList onNavigate={() => setOpen(false)} />
                  <SideFooter />
                </div>
              </SheetContent>
            </Sheet>
          </header>
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 lg:py-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
