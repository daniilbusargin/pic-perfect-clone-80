import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderOpen, FileText, CalendarClock, ShieldCheck, ClipboardCheck, Send } from "lucide-react";

import hero from "@/assets/hero-italy.jpg";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/visitalia";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visitalia — виза в Италию без лишней сложности" },
      { name: "description", content: "Соберите документы, заполните анкету, запишитесь и подайте на визу в Италию спокойно и по шагам." },
      { property: "og:title", content: "Visitalia — виза в Италию без лишней сложности" },
      { property: "og:description", content: "Пошаговая подготовка к туристической визе в Италию." },
    ],
  }),
  component: Landing,
});

const steps = [
  { icon: FolderOpen, t: "Документы", d: "Персональный список и проверка каждого файла." },
  { icon: FileText, t: "Анкета", d: "Заполняем по данным паспорта латиницей." },
  { icon: ShieldCheck, t: "Страховка", d: "Подходящие полисы с покрытием от 30 000 €." },
  { icon: CalendarClock, t: "Запись", d: "Ищем свободные слоты в визовом центре." },
  { icon: ClipboardCheck, t: "Проверка", d: "Финальный чек-лист перед подачей." },
  { icon: Send, t: "Подача", d: "Отслеживаем статус до получения паспорта." },
];

export function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
      <Logo />
      <nav className="flex items-center gap-2">
        <Button asChild variant="ghost"><Link to="/pricing">Тарифы</Link></Button>
        <Button asChild><Link to="/auth">Войти</Link></Button>
      </nav>
    </header>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Туристическая виза · Москва</p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-foreground sm:text-6xl">
            Виза в Италию <em className="text-primary">без лишней сложности</em>
          </h1>
          <p className="mt-5 max-w-lg text-muted-foreground">
            Visitalia ведёт вас по шагам: от списка документов до подачи в визовом центре. Всё в одном визовом кейсе.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/auth">Начать бесплатно</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/pricing">Посмотреть тарифы</Link></Button>
          </div>
        </div>
        <img src={hero} alt="Итальянская улица" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg" />
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <h2 className="font-display text-3xl text-foreground">Шесть шагов до визы</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.t} className="rounded-xl border border-border bg-card p-5">
              <s.icon className="h-5 w-5 text-primary" />
              <p className="mt-3 font-semibold text-foreground">{i + 1}. {s.t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
