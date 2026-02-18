# Datos Hardcodeados — Investment Dashboard

## Archivo fuente: `src/data/portfolio.js`

Todo el dashboard se alimenta de un único archivo con datos estáticos. A continuación el inventario completo:

### 1. `portfolioSummary`
| Campo | Tipo | Ejemplo |
|---|---|---|
| totalValue | number | 892 450 € |
| totalInvested | number | 745 200 € |
| totalReturn / totalReturnPct | number | 147 250 € / 19.76% |
| lastUpdated | string | '2026-02-18' |

### 2. `categoryAllocation` (7 categorías)
Distribución por tipo de activo con: name, value, invested, return%, color.

### 3. `etfsFunds` (6 posiciones)
ETFs y fondos indexados: ticker, invested, current, returnPct, type.

### 4. `monetaryFunds` (3 posiciones)
Cuentas remuneradas y fondos monetarios: invested, current, rate.

### 5. `crypto` (5 posiciones)
BTC, ETH, SOL, LINK, Stablecoins: amount, avgPrice, currentPrice.

### 6. `stocks` (13 posiciones)
Acciones individuales: shares, avgPrice, currentPrice.

### 7. `loans` (21 posiciones)
Préstamos inmobiliarios (Habitalia/Bentor): capital, interestRate, tir, term, dates, status.

### 8. `vcPe` (4 posiciones) + `vcPeFunds` (2 fondos)
Inversiones directas y fondos de VC/PE.

---

## Plan para Google Sheets API

### Estructura propuesta

1. **Crear `src/data/fetcher.js`** — módulo que:
   - En producción: llama a Google Sheets API (sheet ID configurable via env var `VITE_SHEETS_ID`)
   - En desarrollo: cae al archivo `portfolio.js` actual como fallback
   
2. **Variables de entorno necesarias**:
   - `VITE_SHEETS_ID` — ID del Google Sheet
   - `VITE_GOOGLE_API_KEY` — API key (read-only, restricted)

3. **Mapping de hojas**:
   | Hoja en Google Sheets | Export en JS |
   |---|---|
   | Resumen | portfolioSummary |
   | ETFs | etfsFunds |
   | Monetarios | monetaryFunds |
   | Crypto | crypto |
   | Acciones | stocks |
   | Préstamos | loans |
   | VC/PE | vcPe + vcPeFunds |

4. **Pasos de implementación**:
   - [ ] Crear el Google Sheet con las hojas y columnas correctas
   - [ ] Habilitar Google Sheets API en GCP
   - [ ] Crear API key restringida
   - [ ] Implementar `fetcher.js` con cache (5 min)
   - [ ] Añadir loading states a los componentes
   - [ ] Configurar env vars en el hosting
