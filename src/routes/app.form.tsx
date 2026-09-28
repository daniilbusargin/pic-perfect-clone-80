import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Disclaimer, PlanLock, SectionTitle, Stat } from "@/components/visitalia";
import { formatRuDate, useVisaCase } from "@/lib/visa-case";

export const Route = createFileRoute("/app/form")({
  head: () => ({ meta: [{ title: "Анкета — Visitalia" }, { name: "description", content: "Автозаполнение визовой анкеты." }] }),
  component: FormPage,
});

function FormPage() {
  const { state, update, setDocStatus, isPaid, addHistory } = useVisaCase();
  const p = state.profile;
  if (!isPaid) return <div className="space-y-8"><SectionTitle overline="Анкета" title="Визовая анкета" /><PlanLock plan="Pro" cta="Подключить Pro" title="Автозаполнение анкеты" description="Мы заполним анкету латиницей по данным паспорта и профиля." /></div>;
  const generate = () => {
    update({ formStatus: "generating" });
    setTimeout(() => update({ formStatus: "ready" }), 1400);
  };
  const confirm = () => {
    update({ formStatus: "confirmed" });
    setDocStatus("form", "ok", { note: "Анкета подтверждена" });
    addHistory("Анкета подтверждена");
    toast.success("Анкета подтверждена");
  };
  return (
    <div className="space-y-8">
      <SectionTitle overline="Анкета" title="Визовая анкета" description="Краткосрочная виза C, заполняется латиницей." />
      {state.formStatus === "empty" || state.formStatus === "generating" ? (
        <Button onClick={generate} disabled={state.formStatus === "generating"}>{state.formStatus === "generating" ? "Заполняем…" : "Заполнить автоматически"}</Button>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Stat label="Surname" value={translit(p.lastName)} />
            <Stat label="Given names" value={translit(p.firstName)} />
            <Stat label="Date of birth" value={p.birthDate} />
            <Stat label="Passport" value={p.passportNumber} hint={`до ${formatRuDate(p.passportExpires)}`} />
            <Stat label="Trip" value={`${p.tripFrom} — ${p.tripTo}`} />
            <Stat label="Occupation" value={p.employment} />
          </div>
          {state.formStatus === "confirmed" ? <p className="text-success">Анкета подтверждена ✓</p> : <Button onClick={confirm}>Данные верны, подтвердить</Button>}
        </>
      )}
      <Disclaimer>Проверьте данные перед подачей: за ошибки в анкете отвечает заявитель.</Disclaimer>
    </div>
  );
}

function translit(s: string) {
  const m: Record<string, string> = { а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ы: "y", э: "e", ю: "iu", я: "ia", ь: "", ъ: "ie" };
  return s.toLowerCase().split("").map((c) => m[c] ?? c).join("").toUpperCase();
}
