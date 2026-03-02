<template>
  <div class="min-h-screen bg-[#F9FAFB]">
    <header class="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <NuxtLink to="/" class="text-2xl font-black text-emerald-600 tracking-tighter shrink-0">FoodInsight</NuxtLink>
        <div class="flex-1 max-w-2xl mx-12">
          <div class="relative group">
            <input
                v-model="searchQuery"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-6 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all text-sm font-semibold"
                placeholder="원재료, 제품명, 제조사 통합 검색"
                @keyup.enter="refreshData"
            />
            <button @click="refreshData" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
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
              '<span class="text-emerald-600">{{ searchQuery }}</span>' <span class="text-gray-400 font-light">탐색 결과</span>
            </h2>
          </div>
          <div class="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button class="px-4 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-lg shadow-sm">정확도순</button>
            <button class="px-4 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 rounded-lg transition">판매량순</button>
          </div>
        </div>

        <div v-if="pending" class="flex flex-col items-center justify-center py-40">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
          <p class="text-emerald-600 font-bold">전국 식품 제조 데이터를 분석하고 있습니다...</p>
        </div>

        <div v-else-if="items && items.length > 0" class="grid grid-cols-1 gap-6">
          <div v-for="(item, index) in items" :key="index" class="bg-white rounded-3xl border border-gray-100 p-8 flex justify-between items-center hover:border-emerald-200 hover:shadow-lg transition-all shadow-sm group">
            <div class="flex gap-8 items-center">
              <div class="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <span class="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-md uppercase">C002 DATA</span>
                  <span class="text-xs font-bold text-emerald-600">{{ item.BSSH_NM }}</span> </div>
                <h3 class="text-2xl font-black text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                  {{ item.PRDLST_NM }} </h3>
                <p class="text-[15px] text-gray-500 mb-2 line-clamp-1">
                  <span class="font-bold text-gray-400">원재료:</span> {{ item.RAWMATERIAL_NM }}
                </p>
                <p class="text-xs text-gray-400 font-medium italic">신고번호: {{ item.PRDLST_REPORT_NO }}</p>
              </div>
            </div>

            <div class="text-right border-l pl-8 border-gray-100">
              <p class="text-[10px] font-black text-gray-300 mb-1 uppercase tracking-widest">매칭 지수</p>
              <p class="text-3xl font-black text-emerald-600">98%</p>
              <button class="mt-4 px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors shadow-md">리포트</button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-40 bg-white rounded-3xl border border-dashed border-gray-200">
          <p class="text-gray-400 font-medium">검색된 식품 제조 정보가 없습니다.</p>
          <p class="text-sm text-gray-300 mt-2">입력하신 키워드가 원재료명 또는 제품명에 포함되어 있는지 확인해 보세요.</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

// 1. 검색어 상태 관리 (URL 쿼리에서 초기값 가져옴)
const searchQuery = ref(route.query.raw || route.query.prod || route.query.fact || '')
const items = ref([])
const pending = ref(false)

// 2. 데이터 페칭 로직 (서버 API 호출)
const fetchFoodData = async () => {
  if (!searchQuery.value) return

  pending.value = true
  try {
    // 우리가 만든 server/api/food.get.ts 를 호출합니다.
    const response = await $fetch('/api/food', {
      query: {
        raw: searchQuery.value, // 원재료명 위주로 검색 전송
        prod: searchQuery.value,
        fact: searchQuery.value
      }
    })

    // 식품안나라 C002 데이터는 response.items 에 들어있도록 서버에서 정의함
    items.value = response.items || []
  } catch (error) {
    console.error("데이터 로드 실패:", error)
    items.value = []
  } finally {
    pending.value = false
  }
}

// 3. 검색어 입력 후 엔터 시 새로고침 없이 데이터만 갱신
const refreshData = () => {
  router.push({ query: { raw: searchQuery.value } })
  fetchFoodData()
}

// 페이지 로드 시 최초 실행
onMounted(() => {
  fetchFoodData()
})

// URL 쿼리가 바뀔 때(예: 메인에서 검색해서 올 때) 대응
watch(() => route.query.raw, (newVal) => {
  searchQuery.value = newVal
  fetchFoodData()
})
</script>