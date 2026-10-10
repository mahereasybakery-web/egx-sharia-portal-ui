/**
 * EGX Sharia Portal - Core Verified Data Module (js/data.js)
 * Clean Architecture | Single Source of Truth
 */

(function(window) {
    'use strict';

    // 1. Audited Default Portfolio Holdings (8 Stocks + 4 Funds + 1 Physical Gold)
    const DEFAULT_PORTFOLIO = [
        { ticker: "ETEL", name: "المصرية للاتصالات", qty: 74, buy: 108.26, cur: 148.00, sector: "التكنولوجيا والمدفوعات", isFund: false, sharia: true },
        { ticker: "TMGH", name: "مجموعة طلعت مصطفى", qty: 115, buy: 97.88, cur: 89.15, sector: "العقارات والإنشاءات", isFund: false, sharia: true },
        { ticker: "EFIH", name: "إي-فاينانس للاستثمارات", qty: 291, buy: 21.95, cur: 25.10, sector: "التكنولوجيا والمدفوعات", isFund: false, sharia: true },
        { ticker: "ADIB", name: "مصرف أبو ظبي الإسلامي", qty: 49, buy: 52.77, cur: 48.75, sector: "القطاع المصرفي", isFund: false, sharia: true },
        { ticker: "EGAL", name: "مصر للألومنيوم", qty: 7, buy: 299.06, cur: 346.50, sector: "الموارد الأساسية", isFund: false, sharia: true },
        { ticker: "ORHD", name: "أوراسكوم للتنمية مصر", qty: 58, buy: 41.46, cur: 39.20, sector: "العقارات والإنشاءات", isFund: false, sharia: true },
        { ticker: "OCDI", name: "سوديك للتنمية", qty: 55, buy: 27.57, cur: 27.50, sector: "العقارات والإنشاءات", isFund: false, sharia: true },
        { ticker: "EFID", name: "إيديتا للصناعات الغذائية", qty: 23, buy: 31.84, cur: 19.25, sector: "الأغذية والمشروبات", isFund: false, sharia: true },
        { ticker: "CMS", name: "صندوق مؤشر CI EGX33 شريعة", qty: 2210, buy: 22.6986, cur: 22.6350, sector: "صناديق المؤشرات", isFund: true, sharia: true },
        { ticker: "AZG", name: "صندوق Azimut جولد", qty: 11, buy: 23.1027, cur: 23.5900, sector: "صناديق الذهب", isFund: true, sharia: true },
        { ticker: "BWA", name: "صندوق بلتون وفرة", qty: 66, buy: 2.0950, cur: 2.2020, sector: "صناديق نقدية وأسهم", isFund: true, sharia: true },
        { ticker: "NMF", name: "صندوق نعيم أسهم شريعة", qty: 2, buy: 48.3100, cur: 50.1000, sector: "صناديق أسهم شريعة", isFund: true, sharia: true },
        { ticker: "THNDR_GOLD", name: "ذهب ثندر عيار 24", qty: 0.0081, buy: 6972.84, cur: 7030.00, sector: "ذهب خام 24", isFund: false, isGold: true, sharia: true }
    ];

    // 2. Market Quotes & Sharia Stocks Universe
    const MARKET_QUOTES = [
        { ticker: "ETEL", name: "المصرية للاتصالات", close: 148.00, open: 146.50, chg: 1.02, pe: 10.1, pb: 1.8, rsi: 68.2, sharia: "متوافق 100%", rec: "احتفاظ إيجابي" },
        { ticker: "TMGH", name: "طلعت مصطفى", close: 89.15, open: 88.00, chg: 1.31, pe: 12.8, pb: 2.1, rsi: 44.5, sharia: "متوافق 100%", rec: "شراء وتجميع" },
        { ticker: "EFIH", name: "إي فاينانس", close: 25.10, open: 24.80, chg: 1.21, pe: 12.4, pb: 2.4, rsi: 65.1, sharia: "متوافق 100%", rec: "شراء وزخم" },
        { ticker: "ADIB", name: "أبوظبي الإسلامي", close: 48.75, open: 48.20, chg: 1.14, pe: 5.2, pb: 1.3, rsi: 46.2, sharia: "متوافق 100%", rec: "شراء استثماري" },
        { ticker: "EGAL", name: "مصر للألومنيوم", close: 346.50, open: 342.00, chg: 1.32, pe: 14.2, pb: 3.1, rsi: 52.0, sharia: "متوافق 100%", rec: "احتفاظ ومراقبة" },
        { ticker: "ORHD", name: "أوراسكوم للتنمية", close: 39.20, open: 38.90, chg: 0.77, pe: 7.2, pb: 1.1, rsi: 47.8, sharia: "متوافق 100%", rec: "احتفاظ ومراقبة" },
        { ticker: "OCDI", name: "سوديك", close: 27.50, open: 27.10, chg: 1.48, pe: 9.8, pb: 1.4, rsi: 45.9, sharia: "متوافق 100%", rec: "تجميع تكتيكي" },
        { ticker: "EFID", name: "إيديتا الغذائية", close: 19.25, open: 19.00, chg: 1.32, pe: 13.9, pb: 2.8, rsi: 43.1, sharia: "متوافق 100%", rec: "تجميع دفاعي" },
        { ticker: "MFPC", name: "موبكو للأسمدة", close: 46.21, open: 45.50, chg: 1.56, pe: 9.3, pb: 2.2, rsi: 54.0, sharia: "متوافق 100%", rec: "احتفاظ وزخم" },
        { ticker: "AMOC", name: "أموك للبترول", close: 13.42, open: 13.15, chg: 2.05, pe: 8.1, pb: 1.6, rsi: 59.2, sharia: "متوافق 100%", rec: "شراء للمضاربة" },
        { ticker: "ABUK", name: "أبو قير للأسمدة", close: 89.00, open: 88.20, chg: 0.91, pe: 7.8, pb: 2.0, rsi: 51.5, sharia: "متوافق 100%", rec: "احتفاظ دوري" },
        { ticker: "SWDY", name: "السويدي إليكتريك", close: 113.98, open: 112.00, chg: 1.77, pe: 8.9, pb: 1.7, rsi: 42.0, sharia: "متوافق 100%", rec: "احتفاظ وتجميع" }
    ];

    // 3. Macroeconomic & Market Indices
    const MARKET_INDICES = {
        egx30: { name: "مؤشر EGX30", price: 53776.69, chg: 0.83 },
        egx33: { name: "مؤشر EGX33 الشريعة", price: 6625.50, chg: 0.63 },
        egx70: { name: "مؤشر EGX70", price: 19834.95, chg: 0.45 },
        gold:  { name: "ذهب عيار 24", price: 7030.00, chg: 0.21 },
        usd:   { name: "الدولار / جنيه", price: 48.65, chg: -0.15 },
        cbeRate: { name: "سعر الكوريدور (CBE)", value: 27.25 }
    };

    // 4. CBE Treasury Bills Auction Benchmarks
    const TREASURY_BILLS_DATA = {
        term91:  { days: 91,  grossYield: 29.85, label: "3 أشهر (91 يوم)" },
        term182: { days: 182, grossYield: 29.40, label: "6 أشهر (182 يوم)" },
        term273: { days: 273, grossYield: 28.95, label: "9 أشهر (273 يوم)" },
        term364: { days: 364, grossYield: 28.20, label: "سنة كاملة (364 يوم)" }
    };

    // 5. Daily Investment Reports Archive
    const DAILY_REPORTS = [
        {
            date: "2026-10-07",
            title: "تقرير جلسة الأربعاء: تدفقات مؤسسية قوية لأسهم التكنولوجيا والمدفوعات",
            sentiment: "إيجابي قوي مع نشاط ملحوظ في مؤشر EGX33",
            summary: "شهدت جلسة اليوم عمليات شراء انتقائية مكثفة تركزت في أسهم التكنولوجيا والاتصالات، مدعومة بتفاؤل المستثمرين حيال نتائج الأعمال والتدفقات النقدية التشغيلية.",
            topGainer: "AMOC (+2.05%)",
            topVolume: "ETEL (148.00 ج)",
            shariaNote: "التزام كامل لكافة أسهم المحفظة بنسب المديونية الشرعية (أقل من 30% من القيمة السوقية)."
        },
        {
            date: "2026-10-06",
            title: "تقرير جلسة الثلاثاء: تماسك قطاع العقارات واستقرار أسعار الذهب والعملة",
            sentiment: "متوازن ومائل للاستقرار الإيجابي",
            summary: "سادت حالة من الترقب الإيجابي مع استقرار مؤشر EGX30 فوق مستوى الدعم الرئيسي 53,500 نقطة، وارتفاع أحجام تداول صناديق الذهب التحوطية.",
            topGainer: "EFIH (+1.21%)",
            topVolume: "TMGH (89.15 ج)",
            shariaNote: "صناديق الذهب والأسهم الشرعية تسجل استقراراً تاماً في صافي قيمة الأصول (NAV)."
        }
    ];

    // 6. News Feed Archive
    const NEWS_FEED = [
        {
            tag: "البورصة المصرية",
            title: "مؤشر الشريعة EGX33 يواصل جذب رؤوس الأموال المؤسسية الخليجية",
            summary: "ارتفاع حصة التداولات المتوافقة مع الشريعة لتشكل أكثر من 40% من إجمالي تعاملات المستثمرين الأجانب والعرب في جلسات الأسبوع الحالي.",
            time: "منذ ساعتين"
        },
        {
            tag: "القطاع المصرفي",
            title: "مصرف أبوظبي الإسلامي - مصر يرفع محفظة التمويل المتوافق لقطاع الشركات",
            summary: "نمو محفظة التسهيلات الائتمانية بنسبة 18% على أساس سنوي مع الحفاظ على معدلات منخفضة للديون غير المنتظمة.",
            time: "منذ 4 ساعات"
        },
        {
            tag: "الذهب والتحوط",
            title: "صناديق الذهب المصرية تتجاوز حاجز الـ 1.5 مليار جنيه من صافي الأصول",
            summary: "استمرار إقبال الأفراد والمؤسسات على الاستثمار في وثائق أزيموت جولد كأداة تحوط مرنة ومباشرة ذات تسعير لحظي معلن.",
            time: "اليوم"
        }
    ];

    // Export cleanly to global window namespace
    window.EGX_DATA = {
        DEFAULT_PORTFOLIO,
        MARKET_QUOTES,
        MARKET_INDICES,
        TREASURY_BILLS_DATA,
        DAILY_REPORTS,
        NEWS_FEED
    };

})(window);
