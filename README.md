# 💼 Investment Dashboard

Dashboard web profesional para visualización de portfolio de inversiones. Diseño dark theme tipo fintech.

![React](https://img.shields.io/badge/React-19-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan) ![Recharts](https://img.shields.io/badge/Recharts-2-green)

## Características

- **Vista Resumen**: distribución del portfolio (donut chart), rentabilidad por categoría (bar chart), tabla resumen
- **ETFs + Fondos**: detalle de fondos indexados y ETFs
- **Fondos Monetarios**: cuentas remuneradas y fondos de liquidez
- **Criptomonedas**: holdings crypto con distribución visual
- **Renta Variable**: acciones individuales con rentabilidad
- **Préstamos**: 21 préstamos Habitalia/Bentor con TIR, estado, capital pendiente
- **VC + PE**: inversiones directas y fondos de venture capital/private equity
- **Responsive**: diseño adaptativo móvil y desktop
- **Dark Theme**: diseño oscuro profesional

## Setup

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm run preview
```

## Stack

- **React 19** + Vite 7
- **Tailwind CSS 4** (via @tailwindcss/vite)
- **Recharts** — gráficos interactivos
- **Lucide React** — iconos

## Datos

Los datos están hardcodeados en `src/data/portfolio.js`. Para actualizar:

1. Editar `src/data/portfolio.js` con los nuevos datos del Excel
2. Rebuild: `npm run build`

## Estructura

```
src/
├── components/     # Card, KPI, DataTable, Sidebar
├── data/           # portfolio.js (datos estáticos)
├── pages/          # Overview, ETFs, Crypto, Loans, etc.
├── App.jsx         # Layout principal con navegación
└── index.css       # Estilos globales + Tailwind
```
