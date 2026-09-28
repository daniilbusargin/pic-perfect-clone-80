import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/visitalia";
import { cn } from "@/lib/utils";
import { useVisaCase, type Plan } from "@/lib/visa-case";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Тарифы — Visitalia" },
      { name: "description", content: "Бесплатно, Pro и Premium: выберите уровень помощи с визой в Италию." },
      { property: "og:title", content: "Тарифы — Visitalia" },
      { property: "og:description", content: "Сравните тарифы подготовки к визе в Италию." },
    ],
  }),
  component: Pricing,
});

const plans: { id: Plan; name: string; price: string; items: string[] }[] = [
  { id: "free", name: "Бесплатно", price: "0 ₽", items: ["Список документов", "Загрузка файлов", "Базовые подсказки"] },
  { id: "pro", name: "Pro", price: "2 990 ₽", items: ["Проверка документов", "Автозаполнение анкеты", "Подбор страховки", "Финальная проверка"] },
  { id: "premium", name: "Premium", price: "6 990 ₽", items: ["Всё из Pro", "Поиск записи в визовый центр", "Личный менеджер", "Отслеживание подачи"] },
];

function Pricing() {
  const { state, update, addHistory } = useVisaCase();
  const navigate = useNavigate();
  const choose = (p: Plan) => {
    if (!state.authed) {
      navigate({ to: "/auth" });
      return;
    }
    update({ plan: p, lifecycle: "active" });
    addHistory(`Подключён тариф ${p}`);
    toast.success("Тариф подключён");
    navigate({ to: "/app" });
  };
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <Button asChild variant="outline"><Link to={state.authed ? "/app" : "/auth"}>{state.authed ? "В кабинет" : "Войти"}</Link></Button>
      </header>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="font-display text-5xl text-foreground">Тарифы</h1>
        <p className="mt-3 text-muted-foreground">Оплата один раз за визовый кейс, действует 6 месяцев.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.id} className={cn("flex flex-col rounded-2xl border bg-card p-6", p.id === "premium" ? "border-premium/40" : "border-border")}>
              <p className="font-semibold text-foreground">{p.name}</p>
              <p className="mt-2 font-display text-4xl text-foreground">{p.price}</p>
              <ul className="mt-5 flex-1 space-y-2">
                {p.items.map((i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground"><Check className="h-4 w-4 text-success" />{i}</li>
                ))}
              </ul>
              <Button className="mt-6" variant={state.plan === p.id && state.authed ? "outline" : "default"} onClick={() => choose(p.id)}>
                {state.plan === p.id && state.authed ? "Текущий тариф" : "Выбрать"}
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
