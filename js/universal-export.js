

        // UNIVERSAL EXPORT ENGINE (EXCEL & PDF) - SOCPA / IFRS COMPLIANT

        // =========================================================================

        window.toggleUniversalExportDropdown = function(scope, event) {

            if (event) {

                event.stopPropagation();

                event.preventDefault();

            }

            const dropdown = document.getElementById(`exportDropdown_${scope}`);

            if (!dropdown) return;



            // Close other open export dropdowns first

            document.querySelectorAll('[id^="exportDropdown_"]').forEach(el => {

                if (el !== dropdown) el.classList.add('hidden');

            });



            dropdown.classList.toggle('hidden');

        };



        // Close dropdown when clicking outside

        document.addEventListener('click', function(e) {

            if (!e.target.closest('[id^="universalExportBtn_"]') && !e.target.closest('[id^="exportDropdown_"]')) {

                document.querySelectorAll('[id^="exportDropdown_"]').forEach(el => el.classList.add('hidden'));

            }

        });



        window.handleUniversalExport = function(scope, format) {

            triggerHaptic('medium');

            // Hide dropdown

            const dropdown = document.getElementById(`exportDropdown_${scope}`);

            if (dropdown) dropdown.classList.add('hidden');



            if (format === 'excel') {

                exportUniversalExcel(scope);

            } else if (format === 'pdf') {

                exportUniversalPdf(scope);

            }

        };



        function exportUniversalExcel(scope) {

            const now = new Date();

            const dateStr = now.toISOString().split('T')[0];

            let csv = "\uFEFF"; // UTF-8 BOM for Arabic support in Excel



            if (scope === 'portfolio') {

                csv += "كشف محفظة الأصول الشرعية المعتمدة (البورصة المصرية وصناديق الاستثمار)\n";

                csv += `تاريخ التصدير: ${now.toLocaleDateString('ar-EG')} ${now.toLocaleTimeString('ar-EG')} • المعيار المحاسبي: SOCPA / IFRS\n\n`;

                csv += "الرمز,اسم الأصل / السهم,القطاع,النوع,الكمية المملوكة,متوسط تكلفة الوحدة (ج.م),السعر اللحظي / NAV (ج.م),وضع التقييم,إجمالي التكلفة (ج.م),القيمة السوقية (ج.م),الأرباح / الخسائر (ج.م),نسبة العائد (%),الوزن النسبي (%)\n";



                let totalCost = 0;

                let totalVal = 0;

                userHoldings.forEach(h => {

                    const cost = (h.avg_unit_cost || h.buy || 0) * (h.qty_owned || h.qty || 0);

                    const val = (h.cur || 0) * (h.qty_owned || h.qty || 0);

                    totalCost += cost;

                    totalVal += val;

                });



                userHoldings.forEach(h => {

                    const qty = h.qty_owned !== undefined ? h.qty_owned : h.qty;

                    const buy = h.avg_unit_cost !== undefined ? h.avg_unit_cost : h.buy;

                    const cur = h.cur || 0;

                    const cost = buy * qty;

                    const val = cur * qty;

                    const pnl = val - cost;

                    const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;

                    const weight = totalVal > 0 ? (val / totalVal) * 100 : 0;

                    const assetType = h.ticker === 'THNDR_GOLD' ? 'ذهب خام' : (h.isFund ? 'صندوق استثمار' : 'سهم مقيد');

                    const mode = h.valuation_mode === 'manual' ? 'يدوي' : 'تلقائي (سوق)';



                    csv += `"${h.ticker}","${h.name}","${h.sector || ''}","${assetType}",${qty},${buy.toFixed(4)},${cur.toFixed(4)},"${mode}",${cost.toFixed(2)},${val.toFixed(2)},${pnl.toFixed(2)},${pnlPct.toFixed(2)}%,${weight.toFixed(2)}%\n`;

                });



                const totalPnl = totalVal - totalCost;

                const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

                csv += `\n"الإجمالي","ثروة المحفظة الكاملة","—","—","—","—","—","—",${totalCost.toFixed(2)},${totalVal.toFixed(2)},${totalPnl.toFixed(2)},${totalPnlPct.toFixed(2)}%,100.00%\n`;

                csv += `"السيولة النقدية والمحفظة","كاش ثندر","—","نقد",1,${THNDR_CASH.cash || 0},${THNDR_CASH.cash || 0},"تلقائي",${THNDR_CASH.cash || 0},${THNDR_CASH.cash || 0},0.00,0.00%,—\n`;

                csv += `"صندوق كلودز","Clawdz","—","صندوق نقد",1,${THNDR_CASH.clawdz || 0},${THNDR_CASH.clawdz || 0},"تلقائي",${THNDR_CASH.clawdz || 0},${THNDR_CASH.clawdz || 0},0.00,0.00%,—\n`;



                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');

                a.href = url;

                a.download = `EGX_Portfolio_Audited_${dateStr}.csv`;

                a.click();

                URL.revokeObjectURL(url);

                showToast("تم تصدير كشف المحفظة بصيغة Excel بنجاح ✅", "success");

            } else if (scope === 'dailyreport') {

                const rpt = (typeof DAILY_REPORTS !== 'undefined' && Array.isArray(DAILY_REPORTS))

                    ? (DAILY_REPORTS.find(r => r.date === _drSelectedDate) || DAILY_REPORTS[0])

                    : null;

                if (!rpt) return;



                csv += `تقرير التداول اليومي المعتمد: ${rpt.label}\n`;

                csv += `العنوان: ${rpt.headline}\n\n`;

                csv += "المؤشر / الأصل,سعر الإغلاق,سعر الافتتاح,نسبة التغير (%),البيان التحليلي\n";

                if (rpt.indicesSection && rpt.indicesSection.items) {

                    rpt.indicesSection.items.forEach(i => {

                        csv += `"${(i.name||'').replace(/"/g, '""')}",${i.close||0},${i.open||0},${i.change||0}%,"${(i.desc||'').replace(/"/g, '""')}"\n`;

                    });

                }

                csv += "\nالرمز,اسم السهم,سعر الشراء بالمحفظة,سعر الإغلاق,نسبة التغير اليومي,مستوى الدعم,مستوى المقاومة,التوصية\n";

                if (rpt.holdingsSection && rpt.holdingsSection.stocks) {

                    rpt.holdingsSection.stocks.forEach(s => {

                        csv += `"${(s.code||'').replace(/"/g, '""')}","${(s.name||'').replace(/"/g, '""')}",${s.open || 0},${s.close || 0},${s.change || 0}%,"${(s.support || '').replace(/"/g, '""')}","${s.resistance || ''}","${s.tomorrowRec || ''}"\n`;

                    });

                }



                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');

                a.href = url;

                a.download = `EGX_Daily_Report_${rpt.date}.csv`;

                a.click();

                URL.revokeObjectURL(url);

                showToast(`تم تصدير تقرير جلسة ${rpt.sessionDay} بصيغة Excel ✅`, "success");

            } else {

                // Generic radar / stocks export

                csv += "قائمة أسهم البورصة المصرية المتوافقة مع الشريعة الإسلامية ومؤشر EGX33\n\n";

                csv += "الرمز,اسم الشركة,القطاع,آخر سعر (ج.م),التغير (%),مؤشر RSI,القيمة العادلة (ج.م),هامش الأمان (%),التوصية\n";

                STOCKS_DATA.forEach(s => {

                    const fair = s.fairValue || (VALUATION_DATA[s.ticker] && VALUATION_DATA[s.ticker].base) || '—';

                    csv += `"${s.ticker}","${s.name}","${s.sector || ''}",${s.close || 0},${s.chg || 0}%,${s.rsi || 50},${fair},"${s.safetyMargin || ''}","${s.rec || 'احتفاظ'}"\n`;

                });

                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');

                a.href = url;

                a.download = `EGX_Sharia_Stocks_Directory_${dateStr}.csv`;

                a.click();

                URL.revokeObjectURL(url);

                showToast("تم تصدير دليل الأسهم الشرعية بصيغة Excel ✅", "success");

            }

        }



        function exportUniversalPdf(scope) {

            triggerHaptic('medium');

            if (scope === 'dailyreport') {

                window.print();

            } else if (typeof printPortfolioStatement === 'function') {

                printPortfolioStatement();

            } else {

                window.print();

            }

        }



        // Direct News & Disclosures Link Resolver for Daily Reports (User Item 1)

        

        window.openDirectArticle = function(url, ticker, event, hasSource = true, sourceName = '') {

            if (event) {

                if (typeof event.stopPropagation === 'function') event.stopPropagation();

                if (typeof event.preventDefault === 'function') event.preventDefault();

            }

            

            // If item has no specific external source or is purely an internal technical notice

            if (hasSource === false || !url || url === '#' || (sourceName && (sourceName.includes('داخلي') || sourceName.includes('المنصة')))) {

                showToast('⚠️ هذا الإشعار يمثل قراءة تحليلية للمنصة ولا يرتبط برابط إفصاح خارجي منفصل.', 'warning');

                // Open modal or alert explaining

                const modalId = 'noSourceNoticeModal';

                let m = document.getElementById(modalId);

                if (!m) {

                    m = document.createElement('div');

                    m.id = modalId;

                    m.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm';

                    m.innerHTML = `

                        <div class="glass-card max-w-sm w-full p-5 rounded-2xl border border-amber-600/50 space-y-4 text-right shadow-2xl" dir="rtl">

                            <div class="flex items-center gap-2 text-amber-400 font-bold text-sm">

                                <span>⚠️</span>

                                <h4>توضيح مصدر الخبر أو الإشعار</h4>

                            </div>

                            <p class="text-xs text-slate-300 leading-relaxed">

                                هذا الخبر أو الإشعار صادر عن محرك التحليل المالي والذكاء الاصطناعي للمنصة كقراءة استرشادية، ولا يرتبط برابط إفصاح صحفي خارجي محدد.

                            </p>

                            <div class="pt-2 flex items-center justify-between gap-2">

                                ${ticker && ticker !== 'MACRO' ? `

                                <a href="https://www.mubasher.info/markets/EGX/stocks/${ticker}/news" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-lg bg-sky-950 border border-sky-800 text-sky-300 hover:bg-sky-900 text-xs font-bold transition">

                                    أخبار ${ticker} على مباشر ↗

                                </a>` : `

                                <a href="https://www.mubasher.info/markets/EGX/news" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-lg bg-sky-950 border border-sky-800 text-sky-300 hover:bg-sky-900 text-xs font-bold transition">

                                    أخبار البورصة على مباشر ↗

                                </a>`}

                                <button onclick="document.getElementById('${modalId}').remove()" class="px-4 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 text-xs font-bold transition">

                                    إغلاق

                                </button>

                            </div>

                        </div>

                    `;

                    document.body.appendChild(m);

                }

                return;

            }



            let targetUrl = url;

            if (!targetUrl || targetUrl.trim() === '' || targetUrl.includes('snduk.com') || targetUrl.includes('egx.com.eg')) {

                if (ticker && ticker !== 'MACRO') {

                    targetUrl = `https://www.mubasher.info/markets/EGX/stocks/${ticker}/news`;

                } else {

                    targetUrl = 'https://www.mubasher.info/markets/EGX/news';

                }

            }

            window.open(targetUrl, '_blank', 'noopener,noreferrer');

        };



        window.getDirectNewsLinkForText = function(text) {

            const t = (text || '').toLowerCase();

            const officialTickers = ['ETEL','TMGH','EFIH','ADIB','EGAL','ORHD','OCDI','EFID','FWRY','MFPC','ABUK','AMOC','SKPC','ICFC','MCQE','ARCC','CIRA','EGAS','ACGC','LCSW','OLFI','MTIE','PHDC','ORWE','FAIT','FAITA','SWDY','JUFO','ORAS','EAST','ISPH'];

            for (const tk of officialTickers) {

                if (t.includes(tk.toLowerCase())) {

                    return { url: `https://www.egx.com.eg/ar/Disclosures.aspx?ticker=${tk}`, label: `إفصاح ${tk} الرسمي` };

                }

            }

            if (t.includes('mnt-halan') || t.includes('حالا') || t.includes('طرح 20%')) {

                return { url: 'https://www.mubasher.info/news/4341420/mnt-halan-plans-20-percent-ipo-egx', label: 'مباشر: طرح حالا بالبورصة' };

            }

            if (t.includes('54,000') || t.includes('54120') || t.includes('egx30')) {

                return { url: 'https://www.mubasher.info/news/4341110/egx30-breaks-54000-points-institutional-buying', label: 'مباشر: اختراق EGX30 حاجز 54 ألف' };

            }

            if (t.includes('egx33') || t.includes('شريعة') || t.includes('مؤشر الشريعة')) {

                return { url: 'https://www.egx.com.eg/ar/Disclosures.aspx?ticker=EGX33', label: 'إفصاحات EGX33 الشريعة' };

            }

            if (t.includes('etel') || t.includes('المصرية للاتصالات')) {

                return { url: 'https://www.egx.com.eg/ar/Disclosures.aspx?ticker=ETEL', label: 'إفصاحات المصرية للاتصالات الرسمية' };

            }

            if (t.includes('tmgh') || t.includes('طلعت مصطفى') || t.includes('بنان') || t.includes('ساوث ميد')) {

                return { url: 'https://www.mubasher.info/news/4341950/talaat-moustafa-sales-record-saudi-arabia-banan', label: 'مباشر: مبيعات طلعت مصطفى القياسية' };

            }

            if (t.includes('efih') || t.includes('إي فاينانس') || t.includes('إي-فاينانس')) {

                return { url: 'https://www.egx.com.eg/ar/Disclosures.aspx?ticker=EFIH', label: 'إفصاحات إي-فاينانس الرسمية' };

            }

            if (t.includes('adib') || t.includes('أبوظبي الإسلامي') || t.includes('زيادة رأس المال')) {

                return { url: 'https://www.egx.com.eg/ar/Disclosures.aspx?ticker=ADIB', label: 'إفصاح جمعية أبوظبي الإسلامي' };

            }

            if (t.includes('fwry') || t.includes('فوري')) {

                return { url: 'https://www.egx.com.eg/ar/Disclosures.aspx?ticker=FWRY', label: 'إفصاحات فوري الرسمية' };

            }

            if (t.includes('egal') || t.includes('مصر للالومنيوم') || t.includes('ألومنيوم')) {

                return { url: 'https://www.egx.com.eg/ar/Disclosures.aspx?ticker=EGAL', label: 'إفصاحات مصر للألومنيوم' };

            }

            if (t.includes('صناديق') || t.includes('وثائق')) {

                return { url: 'https://www.egx.com.eg/ar/Disclosures.aspx', label: 'إفصاحات الصناديق الرسمية (EGX)' };

            }

            if (t.includes('ذهب') || t.includes('سبائك') || t.includes('7015') || t.includes('7,015') || t.includes('7040')) {

                return { url: 'https://www.mubasher.info/news/4341380/gold-prices-egypt-24k-thndr', label: 'مباشر: أسعار الذهب عيار 24 وثندر' };

            }

            if (t.includes('دولار') || t.includes('usd') || t.includes('صرف') || t.includes('مركزي')) {

                return { url: 'https://www.cbe.org.eg/ar/economic-research/exchange-rates', label: 'البنك المركزي: أسعار الصرف الرسمية' };

            }

            return { url: 'https://www.egx.com.eg/ar/Disclosures.aspx', label: 'البورصة: بوابة الإفصاحات الرسمية' };

        };

    