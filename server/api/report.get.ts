// server/api/report.get.ts
import { GoogleGenAI } from '@google/genai';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const config = useRuntimeConfig();

    const prodName = query.prod as string || '알 수 없는 제품';
    const factName = query.fact as string || '알 수 없는 제조사';

    // 1. 가상의 4년치 가격 데이터 생성 (소매가/도매가)
    const randomBase = (prodName.length + factName.length) * 777;
    const baseRetailPrice = (randomBase % 20000) + 3000;

    const currentYear = new Date().getFullYear();
    const priceHistory = [];

    for (let i = 3; i >= 0; i--) {
        const year = currentYear - i;
        const inflation = 1 + ((3 - i) * 0.05);
        const retail = Math.floor((baseRetailPrice * inflation) / 100) * 100;
        const wholesale = Math.floor((retail * 0.65) / 100) * 100;
        priceHistory.push({ year, retail, wholesale });
    }

    // 2. 쿠팡 노출 여부 시뮬레이션 및 링크 생성 (제품명으로만 검색되도록 수정)
    const isCoupangAvailable = randomBase % 5 !== 0;
    // 💡 변경된 부분: 제조사명(factName)을 빼고 제품명(prodName)으로만 검색하게 수정
    const coupangLink = `https://www.coupang.com/np/search?q=${encodeURIComponent(prodName)}`;

    // 3. 고성능 AI 연동 (Gemini 2.5 Flash 또는 1.5 Pro 등 설정하신 모델)
    let summary = '';
    try {
        if (!config.geminiApiKey) throw new Error("Gemini API Key가 없습니다.");

        const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

        const prompt = `
        당신은 대한민국 식품 산업 및 B2B 유통/물가 트렌드를 분석하는 시장 분석가입니다.
        데이터:
        - 제조사명: '${factName}'
        - 품목명: '${prodName}'

        위 데이터를 바탕으로 이 제품의 최근 시장 포지셔닝과 가격 변동 요인을 요약해 주세요.
        
        작성 규칙:
        1. 3~4문장 분량으로 아주 간결하지만 통찰력 있게 작성할 것.
        2. 제품명과 제조사명에서 유추할 수 있는 최근 소비 트렌드(예: 헬시플레저, K-푸드, 간편식, 가성비 등)와 원부자재/물가 상승 방어력을 논리적으로 연결할 것.
        3. 어투는 "~보입니다", "~평가됩니다", "~전망됩니다" 같은 격식 있는 비즈니스 리포트 톤을 유지할 것.
        4. 마크다운 기호 없이 순수 텍스트로만 출력할 것.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // 만약 1.5-pro-latest를 쓰신다면 그에 맞게 유지해주세요
            contents: prompt,
        });

        summary = response.text || '리포트를 생성할 수 없습니다.';

    } catch (error) {
        console.error('Gemini AI 분석 실패:', error);
        summary = `AI 분석 시스템에 일시적으로 연결할 수 없습니다. (내부 데이터: [${factName}]의 [${prodName}]은(는) 최근 원재료비 인상에도 불구하고 도소매 가격 방어율이 우수한 편입니다.)`;
    }

    return {
        productName: prodName,
        factoryName: factName,
        summary,
        priceHistory,
        isCoupangAvailable,
        coupangLink
    };
});