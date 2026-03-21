// server/api/food.get.ts
export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const config = useRuntimeConfig();

    const API_KEY = config.foodApiKey;
    const SERVICE_ID = 'C002';
    const DATA_TYPE = 'json';

    const page = Number(query.page) || 1;
    const pageSize = 10;
    const sort = query.sort || 'recent';

    const typeQ = query.type as string;
    const prodQ = query.prod as string;
    const factQ = query.fact as string;

    let primaryKey = '';
    let primaryValue = '';

    if (typeQ) { primaryKey = 'PRDLST_DCNM'; primaryValue = typeQ; }
    else if (prodQ) { primaryKey = 'PRDLST_NM'; primaryValue = prodQ; }
    else if (factQ) { primaryKey = 'BSSH_NM'; primaryValue = factQ; }

    let filterPath = '';
    if (primaryKey) {
        filterPath = `/${primaryKey}=${encodeURIComponent(primaryValue)}`;
    }

    const START_IDX = '1';
    const END_IDX = '1000';

    const API_URL = `http://openapi.foodsafetykorea.go.kr/api/${API_KEY}/${SERVICE_ID}/${DATA_TYPE}/${START_IDX}/${END_IDX}${filterPath}`;

    try {
        // 💡 1. 응답시간 10초(10000ms) 초과 시 강제 종료
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

        const hasAnyFilter = !!(prodQ || factQ || typeQ);

        if (hasAnyFilter) {
            const nProd = normalize(prodQ);
            const nFact = normalize(factQ);
            const nType = normalize(typeQ);

            if (nProd && primaryKey !== 'PRDLST_NM') {
                resultItems = resultItems.filter((item: any) => normalize(item.PRDLST_NM).includes(nProd));
            }
            if (nFact && primaryKey !== 'BSSH_NM') {
                resultItems = resultItems.filter((item: any) => normalize(item.BSSH_NM).includes(nFact));
            }
            if (nType && primaryKey !== 'PRDLST_DCNM') {
                resultItems = resultItems.filter((item: any) => normalize(item.PRDLST_DCNM).includes(nType));
            }
        }

        if (sort === 'name') {
            resultItems.sort((a: any, b: any) => {
                const nameA = a.PRDLST_NM || '';
                const nameB = b.PRDLST_NM || '';
                return nameA.localeCompare(nameB, 'ko');
            });
        } else {
            resultItems.sort((a: any, b: any) => {
                const dateA = Number(String(a.PRMS_DT || '0').replace(/\D/g, ''));
                const dateB = Number(String(b.PRMS_DT || '0').replace(/\D/g, ''));
                return dateB - dateA;
            });
        }

        const totalCount = resultItems.length;
        const startIndex = (page - 1) * pageSize;
        resultItems = resultItems.slice(startIndex, startIndex + pageSize);

        return {
            items: resultItems,
            total: totalCount
        };

    } catch (error: any) {
        console.error('API 호출 에러 (타임아웃 등):', error.message);
        // 💡 타임아웃 또는 에러 발생 시 프론트엔드가 알 수 있게 플래그 반환
        return { items: [], total: 0, error: true, isTimeout: true };
    }
});