# Claude Design — Brief de arranque

> Pega este documento (o secciones) en el primer prompt de Claude Design. Conecta además el repo `atlantis-hq/investment-dashboard` para que lea el código directamente.

---

## 1. Contexto del producto

**Nombre:** Investment Dashboard
**Propietario:** Bentor Capital (holding de inversión personal — Asier Bengoa)
**Uso:** Herramienta interna privada para visualizar el portfolio de inversión diversificado del grupo. No es cara al público.
**URL prod:** https://dashboard.bentorcapital.com
**Tono visual actual:** Fintech premium, dark theme, acentos dorados (estilo boutique investment office — no consumer).

**Referencias de estilo a las que aspirar:** Ramp, Mercury, Pry, Copilot Money, Linear (por densidad de info + calma visual). Evitar: consumer-fintech colorido tipo Revolut/N26.

---

## 2. Stack (respetar en el diseño)

- **Framework:** React 19 + Vite 7
- **Styling:** Tailwind CSS 4 (utility classes) + inline styles con tokens desde `useColors()`
- **Gráficos:** Recharts (donut, bar, area) — **no cambiar librería**
- **Iconos:** `lucide-react` — **no cambiar librería**
- **Tipografía:** Inter (system-ui fallback)
- **Deploy:** Vercel

Todos los colores se consumen desde el hook `useColors()` según tema (dark/light). Hay `ThemeProvider` con toggle sol/luna en el sidebar.

---

## 3. Design tokens actuales (punto de partida — evolucionar, no tirar)

### Paleta DARK (principal)
```json
{
  "bg":             "#0a0e17",
  "bgSecondary":    "#111827",
  "card":           "#1a2035",
  "cardHover":      "#1e2642",
  "border":         "#1e293b",
  "borderHover":    "rgba(200,169,126,0.4)",
  "text":           "#ffffff",
  "textSecondary":  "#94a3b8",
  "textMuted":      "#64748b",
  "gold":           "#c8a97e",
  "goldBg":         "rgba(200,169,126,0.2)",
  "goldBorder":     "rgba(200,169,126,0.3)",
  "green":          "#10b981",
  "red":            "#ef4444",
  "amber":          "#f59e0b",
  "purple":         "#8b5cf6",
  "blue":           "#3b82f6",
  "cyan":           "#06b6d4",
  "pink":           "#ec4899",
  "rose":           "#f43f5e"
}
```

### Paleta LIGHT
```json
{
  "bg":            "#f8fafc",
  "card":          "#ffffff",
  "border":        "#e2e8f0",
  "text":          "#0f172a",
  "gold":          "#a07a45",
  "green":         "#059669",
  "red":           "#dc2626"
}
```

### Tipografía
- Font: `Inter, system-ui, -apple-system, sans-serif`
- Antialiased
- Pesos usados: 400 regular, 500 medium, 600 semibold, 700 bold
- Tracking: `tracking-tight` en títulos, `tracking-wider uppercase` en labels KPI

### Spacing / radius
- Cards: `rounded-xl` (12px)
- Padding card: `p-5` / `p-6`
- Gap layout: `gap-4` (16px) entre cards
- Max width app: 1400px centrado
- Sidebar width: 256px (w-64)

---

## 4. Estructura actual de páginas

| Ruta | Archivo | Qué muestra |
|------|---------|-------------|
| `overview` | `Overview.jsx` | Dashboard principal: KPIs, donut allocation, bar rentabilidad por categoría, tabla categorías, próximos vencimientos, alertas |
| `etfs` | `ETFsPage.jsx` | ETFs + fondos indexados (1 fondo: Gestivalue Cap) |
| `monetary` | `MonetaryPage.jsx` | Oro físico (500g en lingotes) |
| `crypto` | `CryptoPage.jsx` | Crypto (~1.04 BTC) |
| `rentafija` | `RentaFijaPage.jsx` | Renta fija (Revolut 2.27% TAE) |
| `loans` | `LoansPage.jsx` | **Página más densa** — 21 préstamos Habitalia/Bentor con TIR, capital pendiente, fecha fin, estado |
| `pe` | `PEPage.jsx` | Private Equity (3 participaciones directas) |
| `vc` | `VCPage.jsx` | VC Startups (2 fondos venture capital) |

Sidebar fija izquierda con nav icon+label + toggle tema al pie.

---

## 5. Componentes reutilizables

- **`KPI`** — tarjeta métrica con label, valor grande, icono, delta con flecha verde/roja
- **`Card`** — contenedor genérico (padding + border + radius)
- **`DataTable`** — tabla responsive con columnas configurables
- **`MobileCard`** — versión card de fila de tabla para mobile
- **`PageHeader`** — título + subtítulo de página
- **`Sidebar`** — nav lateral con 8 items + tema toggle

