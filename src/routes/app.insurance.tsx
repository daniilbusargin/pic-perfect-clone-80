import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/visitalia";
import { useVisaCase } from "@/lib/visa-case";

export const Route = createFileRoute("/app/insurance")({
  head: () => ({ meta: [{ title: "Страховка — Visitalia" }, { name: "description", content: "Медицинская страховка для шенгенской визы." }] }),
  component: Ins,
});

const offers = [
  { provider: "Ингосстрах", price: 1450, coverage: "30 000 €" },
  { provider: "РЕСО", price: 1290, coverage: "30 000 €" },
  { provider: "Альфа", price: 1990, coverage: "50 000 €" },
];

function Ins() {
  const { state, update, setDocStatus, addHistory } = useVisaCase();
  const period = `${state.profile.tripFrom} — ${state.profile.tripTo}`;
  return (
    <div className="space-y-8">
      <SectionTitle overline="Страховка" title="Медицинская страховка" description={`Покрытие по всему Шенгену на период ${period}.`} />
      <div className="grid gap-4 md:grid-cols-3">
        {offers.map((o) => {
          const chosen = state.insurance?.provider === o.provider;
          return (
            <div key={o.provider} className="rounded-xl border border-border bg-card p-5">
              <p className="font-semibold text-foreground">{o.provider}</p>
              <p className="mt-1 text-sm text-muted-foreground">Покрытие {o.coverage}</p>
              <p className="mt-3 font-display text-3xl text-foreground">{o.price} ₽</p>
              <Button className="mt-4 w-full" variant={chosen ? "outline" : "default"} disabled={chosen}
                onClick={() => { update({ insurance: { ...o, period } }); setDocStatus("insurance", "ok", { note: `Полис ${o.provider}` }); addHistory(`Оформлена страховка ${o.provider}`); toast.success("Полис оформлен"); }}>
                {chosen ? "Оформлено" : "Оформить"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
