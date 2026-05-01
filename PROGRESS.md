# Investment Dashboard — Estado al cierre 2026-05-01

> **Documento de continuidad**. Si abres una sesión nueva en este proyecto, lee
> este archivo primero antes de tocar nada. Refleja el estado al cierre de la
> sesión del 2026-05-01.

---

## TL;DR para retomar

- ✅ **Producción live sin contraseña**: https://dashboard.bentorcapital.com
- ✅ Datos actualizados con todo lo nuevo (cárnico, SpaceX, Indexa x2, Trade
  Republic, Potes, oro extra, Pabellón pagado, Habitalia #21 paralizado,
  Rebel rewriteado, FutureChat eliminado, etc.)
- ✅ Métricas nuevas (XIRR, equity-pure, dual chart) deployadas
- ⚠️ **GitHub NO sincronizado** — hay 16 commits locales sin pushear porque la
  cuenta de GitHub `atlantis-hq` no tiene sesión accesible. La prod se subió
  por `vercel --prod` directo desde el Mac mini, bypaseando GitHub.
- ⚠️ Dev server local sigue corriendo en `mac-mini-de-reiser.tail9ede59.ts.net:5173`
  (puede matarse con `pkill -f "node.*vite"` si molesta).

## Cómo retomar en próxima sesión

1. Lee este archivo entero.
2. Verifica que el daemon API está vivo: `launchctl list | grep bentor` (deben aparecer 4).
3. Verifica que la prod responde: `curl -s "https://dashboard.bentorcapital.com/api/portfolio?bust=$(date +%s)" | python3 -m json.tool | head -30`.
4. Si el usuario quiere pushear a GitHub: necesita acceder a la cuenta `atlantis-hq` o darte un PAT con `repo` scope. Sin eso, sigue solo en local + Vercel CLI.

---

## Resumen de la sesión 2026-05-01

Sesión larga reorientando el dashboard hacia métricas honestas y limpiando data.

### Decisiones de visualización (cerradas con el usuario)

1. **Headline**: `GainHero` con "Ganancia +€" + "Rent. anualizada XIRR/año" en
   paralelo. Below the fold: total invertido / valor actual / activos brutos /
   deuda hipotecaria.
2. **XIRR siempre visible** (incluso valores feos). `holdYears` contextualiza.
3. **Equity-pure framing**: totalInvested y totalValue son cash de bolsillo
   (mortgages excluidas). `grossAssetValue` y `mortgageDebt` aparte.
4. **Evolution chart**: dos líneas — invested (gris dashed) + value (verde).
   Área shaded entre ellas = ganancia acumulada visible.
5. **Histórico de valor**: `valuations` table es la fuente. Loans con histórico
   real (DB). Quotes table reflejada para current month (BTC live, etc.).

### Pendientes que el usuario aún no ha decidido

- **Potes 2015 vs 2024**: hoy tx date está en 2015-01-01 (placeholder por
  "hace muchos años"). Eso lleva el holdYears del portfolio a 11.33y y el XIRR
  a 5.37%. Si lo movemos a 2024-01-01 (inicio de "tracking"), el XIRR sube a
  ~26%. Esperar input del usuario.
- **Per-asset XIRR**: ¿mostrar XIRR por loan/property/holding individual o solo
  agregado por categoría?
