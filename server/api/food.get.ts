// server/api/food.get.ts
export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const config = useRuntimeConfig();

    const API_KEY = config.foodApiKey;
    const SERVICE_ID = 'C002';
    const DATA_TYPE = 'json';

    const page = Number(query.page) || 1;
    const pageSize = 10;
    const sort = query.sort || 'recent'; // 정렬 기준 (디폴트: recent)

    // 1. 품목명 > 제조사명 (원재료 주석처리 - RAWMTRL_NM 으로 변경해둠)
    let primaryKey = '';
    let primaryValue = '';

    if (query.prod) { primaryKey = 'PRDLST_NM'; primaryValue = query.prod as string; }
    else if (query.fact) { primaryKey = 'BSSH_NM'; primaryValue = query.fact as string; }
    // else if (query.raw) { primaryKey = 'RAWMTRL_NM'; primaryValue = query.raw as string; }

    let filterPath = '';
    if (primaryKey) {
        filterPath = `/${primaryKey}=${encodeURIComponent(primaryValue)}`;
    }

    // const activeFilters = [query.raw, query.prod, query.fact].filter(Boolean);
    const activeFilters = [query.prod, query.fact].filter(Boolean);
    const isMultiSearch = activeFilters.length > 1;

    // 전체 정렬(Sorting)을 위해 단일/다중 검색 상관없이 1000개를 우선 가져옵니다.
    const START_IDX = '1';
    const END_IDX = '1000';

    const API_URL = `http://openapi.foodsafetykorea.go.kr/api/${API_KEY}/${SERVICE_ID}/${DATA_TYPE}/${START_IDX}/${END_IDX}${filterPath}`;

    try {
        const response: any = await $fetch(API_URL, { method: 'GET' });
        const serviceData = response[SERVICE_ID];

        if (!serviceData || serviceData.RESULT?.CODE !== 'INFO-000') {
            return { items: [], total: 0 };
        }

        let resultItems = serviceData.row || [];

        const normalize = (str: any) => String(str || '').replace(/\s+/g, '').toLowerCase();

        // 2. 2차 필터링 로직
        if (isMultiSearch) {
            // const rawQ = normalize(query.raw);
            const prodQ = normalize(query.prod);
            const factQ = normalize(query.fact);

            // if (rawQ && primaryKey !== 'RAWMTRL_NM') {
            //     resultItems = resultItems.filter((item: any) => normalize(item.RAWMTRL_NM).includes(rawQ));
            // }
            if (prodQ && primaryKey !== 'PRDLST_NM') {
                resultItems = resultItems.filter((item: any) => normalize(item.PRDLST_NM).includes(prodQ));
            }
            if (factQ && primaryKey !== 'BSSH_NM') {
                resultItems = resultItems.filter((item: any) => normalize(item.BSSH_NM).includes(factQ));
            }
        }

        // 3. 정렬 로직 (Sorting)
        if (sort === 'name') {
            // 품목명 가나다순 정렬
            resultItems.sort((a: any, b: any) => {
                const nameA = a.PRDLST_NM || '';
                const nameB = b.PRDLST_NM || '';
                return nameA.localeCompare(nameB, 'ko');
            });
        } else {
            // 최신순 정렬 (PRMS_DT 보고일자 내림차순)
            resultItems.sort((a: any, b: any) => {
                const dateA = Number(String(a.PRMS_DT || '0').replace(/\D/g, ''));
                const dateB = Number(String(b.PRMS_DT || '0').replace(/\D/g, ''));
                return dateB - dateA; // 숫자가 클수록 최신
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