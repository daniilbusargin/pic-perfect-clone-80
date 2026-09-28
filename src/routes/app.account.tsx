import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { SectionTitle, Stat } from "@/components/visitalia";
import { formatRuDate, planLabel, useVisaCase } from "@/lib/visa-case";

export const Route = createFileRoute("/app/account")({
  head: () => ({ meta: [{ title: "Профиль — Visitalia" }, { name: "description", content: "Профиль, тариф и управление кейсом." }] }),
  component: Account,
});

function Account() {
  const { state, update, reset } = useVisaCase();
  const navigate = useNavigate();
  const p = state.profile;
  return (
    <div className="space-y-8">
      <SectionTitle overline="Профиль" title={`${p.firstName} ${p.lastName}`} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Дата рождения" value={formatRuDate(p.birthDate)} />
        <Stat label="Паспорт" value={p.passportNumber} />
        <Stat label="Тариф" value={planLabel[state.plan]} />
      </div>
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline"><Link to="/pricing">Сменить тариф</Link></Button>
        <Button variant="outline" onClick={reset}>Начать кейс заново</Button>
        <Button variant="ghost" onClick={() => { update({ authed: false }); navigate({ to: "/" }); }}>Выйти</Button>
      </div>
    </div>
  );
}