- **Time period selectors**: ¿añadir YTD, 1Y, since-inception?
- **OverviewMobile.jsx**: replicar el GainHero + chart dual (no actualizado).
- **Oro como categoría propia** (no "monetary").
- **Indicar visualmente loans frozen** (Habitalia #21, RE privado) en la lista
  de loans.

---

## Commits locales (16 ahead, sin pushear)

```
40217a0 chore: vite dev proxy to local API + final progress notes
8dfb515 feat(frontend): equity-pure headline + dual-line evolution chart
bddede6 feat(backend): dual-line evolution + realized income in totals
e093142 feat(backend): equity-pure framing for portfolio totals
cd6f467 feat(backend): support frozen/bullet loans + rental income in cashflows
af931af feat(backend): money-weighted return (XIRR) per portfolio and category
db8b4d4 feat(backend): move cashflow/evolution/alerts compute to server
9f727ab feat(backend): daily quote fetcher + live BTC valuation
1f1d4df feat(backend): daily portfolio snapshots + extract domain layer
73dbdd4 feat(ops): daily pg_dump backup with 30-day rotation
3bc881e feat(frontend): wire dashboard to live API with static fallback
9030674 feat(backend): self-hosted Postgres API on Mac mini
79ba0b7 redesign(real-estate): integrate Claude Design v2 handoff
af03c19 feat(real-estate): add Real Estate category with yield metrics
126a953 Merge redesign-v2: integrate Claude Design handoff
8298895 redesign(dashboard): integrate Claude Design handoff
```

### Por qué no se han pusheado

- `gh auth status` dice "token invalid"
- macOS Keychain pide unlock GUI (headless devuelve `<NULL>`)
- `~/.netrc` y `~/.git-credentials` no existen
- No hay `GITHUB_TOKEN`/`GH_TOKEN` en env ni shell rcs
- SSH key existe pero no añadida a GitHub
- El usuario **no tiene sesión/contraseña** de la cuenta `atlantis-hq` a mano
- Se intentó device flow OAuth (códigos `1617-B4E0`, `A291-1438`, `5A99-D4DA`) — el usuario no llegó a autorizarlos.

### Cómo pushear cuando se pueda

Opción A — `gh auth login --web` (requiere navegador):

```bash
gh auth login --hostname github.com --git-protocol https --web
gh auth setup-git
git push origin main
```

Opción B — PAT directo:

```bash
# Generar token en https://github.com/settings/tokens (scope: repo)
# Luego:
git config --global credential.helper store
echo "https://x-access-token:<PAT>@github.com" >> ~/.git-credentials
git push origin main
rm ~/.git-credentials  # si quieres limpiar después
```

Opción C — Device flow OAuth (lo que se intentó):

```bash
RESP=$(curl -s -X POST https://github.com/login/device/code \
  -H "Accept: application/json" \
  -d "client_id=178c6fc778ccc68e1d6a&scope=repo")
echo "$RESP"  # imprime user_code y verification_uri
# Usuario abre URL e introduce code (15 min ventana)
# Polling al endpoint /login/oauth/access_token con device_code
```

Opción D — Vercel CLI bypass (lo que SÍ se hizo):

```bash
vercel --prod --yes  # deploy directo desde local, bypasea GitHub
```

---

## Cambios de data en DB (todos commiteados al estado actual)

### Fechas corregidas

| Asset | Antes | Ahora |
|-------|-------|-------|
| BTC (1.04 unidades, 78K) | 2026-04-25 | 2025-10-01 |
| Oro 100g x5 (70K) | 2026-04-25 | 2026-01-01 |
| Oro 100g x1 más (13.1K) | — | 2025-12-01 (nuevo) |
| Piso Gijón | 2024-06-15 | 2025-10-01 |
| Piso Vitoria | 2025-03-10 | 2026-03-01 |
| Pabellón Industrial | 2024-10-01 | 2025-05-01 |
| Habitalia (PE) | 2024-01-01 | 2024-10-01 |
| Rebel Tickets | 2024-01-01 (75K único) | 2023-04-01 (15K) + 2024-12-01 (60K) |

### Cambios estructurales RE

- **Pabellón**: pagado entero (`cash: true`, `loan: 0`, `equity: 1.32M`).
  Borrada tx mortgage 840K, equity tx subida a 1.32M.
- **Inmuebles Potes**: nuevo asset (placeholder 2015-01-01, valor 500K, fully
  paid). Renta backfilleada solo desde 2025 (15K en 2025-01-01 + 5K parcial
  2026-04-30). User dijo "alquilamos desde 2025".
- Valuations insertadas a 2026-05-01 para los 4 inmuebles con su `currentValue`
  para que la línea del chart use lógica uniforme.

### Loans

- **Habitalia #21 paralizado**: cuotas 8-10 (Dic 2025 - Feb 2026) revertidas
  a `default`, txs `interest_payment`/`principal_payment` correspondientes
  borradas. Metadata: `frozen: true, frozenSince: '2025-12-01'`.
- **Préstamo Inmobiliario privado** 45K @ 20% / 18m, frozen desde compra
  (2024-12-01). Sin schedules, sin pagos.
- **Préstamo Cárnico** 25K @ 15% / 12m mensual (2026-03-01).
- **SpaceX IPO Loan** 50K @ 25% / 18m bullet (2026-04-01). `bullet_payment: true`.

### ETF/Fondos (nuevos)

- **Indexa Capital** 150K @ 3.5% esperado (2026-02-01).
- **Indexa Capital (6%)** 30K @ 6% esperado (2026-04-01).

### Renta Fija

- **Revolut** corrección 70K → 100K (mismo start 2026-01-20).
- **Trade Republic Renta Fija** 30K @ 2.1% TAE (2026-03-31, nuevo).

### PE/VC

- **FutureChat ELIMINADO** (no se invirtió finalmente).
- **Rebel Tickets**: rewrite con dos tickets reales. Valuation actual 122K
  (4.067% de 3M valuation). Histórico: 15K (2023-04) → 101.67K (2024-12) → 122K (2026-05).
- **Habitalia (PE)**: histórico 180K (2024-10) → 700K (2026-04). 35% de 2M valuation.
- **Enzo Ventures**: markup eliminado, valuation = invested = 100K.

---

## Cambios de código (todos commiteados al estado actual)

### `server/compute.mjs`

- `computeCashflow` / `computeEvolutionDualFromDB` / `computeAlerts`
- `computeReturns()` con XIRR Newton-Raphson + bisección [-0.9999, 10]
- `loadCashflows`: añade `rent_received`, `distribution`, `dividend` como
  positivos; `expense`, `mortgage_payment` como negativos
- Cashflow projection skipea loans `frozen`, `bulletPayment`, `paysMonthly === false`
- Evolution dual respeta `quotes` table en mes actual (BTC live)

### `server/portfolio.mjs`

- `loans[]`: añade `frozen`, `frozenSince`, `paysMonthly`, `bulletPayment`,
  status='Paralizado' cuando frozen
- Buckets equity-pure: loan = capital + interestEarned, RE = equity neto + rent
- `realizedIncomeByAsset` agregado a current values (rent/dividend per asset)
- `portfolioSummary` incluye `xirrPct`, `holdYears`, `grossAssetValue`,
  `mortgageDebt`
- `categoryAllocation[]` añade `xirrPct` y `holdYears`

### `src/pages/Overview.jsx`

- `GainHero` reemplaza `HeroKPI`: ganancia €/XIRR%/año en paralelo + secondary metrics
- `EvolutionChart` con 2 paths (invested dashed + value sólido) + área verde gap
- KPI grid reducido a 2 cols (Liquidez + Ilíquido). CAGR retirado.

### `vite.config.js`

- Dev server con proxy `/api/portfolio` → `127.0.0.1:8443/portfolio` con bearer
  inyectado desde `API_TOKEN` env. `host: 0.0.0.0` para acceso vía Tailscale.

### `src/data/portfolio.js`

- `computeEvolution()` fallback ahora devuelve `{month, invested, value}` con
  value=invested (sin histórico mock).

### Sin tocar (avisar antes de modificar)

- `src/pages/OverviewMobile.jsx` — sigue con headline antiguo
- `src/pages/RealEstateMobile.jsx` y `RealEstatePage.jsx` — usan `realEstate.summary`
  con shape gross. Funcionan, pero podrían adaptarse al equity framing.

---

## Estado live actual (datos al cierre 2026-05-01)

```
Portfolio (equity-pure)
  Total invertido:  3.324.434 €
  Valor actual:     3.880.332 €
  Ganancia:         +555.898 €  (+16,72%)
  XIRR:             +5,37% / año (sobre 11,33y, dominado por Potes 2015)

  Activos brutos:   4.009.832 €
  Deuda hipotecaria:  149.500 € (Gijón 47.5K + Vitoria 102K)

Categorías:
  ETF/Fondos    +15,34%   xirr +13,03%  (Gestivalue + 2x Indexa)  308K → 356K
  Monetary       -7,06%   xirr -19,21%  (Oro 6 onzas)              83K →  77K
  Crypto        -13,19%   xirr -21,59%  (BTC 1.04)                 78K →  68K
  Renta Fija     +0,52%   xirr  +2,26%  (Revolut + Trade Republic) 130K → 131K
  Loans          +5,18%   xirr  +7,94%  (21 Habitalia + 3 alt)     358K → 376K
  PE           +222,35%   xirr +99,5%   (Habitalia + Rebel)        255K → 822K
  VC              0%      xirr   0%     (Coben + Enzo)             150K → 150K
  Real Estate    -3,86%   xirr  -0,91%  (Gijón + Vitoria + Pab + Potes) 1.96M → 1.90M
```

---

## Infraestructura

### Daemons launchd activos

| Label | Schedule | Función |
|-------|----------|---------|
| `com.bentor.dashboard-api` | KeepAlive | Node API server (server/index.mjs) en :8443 |
| `com.bentor.dashboard-quotes` | 00:30 daily | Pull precios CoinGecko/metals/Yahoo → `quotes` |
| `com.bentor.dashboard-snapshot` | 01:00 daily | Computa portfolio del día → `portfolio_snapshots` |
| `com.bentor.dashboard-backup` | 03:30 daily | `pg_dump` gzipped en `~/Backups/bentor/`, rota 30 días |

Logs en `~/Library/Logs/bentor-{api,quotes,snapshot,backup}.{log,err.log}`.

### Producción

- **Frontend**: dashboard.bentorcapital.com (Vercel, sin auth básica desde
  esta sesión vía `DASHBOARD_USERS={"_disabled":""}` en Vercel env).
- **Backend**: `mac-mini-de-reiser.tail9ede59.ts.net:443` vía Tailscale Funnel
  → `127.0.0.1:8443` Node API.
- **DB**: postgresql@16 local, db `bentor`, user `bentor`.

### Vercel CLI

- Authed como `reisertorres` (token en `~/Library/Application Support/com.vercel.cli/auth.json`)
- Project ID: `prj_qMNaYUhbBetYXZz5PcAuTYlIWDhB`
- Org ID: `team_Cd58NH7soxyFIi2OFKM72TlB`

---

## Comandos útiles

```bash
# Reiniciar daemon API tras editar server/*
launchctl kickstart -k gui/$(id -u)/com.bentor.dashboard-api

# Test buildShape en local (sanity)
node -e "import('./server/portfolio.mjs').then(async m => {
  const s = await m.buildShape();
  console.log(s.portfolioSummary);
  await m.pool.end();
})"

# Bypass Vercel CDN
curl "https://dashboard.bentorcapital.com/api/portfolio?bust=$(date +%s)" | python3 -m json.tool

# Dev server local (preview pre-push)
npm run dev   # → http://mac-mini-de-reiser.tail9ede59.ts.net:5173

# Test proxy local
curl http://localhost:5173/api/portfolio | python3 -m json.tool

# Daemons bentor
launchctl list | grep bentor

# Logs en vivo
tail -f ~/Library/Logs/bentor-*.log

# Re-deploy a producción (desde local sin GitHub)
vercel --prod --yes

# Snapshot manual (también corre cada noche)
npm run db:snapshot

# Quotes manual (también corre cada noche)
npm run db:quotes
```

---

## Schema rápido

7 tablas: `assets`, `transactions`, `valuations`, `loan_schedules`,
`re_cashflows`, `quotes`, `portfolio_snapshots`.

Migration histórica: `supabase/migrations/0001_initial_schema.sql` (carpeta
heredada, ya no se usa Supabase — todo es self-hosted).

Categorías de assets: `etf_fund`, `monetary`, `crypto`, `fixed_income`, `loan`,
`pe`, `vc`, `real_estate`.

Tipos de transactions: `buy`, `sell`, `dividend`, `interest_payment`,
`principal_payment`, `fee`, `contribution`, `distribution`, `rent_received`,
`expense`, `mortgage_payment`.

---

## Memoria persistente

Hay una memoria de Claude (`/Users/reiser/.claude/projects/-Users-reiser/memory/investment-dashboard-redesign.md`)
que apunta a este archivo. Cualquier sesión nueva con auto-memory cargada lo
sabrá.
