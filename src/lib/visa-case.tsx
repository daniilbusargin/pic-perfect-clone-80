import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Plan = "free" | "pro" | "premium";

export type DocStatus = "missing" | "uploaded" | "checking" | "ok" | "attention";

export type DocCheck = { label: string; ok: boolean };

export type DocItem = {
  id: string;
  title: string;
  category: "Основные документы" | "Финансы" | "Поездка";
  hint: string;
  status: DocStatus;
  note?: string;
  checks?: DocCheck[];
  fix?: string;
};

export type Appointment = { date: string; time: string } | null;

export type Insurance = { provider: string; price: number; coverage: string; period: string } | null;

export type Submission = {
  submitted: boolean;
  contract?: string;
  channel?: "email" | "manager" | "app";
  submittedAt?: string;
};

export type Profile = {
  firstName: string;
  lastName: string;
  birthDate: string;
  passportNumber: string;
  passportIssued: string;
  passportExpires: string;
  tripFrom: string;
  tripTo: string;
  employment: string;
  previousVisas: string;
  travellingAlone: string;
};

export type CaseState = {
  authed: boolean;
  onboarded: boolean;
  plan: Plan;
  profile: Profile;
  docs: DocItem[];
  formStatus: "empty" | "generating" | "ready" | "confirmed";
  insurance: Insurance;
  appointment: Appointment;
  submission: Submission;
  expiresAt: string;
  lifecycle: "active" | "expiring" | "expired";
  history: { at: string; text: string }[];
};

const initialDocs: DocItem[] = [
  {
    id: "passport",
    title: "Загранпаспорт",
    category: "Основные документы",
    hint: "Паспорт должен быть действителен не менее 3 месяцев после возвращения.",
    status: "ok",
    note: "Документ соответствует базовым требованиям",
    checks: [
      { label: "Срок действия достаточен", ok: true },
      { label: "Есть две чистые страницы", ok: true },
      { label: "Данные совпадают с профилем", ok: true },
    ],
  },
  {
    id: "passport-copies",
    title: "Копии страниц паспорта",
    category: "Основные документы",
    hint: "Разворот с фото и все страницы с отметками и визами.",
    status: "ok",
    note: "Документ соответствует базовым требованиям",
    checks: [
      { label: "Читаемое качество сканов", ok: true },
      { label: "Разворот с фото загружен", ok: true },
    ],
  },
  {
    id: "form",
    title: "Визовая анкета",
    category: "Основные документы",
    hint: "Анкета на краткосрочную визу C. Заполняется латиницей по данным паспорта.",
    status: "missing",
  },
  {
    id: "photo",
    title: "Фотография",
    category: "Основные документы",
    hint: "35×45 мм, светлый фон, снимок не старше 6 месяцев.",
    status: "ok",
    note: "Документ соответствует базовым требованиям",
    checks: [
      { label: "Формат 35×45 мм", ok: true },
      { label: "Светлый однородный фон", ok: true },
    ],
  },
  {
    id: "bank",
    title: "Банковская выписка",
    category: "Финансы",
    hint: "За последние 3 месяца, с движением средств и остатком.",
    status: "attention",
    note: "Выписка старше рекомендуемого срока",
    checks: [
      { label: "ФИО владельца счёта совпадает", ok: true },
      { label: "Виден остаток на счёте", ok: true },
      { label: "Выписка выдана не ранее 30 дней назад", ok: false },
    ],
    fix: "Запросите новую выписку в банке за последние 3 месяца и загрузите её повторно. Датой выдачи должна быть дата не ранее, чем за месяц до подачи.",
  },
  {
    id: "employment",
    title: "Справка с работы",
    category: "Финансы",
    hint: "На бланке организации: должность, оклад, дата выдачи, контакты.",
    status: "attention",
    note: "Не найден номер телефона работодателя",
    checks: [
      { label: "ФИО совпадает", ok: true },
      { label: "Указана должность", ok: true },
      { label: "Есть дата выдачи", ok: true },
      { label: "Указан телефон работодателя", ok: false },
    ],
    fix: "Попросите отдел кадров добавить контактный телефон организации — консульство может позвонить для подтверждения занятости.",
  },
  {
    id: "hotel",
    title: "Бронь проживания",
    category: "Поездка",
    hint: "Подтверждение на все ночи поездки с вашим именем.",
    status: "ok",
    note: "Документ соответствует базовым требованиям",
    checks: [
      { label: "Имя гостя совпадает с паспортом", ok: true },
      { label: "Даты покрывают всю поездку", ok: true },
      { label: "Указан адрес и контакты отеля", ok: true },
    ],
  },
  {
    id: "tickets",
    title: "Билеты и маршрут",
    category: "Поездка",
    hint: "Бронь или билеты туда и обратно, маршрут по дням.",
    status: "uploaded",
    note: "Загружен, ожидает проверки",
  },
  {
    id: "insurance",
    title: "Медицинская страховка",
    category: "Поездка",
    hint: "Покрытие не менее 30 000 €, действует на всю зону Шенгена.",
    status: "missing",
  },
  {
    id: "consent",
    title: "Согласие на обработку данных",
    category: "Основные документы",
    hint: "Подписывается в визовом центре, распечатайте заранее.",
    status: "uploaded",
    note: "Загружен, ожидает проверки",
  },
];

