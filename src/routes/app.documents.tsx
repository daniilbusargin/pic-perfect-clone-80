import { createFileRoute } from "@tanstack/react-router";
import { Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CheckRow, SectionTitle, StatusPill } from "@/components/visitalia";
import { useVisaCase } from "@/lib/visa-case";

export const Route = createFileRoute("/app/documents")({
  head: () => ({ meta: [{ title: "Документы — Visitalia" }, { name: "description", content: "Список документов для визы в Италию и их проверка." }] }),
  component: Docs,
});

const cats = ["Основные документы", "Финансы", "Поездка"] as const;

function Docs() {
  const { state, setDocStatus, isPaid, addHistory } = useVisaCase();
  const upload = (id: string, title: string) => {
    setDocStatus(id, "checking", { note: "Проверяем документ…" });
    setTimeout(() => {
      setDocStatus(id, isPaid ? "ok" : "uploaded", {
        note: isPaid ? "Документ соответствует базовым требованиям" : "Загружен. Проверка доступна в Pro",
        checks: isPaid ? [{ label: "Базовые требования выполнены", ok: true }] : undefined,
        fix: undefined,
      });
      addHistory(`Загружен документ: ${title}`);
      toast.success(`${title}: загружено`);
    }, 1200);
  };
  return (
    <div className="space-y-8">
      <SectionTitle overline="Документы" title="Пакет документов" description="Загрузите файлы — мы подскажем, что поправить." />
      {cats.map((c) => (
        <section key={c}>
          <h2 className="text-xl text-foreground">{c}</h2>
          <div className="mt-4 space-y-3">
            {state.docs.filter((d) => d.category === c).map((d) => (
              <div key={d.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="max-w-xl">
                    <p className="font-semibold text-foreground">{d.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{d.hint}</p>
                  </div>
                  <StatusPill status={d.status} />
                </div>
                {d.note ? <p className="mt-3 text-sm text-foreground">{d.note}</p> : null}
                {d.checks ? <ul className="mt-3 space-y-1.5">{d.checks.map((c) => <CheckRow key={c.label} {...c} />)}</ul> : null}
                {d.fix ? <p className="mt-3 rounded-lg bg-warning/12 p-3 text-sm text-warning-foreground">{d.fix}</p> : null}
                {d.id !== "form" && d.id !== "insurance" && d.status !== "ok" && d.status !== "checking" ? (
                  <Button size="sm" variant="outline" className="mt-4" onClick={() => upload(d.id, d.title)}>
                    <Upload className="h-4 w-4" /> {d.status === "missing" ? "Загрузить" : "Загрузить заново"}
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
