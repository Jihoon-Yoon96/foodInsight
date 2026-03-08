// server/api/food.get.ts
export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const config = useRuntimeConfig();

    const API_KEY = config.foodApiKey;
    const SERVICE_ID = 'C002';
    const DATA_TYPE = 'json';

    const page = Number(query.page) || 1;
    const pageSize = 10;

    // 1. [우선순위] 품목명 > 제조사명 (원재료 주석처리)
    let primaryKey = '';
    let primaryValue = '';

    if (query.prod) { primaryKey = 'PRDLST_NM'; primaryValue = query.prod as string; }
    else if (query.fact) { primaryKey = 'BSSH_NM'; primaryValue = query.fact as string; }
    // else if (query.raw) { primaryKey = 'RAWMATERIAL_NM'; primaryValue = query.raw as string; }

    let filterPath = '';
    if (primaryKey) {
        filterPath = `/${primaryKey}=${encodeURIComponent(primaryValue)}`;
    }

    // const activeFilters = [query.raw, query.prod, query.fact].filter(Boolean);
    const activeFilters = [query.prod, query.fact].filter(Boolean);
    const isMultiSearch = activeFilters.length > 1;

    // 다중 검색 시 1000개 로드 후 2차 필터링
    const START_IDX = isMultiSearch ? '1' : String((page - 1) * pageSize + 1);
    const END_IDX = isMultiSearch ? '1000' : String(page * pageSize);

    const API_URL = `http://openapi.foodsafetykorea.go.kr/api/${API_KEY}/${SERVICE_ID}/${DATA_TYPE}/${START_IDX}/${END_IDX}${filterPath}`;

    try {
        const response: any = await $fetch(API_URL, { method: 'GET' });
        const serviceData = response[SERVICE_ID];

        if (!serviceData || serviceData.RESULT?.CODE !== 'INFO-000') {
            return { items: [], total: 0 };
        }

        let resultItems = serviceData.row || [];

        const normalize = (str: any) => String(str || '').replace(/\s+/g, '').toLowerCase();

        if (isMultiSearch) {
            // const rawQ = normalize(query.raw);
            const prodQ = normalize(query.prod);
            const factQ = normalize(query.fact);

            // if (rawQ && primaryKey !== 'RAWMATERIAL_NM') {
            //     resultItems = resultItems.filter((item: any) => normalize(item.RAWMATERIAL_NM).includes(rawQ));
            // }
            if (prodQ && primaryKey !== 'PRDLST_NM') {
                resultItems = resultItems.filter((item: any) => normalize(item.PRDLST_NM).includes(prodQ));
            }
            if (factQ && primaryKey !== 'BSSH_NM') {
                resultItems = resultItems.filter((item: any) => normalize(item.BSSH_NM).includes(factQ));
            }
        }

        let totalCount = 0;
        if (isMultiSearch) {
            totalCount = resultItems.length;
            const startIndex = (page - 1) * pageSize;
            resultItems = resultItems.slice(startIndex, startIndex + pageSize);
        } else {
            totalCount = Number(serviceData.total_count) || 0;
        }

        return {
            items: resultItems,
            total: totalCount
        };

    } catch (error: any) {
        console.error('API 호출 에러:', error.message);
        return { items: [], total: 0, error: true };
    }
});