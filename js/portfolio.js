/**
 * EGX Sharia Portal - Portfolio Engine & UI Renderer (js/portfolio.js)
 * Mathematical Rigor down to 0.00 EGP (SOCPA / IFRS Compliance)
 */

(function(window) {
    'use strict';

    const STORAGE_KEY = 'egx_clean_portfolio_holdings';
    const CASH_KEY = 'egx_clean_portfolio_cash';

    let activeFilter = 'all';
    let activeViewMode = 'cards';
    let holdings = [];
    let cashBalance = 0.00;

    // 1. Initialize and Load Holdings
    function init() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                holdings = JSON.parse(saved);
            } else if (window.EGX_DATA && window.EGX_DATA.DEFAULT_PORTFOLIO) {
                holdings = JSON.parse(JSON.stringify(window.EGX_DATA.DEFAULT_PORTFOLIO));
                saveHoldings();
            }
            const savedCash = localStorage.getItem(CASH_KEY);
            if (savedCash) {
                cashBalance = parseFloat(savedCash) || 0.00;
            }
        } catch (e) {
            console.warn('[Portfolio] Storage load warning, using defaults:', e);
            holdings = JSON.parse(JSON.stringify(window.EGX_DATA.DEFAULT_PORTFOLIO));
        }
        render();
    }

    function saveHoldings() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
            localStorage.setItem(CASH_KEY, cashBalance.toString());
        } catch (e) {
            console.error('[Portfolio] Save error:', e);
        }
    }

    // 2. Compute Portfolio Metrics
    function calculate() {
        let stocksVal = 0, stocksCost = 0;
        let fundsVal = 0, fundsCost = 0;
        let goldVal = 0, goldCost = 0;

        const evaluatedHoldings = holdings.map(h => {
            const costBasis = h.buy * h.qty;
            const currentVal = h.cur * h.qty;
            const pnl = currentVal - costBasis;
            const pnlPct = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

            if (h.isGold) {
                goldVal += currentVal;
                goldCost += costBasis;
            } else if (h.isFund) {
                fundsVal += currentVal;
                fundsCost += costBasis;
            } else {
                stocksVal += currentVal;
                stocksCost += costBasis;
            }

            return {
                ...h,
                costBasis,
                currentVal,
                pnl,
                pnlPct
            };
        });

        const totalInvestedVal = stocksVal + fundsVal + goldVal;
        const totalGrandWealth = totalInvestedVal + cashBalance;
        const totalCostBasis = stocksCost + fundsCost + goldCost;
        const totalPnl = totalInvestedVal - totalCostBasis;
        const totalPnlPct = totalCostBasis > 0 ? (totalPnl / totalCostBasis) * 100 : 0;

        return {
            items: evaluatedHoldings,
            totalGrandWealth,
            totalInvestedVal,
            totalCostBasis,
            totalPnl,
            totalPnlPct,
            breakdown: {
                stocks: { val: stocksVal, cost: stocksCost, pnl: stocksVal - stocksCost, pnlPct: stocksCost > 0 ? ((stocksVal - stocksCost) / stocksCost) * 100 : 0 },
                funds:  { val: fundsVal, cost: fundsCost, pnl: fundsVal - fundsCost, pnlPct: fundsCost > 0 ? ((fundsVal - fundsCost) / fundsCost) * 100 : 0 },
                gold:   { val: goldVal, cost: goldCost, pnl: goldVal - goldCost, pnlPct: goldCost > 0 ? ((goldVal - goldCost) / goldCost) * 100 : 0 },
                cash:   { val: cashBalance }
            }
        };
    }

    // 3. Master Render Dispatcher
    function render() {
        const data = calculate();
        renderGrandWealth(data);
        renderMiniCards(data);
        renderWeightRibbon(data);
        renderAssets(data);
        updateFilterCounts(data);
    }

    // 4. Render Grand Wealth Summary Card
    function renderGrandWealth(data) {
        const wealthEl = document.getElementById('p_grand_wealth');
        const pnlEl = document.getElementById('p_grand_pnl');
        const returnEl = document.getElementById('p_grand_return');

        if (wealthEl) {
            wealthEl.innerText = Math.round(data.totalGrandWealth).toLocaleString();
        }
        if (pnlEl) {
            const isPos = data.totalPnl >= 0;
            pnlEl.innerText = `${isPos ? '+' : ''}${Math.round(data.totalPnl).toLocaleString()} ج.م`;
            pnlEl.className = `font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`;
        }
        if (returnEl) {
            const isPos = data.totalPnlPct >= 0;
            returnEl.innerText = `(${isPos ? '+' : ''}${data.totalPnlPct.toFixed(2)}%)`;
            returnEl.className = `font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`;
        }
    }

    // 5. Render 4 Wealth Breakdown Mini Cards
    function renderMiniCards(data) {
        const formatK = (val) => (val / 1000).toFixed(2) + 'k ج';
        const b = data.breakdown;

        // Stocks Mini Card
        const stocksEl = document.getElementById('p_stocks_card');
        const stocksSub = document.getElementById('p_stocks_card_sub');
        if (stocksEl) stocksEl.innerText = formatK(b.stocks.val);
        if (stocksSub) {
            const isPos = b.stocks.pnl >= 0;
            stocksSub.innerHTML = `<span class="${isPos ? 'text-emerald-400' : 'text-rose-400'}">${isPos ? '+' : ''}${Math.round(b.stocks.pnl)} ج (${isPos ? '+' : ''}${b.stocks.pnlPct.toFixed(2)}%)</span>`;
        }

        // Funds Mini Card
        const fundsEl = document.getElementById('p_funds_card');
        const fundsSub = document.getElementById('p_funds_card_sub');
        if (fundsEl) fundsEl.innerText = formatK(b.funds.val);
        if (fundsSub) {
            const isPos = b.funds.pnl >= 0;
            fundsSub.innerHTML = `<span class="${isPos ? 'text-emerald-400' : 'text-rose-400'}">${isPos ? '+' : ''}${Math.round(b.funds.pnl)} ج (${isPos ? '+' : ''}${b.funds.pnlPct.toFixed(2)}%)</span>`;
        }

        // Gold Mini Card
        const goldEl = document.getElementById('p_gold_card');
        const goldSub = document.getElementById('p_gold_card_sub');
        if (goldEl) goldEl.innerText = `${b.gold.val.toFixed(2)} ج`;
        if (goldSub) {
            const isPos = b.gold.pnl >= 0;
            goldSub.innerHTML = `<span class="${isPos ? 'text-emerald-400' : 'text-rose-400'}">${isPos ? '+' : ''}${b.gold.pnl.toFixed(2)} ج (${isPos ? '+' : ''}${b.gold.pnlPct.toFixed(2)}%)</span>`;
        }

        // Cash Mini Card
        const cashEl = document.getElementById('p_cash_card');
        if (cashEl) cashEl.innerText = `${b.cash.val.toFixed(2)} ج`;
    }

    // 6. Render Proportional Allocation Ribbon
    function renderWeightRibbon(data) {
        const ribbonEl = document.getElementById('assetWeightRibbon');
        const legendEl = document.getElementById('ribbonLegend');
        if (!ribbonEl) return;

        const total = data.totalInvestedVal;
        if (total <= 0) {
            ribbonEl.innerHTML = '<div class="h-full bg-slate-800/80 w-full flex items-center justify-center text-[9px] text-slate-500 font-mono">لا توجد أصول مضافة بعد</div>';
            if (legendEl) legendEl.innerText = '0% توزيع الأوزان';
            return;
        }

        const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1'];
        let barsHtml = '';
        let topHoldings = [...data.items].sort((a, b) => b.currentVal - a.currentVal);
        let legendStr = '';

        topHoldings.forEach((item, idx) => {
            const weightPct = ((item.currentVal / total) * 100);
            if (weightPct <= 0.1) return;
            const color = colors[idx % colors.length];
            barsHtml += `<div style="width: ${weightPct}%; background-color: ${color};" title="${item.ticker}: ${weightPct.toFixed(1)}%" class="h-full transition-all"></div>`;
            if (idx < 3) {
                legendStr += `${item.ticker} ${weightPct.toFixed(1)}% • `;
            }
        });

        ribbonEl.innerHTML = barsHtml;
        if (legendEl) legendEl.innerText = legendStr.replace(/ • $/, '');
    }

    // 7. Render Assets List (Cards or Table)
    function renderAssets(data) {
        const container = document.getElementById('holdingsPresentationContainer');
        if (!container) return;

        let filtered = [...data.items];

        if (activeFilter === 'winners') {
            filtered = filtered.filter(x => x.pnl > 0);
        } else if (activeFilter === 'losers') {
            filtered = filtered.filter(x => x.pnl < 0);
        } else if (activeFilter === 'highestVal') {
            filtered.sort((a, b) => b.currentVal - a.currentVal);
        } else if (activeFilter === 'highestReturn') {
            filtered.sort((a, b) => b.pnlPct - a.pnlPct);
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="glass-card rounded-2xl p-8 text-center border border-dashed border-slate-700/80 space-y-3">
                    <span class="text-3xl">📭</span>
                    <h3 class="text-sm font-bold text-white">لا توجد أصول مطابقة لهذا التصنيف</h3>
                    <p class="text-xs text-slate-400">يمكنك إضافة أصول جديدة أو اختيار تصنيف (الكل).</p>
                </div>
            `;
            return;
        }

        if (activeViewMode === 'table') {
            renderTableView(container, filtered, data.totalInvestedVal);
        } else {
            renderCardsView(container, filtered, data.totalInvestedVal);
        }
    }

    // 7A. Render Cards View (FinTech Executive Cards)
    function renderCardsView(container, items, totalInvested) {
        let html = '<div class="space-y-3">';

        items.forEach(h => {
            const isPos = h.pnl >= 0;
            const weightPct = totalInvested > 0 ? ((h.currentVal / totalInvested) * 100).toFixed(1) : '0.0';

            html += `
                <div class="glass-card rounded-2xl p-4 border border-slate-800 space-y-3">
                    <!-- Row 1: Brand, Name & Valuation -->
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-white font-mono text-sm shadow">
                                ${h.ticker}
                            </div>
                            <div>
                                <div class="flex items-center gap-2">
                                    <h4 class="font-bold text-white text-sm">${h.name}</h4>
                                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">متوافق شرعاً</span>
                                </div>
                                <span class="text-[11px] text-slate-400">${h.sector || ''}</span>
                            </div>
                        </div>

                        <div class="text-left font-mono">
                            <div class="sensitive-num text-base sm:text-lg font-bold text-white">
                                ${Math.round(h.currentVal).toLocaleString()} <span class="text-xs font-normal text-slate-400 font-sans">ج.م</span>
                            </div>
                            <div class="text-xs font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}">
                                ${isPos ? '+' : ''}${Math.round(h.pnl).toLocaleString()} ج (${isPos ? '+' : ''}${h.pnlPct.toFixed(1)}%)
                            </div>
                        </div>
                    </div>

                    <!-- Row 2: Metrics Grid -->
                    <div class="grid grid-cols-3 gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 text-center text-xs">
                        <div>
                            <span class="text-[10px] text-slate-400 block mb-0.5">الكمية المملوكة</span>
                            <span class="font-bold font-mono text-white">${h.qty}</span>
                        </div>
                        <div>
                            <span class="text-[10px] text-slate-400 block mb-0.5 cursor-pointer hover:underline" onclick="window.PortfolioEngine.toggleBuyPrice('${h.ticker}')">
                                سعر الشراء 👁️
                            </span>
                            <span id="buyPrice_${h.ticker}" class="font-bold font-mono text-amber-400">${h.buy.toFixed(2)} ج</span>
                        </div>
                        <div>
                            <span class="text-[10px] text-slate-400 block mb-0.5">السعر الحالي</span>
                            <span class="font-bold font-mono text-emerald-400">${h.cur.toFixed(2)} ج</span>
                        </div>
                    </div>

                    <!-- Row 3: Weight and Actions -->
                    <div class="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                        <span class="text-slate-400 font-mono text-[11px]">الوزن النسبي: <b class="text-slate-200">${weightPct}%</b></span>
                        <div class="flex items-center gap-2">
                            <button onclick="window.PortfolioEngine.editHoldingPrompt('${h.ticker}')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold transition">
                                ✏️ تعديل
                            </button>
                            <button onclick="window.PortfolioEngine.removeHoldingPrompt('${h.ticker}')" class="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-[11px] font-bold transition">
                                🗑️ حذف
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    // 7B. Render Table View
    function renderTableView(container, items, totalInvested) {
        let html = `
            <div class="glass-card rounded-2xl overflow-hidden border border-slate-800">
                <div class="overflow-x-auto">
                    <table class="w-full text-right text-xs">
                        <thead class="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold">
                            <tr>
                                <th class="p-3">الأصل</th>
                                <th class="p-3">الكمية</th>
                                <th class="p-3">الشراء</th>
                                <th class="p-3">الحالي</th>
                                <th class="p-3">القيمة السوقية</th>
                                <th class="p-3">الربح / الخسارة</th>
                                <th class="p-3">الوزن</th>
                                <th class="p-3 text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/60 font-mono">
        `;

        items.forEach(h => {
            const isPos = h.pnl >= 0;
            const weightPct = totalInvested > 0 ? ((h.currentVal / totalInvested) * 100).toFixed(1) : '0.0';

            html += `
                <tr class="hover:bg-slate-800/30 transition">
                    <td class="p-3">
                        <div class="font-bold text-white">${h.ticker}</div>
                        <div class="text-[10px] text-slate-400 font-sans">${h.name}</div>
                    </td>
                    <td class="p-3 font-bold text-white">${h.qty}</td>
                    <td class="p-3 text-amber-400 font-bold">${h.buy.toFixed(2)} ج</td>
                    <td class="p-3 text-emerald-400 font-bold">${h.cur.toFixed(2)} ج</td>
                    <td class="p-3 sensitive-num font-bold text-white">${Math.round(h.currentVal).toLocaleString()} ج</td>
                    <td class="p-3 font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}">
                        ${isPos ? '+' : ''}${Math.round(h.pnl)} ج (${isPos ? '+' : ''}${h.pnlPct.toFixed(1)}%)
                    </td>
                    <td class="p-3 text-slate-300">${weightPct}%</td>
                    <td class="p-3 text-center">
                        <button onclick="window.PortfolioEngine.removeHoldingPrompt('${h.ticker}')" class="text-rose-400 hover:text-rose-300 font-bold">✕</button>
                    </td>
                </tr>
            `;
        });

        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        container.innerHTML = html;
    }

    // 8. Update Filter Counts
    function updateFilterCounts(data) {
        let winners = 0, losers = 0;
        data.items.forEach(x => {
            if (x.pnl > 0) winners++;
            else if (x.pnl < 0) losers++;
        });

        const badgeAll = document.getElementById('countFilterAll');
        const badgeWin = document.getElementById('countFilterWinners');
        const badgeLose = document.getElementById('countFilterLosers');
        const badgeTotalAssets = document.getElementById('badgeTotalAssets');

        if (badgeAll) badgeAll.innerText = `(${data.items.length})`;
        if (badgeWin) badgeWin.innerText = `(${winners})`;
        if (badgeLose) badgeLose.innerText = `(${losers})`;
        if (badgeTotalAssets) badgeTotalAssets.innerText = `${data.items.length} أصل`;
    }

    // 9. Interactive Actions
    function toggleBuyPrice(ticker) {
        const el = document.getElementById('buyPrice_' + ticker);
        if (el) {
            el.classList.toggle('blur-sm');
        }
    }

    function setFilter(filterType) {
        activeFilter = filterType;
        document.querySelectorAll('.filter-pill-btn').forEach(btn => {
            if (btn.getAttribute('data-filter') === filterType) {
                btn.className = 'filter-pill-btn px-3 py-1.5 rounded-xl bg-emerald-600 text-white border border-emerald-500 shadow-sm whitespace-nowrap text-xs font-bold transition';
            } else {
                btn.className = 'filter-pill-btn px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 whitespace-nowrap text-xs font-bold transition';
            }
        });
        render();
    }

    function setViewMode(mode) {
        activeViewMode = mode;
        const bCards = document.getElementById('btnViewCards');
        const bTable = document.getElementById('btnViewTable');
        if (mode === 'cards') {
            if (bCards) bCards.className = 'px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold transition';
            if (bTable) bTable.className = 'px-2.5 py-1 rounded-lg text-slate-400 hover:text-white text-xs font-bold transition';
        } else {
            if (bTable) bTable.className = 'px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold transition';
            if (bCards) bCards.className = 'px-2.5 py-1 rounded-lg text-slate-400 hover:text-white text-xs font-bold transition';
        }
        render();
    }

    function addHolding(ticker, name, qty, buyPrice, curPrice, sector, isFund, isGold) {
        const existingIdx = holdings.findIndex(x => x.ticker === ticker);
        if (existingIdx !== -1) {
            holdings[existingIdx].qty = parseFloat(qty);
            holdings[existingIdx].buy = parseFloat(buyPrice);
            if (curPrice) holdings[existingIdx].cur = parseFloat(curPrice);
        } else {
            holdings.push({
                ticker: ticker.toUpperCase(),
                name: name || ticker,
                qty: parseFloat(qty),
                buy: parseFloat(buyPrice),
                cur: parseFloat(curPrice) || parseFloat(buyPrice),
                sector: sector || 'عام',
                isFund: !!isFund,
                isGold: !!isGold,
                sharia: true
            });
        }
        saveHoldings();
        render();
    }

    function removeHoldingPrompt(ticker) {
        if (confirm(`هل أنت متأكد من حذف الأصل (${ticker}) من المحفظة؟`)) {
            holdings = holdings.filter(x => x.ticker !== ticker);
            saveHoldings();
            render();
            if (window.App && window.App.showToast) window.App.showToast(`تم حذف الأصل ${ticker}`);
        }
    }

    function editHoldingPrompt(ticker) {
        const item = holdings.find(x => x.ticker === ticker);
        if (!item) return;
        const newQty = prompt(`تعديل الكمية لسهم ${item.name} (${ticker}):`, item.qty);
        if (newQty !== null && !isNaN(parseFloat(newQty))) {
            const newBuy = prompt(`تعديل متوسط سعر الشراء (${ticker}):`, item.buy);
            if (newBuy !== null && !isNaN(parseFloat(newBuy))) {
                item.qty = parseFloat(newQty);
                item.buy = parseFloat(newBuy);
                saveHoldings();
                render();
                if (window.App && window.App.showToast) window.App.showToast(`تم تعديل بيانات ${ticker}`);
            }
        }
    }

    function resetToDefault() {
        if (confirm("هل تريد استعادة محفظة الأصول الأصلية المتوافقة مع الشريعة؟")) {
            holdings = JSON.parse(JSON.stringify(window.EGX_DATA.DEFAULT_PORTFOLIO));
            cashBalance = 0.00;
            saveHoldings();
            render();
            if (window.App && window.App.showToast) window.App.showToast('تمت استعادة المحفظة الأصلية بنجاح');
        }
    }

    function exportCSV() {
        let csv = 'Ticker,Company,Qty,BuyPrice,CurPrice,Valuation,ProfitLoss\n';
        const data = calculate();
        data.items.forEach(h => {
            csv += `"${h.ticker}","${h.name}",${h.qty},${h.buy},${h.cur},${h.currentVal.toFixed(2)},${h.pnl.toFixed(2)}\n`;
        });
        const encodedUri = encodeURI('data:text/csv;charset=utf-8,\uFEFF' + csv);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `EGX_Sharia_Portfolio_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        if (window.App && window.App.showToast) window.App.showToast('تم تصدير كشف المحفظة بنجاح');
    }

    // Public API
    window.PortfolioEngine = {
        init,
        render,
        calculate,
        setFilter,
        setViewMode,
        addHolding,
        removeHoldingPrompt,
        editHoldingPrompt,
        resetToDefault,
        toggleBuyPrice,
        exportCSV,
        getHoldings: () => holdings
    };

})(window);
