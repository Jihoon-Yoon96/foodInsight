// server/api/report.get.ts
import { GoogleGenAI } from '@google/genai';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const config = useRuntimeConfig();

    const prodName = query.prod as string || '알 수 없는 제품';
    const factName = query.fact as string || '알 수 없는 제조사';

    const coupangLink = `https://www.coupang.com/np/search?q=${encodeURIComponent(prodName)}`;
    const isCoupangAvailable = prodName !== '알 수 없는 제품';

    const currentYear = new Date().getFullYear();

    // 💡 다시 추가된 판매량 가설 데이터 생성 로직
    const randomBase = (prodName.length + factName.length) * 1234;
    const baseSales = (randomBase % 50000) + 10000;
    const annualSales = [
        { year: currentYear - 3, sales: Math.floor(baseSales * 0.7) },
        { year: currentYear - 2, sales: Math.floor(baseSales * 0.85) },
        { year: currentYear - 1, sales: Math.floor(baseSales * 1.1) },
        { year: currentYear, sales: Math.floor(baseSales * 1.3) },
    ];
    const totalSales = annualSales.reduce((sum, item) => sum + item.sales, 0);

    let summary = '';
    let priceHistory: any[] = [];

    try {
        if (!config.geminiApiKey) throw new Error("Gemini API Key가 없습니다.");

        const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

        const prompt = `
        당신은 대한민국 식품 산업 및 B2B 유통/물가 트렌드를 분석하는 시장 분석가입니다.
        데이터:
        - 제조사명: '${factName}'
        - 품목명: '${prodName}'

        위 데이터를 바탕으로 이 제품의 최근 시장 포지셔닝과 가격 변동 요인을 요약하고, 해당 식품군의 평균적인 가격을 추론하여 최근 4년간(${currentYear - 3}년~${currentYear}년)의 합리적인 예상 도/소매 가격 추이(원화)를 추정해 주세요.

        [작성 규칙]
        1. 요약(summary)은 3문장 이내로 아주 간결하게, "~보입니다", "~평가됩니다" 등 격식 있는 톤으로 작성하세요.
        2. 가격 데이터는 해당 품목의 현실적인 시세를 반영하고, 연도별 물가 상승률 트렌드를 그럴듯하게 반영하세요.
        3. 반드시 아래의 순수 JSON 형식으로만 응답해 주세요. (마크다운 백틱(\`\`\`)이나 다른 설명 텍스트는 절대 포함하지 마세요)

        {
          "summary": "AI 시장 분석 요약 텍스트",
          "priceHistory": [
            { "year": ${currentYear - 3}, "wholesale": 3000, "retail": 4500 },
            { "year": ${currentYear - 2}, "wholesale": 3200, "retail": 4800 },
            { "year": ${currentYear - 1}, "wholesale": 3500, "retail": 5200 },
            { "year": ${currentYear}, "wholesale": 3800, "retail": 5500 }
          ]
        }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const responseText = response.text || '{}';
        const cleanJsonString = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
        const aiData = JSON.parse(cleanJsonString);

        summary = aiData.summary || '리포트를 생성할 수 없습니다.';
        priceHistory = aiData.priceHistory || [];

    } catch (error) {
        console.error('Gemini AI 분석 및 파싱 실패:', error);
        summary = `AI 분석 시스템에 일시적으로 연결할 수 없거나 응답 포맷 오류가 발생했습니다.`; //(내부 데이터: [${factName}]의 [${prodName}]은(는) 최근 원재료비 인상에도 불구하고 가격 방어율이 우수한 편입니다.)
        priceHistory = [
            { year: currentYear - 3, retail: 5000, wholesale: 3500 },
            { year: currentYear - 2, retail: 5200, wholesale: 3600 },
            { year: currentYear - 1, retail: 5500, wholesale: 3800 },
            { year: currentYear, retail: 5800, wholesale: 4000 }
        ];
    }

    return {
        productName: prodName,
        factoryName: factName,
        summary,
        priceHistory,
        annualSales, // 💡 반환값에 판매량 데이터 추가
        totalSales,
        isCoupangAvailable,
        coupangLink
    };
});