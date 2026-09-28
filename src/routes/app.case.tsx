import { createFileRoute } from "@tanstack/react-router";

import { SectionTitle, Stat } from "@/components/visitalia";
import { formatRuDate, planLabel, useVisaCase } from "@/lib/visa-case";

export const Route = createFileRoute("/app/case")({
  head: () => ({ meta: [{ title: "Мой визовый кейс — Visitalia" }, { name: "description", content: "Детали и история визового кейса." }] }),
  component: CasePage,
});

function CasePage() {
  const { state, caseStatus } = useVisaCase();
  return (
    <div className="space-y-8">
      <SectionTitle overline="Кейс" title="Мой визовый кейс" description="Туристическая виза C · Италия · подача в Москве" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Статус" value={caseStatus} />
        <Stat label="Тариф" value={planLabel[state.plan]} />
        <Stat label="Активен до" value={formatRuDate(state.expiresAt)} />
      </div>
      <div className="surface-panel p-6">
        <h2 className="text-xl text-foreground">История</h2>
        <ol className="mt-4 space-y-3 border-l border-border pl-5">
          {state.history.map((h, i) => (
            <li key={i}><p className="text-xs text-muted-foreground">{h.at}</p><p className="text-sm text-foreground">{h.text}</p></li>
          ))}
        </ol>
      </div>
    </div>
  );
}