const initialState: CaseState = {
  authed: false,
  onboarded: false,
  plan: "free",
  profile: {
    firstName: "Анна",
    lastName: "Соколова",
    birthDate: "1992-04-18",
    passportNumber: "75 1234567",
    passportIssued: "2021-06-02",
    passportExpires: "2031-06-02",
    tripFrom: "2026-10-10",
    tripTo: "2026-10-19",
    employment: "Работаю по найму",
    previousVisas: "Да, была шенгенская виза",
    travellingAlone: "Еду один",
  },
  docs: initialDocs,
  formStatus: "empty",
  insurance: null,
  appointment: null,
  submission: { submitted: false },
  expiresAt: "2027-03-14",
  lifecycle: "active",
  history: [
    { at: "14 сентября 2026", text: "Визовый кейс создан" },
    { at: "16 сентября 2026", text: "Загружены паспорт и копии страниц" },
    { at: "21 сентября 2026", text: "Проверена бронь проживания" },
  ],
};

type Ctx = {
  state: CaseState;
  update: (patch: Partial<CaseState>) => void;
  setDocStatus: (id: string, status: DocStatus, patch?: Partial<DocItem>) => void;
  addHistory: (text: string) => void;
  reset: () => void;
  readiness: number;
  docsReady: number;
  caseStatus: string;
  daysLeft: number;
  isPaid: boolean;
  isPremium: boolean;
};

const VisaCaseContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "visitalia.case.v1";

export function VisaCaseProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CaseState>(initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as CaseState) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const value = useMemo<Ctx>(() => {
    const update = (patch: Partial<CaseState>) => setState((s) => ({ ...s, ...patch }));

    const docsReady = state.docs.filter((d) => d.status === "ok" || d.status === "uploaded").length;
    const parts = [
      docsReady / state.docs.length,
      state.formStatus === "confirmed" ? 1 : state.formStatus === "ready" ? 0.6 : 0,
      state.insurance ? 1 : 0,
      state.appointment ? 1 : 0,
      state.submission.submitted ? 1 : 0,
    ];
    const readiness = Math.round(
      parts[0]! * 45 + parts[1]! * 15 + parts[2]! * 12 + parts[3]! * 16 + parts[4]! * 12,
    );

    const caseStatus = state.lifecycle === "expired"
      ? "Архив"
      : state.submission.submitted
        ? "Ожидаем результат"
        : state.appointment
          ? "Готов к подаче"
          : docsReady >= state.docs.length - 1
            ? "Готов к записи"
            : state.onboarded
              ? "Собираем документы"
              : "Создан";

    const daysLeft = Math.max(
      0,
      Math.round(
        (new Date(state.expiresAt).getTime() - new Date("2026-09-27").getTime()) / 86400000,
      ),
    );

    return {
      state,
      update,
      setDocStatus: (id, status, patch) =>
        setState((s) => ({
          ...s,
          docs: s.docs.map((d) => (d.id === id ? { ...d, status, ...patch } : d)),
        })),
      addHistory: (text) =>
        setState((s) => ({
          ...s,
          history: [...s.history, { at: "27 сентября 2026", text }],
        })),
      reset: () => setState({ ...initialState, authed: true }),
      readiness,
      docsReady,
      caseStatus,
      daysLeft: state.lifecycle === "expiring" ? 14 : daysLeft,
      isPaid: state.plan !== "free" && state.lifecycle !== "expired",
      isPremium: state.plan === "premium" && state.lifecycle !== "expired",
    };
  }, [state]);

  return <VisaCaseContext.Provider value={value}>{children}</VisaCaseContext.Provider>;
}

export function useVisaCase() {
  const ctx = useContext(VisaCaseContext);
  if (!ctx) throw new Error("useVisaCase должен использоваться внутри VisaCaseProvider");
  return ctx;
}

export const planLabel: Record<Plan, string> = {
  free: "Бесплатно",
  pro: "Pro",
  premium: "Premium",
};

export function formatRuDate(iso: string) {
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ];
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
