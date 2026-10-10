/**
 * EGX Sharia Portal - Master Application Controller (js/app.js)
 * Clean Architecture | Single Controller Orchestrating All Modules
 */

(function(window) {
    'use strict';

    let currentScreen = 'portfolio';

    // 1. Application Initialization
    function init() {
        initClock();
        initTheme();
        initTicker();
        
        // Initialize child modules
        if (window.PortfolioEngine) window.PortfolioEngine.init();
        if (window.DailyReportsEngine) window.DailyReportsEngine.init();
        if (window.GeminiAssistant) window.GeminiAssistant.init();

        // Render News & Market Pulse
        renderMarketPulse();
        renderNewsFeed();

        // Register PWA Service Worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js').catch(err => {
                    console.log('[PWA] SW register skipped:', err);
                });
            });
        }
    }

    // 2. Cairo Egypt Clock (UTC+2)
    function initClock() {
        const updateClock = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { timeZone: 'Africa/Cairo', hour12: false });
            const clockEl = document.getElementById('egyptTimeClock');
            if (clockEl) clockEl.innerText = timeStr;
        };
        setInterval(updateClock, 1000);
        updateClock();
    }

    // 3. Theme Manager (Dark / Light)
    function initTheme() {
        const savedTheme = localStorage.getItem('egx_clean_theme');
        if (savedTheme === 'light') {
            document.documentElement.classList.remove('dark');
            updateThemeIcons(false);
        } else {
            document.documentElement.classList.add('dark');
            updateThemeIcons(true);
        }
    }

    function toggleTheme() {
        const html = document.documentElement;
        const isDark = html.classList.contains('dark');
        if (isDark) {
            html.classList.remove('dark');
            localStorage.setItem('egx_clean_theme', 'light');
            updateThemeIcons(false);
        } else {
            html.classList.add('dark');
            localStorage.setItem('egx_clean_theme', 'dark');
            updateThemeIcons(true);
        }
        if (window.PerformanceEngine) window.PerformanceEngine.render();
    }

    function updateThemeIcons(isDark) {
        const icon = document.getElementById('themeIcon');
        const text = document.getElementById('themeText');
        if (icon) icon.innerText = isDark ? '🌙' : '☀️';
        if (text) text.innerText = isDark ? 'ليلي' : 'نهاري';
    }

    // 4. Privacy Mode (Blur Numbers)
    function togglePrivacyMode() {
        document.body.classList.toggle('privacy-mode');
        const isBlurred = document.body.classList.contains('privacy-mode');
        const icon = document.getElementById('privacyIcon');
        if (icon) icon.innerText = isBlurred ? '👁️' : '🔒';
        showToast(isBlurred ? 'تم تفعيل وضع الخصوصية وإخفاء الأرقام' : 'تم إظهار الأرقام الحساسة');
    }

    // 5. Render Top Ticker Bar
    function initTicker() {
        const indices = window.EGX_DATA && window.EGX_DATA.MARKET_INDICES;
        if (!indices) return;

        const egx30El = document.getElementById('ticker_egx30_val');
        const egx33El = document.getElementById('ticker_egx33_val');
        const goldEl  = document.getElementById('ticker_gold_val');
        const usdEl   = document.getElementById('ticker_usd_val');

        if (egx30El) egx30El.innerText = indices.egx30.price.toLocaleString();
        if (egx33El) egx33El.innerText = indices.egx33.price.toLocaleString();
        if (goldEl)  goldEl.innerText = `${indices.gold.price.toLocaleString()} ج`;
        if (usdEl)   usdEl.innerText = `${indices.usd.price.toFixed(2)} ج`;
    }

    // 6. Navigation: Bottom Dock Screen Switcher
    function switchScreen(screenName) {
        currentScreen = screenName;
        const screens = ['portfolio', 'analytics', 'market', 'news', 'research', 'reports', 'tools'];
        
        screens.forEach(s => {
            const el = document.getElementById('screen-' + s);
            if (el) {
                if (s === screenName) el.classList.remove('hidden');
                else el.classList.add('hidden');
            }
        });

        // Update Bottom Nav Active Styling
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.getAttribute('data-screen') === screenName) {
                btn.classList.add('active');
                btn.classList.add('text-emerald-400');
                btn.classList.remove('text-slate-400');
            } else {
                btn.classList.remove('active');
                btn.classList.remove('text-emerald-400');
                btn.classList.add('text-slate-400');
            }
        });

        // Trigger Screen-Specific Actions
        if (screenName === 'analytics' && window.PerformanceEngine) {
            window.PerformanceEngine.render();
        } else if (screenName === 'portfolio' && window.PortfolioEngine) {
            window.PortfolioEngine.render();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 7. Top View Switcher (Holdings vs Analytics)
    function switchMainView(mode) {
        const bH = document.getElementById('viewTabHoldings');
        const bA = document.getElementById('viewTabAnalytics');

        if (mode === 'holdings') {
            if (bH) { bH.className = 'px-3 sm:px-4 py-1.5 rounded-lg bg-emerald-600 text-white shadow font-bold transition'; }
            if (bA) { bA.className = 'px-3 sm:px-4 py-1.5 rounded-lg text-slate-400 hover:text-white font-bold transition'; }
            switchScreen('portfolio');
        } else {
            if (bA) { bA.className = 'px-3 sm:px-4 py-1.5 rounded-lg bg-emerald-600 text-white shadow font-bold transition'; }
            if (bH) { bH.className = 'px-3 sm:px-4 py-1.5 rounded-lg text-slate-400 hover:text-white font-bold transition'; }
            switchScreen('analytics');
        }
    }

    // 8. Render Market Pulse Screen
    function renderMarketPulse() {
        const tableBody = document.getElementById('marketPulseTableBody');
        if (!tableBody || !window.EGX_DATA) return;

        const quotes = window.EGX_DATA.MARKET_QUOTES || [];
        let html = '';

        quotes.forEach(s => {
            const isPos = s.chg >= 0;
            html += `
                <tr class="hover:bg-slate-800/30 transition">
                    <td class="p-3">
                        <div class="font-bold text-white">${s.ticker}</div>
                        <div class="text-[10px] text-slate-400 font-sans">${s.name}</div>
                    </td>
                    <td class="p-3 font-bold text-white">${s.close.toFixed(2)} ج</td>
                    <td class="p-3 font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}">
                        ${isPos ? '+' : ''}${s.chg.toFixed(2)}%
                    </td>
                    <td class="p-3 text-slate-300">${s.pe || '--'}</td>
                    <td class="p-3 text-slate-300">${s.pb || '--'}</td>
                    <td class="p-3 font-sans">
                        <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">${s.sharia}</span>
                    </td>
                    <td class="p-3 font-sans font-bold text-emerald-300 text-[11px]">${s.rec}</td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    }

    // 9. Render News Feed Screen
    function renderNewsFeed() {
        const container = document.getElementById('newsFeedCardsContainer');
        if (!container || !window.EGX_DATA) return;

        const news = window.EGX_DATA.NEWS_FEED || [];
        let html = '';

        news.forEach(n => {
            html += `
                <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-slate-700 transition">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">${n.tag}</span>
                        <span class="text-[10px] text-slate-500">${n.time}</span>
                    </div>
                    <h3 class="text-sm font-bold text-white">${n.title}</h3>
                    <p class="text-xs text-slate-400 leading-relaxed">${n.summary}</p>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    // 10. Modals Management
    function openModal(id) {
        const m = document.getElementById(id);
        if (m) m.classList.remove('hidden');
    }
    function closeModal(id) {
        const m = document.getElementById(id);
        if (m) m.classList.add('hidden');
    }

    // 11. Toast Notifications Helper
    function showToast(msg) {
        const t = document.getElementById('toastNotification');
        if (!t) return;
        t.innerText = msg;
        t.style.opacity = '1';
        t.style.transform = 'translate(-50%, 10px)';
        setTimeout(() => {
            t.style.opacity = '0';
            t.style.transform = 'translate(-50%, 0)';
        }, 2600);
    }

    // 12. Save Trade Transaction from Modal
    function handleSaveTrade() {
        const ticker = document.getElementById('tradeTicker')?.value.trim().toUpperCase();
        const name = document.getElementById('tradeName')?.value.trim();
        const qty = parseFloat(document.getElementById('tradeQty')?.value);
        const buyPrice = parseFloat(document.getElementById('tradeBuyPrice')?.value);
        const curPrice = parseFloat(document.getElementById('tradeCurPrice')?.value) || buyPrice;
        const isFund = document.getElementById('tradeIsFund')?.checked;

        if (!ticker || isNaN(qty) || qty <= 0 || isNaN(buyPrice) || buyPrice <= 0) {
            alert('يرجى إدخال رمز السهم والكمية وسعر الشراء بصورة صحيحة');
            return;
        }

        if (window.PortfolioEngine) {
            window.PortfolioEngine.addHolding(ticker, name, qty, buyPrice, curPrice, 'استثمار شخصي', isFund, false);
            showToast(`تمت إضافة صفقة ${ticker} بنجاح`);
            closeModal('modalTrade');
        }
    }

    // Expose Global App Controller
    window.App = {
        init,
        toggleTheme,
        togglePrivacyMode,
        switchScreen,
        switchMainView,
        openModal,
        closeModal,
        showToast,
        handleSaveTrade
    };

    // Auto-boot on DOM Ready
    document.addEventListener('DOMContentLoaded', init);

})(window);
