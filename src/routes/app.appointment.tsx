import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PlanLock, SectionTitle } from "@/components/visitalia";
import { formatRuDate, useVisaCase } from "@/lib/visa-case";

export const Route = createFileRoute("/app/appointment")({
  head: () => ({ meta: [{ title: "Запись — Visitalia" }, { name: "description", content: "Запись в визовый центр Италии в Москве." }] }),
  component: Appt,
});

const slots = [
  { date: "2026-10-01", time: "09:30" }, { date: "2026-10-01", time: "11:15" },
  { date: "2026-10-02", time: "10:00" }, { date: "2026-10-05", time: "14:45" },
];

function Appt() {
  const { state, update, isPremium, addHistory } = useVisaCase();
  return (
    <div className="space-y-8">
      <SectionTitle overline="Запись" title="Запись в визовый центр" description="Визовый центр Италии, Москва, Малый Толмачёвский пер., 6" />
      {!isPremium ? (
        <PlanLock title="Поиск свободных слотов" description="Мы отслеживаем запись и сообщаем, как только появится подходящее время." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {slots.map((s) => {
            const active = state.appointment?.date === s.date && state.appointment.time === s.time;
            return (
              <Button key={s.date + s.time} variant={active ? "default" : "outline"} className="h-auto justify-start py-4"
                onClick={() => { update({ appointment: s }); addHistory(`Выбрана запись ${formatRuDate(s.date)} ${s.time}`); toast.success("Запись выбрана"); }}>
                {formatRuDate(s.date)}, {s.time}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
