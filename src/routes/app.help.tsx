import { createFileRoute } from "@tanstack/react-router";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionTitle } from "@/components/visitalia";

export const Route = createFileRoute("/app/help")({
  head: () => ({ meta: [{ title: "Помощь — Visitalia" }, { name: "description", content: "Ответы на частые вопросы о визе в Италию." }] }),
  component: Help,
});

const faq = [
  ["Сколько рассматривается виза?", "Обычно 10–15 рабочих дней, в сезон может быть дольше."],
  ["Нужна ли бронь билетов?", "Достаточно брони или маршрутной квитанции туда и обратно."],
  ["Какая сумма нужна на счёте?", "Ориентир — от 50 € на человека в день поездки."],
  ["Visitalia гарантирует визу?", "Нет. Решение принимает консульство; мы помогаем подготовить пакет без ошибок."],
];

function Help() {
  return (
    <div className="space-y-8">
      <SectionTitle overline="Помощь" title="Частые вопросы" description="Не нашли ответ — напишите на help@visitalia.ru." />
      <Accordion type="single" collapsible className="surface-panel px-6">
        {faq.map(([q, a]) => (
          <AccordionItem key={q} value={q}><AccordionTrigger>{q}</AccordionTrigger><AccordionContent>{a}</AccordionContent></AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
