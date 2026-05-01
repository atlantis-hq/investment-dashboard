# Investment Dashboard — Progress (sesión 2026-05-01)

Documento de continuidad por si la sesión cae. Refleja estado real al 2026-05-01.

## Resumen ejecutivo

Sesión larga reorientando el dashboard hacia métricas honestas (XIRR, equity-pure)
y limpiando la data (fechas reales, valuaciones, frozen loans, nuevas inversiones).
Backend listo, falta cerrar frontend (chart dual + headline nuevo).

## Decisiones de visualización (definidas con el usuario)

1. **Headline**: ganancia en € + XIRR/año, con totalReturnPct entre paréntesis abajo.
2. **XIRR siempre visible** aunque dé valores feos (-99% para holds cortos). Mostrar
   también `holdYears` para que el lector contextualice.
3. **Equity-pure framing**: totalInvested y totalValue reflejan cash de bolsillo
   (mortgages excluidas). Se exponen `grossAssetValue` y `mortgageDebt` aparte.
4. **Evolution chart**: dos líneas (invested + value), gap = ganancia acumulada.
5. **Histórico de valor**: usuario va metiendo valuaciones a la tabla `valuations`
   manualmente. Loans tienen histórico real de la DB. Resto: si no hay valuation,
   value = invested.

## Lo que se ha hecho (commiteado, sin pushear)

```
e093142 feat(backend): equity-pure framing for portfolio totals
cd6f467 feat(backend): support frozen/bullet loans + rental income in cashflows
af931af feat(backend): money-weighted return (XIRR) per portfolio and category
db8b4d4 feat(backend): move cashflow/evolution/alerts compute to server
9f727ab feat(backend): daily quote fetcher + live BTC valuation
1f1d4df feat(backend): daily portfolio snapshots + extract domain layer
73dbdd4 feat(ops): daily pg_dump backup with 30-day rotation
3bc881e feat(frontend): wire dashboard to live API with static fallback
9030674 feat(backend): self-hosted Postgres API on Mac mini
+ 4 commits redesign frontend pre-pivot
```

13 commits ahead de origin/main. Sin pushear todavía (gh auth pendiente).

### Cambios de data en DB

- **Fechas corregidas**: BTC (2025-10-01), Oro (2026-01-01), pisos (Gijón 2025-10-01,
  Vitoria 2026-03-01, Pabellón 2025-05-01).
- **Pabellón pagado entero**: financing.cash=true, loan eliminado, equity=1.32M.
- **Habitalia #21 paralizado**: cuotas 8-10 revertidas a default, tx de
  interest/principal payments correspondientes borradas, asset marcado frozen.
- **FutureChat eliminado**: no se invirtió finalmente.
- **Rebel Tickets**: rewrite con dos tickets (15K @ 900K val abr-2023, 60K @ 2.5M
  val dic-2024), valuation actual 122K (4.07% de 3M).
- **Habitalia (PE)**: tx date corregida a oct-2024, valuation 2024-10-01=180K
  añadida.
- **Enzo Ventures**: markup eliminado, valuation = invested = 100K.
- **Revolut**: 70K → 100K.
- **Nuevos**:
  - Trade Republic Renta Fija 30K @ 2.1% TAE (2026-03-31)
  - Indexa Capital 150K @ 3.5% esperado (2026-02-01)
  - Indexa Capital (6% esperado) 30K (2026-04-01)
  - Préstamo Inmobiliario privado 45K @ 20% / 18m (2024-12-01) — frozen
  - Préstamo Cárnico 25K @ 15% / 12m mensual (2026-03-01)
  - SpaceX IPO Loan 50K @ 25% / 18m bullet (2026-04-01)
  - Inmuebles Potes 500K, fully paid, rent 15K/año netos desde 2025
    (purchase date placeholder 2015-01-01, rent backfilleado 2025+2026 partial)

### Cambios de código

- `server/compute.mjs`:
  - `computeCashflow/computeEvolutionFromDB/computeAlerts` (movidos del fallback frontend)
  - `computeReturns()` con XIRR Newton-Raphson + bisección sobre [-0.9999, 10]
  - Soporte para `rent_received`, `distribution`, `dividend` (positivos),
    `expense`, `mortgage_payment` (negativos)
  - cashflow projection skipea loans `frozen`, `bulletPayment`, o `paysMonthly === false`
