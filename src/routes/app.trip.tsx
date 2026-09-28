import { createFileRoute } from "@tanstack/react-router";

import { CheckRow, SectionTitle, Stat } from "@/components/visitalia";
import { formatRuDate, useVisaCase } from "@/lib/visa-case";

export const Route = createFileRoute("/app/trip")({
  head: () => ({ meta: [{ title: "Поездка — Visitalia" }, { name: "description", content: "Памятка перед поездкой в Италию." }] }),
  component: Trip,
});

function Trip() {
  const { state } = useVisaCase();
  return (
    <div className="space-y-8">
      <SectionTitle overline="Поездка" title="Перед поездкой" description="Что взять с собой на границу." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Stat label="Вылет" value={formatRuDate(state.profile.tripFrom)} />
        <Stat label="Возвращение" value={formatRuDate(state.profile.tripTo)} />
      </div>
      <ul className="surface-panel space-y-2 p-6">
        {["Паспорт с визой", "Распечатка страховки", "Бронь отеля", "Обратные билеты", "Наличные или карта для подтверждения средств"].map((l) => <CheckRow key={l} label={l} ok />)}
      </ul>
    </div>
  );
}
