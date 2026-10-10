/**
 * EGX Sharia Portal - Financial Calculators Module (js/calculators.js)
 * Clean Formulas | SOCPA & ZATCA Standards
 */

(function(window) {
    'use strict';

    // 1. Brokerage & Market Fees Calculator (0.70%)
    function calculateTradeFees() {
        const amtInput = document.getElementById('calcTradeAmount');
        const resEl = document.getElementById('calcTradeResult');
        if (!amtInput || !resEl) return;

        const amount = parseFloat(amtInput.value) || 0;
        const totalFee = amount * 0.007; // 0.70% total combined brokerage, clearing & EGX fees
        const netPurchase = amount + totalFee;
        const netSale = amount - totalFee;

        resEl.innerHTML = `
            <div class="space-y-1.5 pt-2 border-t border-slate-800 text-xs font-mono">
                <div class="flex justify-between text-slate-300">
                    <span>إجمالي العمولات والرسوم (0.70%):</span>
                    <b class="text-emerald-400 font-bold">${totalFee.toFixed(2)} ج.م</b>
                </div>
                <div class="flex justify-between text-slate-400 text-[11px]">
                    <span>إجمالي المطلوب في حالة الشراء:</span>
                    <b class="text-white">${netPurchase.toFixed(2)} ج.م</b>
                </div>
                <div class="flex justify-between text-slate-400 text-[11px]">
                    <span>صافي المحصل في حالة البيع:</span>
                    <b class="text-white">${netSale.toFixed(2)} ج.م</b>
                </div>
            </div>
        `;
    }

    // 2. Zakat Calculator (2.50% Hijri / 2.577% Gregorian)
    function calculateZakat() {
        const amtInput = document.getElementById('calcZakatAmount');
        const resEl = document.getElementById('calcZakatResult');
        const calType = document.getElementById('calcZakatYearType')?.value || 'gregorian';
        if (!amtInput || !resEl) return;

        const amount = parseFloat(amtInput.value) || 0;
        const rate = (calType === 'gregorian') ? 0.02577 : 0.025; // 2.577% Gregorian vs 2.5% Hijri
        const zakatDue = amount * rate;

        resEl.innerHTML = `
            <div class="space-y-1.5 pt-2 border-t border-slate-800 text-xs font-mono">
                <div class="flex justify-between text-slate-300">
                    <span>نسبة الزكاة المطبقة (${calType === 'gregorian' ? 'ميلادي 2.577%' : 'هجري 2.50%'}):</span>
                    <b class="text-amber-400 font-bold">${zakatDue.toFixed(2)} ج.م</b>
                </div>
                <div class="text-[11px] text-slate-400">
                    تُحسب الزكاة على القيمة السوقية للأسهم إذا كانت للتجارة والمضاربة، أو على الأرباح المحققة بعد خصم الديون إذا كانت للاستثمار طويل الأجل.
                </div>
            </div>
        `;
    }

    // 3. Treasury Bills Net Yield Calculator (CBE + 20% Tax)
    function calculateTBill() {
        const principal = parseFloat(document.getElementById('tbillPrincipal')?.value) || 100000;
        const termDays = parseInt(document.getElementById('tbillTerm')?.value, 10) || 364;
        const grossYieldPct = parseFloat(document.getElementById('tbillYield')?.value) || 28.5;
        const resEl = document.getElementById('tbillResult');
        if (!resEl) return;

        // Formula: Interest = Principal * (Yield / 100) * (Days / 365)
        const grossInterest = principal * (grossYieldPct / 100) * (termDays / 365);
        const tax20 = grossInterest * 0.20; // 20% Official Egyptian Withholding Tax
        const netInterest = grossInterest - tax20;
        const netYieldPct = (netInterest / principal) * (365 / termDays) * 100;

        resEl.innerHTML = `
            <div class="space-y-1.5 pt-2 border-t border-slate-800 text-xs font-mono">
                <div class="flex justify-between text-slate-300">
                    <span>العائد الإجمالي قبل الضريبة:</span>
                    <b class="text-white">${grossInterest.toFixed(2)} ج.م</b>
                </div>
                <div class="flex justify-between text-rose-400">
                    <span>ضريبة الأرباح (20% قطعية):</span>
                    <b>-${tax20.toFixed(2)} ج.م</b>
                </div>
                <div class="flex justify-between text-emerald-400 font-bold text-sm">
                    <span>صافي العائد المستلم (أرباحك):</span>
                    <b>+${netInterest.toFixed(2)} ج.م</b>
                </div>
                <div class="flex justify-between text-slate-400 text-[11px]">
                    <span>العائد السنوي الصافي الفعلي:</span>
                    <b class="text-amber-400">${netYieldPct.toFixed(2)}%</b>
                </div>
            </div>
        `;
    }

    window.CalculatorsEngine = {
        calculateTradeFees,
        calculateZakat,
        calculateTBill
    };

})(window);
