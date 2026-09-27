import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Lock } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Disclaimer, Logo, Stat } from "@/components/visitalia";
import { formatRuDate, useVisaCase, type Profile } from "@/lib/visa-case";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Создание визового кейса — Visitalia" },
      {
        name: "description",
        content:
          "Заполните базовые данные, и Visitalia соберёт персональный список документов на туристическую визу в Италию.",
      },
      { property: "og:title", content: "Создание визового кейса — Visitalia" },
      {
        property: "og:description",
        content: "Несколько вопросов — и персональный план подготовки к подаче готов.",
      },
    ],
  }),
  component: Onboarding,
});

const steps = ["Параметры поездки", "Данные заявителя", "Паспорт", "О вас"];

function Onboarding() {
  const { state, update, addHistory } = useVisaCase();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Profile>(state.profile);
  const [done, setDone] = useState(false);

  const set = (key: keyof Profile, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const finish = () => {
    update({ profile: form, onboarded: true, authed: true });
    addHistory("Визовый кейс создан и параметры поездки сохранены");
    setDone(true);
  };

  if (done) {
    return (
      <div className="hero-wash flex min-h-screen items-center justify-center px-4 py-12">
        <div className="surface-panel w-full max-w-2xl p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/12 text-success">
            <Check className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-3xl">Ваш визовый кейс создан</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Мы подготовили персональный список документов и порядок шагов до подачи.
          </p>
          <div className="mt-7 grid gap-3 text-left sm:grid-cols-2">
            <Stat label="Шаг 1" value="Соберите документы" hint="10 пунктов в вашем списке" />
            <Stat label="Шаг 2" value="Заполните анкету" hint="Латиницей по данным паспорта" />
            <Stat label="Шаг 3" value="Оформите страховку" hint="Покрытие от 30 000 €" />
            <Stat label="Шаг 4" value="Выберите запись" hint="Слоты визового центра в Москве" />
          </div>
          <div className="mt-7 rounded-xl border border-border bg-muted/50 p-4 text-left">
            <p className="text-sm font-semibold text-foreground">Готовность кейса</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Мы оцениваем полноту и согласованность документов, а не вероятность решения
              консульства.
            </p>
          </div>
          <Button className="mt-7 w-full sm:w-auto" onClick={() => navigate({ to: "/app" })}>
            Перейти в кейс <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            Кейс активен до {formatRuDate(state.expiresAt)}. Платные функции доступны в рамках одной
            визовой заявки и не более 6 месяцев.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <Logo />
          <Link to="/" className="text-sm text-muted-foreground underline underline-offset-4">
            Выйти
          </Link>
        </div>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Шаг {step + 1} из {steps.length}
          </p>
          <h1 className="mt-2 text-3xl">{steps[step]}</h1>
          <Progress value={((step + 1) / steps.length) * 100} className="mt-4 h-2" />
        </div>

        <div className="surface-panel mt-6 p-6">
          {step === 0 ? (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Страна", value: "Италия" },
                  { label: "Цель поездки", value: "Туризм" },
                  { label: "Город подачи", value: "Москва" },
                ].map((p) => (
                  <div key={p.label} className="rounded-xl border border-border bg-muted/50 p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {p.label}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                      {p.value} <Lock className="h-3 w-3 text-muted-foreground" />
                    </p>
                  </div>
                ))}
              </div>
              <Disclaimer>
                Сейчас Visitalia работает с туристической визой категории C и подачей в Москве.
                Другие типы виз, города и заявки на семью появятся позже.
              </Disclaimer>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="from">Планируемая дата выезда</Label>
                  <Input
                    id="from"
                    type="date"
                    value={form.tripFrom}
                    onChange={(e) => set("tripFrom", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="to">Планируемая дата возвращения</Label>
                  <Input
                    id="to"
                    type="date"
                    value={form.tripTo}
                    onChange={(e) => set("tripTo", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="first">Имя</Label>
                <Input
                  id="first"
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last">Фамилия</Label>
                <Input
                  id="last"
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="birth">Дата рождения</Label>
                <Input
                  id="birth"
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => set("birthDate", e.target.value)}
                />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="passport">Номер загранпаспорта</Label>
                <Input
                  id="passport"
                  value={form.passportNumber}
                  onChange={(e) => set("passportNumber", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="issued">Дата выдачи</Label>
                <Input
                  id="issued"
                  type="date"
                  value={form.passportIssued}
                  onChange={(e) => set("passportIssued", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="expires">Дата окончания</Label>
                <Input
                  id="expires"
                  type="date"
                  value={form.passportExpires}
                  onChange={(e) => set("passportExpires", e.target.value)}
                />
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Статус занятости</Label>
                <RadioGroup
                  value={form.employment}
                  onValueChange={(v) => set("employment", v)}
                  className="gap-2"
                >
                  {["Работаю по найму", "Самозанятый или ИП", "Студент", "Не работаю", "Пенсионер"].map(
                    (o) => (
                      <label
                        key={o}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                      >
                        <RadioGroupItem value={o} /> {o}
                      </label>
                    ),
                  )}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Были ли ранее шенгенские визы?</Label>
                <RadioGroup
                  value={form.previousVisas}
                  onValueChange={(v) => set("previousVisas", v)}
                  className="gap-2"
                >
                  {["Да, была шенгенская виза", "Нет, подаю впервые"].map((o) => (
                    <label
                      key={o}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                    >
                      <RadioGroupItem value={o} /> {o}
                    </label>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Вы едете один?</Label>
                <RadioGroup
                  value={form.travellingAlone}
                  onValueChange={(v) => set("travellingAlone", v)}
                  className="gap-2"
                >
                  {["Еду один", "Еду с семьёй или спутниками"].map((o) => (
                    <label
                      key={o}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                    >
                      <RadioGroupItem value={o} /> {o}
                    </label>
                  ))}
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                  В MVP кейс оформляется на одного заявителя. Заявки на семью появятся позже.
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="h-4 w-4" /> Назад
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>
              Далее <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={finish}>
              Создать визовый кейс <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
