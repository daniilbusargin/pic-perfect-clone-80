import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Disclaimer, Logo } from "@/components/visitalia";
import { useVisaCase } from "@/lib/visa-case";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Вход в Visitalia — личный кабинет визового кейса" },
      {
        name: "description",
        content:
          "Войдите в Visitalia, чтобы продолжить подготовку документов на туристическую визу в Италию.",
      },
      { property: "og:title", content: "Вход в Visitalia" },
      {
        property: "og:description",
        content: "Личный кабинет для подготовки туристической визы в Италию.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { state, update } = useVisaCase();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("anna.sokolova@example.com");

  const submit = () => {
    update({ authed: true });
    toast.success(mode === "login" ? "Вы вошли в Visitalia" : "Аккаунт создан");
    navigate({ to: state.onboarded ? "/app" : "/onboarding" });
  };

  return (
    <div className="hero-wash flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Logo />
        </div>
        <div className="surface-panel p-7">
          <Tabs value={mode} onValueChange={setMode}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>
          </Tabs>

          <h1 className="mt-6 text-2xl">
            {mode === "login" ? "Продолжим подготовку" : "Создайте аккаунт"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login"
              ? "Войдите, чтобы вернуться к своему визовому кейсу."
              : "Аккаунт нужен, чтобы сохранять документы и статус подготовки."}
          </p>

          <div className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Электронная почта</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Пароль</Label>
              <Input id="password" type="password" defaultValue="visitalia" />
            </div>
            <Button className="w-full" onClick={submit}>
              {mode === "login" ? "Войти" : "Зарегистрироваться"}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full" onClick={submit}>
              <Mail className="h-4 w-4" /> Войти по коду из письма
            </Button>
          </div>

          <div className="mt-6">
            <Disclaimer>
              Это прототип: вход демонстрационный, данные хранятся только в вашем браузере.
            </Disclaimer>
          </div>
        </div>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          <Link to="/" className="underline underline-offset-4">
            Вернуться на главную
          </Link>
        </p>
      </div>
    </div>
  );
}
