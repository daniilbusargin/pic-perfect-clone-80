import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SectionTitle, Stat } from "@/components/visitalia";
import { formatRuDate, useVisaCase } from "@/lib/visa-case";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Кабинет — Visitalia" }, { name: "description", content: "Обзор вашего визового кейса." }] }),
  component: Dashboard,
});

function Dashboard() {
  const { state, readiness, docsReady, caseStatus } = useVisaCase();
  const next = state.docs.some((d) => d.status === "missing" || d.status === "attention")
    ? { to: "/app/documents" as const, t: "Дозагрузите документы" }
    : state.formStatus !== "confirmed" ? { to: "/app/form" as const, t: "Заполните анкету" }
    : !state.insurance ? { to: "/app/insurance" as const, t: "Оформите страховку" }
    : !state.appointment ? { to: "/app/appointment" as const, t: "Выберите запись" }
    : { to: "/app/submission" as const, t: "Отметьте подачу" };
  return (
    <div className="space-y-8">
      <SectionTitle overline="Главная" title={`Здравствуйте, ${state.profile.firstName}`} description="Вот где сейчас ваш визовый кейс." />
      <div className="surface-panel p-6">
        <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Готовность кейса</span><span className="font-semibold text-foreground">{readiness}%</span></div>
        <Progress value={readiness} className="mt-3" />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-foreground">Следующий шаг: <b>{next.t}</b></p>
          <Button asChild><Link to={next.to}>Перейти <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Статус" value={caseStatus} />
        <Stat label="Документы" value={`${docsReady} из ${state.docs.length}`} />
        <Stat label="Поездка" value={formatRuDate(state.profile.tripFrom)} hint={`до ${formatRuDate(state.profile.tripTo)}`} />
        <Stat label="Запись" value={state.appointment ? `${formatRuDate(state.appointment.date)}, ${state.appointment.time}` : "Не выбрана"} />
      </div>
    </div>
  );
}
