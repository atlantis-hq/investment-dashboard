# Investment Dashboard — Progress (sesión 2026-05-01)

Documento de continuidad por si la sesión cae. Refleja estado real al final
de la sesión 2026-05-01.

## Resumen ejecutivo

Sesión completa de redesign de métricas (XIRR, equity-pure framing, dual-line
evolution chart) + limpieza profunda de data: nuevas inversiones, fechas reales,
loans paralizados, valuaciones intermedias para PE.

Backend, frontend y data lista. Dev server corriendo accesible vía Tailscale.

## Para ver el resultado

Dev server con proxy al API local:

```
http://mac-mini-de-reiser.tail9ede59.ts.net:5173
```

(Cualquier equipo en tu Tailnet — desktop, móvil, etc.)

## Decisiones de visualización (definidas con el usuario)

1. **Headline**: `GainHero` con "Ganancia +€" y "Rent. anualizada XIRR/año"
   en paralelo. Below the fold: total invertido / valor actual / activos brutos
   / deuda hipotecaria.
2. **XIRR siempre visible** (incluso valores feos). `holdYears` contextualiza.
3. **Equity-pure framing**: totalInvested y totalValue son cash de bolsillo
   (mortgages excluidas). `grossAssetValue` y `mortgageDebt` aparte.
4. **Evolution chart**: dos líneas — invested (gris dashed) + value (verde).
   Área shaded entre ellas = ganancia acumulada visible.
5. **Histórico de valor**: `valuations` table es la fuente. Loans con histórico
   real (DB). Quotes table reflejada para current month (BTC live, etc.).

## Lo que está hecho (commiteado, sin pushear)

```
8dfb515 feat(frontend): equity-pure headline + dual-line evolution chart
bddede6 feat(backend): dual-line evolution + realized income in totals
e093142 feat(backend): equity-pure framing for portfolio totals
cd6f467 feat(backend): support frozen/bullet loans + rental income in cashflows
af931af feat(backend): money-weighted return (XIRR) per portfolio and category
db8b4d4 feat(backend): move cashflow/evolution/alerts compute to server
+ commits previos: snapshot daemon, pg_dump backup, frontend wiring,
  self-hosted Postgres API, redesign frontend
```

14 commits ahead de origin/main. Sin pushear (gh auth bloqueado).

### Cambios de data en DB

**Fechas corregidas**:
- BTC: 2025-10-01
- Oro físico: 2026-01-01 (5 onzas, 70K) + 2025-12-01 (1 onza más, 13.1K) → 6 unidades 83.1K total
- Pisos: Gijón 2025-10-01 / Vitoria 2026-03-01 / Pabellón 2025-05-01

**Estructura RE**:
- Pabellón pagado entero (cash, sin hipoteca) → equity 1.32M, loan 0
- Inmuebles Potes (placeholder 2015-01-01, valor 500K, fully paid, 15K/año netos)
  - Renta backfilleada solo desde 2025
- Real Estate valuations insertadas a 2026-05-01 con currentValue de cada uno
  (para que la línea de chart pinte uniformemente)

**Loans**:
- Habitalia #21 (45K @ 9%) **paralizado** desde Diciembre 2025 — cuotas 8-10
  revertidas a 'default', txs de interest/principal correspondientes borradas,
  metadata.frozen=true
- **Préstamo Inmobiliario privado** 45K @ 20% / 18m — frozen desde compra (2024-12-01)
- **Préstamo Cárnico** 25K @ 15% / 12m mensual (2026-03-01)
- **SpaceX IPO Loan** 50K @ 25% / 18m bullet (2026-04-01)

**ETF/Fondos**:
- **Indexa Capital** 150K @ 3.5% esperado (2026-02-01)
- **Indexa Capital (6%)** 30K @ 6% esperado (2026-04-01)

**Renta Fija**:
- **Revolut** 70K → 100K (corrección, mismo start 2026-01-20)
- **Trade Republic Renta Fija** 30K @ 2.1% TAE (2026-03-31)

**PE/VC**:
- **FutureChat eliminado** (no se invirtió finalmente)
- **Rebel Tickets** rewrite: tickets 15K (abr-2023 @ 900K val) + 60K (dic-2024 @ 2.5M val), valuation actual 122K
- **Habitalia** (PE): tx date corregida a 2024-10-01, valuation inicial 180K añadida
- **Enzo Ventures**: markup eliminado, valuation = invested = 100K

### Cambios de código

#### `server/compute.mjs`
- `computeCashflow`/`computeEvolutionDualFromDB`/`computeAlerts` (compute al server)
- `computeReturns()` con XIRR Newton-Raphson + bisección [-0.9999, 10]
- `loadCashflows`: `rent_received`, `distribution`, `dividend` como positivos;
  `expense`, `mortgage_payment` como negativos
