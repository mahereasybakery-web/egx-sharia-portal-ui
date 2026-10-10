/**
 * EGX Sharia Portal - Daily Reports Engine (js/daily-reports.js)
 * Clean Architecture | Day-over-Day Audit
 */

(function(window) {
    'use strict';

    let activeReportDate = '2026-10-07';

    function init() {
        render();
    }

    function render(dateStr) {
        activeReportDate = dateStr || activeReportDate;
        const reports = (window.EGX_DATA && window.EGX_DATA.DAILY_REPORTS) || [];
        const rpt = reports.find(r => r.date === activeReportDate) || reports[0];
        if (!rpt) return;

        // 1. Render Date Selector Buttons
        const btnsContainer = document.getElementById('drDateButtons');
        if (btnsContainer) {
            btnsContainer.innerHTML = reports.map(r => `
                <button onclick="window.DailyReportsEngine.selectDate('${r.date}')" class="px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 border ${r.date === rpt.date ? 'bg-emerald-600 text-white border-emerald-500 shadow-md' : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'}">
                    📅 جلسة ${r.date}
                </button>
            `).join('');
        }

        // 2. Render Report Content
        const titleEl = document.getElementById('dr_report_title');
        const sentimentEl = document.getElementById('dr_report_sentiment');
        const summaryEl = document.getElementById('dr_report_summary');
        const topGainerEl = document.getElementById('dr_top_gainer');
        const topVolEl = document.getElementById('dr_top_volume');
        const shariaNoteEl = document.getElementById('dr_sharia_note');

        if (titleEl) titleEl.innerText = rpt.title;
        if (sentimentEl) sentimentEl.innerText = rpt.sentiment;
        if (summaryEl) summaryEl.innerText = rpt.summary;
        if (topGainerEl) topGainerEl.innerText = rpt.topGainer;
        if (topVolEl) topVolEl.innerText = rpt.topVolume;
        if (shariaNoteEl) shariaNoteEl.innerText = rpt.shariaNote;
    }

    function selectDate(d) {
        activeReportDate = d;
        render(d);
        if (window.App && window.App.showToast) window.App.showToast(`تم تحميل تقرير جلسة ${d}`);
    }

    window.DailyReportsEngine = {
        init,
        render,
        selectDate
    };

})(window);
