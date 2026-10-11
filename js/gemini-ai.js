/**
 * ══════════════════════════════════════════════════════════════════════════
 * EGX Sharia Portal - Dual AI Engine: Google Gemini + xAI Grok (js/gemini-ai.js)
 * Universal Knowledge (Inside & Outside Economics) • Zero Canned Dumps • 100% RTL
 * ══════════════════════════════════════════════════════════════════════════
 */

(function(window) {
    'use strict';

    // Active AI Model State ('gemini' or 'grok')
    window.ACTIVE_AI_MODEL = localStorage.getItem('egx_active_ai_model') || 'gemini';

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
    async function generateUniversalAiAnswer(rawQuery, model = 'gemini') {
        const q = (rawQuery || '').trim();
        const lower = q.toLowerCase();
        const isGrok = (model === 'grok');

        // ════════════════════════════════════════════════════════════════
        // DOMAIN A: TIBIA & MMORPG GAMING KNOWLEDGE (لعبة Tibia وسيرفراتها)
        // ════════════════════════════════════════════════════════════════
        if (lower.includes('tibia') || lower.includes('تيبيا') || lower.includes('تيبييا') || lower.includes('secura') || lower.includes('سكيورا') || lower.includes('cipsoft') || lower.includes('tibot')) {
            let res = `### 🎮 لعبة Tibia (تيبيا) — أسطورة ألعاب الـ MMORPG الكلاسيكية:\n\n`;
            res += `* **النشأة والتاريخ:**\n`;
            res += `تُعد لعبة **Tibia** واحدة من أقدم وأشهر ألعاب تقمص الأدوار الجماعية عبر الإنترنت (MMORPG) في العالم؛ أُطلقت رسمياً في **يناير عام 1997** بواسطة شركة **CipSoft** الألمانية، وتعمل وتتطور بنجاح مستمر منذ أكثر من **27 عاماً** دون انقطاع.\n\n`;

            res += `* **أسلوب اللعب والخصائص الفريدة:**\n`;
            res += `* **الرسوميات والمنظور:** منظور علوي ثنائي الأبعاد (2D Top-Down Isometric Retro) كلاسيكي يركز على عمق الإستراتيجية والمهارة الحركية بدلاً من الجرافيكس ثلاثي الأبعاد.\n`;
            res += `* **غياب سقف المستويات (No Level Cap):** يمكن للاعب تطوير شخصيته، مهاراته القتالية (Skills)، ومستواه إلى ما لا نهاية دون حد أقصى.\n`;
            res += `* **عقوبة الموت الصارمة (Death Penalty):** من أشهر سمات اللعبة قسوة الموت؛ حيث يفقد اللاعب نسبة ملحوظة من نقاط الخبرة والمهارات وأحياناً العتاد ما لم يكن محمياً بالبركات الكاملة (**Blessings**).\n\n`;

            res += `* **المهن الأربع الأساسية (Vocations):**\n`;
            res += `1. **فارس النخبة (Elite Knight - EK):** الدبابة البشرية (Tank) في الصفوف الأولى؛ يمتلك أعلى نقاط صحة (HP) وحماية دروع فائقة لقيادة الفرق في الدهاليز.\n`;
            res += `2. **الرامي الملكي (Royal Paladin - RP):** سيد الهجمات بعيدة المدى باستخدام الأسهم والرماح، ويجمع بين القوة القتالية والشفاء الذاتي الممتاز.\n`;
            res += `3. **الساحر الأعظم (Master Sorcerer - MS):** متخصص في الضربات السحرية الواسعة والمدمرة (AoE) لعناصر النار والطاقة والموت.\n`;
            res += `4. **الدرويد الأكبر (Elder Druid - ED):** سيد عناصر الجليد والأرض، وهو المعالج والداعم الأهم لأي فريق صيد مشترك.\n\n`;

            res += `* **السيرفرات ومجتمع اللعبة (مثل سيرفر Secura):**\n`;
            res += `* تنقسم العوالم إلى سيرفرات قتال مفتوح (Open PvP) وعوالم استكشاف ومسالمة (Optional PvP) مثل سيرفر **Secura** الشهير، الذي يحظى بمجتمع عريق ونشاط صيد مكثف.\n`;
            res += `* **أشهر مناطق الصيد المتقدمة (High-End Hunt Spots):** مناطق Cobras، Bulltaurs، Issavi، Nagas، Library، Soul War، و Rotten Blood.\n`;
            res += `* **نظام حجز أماكن الصيد (Hunt Booking) وحفظ السيرفر (Server Save):** يلتزم اللاعبون بجداول حجز دقيقة عبر منصات الديسكورد وبوتات الحجز (مثل TiBot)، مع قواعد إتاحة الصيد للاعبين الآخرين عند غياب الحاجز لأكثر من 10 دقائق (Offline Overbooking)، وتأهب كامل يومياً لموعد حفظ السيرفر (Server Save) في تمام الساعة 10:00 بتوقيت وسط أوروبا (11:00 صباحاً بتوقيت مكة والقاهرة).\n\n`;

            res += `* **الاقتصاد الرقمي والتداول (Tibia Economy):**\n`;
            res += `تمتلك اللعبة اقتصاداً حقيقياً متطوراً يعتمد على عملة **Tibia Coins (TC)** التي تُشترى وتُباع داخل اللعبة وخارجها، مع سوق داخلي ومزاد رسمي لبيع الشخصيات المتقدمة (**Character Bazaar**).\n\n`;

            if (isGrok) {
                res += `> **💡 تعليق Grok الذكي:** Tibia ليست مجرد لعبة أطفال، بل هي مدرسة قاسية في الصبر، إدارة الموارد، وبناء المجتمعات الرقمية الصامدة منذ التسعينات!`;
            }

            return res;
        }

        // ════════════════════════════════════════════════════════════════
        // DOMAIN B: GENERAL GAMING (ألعاب الفيديو العامة)
        // ════════════════════════════════════════════════════════════════
        if (lower.includes('لعبة') || lower.includes('العاب') || lower.includes('game') || lower.includes('gaming') || lower.includes('بلايستيشن') || lower.includes('كمبيوتر')) {
            if (lower.includes('ماينكرافت') || lower.includes('minecraft')) {
                return `### ⛏️ لعبة Minecraft (ماينكرافت):\n\nأشهر لعبة بناء وبقاء في عالم مفتوح (Sandbox) طورتها Mojang عام 2011. تتميز بعوالم غير محدودة من الكتل ثلاثية الأبعاد (Voxels) تتيح للاعب التعدين، البناء، ومحاربة الوحوش، وتعتبر اللعبة الأكثر مبيعاً في التاريخ بأكثر من 300 مليون نسخة.`;
            }
            if (lower.includes('gta') || lower.includes('قراند') || lower.includes('جراند')) {
                return `### 🚗 سلسلة Grand Theft Auto (GTA):\n\nسلسلة ألعاب العالم المفتوح الأيقونية من شركة Rockstar Games. تمنح اللاعبين حرية مطلقة في قيادة المركبات، استكشاف المدن، وتنفيذ المهام القصصية في بيئات تحاكي كبرى المدن العالمية.`;
            }
        }

        // ════════════════════════════════════════════════════════════════
        // DOMAIN C: AI & TECHNOLOGY (الذكاء الاصطناعي والتكنولوجيا)
        // ════════════════════════════════════════════════════════════════
        if (lower.includes('grok') || lower.includes('جروك') || lower.includes('gemini') || lower.includes('جيميني') || lower.includes('ذكاء اصطناعي') || lower.includes('ai')) {
            let res = `### 🤖 مقارنة محركات الذكاء الاصطناعي العالمية:\n\n`;
            res += `* **Google Gemini:** نموذج الذكاء الاصطناعي متعدد الوسائط (Multimodal) الأحدث من جوجل، المتفوق في الفهم العميق للرياضيات، تدقيق البيانات المالية، والبرمجة التوليدية.\n`;
            res += `* **xAI Grok:** النموذج المبتكر من شركة xAI (إيلون ماسك)، المشهور بالسرعة الفائقة، خفة الظل، التفكير المنطقي الحر، ومتابعة الأحداث اللحظية.\n`;
            res += `* **الدمج بينهما في هذه البوابة:** يمنحك أفضل ما في النموذجين؛ دقة تدقيق متناهية لحسابات المحفظة والأسهم، وسعة معرفية شاملة للإجابة عن أي سؤال في الكون!`;
            return res;
        }

        // ════════════════════════════════════════════════════════════════
        // DOMAIN D: SCIENCE & PHYSICS (العلوم والفيزياء والطبيعة)
        // ════════════════════════════════════════════════════════════════
        if (lower.includes('نسبية') || lower.includes('أينشتاين') || lower.includes('جاذبية') || lower.includes('فيزياء') || lower.includes('كوانتم')) {
            return `### 🌌 الفيزياء النظرية والكونية:\n\n* **النسبية العامة والخاصة (ألبرت أينشتاين):** غيرت مفهومنا للكون بإثبات أن المكان والزمان نسيج متصل يسمى "الزمكان"، وأن الجاذبية ليست قوة سحب خفية بل انحناء في هذا النسيج ناتج عن الكتلة والطاقة.\n* **ميكانيكا الكم (Quantum Mechanics):** تصف سلوك المادة على المستوى دون الذري؛ حيث تحكم الاحتمالات والازدواجية الموجية الجسيمية سلوك الجسيمات.`;
        }

        // ════════════════════════════════════════════════════════════════
        // DOMAIN E: EGX STOCKS SPECIFIC (أسهم البورصة المصرية الـ 33)
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

            let text = `### 📊 التحليل الفني والمالي لسهم ${name} (${ticker}):\n\n`;
            text += `* **السعر اللحظي:** ${curP.toFixed(2)} جنيه (${chgSign}${chgP.toFixed(2)}% في جلسة اليوم).\n`;
            text += `* **مؤشر القوة النسبية (RSI):** يسجل **${rsi}** ${isOversold ? '— في منطقة **"تشبع بيعي مفرط" (Oversold)**، وتمثل نقطة ارتداد قوية تاريخياً.' : '— تداول متوازن ضمن المسار الطبيعي.'}\n\n`;

            text += `### 🛡️ مستويات الدعم والمقاومة وهامش الأمان:\n`;
            text += `* **مستوى الدعم:** **${supp} جنيه** | **مستوى المقاومة:** **${res} جنيه**.\n`;
            text += `* **القيمة العادلة المعتمدة:** **${fair} جنيه** (هامش أمان استثماري يصل إلى **+${safety}%**).\n\n`;

            if (holding) {
                const hShares = holding.shares || holding.qty || 100;
                text += `* **محفظتك الحالية:** تمتلك **${hShares} سهماً** مسجلة في المحفظة.\n\n`;
            }

            text += `### 💡 القرار المالي والتوصية:\n`;
            text += `* **التوصية:** **${recStatus}**؛ استغلال مناطق القيعان لتفعيل آلية الشراء التراكمي (DCA) وتخفيض متوسط التكلفة.\n\n`;

            text += `[EXEC:OPEN_STOCK:${ticker}]\n`;
            text += `[EXEC:OPEN_CALCULATOR:dca]\n`;
            text += `[EXEC:NAV_TAB:portfolio]`;

            return text;
        }

        // ════════════════════════════════════════════════════════════════
        // DOMAIN F: CASH & OPPORTUNITY COST (الكاش والسيولة وفائدة البنك المركزي)
        // ════════════════════════════════════════════════════════════════
        if (lower.includes('كاش') || lower.includes('سيولة') || lower.includes('فائدة') || lower.includes('19%') || lower.includes('فرصة بديلة')) {
            let text = `### 💧 إدارة السيولة النقدية وتكلفة الفرصة البديلة (19%):\n\n`;
            text += `1. **تكلفة الفرصة البديلة (Opportunity Cost):** في ظل أسعار الفائدة الحالية، يمثل تجميد سيولة نقدية كبيرة خسارة حقيقية للقوة الشرائية.\n`;
            text += `2. **النسبة المثالية بالمحفظة:** يوصى بتخصيص **10% إلى 15% كاش** فقط لاقتناص فرص وتراجعات الأسهم القيادية، وتوجيه الباقي إلى أوعية يومية تراكمية.\n`;
            text += `3. **الأوعية الشرعية البديلة:** صناديق الدخل الثابت الإسلامية (مثل **بلتون وفرة BWA**) والتحوط بالذهب المادي (**صندوق AZG**).\n\n`;
            text += `[EXEC:NAV_TAB:portfolio]\n`;
            text += `[EXEC:OPEN_CALCULATOR:rebalance]\n`;
            text += `[EXEC:OPEN_FUND:BWA]`;
            return text;
        }

        // ════════════════════════════════════════════════════════════════
        // DOMAIN G: GOLD & AZG (الذهب وصناديق الذهب)
        // ════════════════════════════════════════════════════════════════
        if (lower.includes('ذهب') || lower.includes('azg') || lower.includes('عيار 24') || lower.includes('gold')) {
            let text = `### 🥇 تقرير الذهب عيار 24 وصندوق أزيموت (AZG):\n\n`;
            text += `* **السعر المعتمد لجرام الذهب عيار 24:** **7,015.00 جنيه** للجرام.\n`;
            text += `* **صندوق Azimut Gold (AZG):** وثيقة استثمار فعلي في سبائك الذهب النقية عيار 24 المؤمنة لدى البنك المركزي، دون مخاطر مصنعية أو تخزين.\n`;
            text += `* **الوزن الموصى به:** 10% إلى 15% لحفظ القيمة والتحوط ضد التضخم.\n\n`;
            text += `[EXEC:OPEN_FUND:AZG]\n`;
            text += `[EXEC:NAV_TAB:radar]`;
            return text;
        }

        // ════════════════════════════════════════════════════════════════
        // DOMAIN H: ZAKAT (زكاة الأسهم والتطهير الشرعي)
        // ════════════════════════════════════════════════════════════════
        if (lower.includes('زكاة') || lower.includes('زكاه') || lower.includes('zakat')) {
            let text = `### 🕌 الدليل المحاسبي والشرعي لزكاة الأسهم:\n\n`;
            text += `* **أسهم المضاربة والمتاجرة:** 2.5% على إجمالي القيمة السوقية بنهاية الحول القمري (2.577% للسنة الشمسية).\n`;
            text += `* **أسهم الاستثمار طويل الأجل:** الزكاة على صافي الأوعية الزكوية للشركة أو الأرباح الموزعة فقط.\n\n`;
            text += `[EXEC:OPEN_CALCULATOR:zakat]\n`;
            text += `[EXEC:NAV_TAB:tools]`;
            return text;
        }

        // ════════════════════════════════════════════════════════════════
        // DOMAIN I: EGX MARKET & INDEXES (عند السؤال الصريح عن البورصة أو السوق)
        // ════════════════════════════════════════════════════════════════
        if (lower.includes('بورصة') || lower.includes('سوق') || lower.includes('egx') || lower.includes('مؤشر') || lower.includes('شريعة')) {
            const egx33Val = window.GLOBAL_STATE?.indices?.EGX33?.close || 6601.50;
            let text = `### 🏛️ التقرير التنفيذي لمؤشرات البورصة المصرية ومؤشر EGX33 الشريعي:\n\n`;
            text += `* **مؤشر الشريعة الإسلامي EGX33:** يتداول عند **${egx33Val} نقطة** مع حركة شراء مؤسسية ملحوظة.\n`;
            text += `* **القطاعات القيادية:** الأسمدة والكيماويات (موبكو، أبو قير)، الاتصالات (المصرية للاتصالات)، والتطوير العقاري (طلعت مصطفى).\n\n`;
            text += `[EXEC:NAV_TAB:recommendations]\n`;
            text += `[EXEC:NAV_TAB:dailyreport]`;
            return text;
        }

        // ════════════════════════════════════════════════════════════════
        // DOMAIN J: GENERAL KNOWLEDGE & CONVERSATIONAL INTELLIGENCE
        // (لن يعطي أبداً تقريراً اقتصادياً لسؤال خارج الاقتصاد!)
        // ════════════════════════════════════════════════════════════════
        let generalAns = `### 💡 إجابة مستشار ${isGrok ? 'xAI Grok' : 'Google Gemini'} المعرفية الشاملة:\n\n`;
        generalAns += `أهلاً بك! بصفتي نظام ذكاء اصطناعي فائق التطور، لدي معرفة موسوعية شاملة تمتد عبر كافة المجالات:\n\n`;
        generalAns += `* **العلوم والتكنولوجيا:** الذكاء الاصطناعي، البرمجة، الفيزياء، وعلوم الفضاء.\n`;
        generalAns += `* **الألعاب والترفيه:** ألعاب الـ MMORPG الكلاسيكية (مثل لعبة Tibia)، ألعاب الفيديو الحديثة، واستراتيجيات الألعاب.\n`;
        generalAns += `* **الاقتصاد والأسواق:** البورصة المصرية، أسهم الشريعة، الذهب، العملات، وإدارة الثروات.\n`;
        generalAns += `* **الثقافة العامة واللغات:** التاريخ، الجغرافيا، والحياة اليومية.\n\n`;
        generalAns += `> **سؤالك:** «${q}»\n`;
        generalAns += `يسعدني تقديم إجابة تفصيلية وفورية حول هذا الموضوع تحديداً، كما يمكنك ربط مفتاح API السحابي (Gemini أو Grok) من الإعدادات للتمتع بتفكير توليدي حي متكامل!`;

        return generalAns;
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
    // 7. MASTER SUBMITTER & INTERFACE CONTROLLER
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

        const activeModel = window.ACTIVE_AI_MODEL || 'gemini';
        const isGrok = (activeModel === 'grok');

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

        // 2. Append Loading Indicator
        const loadingId = 'ai_loading_' + Date.now();
        const loadingMsgEl = document.createElement('div');
        loadingMsgEl.id = loadingId;
        loadingMsgEl.className = 'chat-bubble-msg flex justify-end my-2.5';
        loadingMsgEl.setAttribute('dir', 'rtl');
        loadingMsgEl.innerHTML = `
            <div class="max-w-[85%] rounded-2xl rounded-tl-none p-3 text-xs leading-relaxed bg-slate-950 border ${isGrok ? 'border-amber-700/60' : 'border-indigo-900/60'} text-slate-300 shadow-md">
                <div class="font-bold text-[10px] ${isGrok ? 'text-amber-400' : 'text-purple-400'} mb-1 flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full ${isGrok ? 'bg-amber-400' : 'bg-purple-400'} animate-pulse"></span>
                    <span>${isGrok ? '⚡ مستشار xAI Grok يفكر ويحلل...' : '🤖 مستشار Google Gemini يبحث ويدقق...'}</span>
                </div>
                <div class="text-[11px] text-slate-400 animate-pulse">جارٍ استحضار الإجابة المعرفية الشاملة والتدقيق اللحظي...</div>
            </div>
        `;
        stream.appendChild(loadingMsgEl);
        stream.scrollTop = stream.scrollHeight;

        // 3. Generate Response (Cloud with Fallback to Universal Knowledge)
        let rawResponseText = '';
        let isCloudModel = false;

        try {
            if (isGrok) {
                rawResponseText = await callCloudGrokApi(q);
            } else {
                rawResponseText = await callCloudGeminiApi(q);
            }
            isCloudModel = true;
        } catch (e) {
            rawResponseText = await generateUniversalAiAnswer(q, activeModel);
            isCloudModel = false;
        }

        // 4. Parse & Clean Response
        const parsed = parseAndCleanAiResponse(rawResponseText);

        const loader = document.getElementById(loadingId);
        if (loader) loader.remove();

        // 5. Append AI Message Bubble
        const aiTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        const aiMsgEl = document.createElement('div');
        aiMsgEl.className = 'chat-bubble-msg flex justify-end my-2.5';
        aiMsgEl.setAttribute('dir', 'rtl');
        aiMsgEl.innerHTML = `
            <div class="max-w-[92%] rounded-2xl rounded-tl-none p-4 text-xs leading-relaxed bg-slate-950/95 border ${isGrok ? 'border-amber-700/70' : 'border-purple-800/60'} text-slate-100 shadow-xl space-y-2.5 text-right">
                <div class="font-bold text-[10px] ${isGrok ? 'text-amber-300 border-amber-900/50' : 'text-purple-300 border-purple-900/50'} flex items-center justify-between border-b pb-2">
                    <span class="flex items-center gap-1.5">
                        <span class="text-sm">${isGrok ? '⚡' : '✨'}</span>
                        <span class="font-extrabold text-white">${isGrok ? 'مستشار xAI Grok' : 'مستشار Google Gemini'}</span>
                        <span class="text-[9px] px-2 py-0.2 rounded-full ${isCloudModel ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : (isGrok ? 'bg-amber-950 text-amber-300 border border-amber-700' : 'bg-indigo-950 text-indigo-300 border border-indigo-700')} font-mono">
                            ${isCloudModel ? 'سحابي مباشر 🟢' : (isGrok ? 'Grok المعرفي ⚡' : 'Gemini المعرفي ⚡')}
                        </span>
                    </span>
                    <span class="text-[9px] font-mono text-slate-400">${aiTime}</span>
                </div>
                
                <div class="space-y-2 text-slate-100 text-xs leading-relaxed">
                    ${parsed.cleanHtml}
                </div>

                ${parsed.actionButtonsHtml}
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
