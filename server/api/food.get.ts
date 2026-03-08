export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const config = useRuntimeConfig();

    const API_KEY = config.foodApiKey;
    const SERVICE_ID = 'C002';
    const DATA_TYPE = 'json';

    const page = Number(query.page) || 1;
    const pageSize = 10;

    // 1. 공공데이터 API 오류 방지를 위해 '가장 기준이 되는 검색어 1개'만 선택
    // 우선순위: 품목명 > 제조사명 > 원재료명
    let primaryKey = '';
    let primaryValue = '';

    if (query.prod) { primaryKey = 'PRDLST_NM'; primaryValue = query.prod as string; }
    else if (query.fact) { primaryKey = 'BSSH_NM'; primaryValue = query.fact as string; }
    else if (query.raw) { primaryKey = 'RAWMATERIAL_NM'; primaryValue = query.raw as string; }

    let filterPath = '';
    if (primaryKey) {
        filterPath = `/${primaryKey}=${encodeURIComponent(primaryValue)}`;
    }

    // 2. 검색 조건이 2개 이상(다중 검색)인지 확인
    const activeFilters = [query.raw, query.prod, query.fact].filter(Boolean);
    const isMultiSearch = activeFilters.length > 1;

    // 핵심 로직: 다중 검색이면 공공데이터 서버에서 일단 1000개를 다 가져온다. (단일 검색이면 원래대로 10개만)
    const START_IDX = isMultiSearch ? '1' : String((page - 1) * pageSize + 1);
    const END_IDX = isMultiSearch ? '1000' : String(page * pageSize);

    const API_URL = `http://openapi.foodsafetykorea.go.kr/api/${API_KEY}/${SERVICE_ID}/${DATA_TYPE}/${START_IDX}/${END_IDX}${filterPath}`;

    try {
        const response: any = await $fetch(API_URL, { method: 'GET' });
        const serviceData = response[SERVICE_ID];

        if (!serviceData || serviceData.RESULT?.CODE !== 'INFO-000') {
            return { items: [], total: 0, message: serviceData?.RESULT?.MSG || '결과 없음' };
        }

        let resultItems = serviceData.row || [];

        // 3. 다중 검색일 경우: 우리 서버(Nitro)에서 나머지 조건으로 2차 필터링 진행
        if (isMultiSearch) {
            if (query.raw && primaryKey !== 'RAWMATERIAL_NM') {
                resultItems = resultItems.filter((item: any) => item.RAWMATERIAL_NM?.includes(query.raw));
            }
            if (query.prod && primaryKey !== 'PRDLST_NM') {
                resultItems = resultItems.filter((item: any) => item.PRDLST_NM?.includes(query.prod));
            }
            if (query.fact && primaryKey !== 'BSSH_NM') {
                resultItems = resultItems.filter((item: any) => item.BSSH_NM?.includes(query.fact));
            }
        }

        // 4. 다중 검색일 경우: 필터링된 결과물 내에서 요청한 페이지 번호만큼 잘라내기(슬라이싱)
        let totalCount = 0;
        if (isMultiSearch) {
            totalCount = resultItems.length; // 필터링이 끝난 진짜 갯수
            const startIndex = (page - 1) * pageSize;
            resultItems = resultItems.slice(startIndex, startIndex + pageSize);
        } else {
            totalCount = Number(serviceData.total_count) || 0; // 단일 검색은 API가 주는 전체 갯수 사용
        }

        return {
            items: resultItems,
            total: totalCount
        };

    } catch (error: any) {
        console.error('API 호출 에러:', error.message);
        return { items: [], total: 0, error: true, message: 'API 통신 실패' };
    }
});