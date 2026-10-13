---
name: fintech-systemic-audit-pro
description: >-
  Advanced FinTech Systemic Audit & Architectural Consistency Engine. Eliminates
  contradictory figures, fake/mock fallbacks, and multi-source discrepancies across
  financial portals, stock screeners, portfolio trackers, and daily market reports.
  Enforces Single Source of Truth (SSOT), real market grounding (EGX & SNDUK), and
  mathematical rigor down to 0.00 EGP / SAR.
---

# FinTech Systemic Audit & Architectural Consistency Engine

## 1. Scope & Primary Principles
This skill provides automated methodologies for auditing, diagnosing, and resolving architectural flaws that lead to "fake, contradictory, or inaccurate data" in financial platforms and investment portals:
1. **Single Source of Truth (SSOT) Architecture**:
   - Every financial asset (Stock, Fund, Bullion, Currency) must have exactly ONE canonical current price in the runtime state.
   - Narrative texts, executive summaries, catalyst bullet points, top gainers/losers, active volume lists, valuation cards, and portfolio holdings MUST NEVER have separate hardcoded prices that diverge from the canonical price.
2. **Elimination of Fallback Hallucinations & Mock Data**:
   - Prohibit all placeholder fallbacks like `|| 50.0`, `|| 88.40`, `|| 151.00`, `close % 3 * 0.08`, or `close * 0.024`.
   - Missing data must gracefully show clear placeholder indicators (`--` or `غير متاح`) rather than inventing arbitrary numbers.
3. **Cross-Page Reconciliation Protocol**:
   - Compare Page 1 (Portfolio), Page 2 (Radar), Page 3 (Reports), Page 4 (Performance), Page 5 (Valuation), Page 6 (News), and Page 7 (Tools) simultaneously.
   - Any price divergence between pages for the same date/session constitutes an architectural failure that must be immediately harmonized.

## 2. Mathematical Integrity Rules
- **Holding Value**: $Market\ Value = Quantity \times Verified\ Market\ Price$
- **Total Capital Invested**: $Total\ Cost = \sum(Quantity \times Weighted\ Buy\ Price) + Verified\ Historical\ Fees$
- **Net Profit / Loss**: $Net\ P\&L = Total\ Market\ Value - Total\ Cost\ (with\ fees)$
- **Margin of Safety**: $Margin\ \% = \frac{Fair\ Base\ Value - Current\ Market\ Price}{Fair\ Base\ Value} \times 100$
- **Mutual Funds Net Asset Value (NAV)**:
  - Must strictly match official fund manager disclosures on SNDUK (e.g., CI Capital, Azimut, Beltone, Naeem).
  - Unannounced interim trading sessions must preserve the official NAV date and value.

## 3. Auditing Checklist
- [ ] Scan all JSON archives and JavaScript data files for outdated static prices.
- [ ] Verify narrative summary bullets in daily/weekly reports against the holding table of that same report.
- [ ] Ensure live market data sync updates all views in-place without leaving behind stale caches.
- [ ] Run automated Playwright browser tests across all active views to ensure zero NaN, zero undefined, and 100% price consistency.
