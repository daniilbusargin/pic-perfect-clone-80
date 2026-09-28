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
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Logo />
        <nav className="flex items-center gap-1.5">
          <Button asChild variant="ghost"><Link to="/pricing">Тарифы</Link></Button>
          <Button asChild><Link to="/auth">Войти</Link></Button>
        </nav>
      </div>
    </header>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="hero-wash">
        <div className="mx-auto max-w-3xl px-5 pt-20 pb-14 text-center sm:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-[13px] text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Туристическая виза · Москва
          </span>
          <h1 className="mt-6 text-4xl text-foreground sm:text-6xl">
            Виза в Италию <span className="text-primary">без лишней сложности</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Visitalia ведёт вас по шагам: от списка документов до подачи в визовом центре. Всё в одном визовом кейсе.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg"><Link to="/auth">Начать бесплатно</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/pricing">Посмотреть тарифы</Link></Button>
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-5">
          <img src={hero} alt="Итальянская улица" className="aspect-[16/8] w-full rounded-3xl border border-border object-cover" />
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-5 py-24">
        <p className="eyebrow text-center">Как это работает</p>
        <h2 className="mt-2 text-center text-3xl text-foreground sm:text-4xl">Шесть шагов до визы</h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.t} className="rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-surface">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium text-muted-foreground">0{i + 1}</span>
              </div>
              <p className="mt-5 font-semibold text-foreground">{s.t}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-8 text-sm text-muted-foreground">
          <Logo />
          <span>Подготовка к туристической визе в Италию</span>
        </div>
      </footer>
    </div>
  );
}
