// app/server/api/food.get.ts
export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const config = useRuntimeConfig();

    // 1. .env 및 nuxt.config.ts에서 가져온 인증키
    const API_KEY = config.foodApiKey;
    const SERVICE_ID = 'C002'; // 한글명 대신 영문 서비스 코드를 사용해야 합니다.
    const DATA_TYPE = 'json';
    const START_IDX = '1';
    const END_IDX = '20';

    // 2. 검색 필터 조립 (URL 경로 방식)
    let filter = '';
    if (query.raw) filter += `/RAWMATERIAL_NM=${encodeURIComponent(query.raw as string)}`;
    if (query.prod) filter += `/PRDLST_NM=${encodeURIComponent(query.prod as string)}`;
    if (query.fact) filter += `/BSSH_NM=${encodeURIComponent(query.fact as string)}`;

    // 3. 최종 URL 조립
    const API_URL = `http://openapi.foodsafetykorea.go.kr/api/${API_KEY}/${SERVICE_ID}/${DATA_TYPE}/${START_IDX}/${END_IDX}${filter}`;

    try {
        const response: any = await $fetch(API_URL, { method: 'GET' });

        // 식품안전나라 API 특유의 데이터 계층 구조 접근
        const serviceData = response[SERVICE_ID];

        // 결과 코드가 성공(INFO-000)이 아니거나 데이터가 없는 경우 처리
        if (!serviceData || serviceData.RESULT?.CODE !== 'INFO-000') {
            return {
                items: [],
                total: 0,
                message: serviceData?.RESULT?.MSG || '검색 결과가 없습니다.'
            };
        }

        // 실제 제품 리스트(row) 반환
        return {
            items: serviceData.row || [],
            total: serviceData.total_count
        };
    } catch (error: any) {
        // 서버 통신 자체 실패 시 500 에러 발생 방지 및 에러 객체 반환
        console.error('API 호출 에러:', error.message);
        return {
            items: [],
            total: 0,
            error: true,
            message: 'API 서버와의 통신에 실패했습니다.'
        };
    }
});