Componentes nuevos bienvenidos, pero respetar el naming y patrón.

---

## 6. Datos (shape — para que los prototipos tengan números realistas)

```ts
portfolioSummary: {
  totalInvested: number,      // capital invertido total
  totalValue: number,          // valor actual
  totalReturn: number,         // € ganados
  totalReturnPct: number,      // % rentabilidad global
  cagr: number,                // CAGR anualizado
}

categoryAllocation: [
  { name: 'Préstamos',       value, invested, pct, color },
  { name: 'ETFs + Fondos',   ... },
  { name: 'Fondos Monetarios' /* en realidad oro físico */, ... },
  { name: 'Criptomonedas',   ... },
  { name: 'Renta Fija',      ... },
  { name: 'PE',              ... },
  { name: 'VC Startups',     ... },
]

loans: Array<{
  name, capital, tir, endDate, status, interestEarned, remainingCapital
}> // 21 préstamos Habitalia/Bentor

loansSummary: { totalCapital, totalInterestEarned, avgTir, activeCount }

cashflow: [{ month, income, outflow, net }]
evolution: [{ month, totalValue, invested }]
alerts:   [{ type, message, severity }]
```

Los datos están en `src/data/portfolio.js` (fallback estático) y llegan en runtime desde **Google Sheets público** (`services/googleSheets.js`, CSV export — sin API key).

---

## 7. Qué queremos mejorar (prioridades)

### 🥇 Must-have
1. **Overview más impactante** — ahora es una pared de cards, falta jerarquía. Queremos un "hero" claro con el patrimonio total + CAGR + delta mensual, y debajo una composición visual elegante (donut + sparkline evolución).
2. **Página de préstamos mejorada** — es la que tiene más datos (21 filas). Ahora es tabla densa. Necesita mejor escaneabilidad: agrupación por estado, mini progress bars de capital devuelto, timeline de vencimientos.
3. **Typography hierarchy** — todos los títulos tienen peso similar. Mayor contraste entre H1/H2/labels/valores.
4. **Micro-interacciones** — hover states más sutiles, transiciones suaves al cambiar de página, skeletons al cargar datos.

### 🥈 Nice-to-have
5. Vista "Timeline" del portfolio (evolución valor vs. invertido, área chart grande ocupando ancho)
6. Página "Ilíquido" combinada (PE + VC + préstamos largos) con foco en bloqueo de capital
7. Tema light más pulido (ahora es menos cuidado que el dark)
8. Export PDF del overview (one-pager mensual para inversión personal)

### 🚫 No tocar
- Lógica de datos (`usePortfolioData`, `googleSheets.js`, `portfolio.js`)
- Routing (tab-based state, no react-router)
- Recharts como librería de charts
- Estructura de tokens en `useColors()` — ampliar sí, reemplazar no
- Sidebar nav items (mismos 8, mismos iconos)

---

## 8. Constraints de código (para el handoff a Claude Code)

- Componentes en `src/components/`, páginas en `src/pages/`
- Consumir colores vía `useColors()`, nunca hardcodear hex salvo en componentes legacy que ya lo hacen (`KPI.jsx` — actualizar cuando lo rediseñemos)
- Mobile-first — usar `useIsMobile()` del hook existente
- Evitar dependencias nuevas salvo imprescindibles. Si algo requiere una lib extra, marcarlo explícitamente en el handoff para que lo apruebe el usuario.
- Mantener `ThemeProvider` y ambos temas funcionales
- Formato moneda: `€XX.XXX` con `toLocaleString('es-ES')`
- Idioma UI: **español**

---

## 9. Entregables esperados de Claude Design

Al final de la sesión, genera un **handoff bundle** que incluya:
1. Nuevos design tokens (si se amplían — colores nuevos, tipografía, sombras, etc.)
2. Especificación componente a componente (props, estados, responsive)
3. Especificación página por página (layouts, orden, breakpoints)
4. Mockups de referencia (PNG/PDF) para cada pantalla clave
5. Instrucciones claras para el agente de código sobre qué archivos tocar

El bundle se pasará a Claude Code con una instrucción única tipo: *"Integra este handoff en el repo manteniendo la lógica de datos intacta. Crea una rama `redesign-v2`."*

---

## 10. Checklist antes de cerrar sesión en Claude Design

- [ ] Design system creado desde el repo conectado
- [ ] Overview rediseñado (desktop + mobile)
- [ ] Loans rediseñado (desktop + mobile)
- [ ] Al menos 2 páginas más iteradas (ETFs, PE, VC — elegir)
- [ ] Light theme auditado y pulido
- [ ] Handoff bundle exportado
- [ ] URL compartible del prototipo guardada
