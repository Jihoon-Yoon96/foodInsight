// server/api/custom-report.post.ts
import { GoogleGenAI } from '@google/genai';

export default defineEventHandler(async (event) => {
    // POST 요청이므로 readBody로 데이터를 받습니다.
    const body = await readBody(event);
    const config = useRuntimeConfig();

    const prodName = body.prodName || '알 수 없는 제품';
    const factName = body.factName || '알 수 없는 제조사';
    const userPrompt = body.userPrompt || '';

    try {
        if (!config.geminiApiKey) throw new Error("Gemini API Key가 없습니다.");
        const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

        const prompt = `
        당신은 대한민국 식품 산업 및 B2B 유통/물가 트렌드를 분석하는 시장 분석가입니다.
        데이터:
        - 제조사명: '${factName}'
        - 품목명: '${prodName}'

        사용자의 추가 분석 요청:
        "${userPrompt}"

        [작성 규칙]
        1. 3문장 이내로 아주 간결하게, "~보입니다", "~평가됩니다" 등 격식 있는 톤으로 작성하세요.
        2. 마크다운 기호 없이 순수 텍스트로만 출력하세요.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return {
            result: response.text || '분석 결과를 생성할 수 없습니다.'
        };

    } catch (error) {
        console.error('Gemini AI 추가 분석 실패:', error);
        return {
            result: 'AI 분석 시스템에 일시적으로 연결할 수 없습니다. 잠시 후 다시 시도해주세요.'
        };
    }
});