- `server/portfolio.mjs`:
  - `loans[]` expone `frozen`, `frozenSince`, `paysMonthly`, `bulletPayment`,
    status='Paralizado' si frozen
  - Buckets en equity-pure: loan = capital + interestEarned, RE = equity neto
  - `portfolioSummary` añade `xirrPct`, `holdYears`, `grossAssetValue`,
    `mortgageDebt`
  - `categoryAllocation[]` añade `xirrPct` y `holdYears`

## Lo que queda

Tareas pendientes (en orden de prioridad para que el usuario "vea cómo está"):

### 1. Backend — evolution con dos líneas (#6) [pendiente]

Construir histórico mensual `[{month, invested, value}]`:
- `invested` = ya está hecho en `computeEvolutionFromDB`, cumulative equity-pure
- `value` por mes:
  - Loans: capital + sum(interest_payment hasta ese mes)
  - Otros assets con valuation: latest valuation hasta ese mes
  - Otros sin valuation: invested (cost basis)
  - RE: gross currentValue - financing.loan (aproximación)

Entregable: nueva función `computeEvolutionDualFromDB()` que reemplace la actual
y devuelva `{month, invested, value}`. Update `buildShape` y el fallback en
`src/data/portfolio.js` (versión mock de la nueva shape).

### 2. Frontend — nuevo headline (#7) [pendiente]

`src/pages/Overview.jsx` y `OverviewMobile.jsx`. Formato elegido por usuario:

```
+535.898 €      +5,37%/año
(+16,12% total) (XIRR)

Total invertido: 3.324.434 €
Valor actual:    3.860.332 €

Deuda hipotecaria:    149.500 € (-)
Activos brutos:     4.009.832 €
```

Datos disponibles en `usePortfolio()`: `portfolioSummary.totalReturn`,
`xirrPct`, `holdYears`, `totalReturnPct`, `totalInvested`, `totalValue`,
`grossAssetValue`, `mortgageDebt`.

### 3. Frontend — EvolutionChart dual line (#8) [pendiente]

Componente `EvolutionChart` (probablemente en `src/components/`) pasa de una
línea a dos: `invested` (azul) y `value` (verde). Gap = ganancia visual.

### 4. Polish — pendiente discutir

- Per-asset XIRR (¿mostrar XIRR por loan/property/holding individual?)
- Ordenación de categorías (por valor / return / nombre / ...)
- Time period selectors (YTD, 1Y, since-inception)
- Oro como categoría propia (no "monetary"?)
- Decisión final sobre Potes 2015 vs 2024 (afecta XIRR portfolio: 5,37% vs ~26%)

### Bloqueado en input externo (no autónomo)

- `gh auth login --web` para pushear los 13 commits a GitHub
- `METALS_API_KEY` para oro físico live (hoy quotes.mjs lo skippea)
- Datos reales de RE intermedios (valuaciones tasaciones por propiedad)
- Datos crypto/oro: avgPrice histórico real (no afecta valor actual pero sí XIRR)

## Estado live actual (2026-05-01)

```
Portfolio
  Total invertido:  3.324.434 €  (equity-pure)
  Valor actual:     3.860.332 €  (net liquidation)
  Total return:     +535.898 €   (+16,12%)
  XIRR:             +5,37% / año (sobre 11,33y, dominado por Potes 2015)

  Activos brutos:   4.009.832 €
  Deuda hipoteca:     149.500 €

Categorías:
  ETF/Fondos    +15,34%   xirr +13,03%  (Gestivalue + 2x Indexa)
  Monetary       -7,06%   xirr -19,21%  (Oro 6 onzas)
  Crypto        -13,19%   xirr -21,59%  (BTC 1.04)
  Renta Fija     +0,52%   xirr +2,26%   (Revolut + Trade Republic)
  Loans          +5,18%   xirr +7,94%   (21 Habitalia + 3 alternativos)
  PE           +222,35%   xirr +99,5%   (Habitalia + Rebel Tickets)
  VC              0%      xirr 0%       (Coben + Enzo, sin markup)
  Real Estate    -4,15%   xirr -0,91%   (Gijón + Vitoria + Pabellón + Potes)
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
