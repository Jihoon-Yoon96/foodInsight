<template>
  <div class="min-h-screen bg-[#F9FAFB]">
    <header class="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <NuxtLink to="/" class="text-2xl font-black text-emerald-600 tracking-tighter shrink-0">FoodInsight</NuxtLink>
        <div class="flex-1 max-w-2xl mx-12">
          <div class="relative group">
            <input
                v-model="q"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-6 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all text-sm"
                placeholder="원재료, 제품명, 제조사 통합 검색"
            />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
        </div>
<!--        <div class="flex items-center gap-4 shrink-0">-->
<!--          <button class="text-sm font-semibold text-gray-500 hover:text-emerald-600 transition">문의하기</button>-->
<!--          <button class="px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-100 transition">로그인</button>-->
<!--        </div>-->
      </div>
    </header>

    <div class="max-w-7xl mx-auto py-10 px-6 flex gap-10">
      <aside class="w-64 shrink-0 hidden lg:block">
        <div class="sticky top-32">
          <h3 class="text-sm font-bold text-gray-400 mb-6 tracking-widest uppercase">Smart Filter</h3>
          <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
            <div v-for="label in ['HACCP 인증', '스마트공장', 'OEM 가능', '소량생산 가능']" :key="label">
              <label class="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                <span class="text-sm font-medium text-gray-600 group-hover:text-emerald-600 transition">{{ label }}</span>
              </label>
            </div>
            <hr class="border-gray-50">
            <button class="w-full py-2 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition">필터 초기화</button>
          </div>
        </div>
      </aside>

      <main class="flex-1">
        <div class="mb-8 flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 leading-none">
              '<span class="text-emerald-600">{{ q }}</span>' <span class="text-gray-400 font-light">탐색 결과</span>
            </h2>
          </div>
          <div class="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button class="px-4 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-lg shadow-sm">정확도순</button>
            <button class="px-4 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 rounded-lg transition">판매량순</button>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6">
          <div v-if="pending" class="text-center py-20 text-emerald-600 font-bold">
            데이터를 분석 중입니다...
          </div>

          <div v-else-if="items.length > 0" class="grid grid-cols-1 gap-6">
            <div v-for="(item, index) in items" :key="index" class="bg-white rounded-3xl border border-gray-100 p-8 flex justify-between items-center hover:border-emerald-200 transition-all shadow-sm">
              <div class="flex gap-8 items-center">
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <span class="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-md">식품제조가공업</span>
                    <span class="text-xs font-bold text-emerald-600">{{ item.BSSH_NM }}</span> </div>
                  <h3 class="text-2xl font-black text-gray-900 mb-2">
                    {{ item.PRDLST_NM }} </h3>
                  <p class="text-[15px] text-gray-500 mb-4 line-clamp-2">
                    원재료: {{ item.RAWMATERIAL_NM }} </p>
                </div>
              </div>

              <div class="text-right">
                <p class="text-[10px] font-black text-gray-300 mb-1">매칭 정확도</p>
                <p class="text-3xl font-black text-emerald-600">98%</p>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-20">
            검색 결과가 없습니다.
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const config = useRuntimeConfig()

// 검색어 상태 (URL 쿼리에서 가져옴)
const searchQuery = ref(route.query.raw || route.query.prod || '')
const items = ref([])
const pending = ref(false)

// API 호출 함수
const fetchFoodData = async () => {
  if (!searchQuery.value) return

  pending.value = true
  try {
    // 식약처 Open API 호출 (CORS 이슈 발생 시 서버 엔진 사용 권장)
    const { data } = await useFetch('https://apis.data.go.kr/1471000/FoodN_Pub_Opn_Info_Service01/getFoodN_Pub_Opn_Info01', {
      query: {
        serviceKey: config.public.foodApiKey,
        pageNo: 1,
        numOfRows: 10,
        type: 'json',
        rawmaterial_nm: searchQuery.value // 원재료명으로 검색
      }
    })

    if (data.value) {
      // API 응답 구조에 따라 데이터 매핑 (식약처 데이터 구조 기준)
      items.value = data.value.body.items || []
    }
  } catch (error) {
    console.error("데이터 로드 실패:", error)
  } finally {
    pending.value = false
  }
}

// 페이지 로드 시 실행
onMounted(() => {
  fetchFoodData()
})
</script>