- Cashflow projection skipea `frozen`, `bulletPayment`, `paysMonthly === false`
- Evolution dual respeta quotes table en mes actual (BTC live)

#### `server/portfolio.mjs`
- `loans[]`: añade `frozen`, `frozenSince`, `paysMonthly`, `bulletPayment`,
  status='Paralizado' cuando frozen
- Buckets equity-pure: loan=capital+interestEarned, RE=equity neto+rent
- `realizedIncomeByAsset` agregado a current values de cada asset (rent/dividend)
- `portfolioSummary` incluye `xirrPct`, `holdYears`, `grossAssetValue`, `mortgageDebt`
- `categoryAllocation[]` añade `xirrPct` y `holdYears`

#### `src/pages/Overview.jsx`
- `GainHero` reemplaza HeroKPI: ganancia €/XIRR%/año en paralelo + secondary metrics
- `EvolutionChart` con 2 paths (invested dashed + value sólido) + área verde gap
- KPI grid reducido a 2 cols (Liquidez + Ilíquido). CAGR retirado.

#### `vite.config.js`
- Dev server con proxy `/api/portfolio` → `127.0.0.1:8443/portfolio` con bearer
  inyectado desde `API_TOKEN` env. `host: 0.0.0.0` permite acceso vía Tailscale.

#### `src/data/portfolio.js`
- `computeEvolution()` fallback ahora devuelve `{month, invested, value}` con
  value=invested (sin histórico mock).

## Lo que queda

### Bloqueado en input externo
- `gh auth login --web` para pushear los 14 commits a GitHub
- `METALS_API_KEY` para oro live (quotes.mjs lo skippea hoy)
- Decisión Potes: 2015-01-01 (now) vs 2024-01-01 (would change XIRR portfolio
  from 5.37% to ~26%)
- Datos reales de RE intermedios (tasaciones por propiedad)

### Polish opcional pendiente
- Per-asset XIRR (¿por loan/property/holding individual o solo categoría?)
- Ordenación de categorías (valor / return / nombre)
- Time period selectors (YTD, 1Y, since-inception)
- Oro como categoría propia (no "monetary")
- OverviewMobile.jsx: replicar GainHero + chart dual (no actualizado todavía)
- Indicar visualmente loans frozen (Habitalia #21, RE privado) en la lista de loans

## Estado live actual (2026-05-01, equity-pure)

```
Portfolio
  Total invertido:  3.324.434 €  (equity-pure)
  Valor actual:     3.880.332 €  (net liq + realized income)
  Ganancia:         +535.898 €   (+16,72%)
  XIRR:             +5,37% / año (sobre 11,33y, dominado por Potes 2015)

  Activos brutos:   4.009.832 €
  Deuda hipoteca:     149.500 €

Categorías:
  ETF/Fondos    +15,34%   xirr +13,03%  (Gestivalue + 2x Indexa)
  Monetary       -7,06%   xirr -19,21%  (Oro 6 onzas)
  Crypto        -13,19%   xirr -21,59%  (BTC 1.04)
  Renta Fija     +0,52%   xirr +2,26%   (Revolut 100K + Trade Republic 30K)
  Loans          +5,18%   xirr +7,94%   (21 Habitalia + Cárnico + RE-priv + SpaceX)
  PE           +222,35%   xirr +99,5%   (Habitalia + Rebel Tickets)
  VC              0%      xirr 0%       (Coben + Enzo, sin markup)
  Real Estate    -3,86%   xirr -0,91%   (Gijón + Vitoria + Pabellón + Potes)
```

## Comandos útiles

```bash
# Reiniciar daemon API tras editar server/*
launchctl kickstart -k gui/$(id -u)/com.bentor.dashboard-api

# Test buildShape en local
node -e "import('./server/portfolio.mjs').then(async m => {
  const s = await m.buildShape();
  console.log(s.portfolioSummary);
  await m.pool.end();
})"

# Bypass Vercel CDN
curl "https://dashboard.bentorcapital.com/api/portfolio?bust=$(date +%s)" | python3 -m json.tool

# Dev server local (para preview sin pushear)
npm run dev   # → http://mac-mini-de-reiser.tail9ede59.ts.net:5173

# Test proxy local
curl http://localhost:5173/api/portfolio | python3 -m json.tool

# Daemons bentor
launchctl list | grep bentor

# Logs en vivo
tail -f ~/Library/Logs/bentor-*.log
```

## Para retomar push (cuando haya GUI)

```bash
gh auth login --hostname github.com --git-protocol https --web
gh auth setup-git
git push origin main
```

## Próximos pasos (post-push)

Una vez pushees, Vercel auto-deployará el frontend y `dashboard.bentorcapital.com`
mostrará el nuevo headline + chart dual. El backend ya está live.

Después podemos seguir con polish: per-asset XIRR, time selectors, mobile,
decisión final sobre Potes 2015 vs 2024, etc.
