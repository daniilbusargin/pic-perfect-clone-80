import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionTitle, Stat } from "@/components/visitalia";
import { useVisaCase } from "@/lib/visa-case";

export const Route = createFileRoute("/app/submission")({
  head: () => ({ meta: [{ title: "Подача — Visitalia" }, { name: "description", content: "Отметьте подачу и следите за статусом." }] }),
  component: Sub,
});

function Sub() {
  const { state, update, addHistory } = useVisaCase();
  const [contract, setContract] = useState("");
  const s = state.submission;
  return (
    <div className="space-y-8">
      <SectionTitle overline="Подача" title="Подача документов" description="После визита в визовый центр укажите номер договора." />
      {s.submitted ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Статус" value="Ожидаем результат" hint="Обычно 10–15 рабочих дней" />
          <Stat label="Договор" value={s.contract ?? "—"} />
          <Stat label="Подано" value={s.submittedAt ?? "—"} />
        </div>
      ) : (
        <div className="surface-panel flex max-w-lg flex-col gap-3 p-6">
          <Input placeholder="Номер договора, например MOS-2026-001234" value={contract} onChange={(e) => setContract(e.target.value)} />
          <Button disabled={!contract.trim()} onClick={() => {
            update({ submission: { submitted: true, contract, channel: "app", submittedAt: "27 сентября 2026" } });
            addHistory("Документы поданы в визовый центр");
            toast.success("Подача отмечена");
          }}>Я подал документы</Button>
        </div>
      )}
    </div>
  );
}
