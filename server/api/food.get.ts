// server/api/food.get.ts
export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const config = useRuntimeConfig();

    const API_KEY = config.foodApiKey;
    const SERVICE_ID = 'C002';
    const DATA_TYPE = 'json';

    // --- 페이징 로직 추가 ---
    const page = Number(query.page) || 1;
    const pageSize = 10; // 한 페이지당 10개씩
    const START_IDX = String((page - 1) * pageSize + 1);
    const END_IDX = String(page * pageSize);
    // -----------------------

    let filter = '';
    if (query.raw) filter += `/RAWMATERIAL_NM=${encodeURIComponent(query.raw as string)}`;
    if (query.prod) filter += `/PRDLST_NM=${encodeURIComponent(query.prod as string)}`;
    if (query.fact) filter += `/BSSH_NM=${encodeURIComponent(query.fact as string)}`;

    const API_URL = `http://openapi.foodsafetykorea.go.kr/api/${API_KEY}/${SERVICE_ID}/${DATA_TYPE}/${START_IDX}/${END_IDX}${filter}`;

    try {
        const response: any = await $fetch(API_URL, { method: 'GET' });
        const serviceData = response[SERVICE_ID];

        if (!serviceData || serviceData.RESULT?.CODE !== 'INFO-000') {
            return { items: [], total: 0, message: serviceData?.RESULT?.MSG || '결과 없음' };
        }

        return {
            items: serviceData.row || [],
            total: Number(serviceData.total_count) || 0 // 전체 개수 반환
        };
    } catch (error: any) {
        console.error('API 호출 에러:', error.message);
        return { items: [], total: 0, error: true };
    }
});