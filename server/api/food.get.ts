// server/api/food.get.ts
export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const config = useRuntimeConfig();

    const API_KEY = config.foodApiKey;
    const SERVICE_ID = 'C002';
    const DATA_TYPE = 'json';

    // 💡 클라이언트에서 필터링과 페이징을 처리하므로, 서버는 조건에 맞는 전체(최대 1000건)만 넘겨줍니다.
    const prodQ = query.prod as string;
    const factQ = query.fact as string;

    let primaryKey = '';
    let primaryValue = '';

    if (prodQ) { primaryKey = 'PRDLST_NM'; primaryValue = prodQ; }
    else if (factQ) { primaryKey = 'BSSH_NM'; primaryValue = factQ; }

    let filterPath = '';
    if (primaryKey) {
        filterPath = `/${primaryKey}=${encodeURIComponent(primaryValue)}`;
    }

    const START_IDX = '1';
    const END_IDX = '1000'; // 최대 1000건 가져오기

    const API_URL = `http://openapi.foodsafetykorea.go.kr/api/${API_KEY}/${SERVICE_ID}/${DATA_TYPE}/${START_IDX}/${END_IDX}${filterPath}`;

    try {
        const response: any = await $fetch(API_URL, {
            method: 'GET',
            timeout: 10000
        });

        const serviceData = response[SERVICE_ID];

        if (!serviceData || serviceData.RESULT?.CODE !== 'INFO-000') {
            return { items: [], total: 0 };
        }

        let resultItems = serviceData.row || [];

        const normalize = (str: any) => String(str || '').replace(/\s+/g, '').toLowerCase();

        // 2차 검색어 로컬 필터링 (품목명 + 제조사명 둘 다 입력했을 경우)
        if (prodQ || factQ) {
            const nProd = normalize(prodQ);
            const nFact = normalize(factQ);

            if (nProd && primaryKey !== 'PRDLST_NM') {
                resultItems = resultItems.filter((item: any) => normalize(item.PRDLST_NM).includes(nProd));
            }
            if (nFact && primaryKey !== 'BSSH_NM') {
                resultItems = resultItems.filter((item: any) => normalize(item.BSSH_NM).includes(nFact));
            }
        }

        return {
            items: resultItems,
            total: resultItems.length
        };

    } catch (error: any) {
        console.error('API 호출 에러 (타임아웃 등):', error.message);
        return { items: [], total: 0, error: true, isTimeout: true };
    }
});