# Деплой Visitalia в Yandex Cloud

Схема: **GitHub Actions → Container Registry → Serverless Container → API Gateway → ваш домен (HTTPS через Certificate Manager)**.

После настройки каждый push в `main` (в том числе изменения из Lovable) автоматически собирает Docker-образ и выкатывает новую ревизию контейнера. Контейнер запускается по запросу, поэтому для MVP с небольшим трафиком это стоит копейки.

В примерах ниже `example.ru` — ваш домен, замените его на свой.

---

## 0. Что понадобится

- Аккаунт в [Yandex Cloud](https://console.yandex.cloud) с платёжным аккаунтом.
- Установленный `yc` CLI:
  ```bash
  curl -sSL https://storage.yandexcloud.net/yandexcloud-yc/install.sh | bash
  yc init   # выберите облако и каталог, в котором будет жить сервис
  ```
- Права администратора репозитория на GitHub (чтобы добавить секреты).

## 1. Реестр, контейнер и сервисные аккаунты

```bash
FOLDER_ID=$(yc config get folder-id)

# Реестр для Docker-образов
yc container registry create --name visitalia
REGISTRY_ID=$(yc container registry get --name visitalia --format json | jq -r .id)

# Пустой Serverless Container (ревизию создаст GitHub Actions)
yc serverless container create --name visitalia
CONTAINER_ID=$(yc serverless container get --name visitalia --format json | jq -r .id)

# Аккаунт, от имени которого контейнер тянет образ и API Gateway вызывает контейнер
yc iam service-account create --name visitalia-runtime
RUNTIME_SA_ID=$(yc iam service-account get --name visitalia-runtime --format json | jq -r .id)
yc resource-manager folder add-access-binding "$FOLDER_ID" \
  --role container-registry.images.puller --subject serviceAccount:"$RUNTIME_SA_ID"
yc serverless container add-access-binding --name visitalia \
  --role serverless-containers.containerInvoker --subject serviceAccount:"$RUNTIME_SA_ID"

# Аккаунт для GitHub Actions: пушит образы и выкатывает ревизии
yc iam service-account create --name visitalia-deployer
DEPLOYER_SA_ID=$(yc iam service-account get --name visitalia-deployer --format json | jq -r .id)
for ROLE in container-registry.images.pusher serverless-containers.editor iam.serviceAccounts.user; do
  yc resource-manager folder add-access-binding "$FOLDER_ID" \
    --role "$ROLE" --subject serviceAccount:"$DEPLOYER_SA_ID"
done
yc iam key create --service-account-name visitalia-deployer --output deployer-key.json

echo "FOLDER_ID=$FOLDER_ID REGISTRY_ID=$REGISTRY_ID RUNTIME_SA_ID=$RUNTIME_SA_ID CONTAINER_ID=$CONTAINER_ID"
```

> `deployer-key.json` — это секретный ключ. Не коммитьте его. После шага 2 удалите файл.

## 2. Настройки в GitHub

В репозитории: **Settings → Secrets and variables → Actions**.

| Где       | Имя                      | Значение                                |
| --------- | ------------------------ | --------------------------------------- |
| Secrets   | `YC_SA_JSON_CREDENTIALS` | всё содержимое `deployer-key.json`      |
| Variables | `YC_FOLDER_ID`           | `FOLDER_ID` из шага 1                   |
| Variables | `YC_REGISTRY_ID`         | `REGISTRY_ID` из шага 1                 |
| Variables | `YC_RUNTIME_SA_ID`       | `RUNTIME_SA_ID` из шага 1               |
| Variables | `YC_CONTAINER_NAME`      | необязательно, по умолчанию `visitalia` |

Пока `YC_FOLDER_ID` не задан, workflow пропускается и ничего не ломает.

Первый деплой: **Actions → Deploy to Yandex Cloud → Run workflow** (ветка `main`). Дальше деплой идёт сам при каждом push в `main`.

## 3. API Gateway

```bash
sed -e "s/<CONTAINER_ID>/$CONTAINER_ID/g" -e "s/<RUNTIME_SA_ID>/$RUNTIME_SA_ID/g" \
  deploy/yandex/api-gateway.yaml > /tmp/visitalia-gw.yaml
yc serverless api-gateway create --name visitalia --spec /tmp/visitalia-gw.yaml
yc serverless api-gateway get --name visitalia --format json | jq -r .domain
```

Последняя команда выведет служебный домен вида `d5d…apigw.yandexcloud.net`. Откройте его в браузере: сайт уже должен работать по HTTPS.

## 4. Свой домен

**Важное ограничение Yandex Cloud:** если DNS домена управляется у регистратора (Reg.ru, Nic.ru и т. п.), к API Gateway можно подключить только поддомен (`www.example.ru`, `app.example.ru`), а сам `example.ru` нельзя. Поэтому есть два варианта.

### Вариант А (рекомендуется): перенести DNS в Yandex Cloud DNS

Так будут работать и `example.ru`, и `www.example.ru`.

1. Создайте публичную зону:
   ```bash
   yc dns zone create --name visitalia --zone example.ru. --public-visibility
   ```
2. У регистратора замените NS-серверы домена на `ns1.yandexcloud.net` и `ns2.yandexcloud.net`. Обновление занимает от нескольких часов до суток.
3. Перенесите в зону существующие записи, если они есть (например MX для почты), **до** смены NS.
4. Выпустите сертификат и подключите домены (шаги 1–3 ниже). При подключении домена в консоли нажмите «Создать запись», и Yandex сам создаст ANAME-запись.

### Вариант Б: оставить DNS у регистратора

Сайт будет открываться на `www.example.ru`. Для голого `example.ru` включите у регистратора перенаправление (redirect) на `https://www.example.ru`.

1. У регистратора добавьте запись: `www  CNAME  <служебный_домен_API-шлюза>.`
2. Выпустите сертификат и подключите домен (шаги ниже).

### Сертификат и подключение домена

1. Запросите сертификат Let's Encrypt (для варианта Б укажите только `www.example.ru`):
   ```bash
   yc certificate-manager certificate request --name visitalia \
     --domains example.ru,www.example.ru --challenge dns
   yc certificate-manager certificate get --name visitalia --full
   ```
2. Вторая команда покажет CNAME-записи вида `_acme-challenge.example.ru → …`. Добавьте их туда, где у вас DNS: у регистратора или в Cloud DNS. **Не удаляйте их после выпуска**, они нужны для автопродления.
3. Дождитесь статуса `ISSUED` (обычно 5–30 минут), затем подключите домены:
   ```bash
   CERT_ID=$(yc certificate-manager certificate get --name visitalia --format json | jq -r .id)
   yc serverless api-gateway add-domain visitalia --domain www.example.ru --certificate-id "$CERT_ID"
   yc serverless api-gateway add-domain visitalia --domain example.ru --certificate-id "$CERT_ID"   # только вариант А
   ```

## 5. Проверка

```bash
curl -I https://www.example.ru/
curl -I https://www.example.ru/pricing
```

Обе команды должны вернуть `HTTP/2 200`.

## Полезно знать

- **Холодный старт.** Если на сайт давно никто не заходил, первый запрос отвечает на 1–3 секунды дольше. Чтобы этого не было, задайте в workflow `revision-provisioned: 1` (один экземпляр всегда готов; это стоит денег и в простое).
- **Данные.** Сейчас это прототип: вход демонстрационный, кейс хранится в браузере пользователя (`localStorage`). Серверной базы данных нет, её нужно будет добавить отдельно.
- **Lovable** продолжает публиковать проект на своём домене. Деплой в Yandex Cloud от этого не зависит и берёт код из `main`.
- **Сборка локально:** `docker build -t visitalia . && docker run -p 8080:8080 visitalia`, затем откройте http://localhost:8080.
