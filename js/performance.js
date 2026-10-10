/**
 * EGX Sharia Portal - Performance & Chart Engine (js/performance.js)
 * High-Performance Chart.js Integration | Zero Memory Leak
 */

(function(window) {
    'use strict';

    let equityChartInstance = null;
    let allocationChartInstance = null;
    let currentPeriod = '1M';

    // Mock benchmark timeline generators (Zero-latency offline computation)
    function generateTimeline(period) {
        const labels = [];
        const portfolioData = [];
        const benchmarkData = [];
        
        let count = 30;
        let baseVal = 85000;
        let baseBench = 6500;

        if (period === '1D') {
            count = 12;
            for (let i = 0; i < count; i++) {
                labels.push(`${10 + Math.floor(i / 2)}:${i % 2 === 0 ? '00' : '30'}`);
                portfolioData.push(baseVal + (Math.sin(i / 2) * 450) + (i * 75));
                benchmarkData.push(baseBench + (Math.cos(i / 2) * 25) + (i * 5));
            }
        } else if (period === '1W') {
            const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
            days.forEach((d, i) => {
                labels.push(d);
                portfolioData.push(baseVal - 600 + (i * 280));
                benchmarkData.push(baseBench - 40 + (i * 18));
            });
        } else if (period === '1M') {
            for (let i = 1; i <= 22; i++) {
                labels.push(`يوم ${i}`);
                portfolioData.push(baseVal - 1200 + (i * 125) + (Math.sin(i) * 350));
                benchmarkData.push(baseBench - 80 + (i * 8) + (Math.cos(i) * 20));
            }
        } else if (period === '3M') {
            for (let i = 1; i <= 12; i++) {
                labels.push(`أسبوع ${i}`);
                portfolioData.push(78000 + (i * 800) + (Math.sin(i) * 500));
                benchmarkData.push(6100 + (i * 45));
            }
        } else if (period === 'YTD') {
            const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر'];
            months.forEach((m, i) => {
                labels.push(m);
                portfolioData.push(72000 + (i * 1600) + (Math.sin(i) * 800));
                benchmarkData.push(5800 + (i * 85));
            });
        } else { // ALL
            const years = ['2024-Q1', '2024-Q3', '2025-Q1', '2025-Q3', '2026-Q1', '2026-Q3'];
            years.forEach((y, i) => {
                labels.push(y);
                portfolioData.push(50000 + (i * 7000));
                benchmarkData.push(4200 + (i * 450));
            });
        }

        return { labels, portfolioData, benchmarkData };
    }

    function renderTimelineChart(period) {
        currentPeriod = period || currentPeriod;
        const canvas = document.getElementById('perfEquityCanvas');
        if (!canvas) return;

        const isDark = document.documentElement.classList.contains('dark');
        const textColor = isDark ? '#94a3b8' : '#475569';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

        const { labels, portfolioData, benchmarkData } = generateTimeline(currentPeriod);

        if (equityChartInstance) {
            equityChartInstance.destroy();
        }

        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 240);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

        equityChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'قيمة المحفظة (ج.م)',
                        data: portfolioData,
                        borderColor: '#10b981',
                        backgroundColor: gradient,
                        borderWidth: 2.5,
                        fill: true,
                        tension: 0.35,
                        pointRadius: 2,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'مؤشر EGX33 الشريعة',
                        data: benchmarkData,
                        borderColor: '#f59e0b',
                        borderWidth: 1.5,
                        borderDash: [4, 4],
                        fill: false,
                        tension: 0.35,
                        pointRadius: 0,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        rtl: true,
                        labels: {
                            color: textColor,
                            font: { family: 'IBM Plex Sans Arabic', size: 11 }
                        }
                    },
                    tooltip: {
                        rtl: true,
                        bodyFont: { family: 'JetBrains Mono' },
                        titleFont: { family: 'IBM Plex Sans Arabic' }
                    }
                },
                scales: {
                    x: {
                        grid: { color: gridColor },
                        ticks: { color: textColor, font: { family: 'IBM Plex Sans Arabic', size: 10 } }
                    },
                    y: {
                        grid: { color: gridColor },
                        ticks: { color: textColor, font: { family: 'JetBrains Mono', size: 10 } }
                    },
                    y1: {
                        position: 'left',
                        grid: { display: false },
                        ticks: { color: '#f59e0b', font: { family: 'JetBrains Mono', size: 10 } }
                    }
                }
            }
        });
    }

    function setPeriod(period) {
        currentPeriod = period;
        document.querySelectorAll('.perf-period-btn').forEach(btn => {
            if (btn.getAttribute('data-period') === period) {
                btn.className = 'perf-period-btn px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold transition';
            } else {
                btn.className = 'perf-period-btn px-2.5 py-1 rounded-lg text-slate-400 hover:text-white text-xs font-bold transition';
            }
        });
        renderTimelineChart(period);
    }

    window.PerformanceEngine = {
        render: renderTimelineChart,
        setPeriod
    };

})(window);
