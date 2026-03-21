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

    // 💡 변경된 부분: 1순위 검색어를 '품목유형(PRDLST_DCNM)'으로 가장 먼저 확인하도록 변경
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
    console.log(`=====================`)
    console.log(`typeQ: ${typeQ}`)
    console.log(`API_URL: ${API_URL}`)


    try {
        const response: any = await $fetch(API_URL, {
            method: 'GET',
            timeout: 8000 // 응답시간 8초 초과시 종료처리
        });
        const serviceData = response[SERVICE_ID];
        console.log(response)
        console.log(`=====================`)

        if (!serviceData || serviceData.RESULT?.CODE !== 'INFO-000') {
            return { items: [], total: 0 };
        }

        let resultItems = serviceData.row || [];

        const normalize = (str: any) => String(str || '').replace(/\s+/g, '').toLowerCase();

        // 2. 2차 필터링 로직 (Nitro 서버 메모리 단에서 수행)
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

        // 3. 정렬 로직 (Sorting)
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

        // 4. 페이징 처리 (Slice)
        const totalCount = resultItems.length;
        const startIndex = (page - 1) * pageSize;
        resultItems = resultItems.slice(startIndex, startIndex + pageSize);

        return {
            items: resultItems,
            total: totalCount
        };

    } catch (error: any) {
        console.error('API 호출 에러:', error.message);
        return { items: [], total: 0, error: true };
    }
});