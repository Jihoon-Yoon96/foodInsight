// server/api/food.get.ts
export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const config = useRuntimeConfig();

    // .env에서 가져온 키
    const API_KEY = config.foodApiKey;
    const SERVICE_ID = '식품(첨가물)품목제조보고(원재료)'; //'C002';
    const DATA_TYPE = 'json';
    const START_IDX = '1';
    const END_IDX = '20'; // 기획안용으로 조금 넉넉히 가져옵니다.

    // 필터 생성 (식품안전나라는 경로 방식: /KEY=VALUE)
    let filter = '';
    if (query.raw) filter += `/RAWMATERIAL_NM=${encodeURIComponent(query.raw as string)}`;
    if (query.prod) filter += `/PRDLST_NM=${encodeURIComponent(query.prod as string)}`;
    if (query.fact) filter += `/BSSH_NM=${encodeURIComponent(query.fact as string)}`;

    console.log("API_KEY", API_KEY)
    // 최종 URL 조립
    const API_URL = `http://openapi.foodsafetykorea.go.kr/api/${API_KEY}/${SERVICE_ID}/${DATA_TYPE}/${START_IDX}/${END_IDX}${filter}`;

    try {
        const response: any = await $fetch(API_URL, { method: 'GET' });

        // 데이터가 없는 경우나 인증 에러 처리
        if (!response[SERVICE_ID] || response[SERVICE_ID].RESULT?.CODE !== 'INFO-000') {
            return {
                items: [],
                message: response[SERVICE_ID]?.RESULT?.MSG || '데이터를 찾을 수 없습니다.'
            };
        }

        return {
            items: response[SERVICE_ID].row, // 실제 데이터 리스트
            total: response[SERVICE_ID].total_count
        };
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'API 연동 중 오류 발생: ' + error.message,
        });
    }
});