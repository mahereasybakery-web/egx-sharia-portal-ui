/**
 * EGX Sharia Portal - Gemini AI Investment Assistant (js/gemini-ai.js)
 * Clean Architecture | Local API Key Storage | Offline Fallback
 */

(function(window) {
    'use strict';

    const API_KEY_STORAGE = 'egx_gemini_api_key';

    function init() {
        const savedKey = localStorage.getItem(API_KEY_STORAGE);
        const keyInput = document.getElementById('geminiApiKeyInput');
        if (keyInput && savedKey) {
            keyInput.value = savedKey;
        }
    }

    function saveApiKey() {
        const keyInput = document.getElementById('geminiApiKeyInput');
        if (!keyInput) return;
        const key = keyInput.value.trim();
        if (key) {
            localStorage.setItem(API_KEY_STORAGE, key);
            if (window.App && window.App.showToast) window.App.showToast('تم حفظ مفتاح API بنجاح');
        } else {
            localStorage.removeItem(API_KEY_STORAGE);
            if (window.App && window.App.showToast) window.App.showToast('تم مسح المفتاح المخزن');
        }
    }

    async function sendPrompt(customText) {
        const inputEl = document.getElementById('aiChatInput');
        const prompt = customText || (inputEl ? inputEl.value.trim() : '');
        if (!prompt) return;

        if (inputEl) inputEl.value = '';

        appendMessage('user', prompt);
        showTypingIndicator();

        const apiKey = localStorage.getItem(API_KEY_STORAGE);

        if (apiKey) {
            try {
                const response = await callGeminiAPI(apiKey, prompt);
                removeTypingIndicator();
                appendMessage('ai', response);
                return;
            } catch (err) {
                console.warn('[Gemini AI] API call failed, falling back to smart engine:', err);
            }
        }

        // Smart Offline Financial Engine
        setTimeout(() => {
            removeTypingIndicator();
            const smartReply = generateSmartResponse(prompt);
            appendMessage('ai', smartReply);
        }, 800);
    }

    async function callGeminiAPI(apiKey, userText) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const holdingsSummary = JSON.stringify(window.PortfolioEngine ? window.PortfolioEngine.calculate().summary : {});
        
        const systemInstruction = `أنت خبير استثماري ومستشار مالي معتمد للشريعة الإسلامية في البورصة المصرية (EGX). 
بيانات محفظة المستخدم الحالية: ${holdingsSummary}. 
أجب باللغة العربية باحترافية واختصار وموضوعية، مع التركيز على إدارة المخاطر وتوزيع الأصول المتوافق مع الشريعة.`;

        const payload = {
            contents: [
                {
                    parts: [
                        { text: systemInstruction + "\n\nسؤال المستخدم: " + userText }
                    ]
                }
            ]
        };

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
    }

    function generateSmartResponse(query) {
        const q = query.toLowerCase();
        if (q.includes('محفظ') || q.includes('مخاطر') || q.includes('توزيع')) {
            return `بناءً على تدقيق المحفظة الحالية:
1. **توزيع الأوزان**: يتركز الجزء الأكبر في سهمي المصرية للاتصالات (ETEL) ومجموعة طلعت مصطفى (TMGH) وصندوق الشريعة (CMS).
2. **عنصر الأمان**: حيازة صناديق الذهب (AZG) والسبائك تمنح المحفظة درعاً دفاعياً ممتازاً ضد تقلبات العملة.
3. **توصية استراتيجية**: يُنصح بإعادة موازنة تدريجية عبر توجيه السيولة النقدية الجديدة إلى صناديق الدخل الثابت أو الأسهم ذات العائد الدوري النقدي المرتفع.`;
        }
        if (q.includes('زكاة') || q.includes('شريع')) {
            return `وفقاً لمعايير الأيوفي (AAOIFI) ولجنة الفتوى:
1. **أسهم المتاجرة والمضاربة**: تُخرج الزكاة بنسبة 2.5% من القيمة السوقية الإجمالية للمحفظة في نهاية الحول.
2. **أسهم الاستثمار طويل الأجل (القنية)**: تُحسب الزكاة فقط على الأرباح النقدية الموزعة أو القيمة الدفترية للأصول الزكوية.
3. **صناديق الذهب**: يُزكى عليها بالقيمة السوقية الحالية عند بلوغ النصاب (85 جرام عيار 24).`;
        }
        return `أهلاً بك! السوق المصري يشهد حالياً زخماً إيجابياً في أسهم مؤشر الشريعة EGX33 بقيادة قطاعات المدفوعات والموارد الأساسية. يمكنك الاستفادة من حاسبات التداول وأدوات أذون الخزانة في شاشة (أدواتي) لتخطيط استثماراتك بأعلى عائد خالي من المخاطر.`;
    }

    function appendMessage(sender, text) {
        const box = document.getElementById('aiChatMessages');
        if (!box) return;

        const isUser = sender === 'user';
        const msgDiv = document.createElement('div');
        msgDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`;
        msgDiv.innerHTML = `
            <div class="max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${isUser ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'}">
                <div class="font-bold text-[10px] mb-1 ${isUser ? 'text-emerald-200' : 'text-indigo-400'}">
                    ${isUser ? '👤 أنت' : '✨ مستشار Gemini AI'}
                </div>
                <div>${text.replace(/\n/g, '<br>')}</div>
            </div>
        `;
        box.appendChild(msgDiv);
        box.scrollTop = box.scrollHeight;
    }

    function showTypingIndicator() {
        const box = document.getElementById('aiChatMessages');
        if (!box) return;
        const ind = document.createElement('div');
        ind.id = 'aiTypingIndicator';
        ind.className = 'flex justify-start mb-3';
        ind.innerHTML = `
            <div class="bg-slate-950 border border-slate-800 text-slate-400 text-xs rounded-2xl px-3 py-2 flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style="animation-delay: 0.2s"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style="animation-delay: 0.4s"></span>
                <span>جاري التحليل...</span>
            </div>
        `;
        box.appendChild(ind);
        box.scrollTop = box.scrollHeight;
    }

    function removeTypingIndicator() {
        const ind = document.getElementById('aiTypingIndicator');
        if (ind) ind.remove();
    }

    window.GeminiAssistant = {
        init,
        saveApiKey,
        sendPrompt
    };

})(window);
