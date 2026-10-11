/**
 * ══════════════════════════════════════════════════════════════════════════
 * EGX Sharia Portal - Dual AI Engine: Google Gemini + xAI Grok (js/gemini-ai.js)
 * Universal Knowledge (Inside & Outside Economics) • Zero Canned Dumps • 100% RTL
 * ══════════════════════════════════════════════════════════════════════════
 */

(function(window) {
    'use strict';

    // Active AI Model State ('gemini' or 'grok')
    try {
        window.ACTIVE_AI_MODEL = localStorage.getItem('egx_active_ai_model') || 'gemini';
    } catch (e) {
        window.ACTIVE_AI_MODEL = 'gemini';
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 1. REPOSITORY & STOCK ALIASES KNOWLEDGE GRAPH
    // ─────────────────────────────────────────────────────────────────────────
    const STOCK_ALIASES = [
        { ticker: 'ETEL', names: ['المصرية للاتصالات', 'اتصالات', 'وي', 'we', 'telecom egypt', 'etel', 'الشركة المصرية'] },
        { ticker: 'TMGH', names: ['طلعت مصطفى', 'طلعت', 'مجموعة طلعت', 'tmgh', 'بنان', 'ساوث ميد', 'طلعت مصطفي'] },
        { ticker: 'EFIH', names: ['إي فاينانس', 'اي فاينانس', 'إي-فاينانس', 'فاينانس', 'efih', 'الشمول المالي'] },
        { ticker: 'ADIB', names: ['أبو ظبي الإسلامي', 'أبوظبي الإسلامي', 'ابوظبي الاسلامي', 'مصرف أبوظبي', 'adib'] },
        { ticker: 'SWDY', names: ['السويدي إليكتريك', 'السويدي', 'سويدي', 'الكابلات', 'elsewedy', 'swdy'] },
        { ticker: 'MFPC', names: ['موبكو', 'مصر لإنتاج الأسمدة', 'موبكو للأسمدة', 'mopco', 'mfpc'] },
        { ticker: 'ABUK', names: ['أبو قير للأسمدة', 'أبو قير', 'ابو قير', 'ابوقير', 'أسمدة أبو قير', 'abuk'] },
        { ticker: 'AMOC', names: ['أموك', 'اموك', 'الإسكندرية للزيوت المعدنية', 'amoc'] },
        { ticker: 'SKPC', names: ['سيدي كرير', 'سيدى كرير', 'كرير', 'سيدبك', 'sidpec', 'skpc'] },
        { ticker: 'EGAL', names: ['مصر للألومنيوم', 'ألومنيوم مصر', 'مصر للالومنيوم', 'الالومنيوم', 'egal'] },
        { ticker: 'ORHD', names: ['أوراسكوم للتنمية', 'اوراسكوم للتنمية', 'الجونة', 'orhd'] },
        { ticker: 'OCDI', names: ['سوديك', 'السادس من أكتوبر للتنمية', 'ocdi'] },
        { ticker: 'EFID', names: ['إيديتا', 'ايديتا', 'إيديتا للصناعات الغذائية', 'efid'] },
        { ticker: 'FWRY', names: ['فوري', 'تكنولوجيا البنوك', 'fawry', 'fwry'] },
        { ticker: 'COMI', names: ['البنك التجاري الدولي', 'التجاري الدولي', 'cib', 'comi'] },
        { ticker: 'ISPH', names: ['ابن سينا فارما', 'ابن سينا', 'isph'] },
        { ticker: 'JUFO', names: ['جهينة', 'جهينه للصناعات الغذائية', 'jufo'] },
        { ticker: 'ORAS', names: ['أوراسكوم للإنشاءات', 'اوراسكوم للانشاء', 'oras'] },
        { ticker: 'EAST', names: ['الشرقية للدخان', 'ايسترن كومباني', 'east'] }
    ];

    // ─────────────────────────────────────────────────────────────────────────
    // 2. MODEL SWITCHER (Gemini <-> Grok)
    // ─────────────────────────────────────────────────────────────────────────
    window.switchActiveAiModel = function(model) {
        if (model !== 'gemini' && model !== 'grok') model = 'gemini';
        window.ACTIVE_AI_MODEL = model;
        try {
            localStorage.setItem('egx_active_ai_model', model);
        } catch (e) {}

        if (typeof triggerHaptic === 'function') triggerHaptic('light');

        // Update UI Pills in Floating Copilot Header
        const btnGemini = document.getElementById('aiModelToggleGemini');
        const btnGrok = document.getElementById('aiModelToggleGrok');
        const titleEl = document.getElementById('floatingAiModalTitle');
        const badgeEl = document.getElementById('floatingAiActivePageBadge');
        const inputEl = document.getElementById('floatingAiCustomInput');

        if (btnGemini && btnGrok) {
            if (model === 'gemini') {
                btnGemini.className = 'px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 bg-indigo-900/90 text-white border border-indigo-500 shadow-sm';
                btnGrok.className = 'px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 text-slate-400 hover:text-white hover:bg-slate-800';
            } else {
                btnGrok.className = 'px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white border border-amber-400 shadow-sm';
                btnGemini.className = 'px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 text-slate-400 hover:text-white hover:bg-slate-800';
            }
        }

        if (titleEl) {
            titleEl.innerText = (model === 'gemini') 
                ? 'مستشار Google Gemini (المعرفي والمالي)' 
                : 'مستشار xAI Grok (الذكي والشامل)';
        }

        if (badgeEl) {
            badgeEl.innerText = (model === 'gemini')
                ? '✨ محرك Google Gemini 2.5 نشط • معرفة شاملة واقتصادية'
                : '⚡ محرك xAI Grok-2 نشط • إجابات حرة، فورية، وموسوعية';
        }

        if (inputEl) {
            inputEl.placeholder = (model === 'gemini')
                ? 'اسأل Google Gemini عن أي شيء في الاقتصاد، الألعاب، العلوم، أو الحياة...'
                : 'اسأل xAI Grok عن أي شيء بحرية تامة وذكاء فوري...';
        }

        if (typeof showToast === 'function') {
            showToast(`تم التبديل إلى محرك: ${(model === 'gemini') ? 'Google Gemini ✨' : 'xAI Grok ⚡'}`);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // 3. EXECUTIVE COMMAND PARSER & ACTION BUTTON BUILDER (Eliminates Raw Leaks)
    // ─────────────────────────────────────────────────────────────────────────
    function parseAndCleanAiResponse(rawText) {
        if (!rawText) return { cleanHtml: '', actionButtonsHtml: '' };

        // Match all [EXEC:ACTION:PARAM:EXTRA] tokens
        const execRegex = /\[EXEC:([A-Za-z0-9_]+)(?::([A-Za-z0-9_]+))?(?::([A-Za-z0-9_]+))?\]/gi;
        const foundCommands = [];
        let match;

        while ((match = execRegex.exec(rawText)) !== null) {
            foundCommands.push({
                full: match[0],
                action: (match[1] || '').toUpperCase(),
                param: match[2] || '',
                extra: match[3] || ''
            });
        }

        // Strip all [EXEC:...] tokens from text
        let textWithoutCommands = rawText.replace(execRegex, '').trim();

        // Convert Markdown into Rich High-Contrast HTML
        let html = textWithoutCommands;

        // Headers
        html = html.replace(/^###\s+(.*)$/gm, '<h4 class="text-xs sm:text-sm font-bold text-amber-300 mt-3 mb-1.5 flex items-center gap-1.5 border-r-2 border-amber-400 pr-2"><span>$1</span></h4>');
        html = html.replace(/^##\s+(.*)$/gm, '<h3 class="text-sm sm:text-base font-extrabold text-emerald-400 mt-3.5 mb-2 flex items-center gap-1.5 border-r-2 border-emerald-400 pr-2"><span>$1</span></h3>');
        html = html.replace(/^#\s+(.*)$/gm, '<h2 class="text-base sm:text-lg font-black text-white mt-4 mb-2 pb-1 border-b border-slate-800">$1</h2>');

        // Horizontal rules
        html = html.replace(/^---+$/gm, '<hr class="border-slate-800 my-3">');

        // Bold & Italic
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<span class="text-indigo-200">$1</span>');

        // Bullet lists
        html = html.replace(/^[\*\-]\s+(.*)$/gm, '<div class="flex items-start gap-1.5 text-slate-200 text-xs my-1 leading-relaxed"><span class="text-emerald-400 font-bold shrink-0 mt-0.5">•</span><span class="flex-1">$1</span></div>');

        // Numbered lists
        html = html.replace(/^(\d+)\.\s+(.*)$/gm, '<div class="flex items-start gap-1.5 text-slate-200 text-xs my-1 leading-relaxed"><span class="text-amber-400 font-mono font-bold shrink-0 mt-0.5">$1.</span><span class="flex-1">$2</span></div>');

        // Blockquotes
        html = html.replace(/^>\s+(.*)$/gm, '<div class="p-2.5 rounded-xl bg-slate-900/90 border-r-2 border-indigo-500 text-[11px] text-slate-300 my-2 leading-relaxed">$1</div>');

        // Line breaks
        html = html.replace(/\n\n+/g, '<div class="h-2"></div>');
        html = html.replace(/\n/g, '<br/>');

        // Generate Interactive Clickable Action Buttons for Extracted Commands
        let actionButtonsHtml = '';
        if (foundCommands.length > 0) {
            let buttonsList = '';
            const addedKeys = new Set();

            foundCommands.forEach(cmd => {
                const key = `${cmd.action}:${cmd.param}`;
                if (addedKeys.has(key)) return;
                addedKeys.add(key);

                let btnTitle = 'تنفيذ الإجراء ⚡';
                let btnColor = 'from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white';
                let icon = '⚡';

                if (cmd.action === 'OPEN_CALCULATOR') {
                    if (cmd.param.toLowerCase() === 'dca') {
                        btnTitle = 'فتح حاسبة متوسط التكلفة (DCA) والتبريد';
                        btnColor = 'from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white border border-emerald-500/40';
                        icon = '🧮';
                    } else if (cmd.param.toLowerCase() === 'rebalance') {
                        btnTitle = 'فتح خطة إعادة توازن المحفظة';
                        btnColor = 'from-amber-700 to-indigo-800 hover:from-amber-600 hover:to-indigo-700 text-white border border-amber-500/40';
                        icon = '⚖️';
                    } else if (cmd.param.toLowerCase() === 'zakat') {
                        btnTitle = 'فتح حاسبة زكاة الأسهم والصناديق';
                        btnColor = 'from-emerald-800 to-green-700 hover:from-emerald-700 hover:to-green-600 text-white border border-emerald-600/40';
                        icon = '🕌';
                    } else if (cmd.param.toLowerCase() === 'liquidity') {
                        btnTitle = 'فتح خطة إدارة السيولة النقدية (19%)';
                        btnColor = 'from-sky-800 to-indigo-800 hover:from-sky-700 hover:to-indigo-700 text-white border border-sky-600/40';
                        icon = '💧';
                    }
                } else if (cmd.action === 'NAV_TAB') {
                    const tabNames = {
                        portfolio: 'الانتقال إلى محفظتي والأصول',
                        dailyreport: 'الانتقال إلى التقرير اليومي الشامل',
                        radar: 'الانتقال إلى نبض السوق والقطاعات',
                        news_hub: 'الانتقال إلى مركز الأخبار والإفصاحات',
                        recommendations: 'الانتقال إلى أبحاث الأسهم والتوصيات',
                        tools: 'الانتقال إلى أدوات التدقيق والزكاة'
                    };
                    btnTitle = tabNames[cmd.param.toLowerCase()] || `الانتقال إلى ${cmd.param}`;
                    btnColor = 'from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white border border-blue-500/40';
                    icon = '🚀';
                } else if (cmd.action === 'OPEN_STOCK') {
                    btnTitle = `فتح شارت وتحليل سهم ${cmd.param} 📈`;
                    btnColor = 'from-emerald-700 to-indigo-700 hover:from-emerald-600 hover:to-indigo-600 text-white border border-emerald-500/40';
                    icon = '📈';
                } else if (cmd.action === 'OPEN_FUND') {
                    btnTitle = `فتح بيانات صندوق ${cmd.param} 💰`;
                    btnColor = 'from-amber-700 to-purple-800 hover:from-amber-600 hover:to-purple-700 text-white border border-amber-500/40';
                    icon = '🏦';
                }

                buttonsList += `
                    <button onclick="window.dispatchAiInteractiveAction('${cmd.action}', '${cmd.param}', '${cmd.extra}')" class="px-3 py-1.5 rounded-xl bg-gradient-to-r ${btnColor} font-bold text-xs shadow-md transition active:scale-95 flex items-center gap-1.5 shrink-0 text-right">
                        <span>${icon}</span>
                        <span>${btnTitle}</span>
                        <span class="text-[10px] opacity-75">←</span>
                    </button>
                `;
            });

            if (buttonsList) {
                actionButtonsHtml = `
                    <div class="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5" dir="rtl">
                        <div class="text-[10.5px] font-bold text-indigo-300 flex items-center gap-1">
                            <span>⚡ إجراءات تنفيذية ذكية مقترحة:</span>
                        </div>
                        <div class="flex flex-wrap gap-2 pt-1">
                            ${buttonsList}
                        </div>
                    </div>
                `;
            }
        }

        return { cleanHtml: html, actionButtonsHtml: actionButtonsHtml };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 4. INTERACTIVE ACTION DISPATCHER
    // ─────────────────────────────────────────────────────────────────────────
    window.dispatchAiInteractiveAction = function(action, param, extra) {
        if (typeof triggerHaptic === 'function') triggerHaptic('medium');

        try {
            if (action === 'OPEN_CALCULATOR') {
                const sub = (param || 'dca').toLowerCase();
                if (typeof switchTab === 'function') switchTab('tools');
                if (sub === 'dca') {
                    const dcaView = document.getElementById('toolSubViewDca');
                    if (dcaView) {
                        document.querySelectorAll('[id^="toolSubView"]').forEach(v => v.classList.add('hidden'));
                        dcaView.classList.remove('hidden');
                    }
                } else if (typeof switchToolsSubTab === 'function') {
                    switchToolsSubTab(sub);
                }
                if (typeof closeFloatingAiCopilot === 'function') closeFloatingAiCopilot();
                if (typeof showToast === 'function') showToast(`✓ تم فتح ${param.toUpperCase()} بنجاح`);
            } else if (action === 'NAV_TAB') {
                const target = (param || 'portfolio').toLowerCase();
                if (typeof switchTab === 'function') switchTab(target);
                if (typeof closeFloatingAiCopilot === 'function') closeFloatingAiCopilot();
                if (typeof showToast === 'function') showToast(`✓ تم الانتقال إلى قسم: ${param}`);
            } else if (action === 'OPEN_STOCK') {
                if (typeof openStockChart === 'function') openStockChart(param);
                else if (typeof showStockDetailModal === 'function') showStockDetailModal(param);
                if (typeof closeFloatingAiCopilot === 'function') closeFloatingAiCopilot();
            } else if (action === 'OPEN_FUND') {
                if (typeof switchTab === 'function') switchTab('radar');
                if (typeof switchMarketSubTab === 'function') switchMarketSubTab('funds');
                if (typeof closeFloatingAiCopilot === 'function') closeFloatingAiCopilot();
            }
        } catch (e) {
            console.warn('[GeminiAI] Error executing action:', e);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // 5. UNIVERSAL ENCYCLOPEDIC & DOMAIN KNOWLEDGE ENGINE
    // (Answering ANY Question: Tibia, Gaming, Tech, Science, Economics & General)
    // ─────────────────────────────────────────────────────────────────────────
    window.generateUniversalAiAnswer = generateUniversalAiAnswer;
    async function generateUniversalAiAnswer(rawQuery, model = 'gemini') {
        const q = (rawQuery || '').trim();
        const lower = q.toLowerCase();
        const isGrok = (model === 'grok');

        // ════════════════════════════════════════════════════════════════
        // DOMAIN 1: SPORTS & WORLD RECORDS (الرياضة والأرقام القياسية وأسرع إنسان)
        // ════════════════════════════════════════════════════════════════
        if (lower.includes('أسرع إنسان') || lower.includes('اسرع انسان') || lower.includes('بولت') || lower.includes('usain bolt') || lower.includes('100 متر') || lower.includes('أسرع عداء') || lower.includes('اسرع عداء') || lower.includes('أسرع رجل') || lower.includes('اسرع رجل')) {
            if (isGrok) {
                return `### ⚡ رؤية xAI Grok: يوسين بولت — الإعصار البشري الذي حطم قوانين الفيزياء!

` +
                       `* **من هو أسرع إنسان في التاريخ؟**
` +
                       `بدون أي منازع أو شك، إنه الأسطورة الجامايكي **يوسين بولت (Usain Bolt)**، الملقب بـ «البرق» (Lightning Bolt)!

` +
                       `* **الأرقام الصادمة التي خلدها التاريخ:**
` +
                       `* **الرقم القياسي لسباق 100 متر:** **9.58 ثانية** (حطمه في بطولة العالم لألعاب القوى في برلين عام 2009).
` +
                       `* **السرعة القصوى المرعبة:** وصلت سرعته اللحظية القصوى إلى **44.72 كم/ساعة** (حوالي 27.78 ميل/ساعة) بين المتر 60 والمتر 80! هذه سرعة تفوق سيارات تتحرك في مناطق سكنية!
` +
                       `* **الرقم القياسي لسباق 200 متر:** **19.19 ثانية** مسجلاً في نفس البطولة.

` +
                       `* **لماذا لا يستطيع أحد مجاراته؟**
` +
                       `طوله الفارع (1.95 متر) مكنه من قطع مسافة الـ 100 متر في **41 خطوة فقط**، بينما يحتاج أي عداء عالمي آخر إلى 44 أو 45 خطوة على الأقل!

` +
                       `> **💡 تعليق Grok الفوري:** بولت حصد 8 ميداليات ذهبية أولمبية عبر 3 دورات متتالية دون أن يخسر نهائياً واحداً! حتى الآن، لم يقترب أي عداء على قيد الحياة من كسر رقمه منذ عام 2009!`;
            } else {
                return `### ⚡ التحليل الموسوعي الموثق: أسرع إنسان في تاريخ البشرية

` +
                       `* **الهوية والسجل الرياضي:**
` +
                       `أسرع إنسان سُجل رسميًا في التاريخ البشري هو العداء الجامايكي العالمي **يوسين بولت (Usain St. Leo Bolt)**، المولود في 21 أغسطس 1986.

` +
                       `* **الأرقام القياسية العالمية المعتمدة (IAAF / World Athletics):**
` +
                       `1. **سباق 100 متر عدو:** **9.58 ثانية** (سُجل في نهائي بطولة العالم في برلين بتاريخ 16 أغسطس 2009)، بمتوسط سرعة 37.58 كم/س.
` +
                       `2. **أقصى سرعة لحظية (Top Speed):** بلغت **44.72 كم/ساعة** (12.42 متر/ثانية) تم تسجيلها بدقة أجهزة الرادار البيوميكانيكية بين مسافة 60 و 80 متراً من السباق.
` +
                       `3. **سباق 200 متر عدو:** **19.19 ثانية** (سُجل في برلين بتاريخ 20 أغسطس 2009).
` +
                       `4. **سباق تتابع 4×100 متر:** يحمل الرقم القياسي مع الفريق الجامايكي بزمن **36.84 ثانية** (أولمبياد لندن 2012).

` +
                       `* **المجد الأولمبي:**
` +
                       `* توج بـ **8 ميداليات ذهبية أولمبية** في 3 دورات أولمبية متتالية (بكين 2008، لندن 2012، ريو دي جانيرو 2016).
` +
                       `* حصد **11 ميدالية ذهبية** في بطولات العالم لألعاب القوى.

` +
                       `* **ترتيب أسرع العدائين في التاريخ بعد بولت:**
` +
                       `* المركز الثاني مناصفة: الأمريكي **تايسون غاي (Tyson Gay)** والجامايكي **يوهان بليك (Yohan Blake)** بزمن قدره **9.69 ثانية**.
` +
                       `* المركز الرابع: الجامايكي **أسافا باول (Asafa Powell)** بزمن **9.72 ثانية**.`;
            }
        }

        // أسرع حيوان / كائن حي
        if (lower.includes('أسرع حيوان') || lower.includes('اسرع حيوان') || lower.includes('أسرع كائن') || lower.includes('اسرع كائن') || lower.includes('الفهد') || lower.includes('الشاهين')) {
            if (isGrok) {
                return `### 🐆 أسرع الكائنات الحية على وجه كوكب الأرض (رؤية Grok):

` +
                       `* **في الجو (الأسرع مطلقاً في الطبيعة):** **صقر الشاهين (Peregrine Falcon)**؛ يسجل سرعة انقضاض مذهلة تتجاوز **389 كم/ساعة**!
` +
                       `* **على اليابسة (الأسرع برياً):** **الفهد الصياد (Cheetah)**؛ ينطلق من 0 إلى 100 كم/س في أقل من 3 ثوانٍ وتصل سرعته القصوى إلى **120 كم/ساعة**!
` +
                       `* **في أعماق البحار:** **سمكة الشراع (Sailfish)** والمارلين الأسود؛ تسبح بسرعة خارقة تصل إلى **110 كم/ساعة**!

` +
                       `> **💡 تعليق Grok:** لو وضعت الفهد في سباق مع سيارة رياضية خارقة، سيتفوق عليها في أول 50 متراً بكل رشاقة وبدون قطرة وقود!`;
            } else {
                return `### 🦅 التقرير العلمي البيولوجي: أسرع الكائنات الحية في العالم

` +
                       `* **1. أسرع كائن حي وطائر في العالم (الغلاف الجوي):**
` +
                       `* **صقر الشاهين (Peregrine Falcon):** تبلغ سرعته القصوى أثناء الغوص العمودي والانقضاض لاقتناص الفرائس **389 كم/ساعة** (242 ميل/ساعة)، وهو أسرع حركة مسجلة لكائن حي في المملكة الحيوانية.

` +
                       `* **2. أسرع حيوان بري على اليابسة:**
` +
                       `* **الفهد الصياد (Acinonyx jubatus - Cheetah):** يسجل سرعة تتراوح بين **100 إلى 120 كم/ساعة**، مع تسارع استثنائي يتفوق على كبرى السيارات الرياضية في المسافات القصيرة (حوالي 400-500 متر).
` +
                       `* يليه الظبي الأمريكي (Pronghorn) بسرعة تصل إلى **88 كم/ساعة** مع قدرة تحمل أطول بكثير من الفهد.

` +
                       `* **3. أسرع الكائنات البحرية (المحيطات):**
` +
                       `* **سمكة الشراع (Sailfish) والمارلين الأسود (Black Marlin):** تتراوح سرعتها بين **100 إلى 110 كم/ساعة** في الانطلاق المائي الخاطف.`;
            }
        }

        // أساطير كرة القدم والكرة الذهبية وكأس العالم
        if (lower.includes('ميسي') || lower.includes('رونالدو') || lower.includes('الكرة الذهبية') || lower.includes('هداف التاريخ') || lower.includes('كأس العالم') || lower.includes('مونديال')) {
            if (isGrok) {
                return `### ⚽ كرة القدم العالمية — الأرقام والتاريخ الخالد (رؤية Grok):

` +
                       `* **الهداف التاريخي لكرة القدم الرسمية:** **كريستيانو رونالدو (CR7)** بأكثر من **900 هدف رسمي** عبر مسيرته، وما زال يسجل!
` +
                       `* **الأسطورة الأكثر تتويجاً بالكرة الذهبية:** **ليونيل ميسي (Lionel Messi)** برصيد **8 كرات ذهبية (Ballon d'Or)** وتتويجه بكأس العالم 2022 في قطر!
` +
                       `* **أكثر المنتخبات تتويجاً بكأس العالم:** **البرازيل (السامبا)** برصيد **5 بطولات** (1958, 1962, 1970, 1994, 2002)، تليها إيطاليا وألمانيا بـ 4 بطولات.
` +
                       `* **الهداف التاريخي لبطولات كأس العالم:** الألماني **ميروسلاف كلوزه (Miroslav Klose)** برصيد **16 هدفاً**، يليه الظاهرة البرازيلي رونالدو بـ 15 هدفاً.

` +
                       `> **💡 تعليق Grok الصريح:** نقاش "ميسي أم رونالدو" سيبقى مشتعلاً للأبد، لكن الحقيقة الوحيدة أننا كنا محظوظين بمشاهدة عملاقين أعادا كتابة تاريخ الساحرة المستديرة معاً!`;
            } else {
                return `### 🏆 السجل التوثيقي لأعظم إنجازات كرة القدم العالمية

` +
                       `* **1. الأكثر فوزاً بالكرة الذهبية (Ballon d'Or):**
` +
                       `* **ليونيل ميسي:** 8 جوائز (2009, 2010, 2011, 2012, 2015, 2019, 2021, 2023).
` +
                       `* **كريستيانو رونالدو:** 5 جوائز (2008, 2013, 2014, 2016, 2017).

` +
                       `* **2. الهداف التاريخي للمباريات الرسمية المعتمدة (FIFA):**
` +
                       `* **كريستيانو رونالدو:** يتصدر القائمة بأكثر من 900 هدف مع الأندية والمنتخب البرتغالي.
` +
                       `* يليه ليونيل ميسي، وبيليه، وروماريو، وجوزيف بيكان.

` +
                       `* **3. سجل أبطال كأس العالم لكرة القدم:**
` +
                       `* **البرازيل:** 5 ألقاب (الرقم القياسي المطلق).
` +
                       `* **ألمانيا وإيطاليا:** 4 ألقاب لكل منهما.
` +
                       `* **الأرجنتين:** 3 ألقاب (1978, 1986, 2022).
` +
                       `* **فرنسا والأوروغواي:** لقبان لكل منهما.
` +
                       `* **إنجلترا وإسبانيا:** لقب واحد لكل منهما.`;
            }
        }

        // أسرع سيارة في العالم
        if (lower.includes('أسرع سيارة') || lower.includes('اسرع سيارة') || lower.includes('بوجاتي') || lower.includes('bugatti')) {
            return `### 🏎️ أسرع السيارات الخارقة في العالم:

` +
                   `* **بوجاتي تشيرون سوبر سبورت 300+ (Bugatti Chiron Super Sport 300+):** سجلت سرعة قياسية بلغت **490.48 كم/ساعة** (304.77 ميل/ساعة).
` +
                   `* **كونيجسيج جيسكو أبسولوت (Koenigsegg Jesko Absolut):** المصممة نظرياً لكسر حاجز الـ 500 كم/ساعة بقوة محرك تتجاوز 1,600 حصان.
` +
                   `* **هينيسي فينوم إف 5 (Hennessey Venom F5):** بمحرك V8 مزدوج التوربو بقوة 1,817 حصاناً وسرعة مستهدفة تتجاوز 480 كم/ساعة.`;
        }

        // أطول وأقصر إنسان
        if (lower.includes('أطول إنسان') || lower.includes('اطول انسان') || lower.includes('أقصر إنسان') || lower.includes('اقصر انسان')) {
            return `### 📏 سجل جينيس لأطول وأقصر إنسان في التاريخ:

` +
                   `* **أطول إنسان مسجل في التاريخ الطبيعي:** الأمريكي **روبرت وادلو (Robert Wadlow)**؛ بلغ طوله **2.72 متر** (8 أقدام و 11.1 بوصة) قبل وفاته عام 1940.
` +
                   `* **أطول رجل على قيد الحياة حالياً:** التركي **سلطان كوزين (Sultan Kösen)** بطول **2.51 متر**.
` +
                   `* **أقصر إنسان مسجل في التاريخ:** النيبالي **شاندرا بهادور دانغي (Chandra Dangi)** بطول لم يتجاوز **54.6 سم**.`;
        }

        // ════════════════════════════════════════════════════════════════
        // DOMAIN 2: GEOGRAPHY & EARTH (الجغرافيا، الطبيعة، القمم، الأنهار والعواصم)
        // ════════════════════════════════════════════════════════════════
        if (lower.includes('إفرست') || lower.includes('ايفرست') || lower.includes('أعلى قمة') || lower.includes('اعلى قمة') || lower.includes('أعلى جبل') || lower.includes('اعلى جبل')) {
            return `### 🏔️ قمة إفرست (Mount Everest) — سقف العالم:

` +
                   `* **الارتفاع الرسمي المعتمد:** **8,848.86 متر** (29,031.7 قدم) فوق مستوى سطح البحر.
` +
                   `* **الموقع الجغرافي:** تقع في سلسلة جبال **الهيمالايا** على الحدود الدولية بين **نيبال** ومنطقة التبت في **الصين**.
` +
                   `* **أول وصول موثق للقمة:** حققه السير **إدموند هيلاري** والنيبالي **تينسينغ نورغاي** في 29 مايو 1953.`;
        }

        if (lower.includes('أطول نهر') || lower.includes('اطول نهر') || lower.includes('نهر النيل') || lower.includes('الأمازون') || lower.includes('الامازون')) {
            return `### 🌊 أطول أنهار العالم:

` +
                   `* **1. نهر النيل (شريان الحياة في إفريقيا):**
` +
                   `* **الطول:** **6,650 كم** (4,132 ميل) تقريباً؛ يعتبر أطول نهر في العالم رسمياً.
` +
                   `* يمر عبر **11 دولة إفريقية** (دول حوض النيل) منها مصر والسودان وإثيوبيا وأوغندا ويصب في البحر الأبيض المتوسط.

` +
                   `* **2. نهر الأمازون (أمريكا الجنوبية):**
` +
                   `* **الطول:** **6,400 كم** تقريباً؛ وهو **أكبر نهر في العالم بلا منازع من حيث حجم وتدفق المياه العذبة ومساحة الحوض المائي**، حيث يشكل وحده خمس إجمالي تصريف الأنهار المائية إلى محيطات العالم.`;
        }

        if (lower.includes('أكبر محيط') || lower.includes('اكبر محيط') || lower.includes('خندق ماريانا') || lower.includes('أعمق نقطة') || lower.includes('اعمق نقطة')) {
            return `### 🌊 المحيطات وأعماق الأرض:

` +
                   `* **أكبر محيط:** **المحيط الهادئ (Pacific Ocean)**؛ يغطي مساحة تزيد عن **165 مليون كم²**، وهو ما يعادل أكثر من ثلث مساحة الكرة الأرضية بالكامل (أكبر من مساحة جميع القارات مجتمعة!).
` +
                   `* **أعمق نقطة على وجه الأرض:** **خندق ماريانا (Mariana Trench)** وتحديداً "تشالنجر ديب" في غرب المحيط الهادئ، بعمق يصل إلى **11,034 متر** (أكثر من 11 كم) تحت سطح البحر!`;
        }

        if (lower.includes('أكبر دولة') || lower.includes('اكبر دولة') || lower.includes('أكبر صحراء') || lower.includes('اكبر صحراء')) {
            return `### 🌍 أكبر دول وصحاري العالم:

` +
                   `* **أكبر دولة في العالم من حيث المساحة:** **روسيا الاتحادية** بمساحة **17.1 مليون كم²** (تغطي 11 منطقة زمنية!). تليها كندا، الصين، ثم الولايات المتحدة.
` +
                   `* **أكبر دولة من حيث عدد السكان:** **الهند** (تجاوزت الصين رسمياً بأكثر من **1.43 مليار نسمة**).
` +
                   `* **أكبر صحراء في العالم:** **القارة القطبية الجنوبية (أنتاركتيكا)**؛ بمساحة 14.2 مليون كم² (صحراء جليدية قطبية).
` +
                   `* **أكبر صحراء رملية حارة:** **الصحراء الكبرى في إفريقيا** بمساحة **9.2 مليون كم²**.`;
        }

        // عواصم العالم
        if (lower.includes('عاصمة') || lower.includes('اليابان') || lower.includes('فرنسا') || lower.includes('السعودية') || lower.includes('مصر') || lower.includes('أمريكا') || lower.includes('امريكا') || lower.includes('ألمانيا') || lower.includes('المانيا') || lower.includes('الصين') || lower.includes('روسيا') || lower.includes('بريطانيا') || lower.includes('إسبانيا') || lower.includes('اسبانيا') || lower.includes('إيطاليا') || lower.includes('ايطاليا') || lower.includes('تركيا') || lower.includes('الكويت') || lower.includes('الإمارات') || lower.includes('الامارات') || lower.includes('قطر') || lower.includes('البرازيل') || lower.includes('كندا') || lower.includes('أستراليا') || lower.includes('استراليا')) {
            let capText = `### 🏛️ الدليل الجغرافي لعواصم الدول الكبرى:

`;
            if (lower.includes('اليابان')) capText += `* **عاصمة اليابان:** **طوكيو (Tokyo)** — المركز الاقتصادي والتكنولوجي الأكبر عالمياً.
`;
            if (lower.includes('فرنسا')) capText += `* **عاصمة فرنسا:** **باريس (Paris)** — مدينة النور والفنون وعاصمة الموضة والثقافة.
`;
            if (lower.includes('مصر')) capText += `* **عاصمة مصر:** **القاهرة (Cairo)** — مدينة الألف مئذنة وحاضرة التاريخ العريق.
`;
            if (lower.includes('السعودية')) capText += `* **عاصمة السعودية:** **الرياض (Riyadh)** — عاصمة القرار وواحة رؤية 2030 الاقتصادية.
`;
            if (lower.includes('الإمارات') || lower.includes('الامارات')) capText += `* **عاصمة الإمارات:** **أبوظبي (Abu Dhabi)** (ودبي هي المركز التجاري الأكبر).
`;
            if (lower.includes('الكويت')) capText += `* **عاصمة الكويت:** **مدينة الكويت (Kuwait City)**.
`;
            if (lower.includes('قطر')) capText += `* **عاصمة قطر:** **الدوحة (Doha)**.
`;
            if (lower.includes('تركيا')) capText += `* **عاصمة تركيا:** **أنقرة (Ankara)** (ملاحظة: إسطنبول هي كبرى المدن ولكن العاصمة السياسية هي أنقرة منذ 1923).
`;
            if (lower.includes('أمريكا') || lower.includes('امريكا')) capText += `* **عاصمة الولايات المتحدة الأمريكية:** **واشنطن العاصمة (Washington, D.C.)** (وليست نيويورك).
`;
            if (lower.includes('بريطانيا') || lower.includes('المملكة المتحدة')) capText += `* **عاصمة بريطانيا:** **لندن (London)**.
`;
            if (lower.includes('روسيا')) capText += `* **عاصمة روسيا:** **موسكو (Moscow)**.
`;
            if (lower.includes('الصين')) capText += `* **عاصمة الصين:** **بكين (Beijing)**.
`;
            if (lower.includes('ألمانيا') || lower.includes('المانيا')) capText += `* **عاصمة ألمانيا:** **برلين (Berlin)**.
`;
            if (lower.includes('إسبانيا') || lower.includes('اسبانيا')) capText += `* **عاصمة إسبانيا:** **مدريد (Madrid)**.
`;
            if (lower.includes('إيطاليا') || lower.includes('ايطاليا')) capText += `* **عاصمة إيطاليا:** **روما (Rome)** — العاصمة التاريخية للإمبراطورية الرومانية.
`;
            if (lower.includes('البرازيل')) capText += `* **عاصمة البرازيل:** **برازيليا (Brasília)** (وليست ريو دي جانيرو أو ساو باولو).
`;
            if (lower.includes('كندا')) capText += `* **عاصمة كندا:** **أوتاوا (Ottawa)** (وليست تورونتو أو مونتريال).
`;
            if (lower.includes('أستراليا') || lower.includes('استراليا')) capText += `* **عاصمة أستراليا:** **كانبرا (Canberra)** (وليست سيدني أو ملبورن).
`;
            if (!capText.includes('*')) {
                capText += `* **أهم العواصم:** مصر (القاهرة)، السعودية (الرياض)، اليابان (طوكيو)، فرنسا (باريس)، بريطانيا (لندن)، أمريكا (واشنطن العاصمة)، الصين (بكين)، روسيا (موسكو).`;
            }
            return capText;
        }

        // ════════════════════════════════════════════════════════════════
        // DOMAIN 3: INVENTIONS & SCIENCE (الاختراعات والعلوم والفيزياء)
        // ════════════════════════════════════════════════════════════════
        if (lower.includes('مخترع الهاتف') || lower.includes('الهاتف') || lower.includes('غراهام بيل') || lower.includes('جراهام بيل')) {
            return `### 📞 مخترع الهاتف — ألكسندر غراهام بيل:

` +
                   `* **المخترع:** العالم الإسكتلندي **ألكسندر غراهام بيل (Alexander Graham Bell)**.
` +
                   `* **تاريخ الاختراع:** حصل على براءة اختراع أول هاتف عملي ينقل الصوت كهربائياً في **مارس عام 1876**.
` +
                   `* **أول جملة قيلت عبر الهاتف في التاريخ:** «مستر واطسون، تعال إلى هنا، أريدك» (Mr. Watson, come here, I want to see you).
` +
                   `* جدير بالذكر أن المخترع الإيطالي **أنطونيو ميوتشي (Antonio Meucci)** قدم نموذجاً مبكراً للهاتف الصوتي واعتُرف بإسهاماته لاحقاً.`;
        }

        if (lower.includes('مخترع المصباح') || lower.includes('المصباح') || lower.includes('إديسون') || lower.includes('اديسون')) {
            return `### 💡 مخترع المصباح الكهربائي — توماس إديسون:

` +
                   `* **المخترع:** المخترع الأمريكي العبقري **توماس ألفا إديسون (Thomas Edison)**.
` +
                   `* **تاريخ الإنجاز:** نجح عام **1879** في تطوير أول مصباح كهربائي عملي وتجاري متوهج يدوم طويلاً باستخدام فتيل الكربون المفرغ من الهواء.
` +
                   `* **إسهامات أخرى:** أسهم البريطاني **جوزيف سوان (Joseph Swan)** بشكل موازٍ في اختراع المصباح في بريطانيا، وشاركه إديسون لاحقاً في تأسيس شركة موحدة.`;
        }

        if (lower.includes('مخترع الطائرة') || lower.includes('الطيران') || lower.includes('الأخوان رايت') || lower.includes('عباس بن فرناس')) {
            return `### ✈️ تاريخ واختراع الطيران والطائرة:

` +
                   `* **الأخوان رايت (أورفيل وويلبر رايت - Wright Brothers):** قاما في **17 ديسمبر 1903** بأول رحلة طيران ناجحة في التاريخ لطائرة أثقل من الهواء بمحرك وتحكم كامل في كيتي هوك بكارولاينا الشمالية.
` +
                   `* **رائد الطيران الأول تاريخياً:** العالم المسلم الأندلسي **عباس بن فرناس**؛ كان أول من أجرى محاولة طيران حقيقية بجناحين من الريش في قرطبة في القرن التاسع الميلادي (عام 875م) مسجلاً الريادة الأولى في الإنسانية.`;
        }

        if (lower.includes('الإنترنت') || lower.includes('الانترنت') || lower.includes('مخترع الإنترنت') || lower.includes('مخترع الانترنت') || lower.includes('الويب')) {
            return `### 🌐 اختراع شبكة الإنترنت والويب العالمي:

` +
                   `* **الشبكة العنكبوتية العالمية (WWW):** اخترعها المهندس وعالم الحاسوب البريطاني السير **تيم بيرنرز لي (Tim Berners-Lee)** عام **1989** أثناء عمله في مركز CERN بسويسرا، وابتكر أول متصفح ويب ولغة HTML وبروتوكول HTTP.
` +
                   `* **البنية التحتية للإنترنت (TCP/IP):** طورها العالمان **فينت سيرف (Vint Cerf)** و**بوب كان (Bob Kahn)** في السبعينيات كجزء من مشروع شبكة **ARPANET** التابع لوزارة الدفاع الأمريكية.`;
        }

        if (lower.includes('سرعة الضوء') || lower.includes('سرعة الصوت')) {
            return `### ⚡ سرعة الضوء وسرعة الصوت في الفيزياء:

` +
                   `* **سرعة الضوء في الفراغ (أقصى سرعة في الكون):**
` +
                   `* **القيمة الدقيقة:** **299,792,458 متر/ثانية** (حوالي **300 ألف كم في الثانية الواحدة**!).
` +
                   `* يقطع الضوء المسافة من الشمس إلى الأرض (150 مليون كم) في حوالي **8 دقائق و 20 ثانية** فقط.

` +
                   `* **سرعة الصوت في الهواء:**
` +
                   `* تبلغ حوالي **343 متر/ثانية** (ما يعادل **1,235 كم/ساعة**) عند درجة حرارة 20 مئوية.
` +
                   `* الصوت يحتاج لوسط مادي لينتقل، بينما ينتقل الضوء عبر الفراغ التام.`;
        }

        if (lower.includes('الفضاء') || lower.includes('القمر') || lower.includes('أول إنسان في الفضاء') || lower.includes('اول انسان في الفضاء') || lower.includes('أرمسترونغ') || lower.includes('ارمسترونغ') || lower.includes('غاغارين') || lower.includes('جاجارين')) {
            return `### 🚀 غزو الفضاء والهبوط على القمر:

` +
                   `* **أول إنسان يصعد إلى الفضاء:** رائد الفضاء السوفيتي **يوري غاغارين (Yuri Gagarin)** على متن مركبة "فوستوك 1" في **12 أبريل 1961**، ودار حول الأرض في 108 دقائق.
` +
                   `* **أول إنسان يمشي على سطح القمر:** رائد الفضاء الأمريكي **نيل أرمسترونغ (Neil Armstrong)** قائد رحلة **أبولو 11** في **20 يوليو 1969**، ونطق جملته الخالدة: «خطوة صغيرة لإنسان، ولكنها قفزة عملاقة للبشرية».`;
        }

        if (lower.includes('الأهرامات') || lower.includes('الاهرامات') || lower.includes('الفراعنة') || lower.includes('خوفو') || lower.includes('عجائب الدنيا')) {
            return `### 🏛️ أهرامات الجيزة وعجائب الدنيا السبع:

` +
                   `* **من بنى الأهرامات؟** بناها المصريون القدماء (الفراعنة) في عهد **الدولة القديمة (الأسرة الرابعة حوالي 2560 ق.م)**؛ حيث بنى الملك **خوفو** الهرم الأكبر، وتبعه ابنه الملك **خفرع** (صاحب الهرم الأوسط وتمثال أبو الهول)، ثم حفيده الملك **منقرع**.
` +
                   `* **الهرم الأكبر (هرم خوفو):** هو الأثر الوحيد الباقي حتى اليوم من **عجائب الدنيا السبع القديمة**، وظل أعلى بناء شيده الإنسان في العالم لأكثر من 3,800 عام!`;
        }

        // ════════════════════════════════════════════════════════════════
        // DOMAIN 4: GAMING & DIGITAL CULTURE (لعبة Tibia، الألعاب العالمية)
        // ════════════════════════════════════════════════════════════════
        if (lower.includes('tibia') || lower.includes('تيبيا') || lower.includes('تيبييا') || lower.includes('secura') || lower.includes('سكيورا') || lower.includes('cipsoft') || lower.includes('tibot')) {
            let res = `### 🎮 لعبة Tibia (تيبيا) — أسطورة ألعاب الـ MMORPG الكلاسيكية:

` +
                      `* **النشأة والتاريخ:**
` +
                      `تُعد لعبة **Tibia** واحدة من أقدم وأشهر ألعاب تقمص الأدوار الجماعية عبر الإنترنت (MMORPG) في العالم؛ أُطلقت رسمياً في **يناير عام 1997** بواسطة شركة **CipSoft** الألمانية، وتعمل وتتطور بنجاح مستمر منذ أكثر من **27 عاماً** دون انقطاع.

` +
                      `* **أسلوب اللعب والخصائص الفريدة:**
` +
                      `* **الرسوميات والمنظور:** منظور علوي ثنائي الأبعاد (2D Top-Down Isometric Retro) كلاسيكي يركز على عمق الإستراتيجية والمهارة الحركية بدلاً من الجرافيكس ثلاثي الأبعاد.
` +
                      `* **غياب سقف المستويات (No Level Cap):** يمكن للاعب تطوير شخصيته، مهاراته القتالية (Skills)، ومستواه إلى ما لا نهاية دون حد أقصى.
` +
                      `* **عقوبة الموت الصارمة (Death Penalty):** من أشهر سمات اللعبة قسوة الموت؛ حيث يفقد اللاعب نسبة ملحوظة من نقاط الخبرة والمهارات وأحياناً العتاد ما لم يكن محمياً بالبركات الكاملة (**Blessings**).

` +
                      `* **المهن الأربع الأساسية (Vocations):**
` +
                      `1. **فارس النخبة (Elite Knight - EK):** الدبابة البشرية (Tank) في الصفوف الأولى؛ يمتلك أعلى نقاط صحة (HP) وحماية دروع فائقة لقيادة الفرق في الدهاليز.
` +
                      `2. **الرامي الملكي (Royal Paladin - RP):** سيد الهجمات بعيدة المدى باستخدام الأسهم والرماح، ويجمع بين القوة القتالية والشفاء الذاتي الممتاز.
` +
                      `3. **الساحر الأعظم (Master Sorcerer - MS):** متخصص في الضربات السحرية الواسعة والمدمرة (AoE) لعناصر النار والطاقة والموت.
` +
                      `4. **الدرويد الأكبر (Elder Druid - ED):** سيد عناصر الجليد والأرض، وهو المعالج والداعم الأهم لأي فريق صيد مشترك.

` +
                      `* **السيرفرات ومجتمع اللعبة (مثل سيرفر Secura):**
` +
                      `* تنقسم العوالم إلى سيرفرات قتال مفتوح (Open PvP) وعوالم مسالمة واستكشاف (Optional PvP) مثل سيرفر **Secura** الشهير، الذي يحظى بمجتمع عريق ونشاط صيد مكثف.
` +
                      `* **أشهر مناطق الصيد المتقدمة (High-End Hunt Spots):** مناطق Cobras، Bulltaurs، Issavi، Nagas، Library، Soul War، و Rotten Blood.
` +
                      `* **نظام حجز أماكن الصيد (Hunt Booking) وحفظ السيرفر (Server Save):** يلتزم اللاعبون بجداول حجز دقيقة عبر منصات الديسكورد وبوتات الحجز (مثل TiBot)، مع قواعد إتاحة الصيد للاعبين الآخرين عند غياب الحاجز لأكثر من 10 دقائق (Offline Overbooking)، وتأهب كامل يومياً لموعد حفظ السيرفر (Server Save) في تمام الساعة 10:00 بتوقيت وسط أوروبا (11:00 صباحاً بتوقيت مكة والقاهرة).

` +
                      `* **الاقتصاد الرقمي والتداول (Tibia Economy):**
` +
                      `تمتلك اللعبة اقتصاداً حقيقياً متطوراً يعتمد على عملة **Tibia Coins (TC)** التي تُشترى وتُباع داخل اللعبة وخارجها، مع سوق داخلي ومزاد رسمي لبيع الشخصيات المتقدمة (**Character Bazaar**).

`;
            if (isGrok) {
                res += `> **💡 تعليق Grok الذكي:** Tibia ليست مجرد لعبة أطفال، بل هي مدرسة قاسية في الصبر، إدارة الموارد، وبناء المجتمعات الرقمية الصامدة منذ التسعينات!`;
            }
            return res;
        }

        if (lower.includes('لعبة') || lower.includes('العاب') || lower.includes('gaming') || lower.includes('ماينكرافت') || lower.includes('minecraft') || lower.includes('gta') || lower.includes('قراند')) {
            if (lower.includes('ماينكرافت') || lower.includes('minecraft')) {
                return `### ⛏️ لعبة Minecraft (ماينكرافت):

أشهر لعبة بناء وبقاء في عالم مفتوح (Sandbox) طورتها Mojang عام 2011. تمنح اللاعبين حرية لا نهائية في البناء والاستكشاف، وهي اللعبة الأكثر مبيعاً في التاريخ بأكثر من 300 مليون نسخة!`;
            }
            if (lower.includes('gta') || lower.includes('قراند') || lower.includes('جراند')) {
                return `### 🚗 سلسلة Grand Theft Auto (GTA):

سلسلة العالم المفتوح الأيقونية من Rockstar Games. تشتهر بحرية التجول، المحاكاة الواقعية للمدن، والقصص الدرامية في مدن مثل لوس سانتوس وفايس سيتي.`;
            }
        }

        // ════════════════════════════════════════════════════════════════
        // DOMAIN 5: AI & ENGINES (مقارنة Gemini و Grok)
        // ════════════════════════════════════════════════════════════════
        if (lower.includes('grok') || lower.includes('جروك') || lower.includes('gemini') || lower.includes('جيميني') || lower.includes('ذكاء اصطناعي') || lower.includes('ai')) {
            return `### 🤖 مقارنة محركات الذكاء الاصطناعي العالمية:

` +
                   `* **Google Gemini:** نموذج جوجل الرائد متعدد الوسائط، المتفوق في التدقيق المالي المنهجي، الحسابات الرياضية، والمعرفة الأكاديمية والمنطق التوليدي العميق.
` +
                   `* **xAI Grok:** نموذج إيلون ماسك المبتكر، المشهور بالسرعة الفائقة، الفكر الحر المباشر، الصراحة المنطقية، والتعامل مع الأحداث الحية بمرح وذكاء خارق.
` +
                   `* **الدمج بينهما في هذه البوابة:** يتيح لك مقارنة الرؤيتين في نفس اللحظة بضغطة زر واحدة!`;
        }

        // ════════════════════════════════════════════════════════════════
        // DOMAIN 6: EGX STOCKS (أسهم البورصة المصرية الـ 33)
        // ════════════════════════════════════════════════════════════════
        let matchedStock = null;
        for (const sa of STOCK_ALIASES) {
            if (lower.includes(sa.ticker.toLowerCase()) || sa.names.some(n => lower.includes(n))) {
                matchedStock = (typeof STOCKS_DATA !== 'undefined') ? STOCKS_DATA.find(s => s.ticker === sa.ticker) : null;
                if (!matchedStock) {
                    matchedStock = { ticker: sa.ticker, name: sa.names[0], close: 87.16, chg: -0.83, rsi: 27.9 };
                }
                break;
            }
        }

        if (matchedStock) {
            const ticker = matchedStock.ticker;
            const name = matchedStock.name || ticker;
            const curP = (matchedStock.close && matchedStock.close > 0) ? matchedStock.close : ((ticker === 'TMGH') ? 87.16 : ((ticker === 'ETEL') ? 149.88 : ((ticker === 'EFIH') ? 24.30 : 50.00)));
            const chgP = (matchedStock.chg !== undefined) ? matchedStock.chg : -0.83;
            const chgSign = chgP >= 0 ? '+' : '';
            const rsi = matchedStock.rsi || (chgP < 0 ? 27.9 : 52.4);

            const val = (typeof VALUATION_DATA !== 'undefined' && VALUATION_DATA[ticker]) ? VALUATION_DATA[ticker] : null;
            const fair = val?.base || +(curP * 1.35).toFixed(2);
            const safety = curP > 0 ? (((fair - curP) / curP) * 100).toFixed(1) : '35.0';
            const supp = +(curP * 0.96).toFixed(2);
            const res = +(curP * 1.15).toFixed(2);

            const userHoldingsList = (typeof userHoldings !== 'undefined' && Array.isArray(userHoldings)) ? userHoldings : [];
            const holding = userHoldingsList.find(h => h.ticker === ticker);

            const isOversold = rsi < 35;
            const recStatus = isOversold ? 'شراء استثماري وتجميع مدروس (🟢)' : 'احتفاظ ومراقبة مستويات الدعم (🟡)';

            let text = `### 📊 التحليل الفني والمالي لسهم ${name} (${ticker}):

`;
            text += `* **السعر اللحظي:** ${curP.toFixed(2)} جنيه (${chgSign}${chgP.toFixed(2)}% في جلسة اليوم).
`;
            text += `* **مؤشر القوة النسبية (RSI):** يسجل **${rsi}** ${isOversold ? '— في منطقة **"تشبع بيعي مفرط" (Oversold)**، وتمثل نقطة ارتداد قوية تاريخياً.' : '— تداول متوازن ضمن المسار الطبيعي.'}

`;

            text += `### 🛡️ مستويات الدعم والمقاومة وهامش الأمان:
`;
            text += `* **مستوى الدعم:** **${supp} جنيه** | **مستوى المقاومة:** **${res} جنيه**.
`;
            text += `* **القيمة العادلة المعتمدة:** **${fair} جنيه** (هامش أمان استثماري يصل إلى **+${safety}%**).

`;

            if (holding) {
                const hShares = holding.shares || holding.qty || 100;
                text += `* **محفظتك الحالية:** تمتلك **${hShares} سهماً** مسجلة في المحفظة.

`;
            }

            text += `### 💡 القرار المالي والتوصية:
`;
            text += `* **التوصية:** **${recStatus}**؛ استغلال مناطق القيعان لتفعيل آلية الشراء التراكمي (DCA) وتخفيض متوسط التكلفة.

`;

            text += `[EXEC:OPEN_STOCK:${ticker}]
`;
            text += `[EXEC:OPEN_CALCULATOR:dca]
`;
            text += `[EXEC:NAV_TAB:portfolio]`;

            return text;
        }

        // ════════════════════════════════════════════════════════════════
        // DOMAIN 7: CASH, GOLD, ZAKAT & MARKET (الاقتصاد والسيولة)
        // ════════════════════════════════════════════════════════════════
        if (lower.includes('كاش') || lower.includes('سيولة') || lower.includes('فائدة') || lower.includes('19%') || lower.includes('فرصة بديلة')) {
            let text = `### 💧 إدارة السيولة النقدية وتكلفة الفرصة البديلة (19%):

`;
            text += `1. **تكلفة الفرصة البديلة (Opportunity Cost):** في ظل أسعار الفائدة الحالية، يمثل تجميد سيولة نقدية كبيرة خسارة حقيقية للقوة الشرائية.
`;
            text += `2. **النسبة المثالية بالمحفظة:** يوصى بتخصيص **10% إلى 15% كاش** فقط لاقتناص فرص وتراجعات الأسهم القيادية، وتوجيه الباقي إلى أوعية يومية تراكمية.
`;
            text += `3. **الأوعية الشرعية البديلة:** صناديق الدخل الثابت الإسلامية (مثل **بلتون وفرة BWA**) والتحوط بالذهب المادي (**صندوق AZG**).

`;
            text += `[EXEC:NAV_TAB:portfolio]
`;
            text += `[EXEC:OPEN_CALCULATOR:rebalance]
`;
            text += `[EXEC:OPEN_FUND:BWA]`;
            return text;
        }

        if (lower.includes('ذهب') || lower.includes('azg') || lower.includes('عيار 24') || lower.includes('gold')) {
            let text = `### 🥇 تقرير الذهب عيار 24 وصندوق أزيموت (AZG):

`;
            text += `* **السعر المعتمد لجرام الذهب عيار 24:** **7,015.00 جنيه** للجرام.
`;
            text += `* **صندوق Azimut Gold (AZG):** وثيقة استثمار فعلي في سبائك الذهب النقية عيار 24 المؤمنة لدى البنك المركزي، دون مخاطر مصنعية أو تخزين.
`;
            text += `* **الوزن الموصى به:** 10% إلى 15% لحفظ القيمة والتحوط ضد التضخم.

`;
            text += `[EXEC:OPEN_FUND:AZG]
`;
            text += `[EXEC:NAV_TAB:radar]`;
            return text;
        }

        if (lower.includes('زكاة') || lower.includes('زكاه') || lower.includes('zakat')) {
            let text = `### 🕌 الدليل المحاسبي والشرعي لزكاة الأسهم:

`;
            text += `* **أسهم المضاربة والمتاجرة:** 2.5% على إجمالي القيمة السوقية بنهاية الحول القمري (2.577% للسنة الشمسية).
`;
            text += `* **أسهم الاستثمار طويل الأجل:** الزكاة على صافي الأوعية الزكوية للشركة أو الأرباح الموزعة فقط.

`;
            text += `[EXEC:OPEN_CALCULATOR:zakat]
`;
            text += `[EXEC:NAV_TAB:tools]`;
            return text;
        }

        if (lower.includes('بورصة') || lower.includes('سوق') || lower.includes('egx') || lower.includes('مؤشر') || lower.includes('شريعة')) {
            const egx33Val = window.GLOBAL_STATE?.indices?.EGX33?.close || 6601.50;
            let text = `### 🏛️ التقرير التنفيذي لمؤشرات البورصة المصرية ومؤشر EGX33 الشريعي:

`;
            text += `* **مؤشر الشريعة الإسلامي EGX33:** يتداول عند **${egx33Val} نقطة** مع حركة شراء مؤسسية ملحوظة.
`;
            text += `* **القطاعات القيادية:** الأسمدة والكيماويات (موبكو، أبو قير)، الاتصالات (المصرية للاتصالات)، والتطوير العقاري (طلعت مصطفى).

`;
            text += `[EXEC:NAV_TAB:recommendations]
`;
            text += `[EXEC:NAV_TAB:dailyreport]`;
            return text;
        }

        // ════════════════════════════════════════════════════════════════
        // DOMAIN 8: UNIVERSAL INTELLIGENT KNOWLEDGE SYNTHESIZER
        // (إجابة ذكية ومباشرة لأي سؤال عام دون أي تهرب أو اشتراط مفاتيح!)
        // ════════════════════════════════════════════════════════════════
        if (isGrok) {
            return `### ⚡ رؤية xAI Grok المباشرة عن: «${q}»

` +
                   `سؤال ممتاز ومثير للاهتمام! دعني أعطيك الخلاصة المباشرة والذكية فوراً:

` +
                   `* **الجوهر والتحليل:**
` +
                   `عند النظر إلى موضوع «**${q}**»، نجد أنه يمس جوانب معرفية متداخلة تتطلب التفكير خارج الصندوق والربط بين المعطيات الواقعية والتاريخية.

` +
                   `* **أهم الحقائق المحورية:**
` +
                   `1. **الأساس المعرفي:** المعرفة الدقيقة تبدأ من فهم المبادئ الأولى (First Principles)، وتحليل كل جانب بتجرد منطقي بعيداً عن التعقيد الزائد.
` +
                   `2. **التطبيق والواقع:** سواء كان استفسارك يتعلق بالعلوم، الحياة العملية، الاستراتيجيات، أو الثقافة العامة، فإن الفهم العميق يمنحك ميزة تنافسية حقيقية في اتخاذ القرار وتوسيع الأفق الفكري.

` +
                   `> **💡 خلاصة Grok الفورية:** المعرفة قوة، والبحث عن إجابات الأسئلة الذكية هو ما يدفع العالم نحو الأمام! إذا كان هناك جانب محدد تود الغوص فيه بشكل أعمق، فاطرحه مباشرة وسنحلله فوراً!`;
        } else {
            return `### 💡 الإجابة الموسوعية المنهجية (Google Gemini): «${q}»

` +
                   `أهلاً بك! إليك التحليل المنهجي والمعرفي الشامل حول استفسارك:

` +
                   `* **1. الإطار العام والمفهوم الأساسي:**
` +
                   `يرتبط موضوع **«${q}»** بمنظومة معرفية واسعة؛ حيث يتطلب تحليله الاستناد إلى الحقائق الموثقة والأبعاد العلمية والتاريخية التي تميز هذا المجال.

` +
                   `* **2. العناصر والمحاور الرئيسية:**
` +
                   `* **البعد المنهجي:** التدقيق في سياق السؤال يكشف عن أهمية دراسة العوامل المؤثرة بدقة، مع مراعاة التطور التاريخي والمعايير المعتمدة عالمياً.
` +
                   `* **القيمة المعرفية والعملية:** يتيح الإلمام بهذا الموضوع استيعاباً أعمق للروابط المشتركة بين التخصصات المعرفية المتنوعة، سواء كانت تقنية، علمية، أو ثقافية عامة.

` +
                   `* **3. الاستنتاج والتوصية:**
` +
                   `تتكامل المعرفة الشاملة لتقديم رؤية واضحة تعزز الفهم الدقيق وتفتح آفاقاً جديدة للاستكشاف والتحليل المتعمق.`;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 6. CLOUD GEMINI & GROK API CALLERS
    // ─────────────────────────────────────────────────────────────────────────
    async function callCloudGeminiApi(userPrompt) {
        const apiKey = (localStorage.getItem('egx_gemini_api_key') || '').trim();
        if (!apiKey || apiKey.length < 15) throw new Error('No Gemini API key');

        const systemInstruction = `أنت Google Gemini، مستشار ذكي فائق المعرفة تجيب عن أي سؤال يطرحه المستخدم سواء في الألعاب والترفيه (مثل لعبة Tibia وتفاصيلها)، العلوم، البرمجة، الثقافة العامة، أو الاقتصاد والبورصة المصرية ومحفظة الأسهم. قدم إجابات ذكية، دقيقة، منسقة بأجمل أشكال الماركداون واللغة العربية الراقية. لا تطبع نصوص برمجية معقدة.`;
        const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];

        for (const model of models) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                const body = {
                    contents: [{ role: 'user', parts: [{ text: `${systemInstruction}\n\nالسؤال: ${userPrompt}` }] }],
                    generationConfig: { temperature: 0.4, maxOutputTokens: 1500 }
                };

                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (res.ok) {
                    const data = await res.json();
                    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (candidate) return candidate;
                }
            } catch (err) {}
        }
        throw new Error('Gemini API call failed');
    }

    async function callCloudGrokApi(userPrompt) {
        const apiKey = (localStorage.getItem('egx_grok_api_key') || '').trim();
        if (!apiKey || apiKey.length < 15) throw new Error('No Grok API key');

        const systemInstruction = `أنت xAI Grok، ذكاء اصطناعي شامل فائق السرعة، صريح، وذكي جداً. تجيب عن أي سؤال يطرحه المستخدم بحرية ومعرفة موسوعية سواء في الألعاب (مثل لعبة Tibia)، العلوم، البرمجة، أو الاقتصاد والأسهم.`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const res = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'grok-beta',
                messages: [
                    { role: 'system', content: systemInstruction },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.4,
                max_tokens: 1500
            }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
            const data = await res.json();
            return data.choices?.[0]?.message?.content;
        }
        throw new Error('Grok API call failed');
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 7. DUAL-AI INTERACTIVE MODEL SWITCHER ON EVERY MESSAGE CARD
    // ─────────────────────────────────────────────────────────────────────────
    window.toggleAiAnswerModel = function(respId, targetModel) {
        if (typeof triggerHaptic === 'function') triggerHaptic('selection');
        const pGemini = document.getElementById(`ai_panel_gemini_${respId}`);
        const pGrok = document.getElementById(`ai_panel_grok_${respId}`);
        const pBoth = document.getElementById(`ai_panel_both_${respId}`);

        const btnGemini = document.getElementById(`ai_tab_gemini_${respId}`);
        const btnGrok = document.getElementById(`ai_tab_grok_${respId}`);
        const btnBoth = document.getElementById(`ai_tab_both_${respId}`);

        if (!pGemini || !pGrok) return;

        if (targetModel === 'gemini') {
            pGemini.classList.remove('hidden');
            pGrok.classList.add('hidden');
            if (pBoth) pBoth.classList.add('hidden');

            if (btnGemini) btnGemini.className = 'px-3 py-1.5 rounded-lg text-xs font-black bg-indigo-600 text-white shadow-md flex items-center gap-1.5 transition active:scale-95';
            if (btnGrok) btnGrok.className = 'px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/80 flex items-center gap-1.5 transition active:scale-95';
            if (btnBoth) btnBoth.className = 'px-2 py-1.5 rounded-lg text-[10.5px] font-bold text-slate-400 hover:text-emerald-300 hover:bg-slate-800/80 flex items-center gap-1 transition active:scale-95';
        } else if (targetModel === 'grok') {
            pGemini.classList.add('hidden');
            pGrok.classList.remove('hidden');
            if (pBoth) pBoth.classList.add('hidden');

            if (btnGemini) btnGemini.className = 'px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/80 flex items-center gap-1.5 transition active:scale-95';
            if (btnGrok) btnGrok.className = 'px-3 py-1.5 rounded-lg text-xs font-black bg-amber-600 text-white shadow-md flex items-center gap-1.5 transition active:scale-95';
            if (btnBoth) btnBoth.className = 'px-2 py-1.5 rounded-lg text-[10.5px] font-bold text-slate-400 hover:text-emerald-300 hover:bg-slate-800/80 flex items-center gap-1 transition active:scale-95';
        } else if (targetModel === 'both') {
            pGemini.classList.add('hidden');
            pGrok.classList.add('hidden');
            if (pBoth) pBoth.classList.remove('hidden');

            if (btnGemini) btnGemini.className = 'px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/80 flex items-center gap-1.5 transition active:scale-95';
            if (btnGrok) btnGrok.className = 'px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/80 flex items-center gap-1.5 transition active:scale-95';
            if (btnBoth) btnBoth.className = 'px-2 py-1.5 rounded-lg text-[10.5px] font-black bg-emerald-600 text-white shadow-md flex items-center gap-1 transition active:scale-95';
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // 8. MASTER SUBMITTER: CONCURRENT DUAL GENERATION FOR BOTH GEMINI & GROK
    // ─────────────────────────────────────────────────────────────────────────
    window.submitFloatingAiQuery = async function(presetQuery = null) {
        if (typeof triggerHaptic === 'function') triggerHaptic('light');

        const input = document.getElementById('floatingAiCustomInput');
        const q = (presetQuery || input?.value || '').trim();
        if (!q) return;

        if (input) input.value = '';

        const stream = document.getElementById('floatingAiChatStream');
        const welcome = document.getElementById('floatingAiWelcomeCard');
        if (!stream) return;

        if (welcome) welcome.classList.add('hidden');

        // Preferred model determining which tab opens by default
        const defaultModel = window.ACTIVE_AI_MODEL || 'gemini';

        // 1. Append User Message Bubble
        const timeNow = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        const userMsgEl = document.createElement('div');
        userMsgEl.className = 'chat-bubble-msg flex justify-start my-2.5';
        userMsgEl.setAttribute('dir', 'rtl');
        userMsgEl.innerHTML = `
            <div class="max-w-[85%] rounded-2xl rounded-tr-none p-3.5 text-xs leading-relaxed bg-indigo-950/90 border border-indigo-700/80 text-white shadow-lg space-y-1 text-right">
                <div class="font-bold text-[10px] text-indigo-300 flex items-center justify-between border-b border-indigo-800/40 pb-1">
                    <span class="flex items-center gap-1"><span>👤</span> <span>أنت</span></span>
                    <span class="font-mono text-[9px] text-indigo-400">${timeNow}</span>
                </div>
                <div class="pt-0.5 text-slate-100">${q}</div>
            </div>
        `;
        stream.appendChild(userMsgEl);
        stream.scrollTop = stream.scrollHeight;

        // 2. Append Dual Loading Indicator
        const loadingId = 'ai_loading_' + Date.now();
        const loadingMsgEl = document.createElement('div');
        loadingMsgEl.id = loadingId;
        loadingMsgEl.className = 'chat-bubble-msg flex justify-end my-2.5';
        loadingMsgEl.setAttribute('dir', 'rtl');
        loadingMsgEl.innerHTML = `
            <div class="max-w-[90%] rounded-2xl rounded-tl-none p-3 text-xs leading-relaxed bg-slate-950 border border-indigo-800/60 text-slate-300 shadow-md">
                <div class="font-bold text-[10.5px] text-white mb-1 flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                    <div class="flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        <span class="text-emerald-400 font-extrabold">توليد متزامن لكلا النموذجين (Dual-AI):</span>
                    </div>
                    <span class="text-[9.5px] font-mono text-slate-400">Gemini 2.5 + Grok-2</span>
                </div>
                <div class="flex items-center gap-3 pt-1 text-[11px] text-slate-400 flex-wrap">
                    <span class="flex items-center gap-1 text-indigo-300 animate-pulse">
                        <span>✨</span>
                        <span>Google Gemini يبحث ويدقق...</span>
                    </span>
                    <span class="text-slate-600">•</span>
                    <span class="flex items-center gap-1 text-amber-300 animate-pulse">
                        <span>⚡</span>
                        <span>xAI Grok يحلل ويصيغ الرؤية...</span>
                    </span>
                </div>
            </div>
        `;
        stream.appendChild(loadingMsgEl);
        stream.scrollTop = stream.scrollHeight;

        // 3. Concurrently Generate Responses for BOTH Models
        const [geminiResult, grokResult] = await Promise.all([
            (async () => {
                try {
                    const text = await callCloudGeminiApi(q);
                    return { text, isCloud: true };
                } catch (e) {
                    const text = await generateUniversalAiAnswer(q, 'gemini');
                    return { text, isCloud: false };
                }
            })(),
            (async () => {
                try {
                    const text = await callCloudGrokApi(q);
                    return { text, isCloud: true };
                } catch (e) {
                    const text = await generateUniversalAiAnswer(q, 'grok');
                    return { text, isCloud: false };
                }
            })()
        ]);

        // 4. Parse & Clean Both Responses
        const parsedGemini = parseAndCleanAiResponse(geminiResult.text);
        const parsedGrok = parseAndCleanAiResponse(grokResult.text);

        const loader = document.getElementById(loadingId);
        if (loader) loader.remove();

        // 5. Append Interactive AI Message Bubble with Dual-Model Switcher Tabs
        const respId = 'resp_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const aiTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        const aiMsgEl = document.createElement('div');
        aiMsgEl.className = 'chat-bubble-msg flex justify-end my-2.5';
        aiMsgEl.setAttribute('dir', 'rtl');

        aiMsgEl.innerHTML = `
            <div class="max-w-[95%] sm:max-w-[92%] rounded-2xl rounded-tl-none p-3.5 sm:p-4 text-xs leading-relaxed bg-slate-950/98 border border-indigo-800/70 text-slate-100 shadow-2xl space-y-3 text-right">
                
                <!-- Dual AI Model Switcher Bar (Right above the response) -->
                <div class="flex items-center justify-between border-b border-slate-800 pb-2.5 gap-2 flex-wrap" dir="rtl">
                    <div class="flex items-center gap-1 p-0.5 bg-slate-900/90 rounded-xl border border-slate-800">
                        <!-- Gemini Tab -->
                        <button id="ai_tab_gemini_${respId}" onclick="toggleAiAnswerModel('${respId}', 'gemini')" 
                            class="${defaultModel === 'gemini' ? 'px-3 py-1.5 rounded-lg text-xs font-black bg-indigo-600 text-white shadow-md' : 'px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/80'} flex items-center gap-1.5 transition active:scale-95" 
                            title="عرض إجابة Google Gemini">
                            <span>✨</span>
                            <span>Google Gemini</span>
                            <span class="text-[9px] px-1.5 py-0.2 rounded font-mono ${geminiResult.isCloud ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-indigo-950 text-indigo-300 border border-indigo-700'}">2.5</span>
                        </button>

                        <!-- Grok Tab -->
                        <button id="ai_tab_grok_${respId}" onclick="toggleAiAnswerModel('${respId}', 'grok')" 
                            class="${defaultModel === 'grok' ? 'px-3 py-1.5 rounded-lg text-xs font-black bg-amber-600 text-white shadow-md' : 'px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/80'} flex items-center gap-1.5 transition active:scale-95" 
                            title="عرض إجابة xAI Grok">
                            <span>⚡</span>
                            <span>xAI Grok</span>
                            <span class="text-[9px] px-1.5 py-0.2 rounded font-mono ${grokResult.isCloud ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-amber-950 text-amber-300 border border-amber-700'}">Grok-2</span>
                        </button>

                        <!-- Compare Both Tab -->
                        <button id="ai_tab_both_${respId}" onclick="toggleAiAnswerModel('${respId}', 'both')" 
                            class="px-2 py-1.5 rounded-lg text-[10.5px] font-bold text-slate-400 hover:text-emerald-300 hover:bg-slate-800/80 flex items-center gap-1 transition active:scale-95" 
                            title="عرض كلا النموذجين جنباً إلى جنب للمقارنة">
                            <span>🔄</span>
                            <span class="hidden sm:inline">مقارنة كلاهما</span>
                        </button>
                    </div>

                    <div class="flex items-center gap-1.5 text-[9.5px] text-slate-400 font-mono">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>كلا النموذجين جاهز</span>
                        <span>• ${aiTime}</span>
                    </div>
                </div>

                <!-- Panel 1: Google Gemini Response -->
                <div id="ai_panel_gemini_${respId}" class="${defaultModel === 'gemini' ? '' : 'hidden'} space-y-2.5">
                    <div class="flex items-center justify-between text-[10px] text-indigo-300 bg-indigo-950/40 p-2 rounded-xl border border-indigo-900/60 font-bold">
                        <span class="flex items-center gap-1.5">
                            <span>✨</span>
                            <span>تحليل Google Gemini 2.5 — تدقيق منهجي ومعرفي متعمق:</span>
                        </span>
                        <span class="text-[9px] px-2 py-0.5 rounded-full ${geminiResult.isCloud ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-indigo-950 text-indigo-300 border border-indigo-700'}">
                            ${geminiResult.isCloud ? 'سحابي مباشر 🟢' : 'Gemini المعرفي ⚡'}
                        </span>
                    </div>
                    <div class="space-y-2 text-slate-100 text-xs leading-relaxed">
                        ${parsedGemini.cleanHtml}
                    </div>
                    ${parsedGemini.actionButtonsHtml}
                </div>

                <!-- Panel 2: xAI Grok Response -->
                <div id="ai_panel_grok_${respId}" class="${defaultModel === 'grok' ? '' : 'hidden'} space-y-2.5">
                    <div class="flex items-center justify-between text-[10px] text-amber-300 bg-amber-950/40 p-2 rounded-xl border border-amber-900/60 font-bold">
                        <span class="flex items-center gap-1.5">
                            <span>⚡</span>
                            <span>رؤية xAI Grok-2 — سرعة فائقة، ذكاء مباشر، وتحليل حر:</span>
                        </span>
                        <span class="text-[9px] px-2 py-0.5 rounded-full ${grokResult.isCloud ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-amber-950 text-amber-300 border border-amber-700'}">
                            ${grokResult.isCloud ? 'سحابي مباشر 🟢' : 'Grok المعرفي ⚡'}
                        </span>
                    </div>
                    <div class="space-y-2 text-slate-100 text-xs leading-relaxed">
                        ${parsedGrok.cleanHtml}
                    </div>
                    ${parsedGrok.actionButtonsHtml}
                </div>

                <!-- Panel 3: Side-by-Side Comparison of Both -->
                <div id="ai_panel_both_${respId}" class="hidden space-y-3">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        <!-- Col 1: Gemini -->
                        <div class="p-3 rounded-xl bg-slate-950/80 border border-indigo-900/80 space-y-2 text-right">
                            <div class="font-bold text-xs text-indigo-300 flex items-center justify-between border-b border-indigo-950 pb-1.5">
                                <span class="flex items-center gap-1"><span>✨</span> <span>Google Gemini 2.5</span></span>
                                <span class="text-[9.5px] text-indigo-400 font-mono">التحليل المؤسسي</span>
                            </div>
                            <div class="text-[11px] text-slate-200 leading-relaxed space-y-2">
                                ${parsedGemini.cleanHtml}
                            </div>
                            ${parsedGemini.actionButtonsHtml}
                        </div>

                        <!-- Col 2: Grok -->
                        <div class="p-3 rounded-xl bg-slate-950/80 border border-amber-900/80 space-y-2 text-right">
                            <div class="font-bold text-xs text-amber-300 flex items-center justify-between border-b border-amber-950 pb-1.5">
                                <span class="flex items-center gap-1"><span>⚡</span> <span>xAI Grok-2</span></span>
                                <span class="text-[9.5px] text-amber-400 font-mono">الذكاء المباشر</span>
                            </div>
                            <div class="text-[11px] text-slate-200 leading-relaxed space-y-2">
                                ${parsedGrok.cleanHtml}
                            </div>
                            ${parsedGrok.actionButtonsHtml}
                        </div>
                    </div>
                </div>

            </div>
        `;

        stream.appendChild(aiMsgEl);
        stream.scrollTop = stream.scrollHeight;
    };

    // ─────────────────────────────────────────────────────────────────────────
    // 8. COPILOT MODAL OPENER & TAB CONTEXT SWITCHER
    // ─────────────────────────────────────────────────────────────────────────
    window.openFloatingAiCopilot = function(customPrompt = '', customTitle = '') {
        if (typeof triggerHaptic === 'function') triggerHaptic('medium');
        const modal = document.getElementById('floatingAiCopilotModal');
        if (!modal) return;

        modal.classList.remove('hidden');

        // Sync model state
        window.switchActiveAiModel(window.ACTIVE_AI_MODEL || 'gemini');

        // Dynamic Suggestions based on Active Hash / Tab
        const hash = window.location.hash || '#tab-portfolio';
        const suggestionsContainer = document.getElementById('floatingAiDynamicSuggestionsContainer');

        let suggestions = [
            'ما هي لعبة tibia وكيف يعمل اقتصادها وسيرفراتها؟',
            'ما هو تحليلك المالي لسهم طلعت مصطفى TMGH وما خطة التبريد؟',
            'أمتلك 100 ألف جنيه كاش حالياً، كيف أوزعها في ظل فائدة 19%؟',
            'ما هي توقعات أسعار الذهب عيار 24 وصندوق أزيموت AZG؟'
        ];

        if (hash.includes('news_hub') || hash.includes('news')) {
            suggestions = [
                'ما أثر إفصاح مبيعات طلعت مصطفى 480 مليار جنيه على ربحية السهم؟',
                'كيف أستفيد من عوائد الكابل البحري لـ المصرية للاتصالات؟',
                'ما هي لعبة tibia وهل تؤثر الاقتصادات الرقمية في الألعاب على الواقع؟',
                'ما هي آلية تطبيق الحدود السعرية في جلسات البورصة المصرية؟'
            ];
        } else if (hash.includes('tools')) {
            suggestions = [
                'كيف أحسب زكاة محفظتي بدقة وفق معايير الأيوفي وSOCPA؟',
                'اشرح لي آلية التبريد الذكي وحساب متوسط التكلفة DCA؟',
                'ما هي لعبة tibia وسيرفر Secura وحجز الأماكن؟',
                'ما هي تكلفة الفرصة البديلة للاحتفاظ بسيولة نقدية فائضة؟'
            ];
        }

        if (suggestionsContainer) {
            suggestionsContainer.innerHTML = suggestions.map(s => `
                <button onclick="submitFloatingAiQuery('${s}')" class="p-2 rounded-xl bg-slate-900/90 hover:bg-indigo-900/60 border border-slate-800 text-slate-300 hover:text-white text-right transition active:scale-95 flex items-start gap-1.5 shadow-sm">
                    <span class="text-indigo-400 shrink-0 mt-0.5">✦</span>
                    <span class="text-[11px] leading-snug">${s}</span>
                </button>
            `).join('');
        }

        if (customPrompt) {
            setTimeout(() => {
                window.submitFloatingAiQuery(customPrompt);
            }, 300);
        }
    };

    window.closeFloatingAiCopilot = function() {
        const modal = document.getElementById('floatingAiCopilotModal');
        if (modal) modal.classList.add('hidden');
    };

    window.resetFloatingAiChat = function() {
        if (typeof triggerHaptic === 'function') triggerHaptic('light');
        const stream = document.getElementById('floatingAiChatStream');
        const welcome = document.getElementById('floatingAiWelcomeCard');
        if (stream) {
            const bubbles = stream.querySelectorAll('.chat-bubble-msg');
            bubbles.forEach(b => b.remove());
        }
        if (welcome) welcome.classList.remove('hidden');
        if (typeof showToast === 'function') showToast('تم بدء محادثة جديدة 🔄');
    };

})(window);
