import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { CheckRow, SectionTitle } from "@/components/visitalia";
import { useVisaCase } from "@/lib/visa-case";

export const Route = createFileRoute("/app/review")({
  head: () => ({ meta: [{ title: "Финальная проверка — Visitalia" }, { name: "description", content: "Чек-лист перед подачей на визу." }] }),
  component: Review,
});

function Review() {
  const { state } = useVisaCase();
  const items = [
    ...state.docs.map((d) => ({ label: d.title, ok: d.status === "ok" || d.status === "uploaded" })),
    { label: "Анкета подтверждена", ok: state.formStatus === "confirmed" },
    { label: "Страховка оформлена", ok: !!state.insurance },
    { label: "Запись выбрана", ok: !!state.appointment },
  ];
  const all = items.every((i) => i.ok);
  return (
    <div className="space-y-8">
      <SectionTitle overline="Проверка" title="Финальная проверка" description="Всё ли готово к визиту в визовый центр." />
      <ul className="surface-panel space-y-2 p-6">{items.map((i) => <CheckRow key={i.label} {...i} />)}</ul>
      {all ? <Button asChild><Link to="/app/submission">Перейти к подаче</Link></Button> : <p className="text-sm text-muted-foreground">Закройте отмеченные пункты, чтобы перейти к подаче.</p>}
    </div>
  );
}
