<template>
  <div class="min-h-screen bg-[#F7F9F7] flex flex-col items-center justify-center px-4 font-sans py-20">
    <div class="text-center mb-12">
      <p class="text-lg md:text-xl font-medium text-emerald-700 mb-2 tracking-tight">
        데이터로 연결하는 식품 비즈니스 파트너
      </p>
      <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
        정확하게 찾는<br />
        <span class="text-[#059669]">최적의 제조 파트너</span>
      </h1>
      <p class="mt-4 text-gray-500 text-sm md:text-base">
        식품 공장 및 품목 제조 데이터를 제공합니다.
      </p>
    </div>

    <div class="w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row items-stretch overflow-hidden border border-emerald-100">
      <div class="flex-1 border-b md:border-b-0 md:border-r border-gray-100 p-4 md:p-6 group focus-within:bg-emerald-50 transition">
        <label class="block text-xs font-bold text-emerald-600 mb-1 uppercase tracking-wider">품목명</label>
        <input
            v-model="searchForm.productName"
            type="text"
            placeholder="제품명을 입력하세요 (예: 핫도그)"
            class="w-full bg-transparent text-lg font-semibold focus:outline-none placeholder:text-gray-300"
            @keyup.enter="handleSearch"
        />
      </div>

      <div class="flex-1 p-4 md:p-6 group focus-within:bg-emerald-50 transition">
        <label class="block text-xs font-bold text-emerald-600 mb-1 uppercase tracking-wider">제조사명</label>
        <input
            v-model="searchForm.factoryName"
            type="text"
            placeholder="공장명 입력 (예: 풀무원)"
            class="w-full bg-transparent text-lg font-semibold focus:outline-none placeholder:text-gray-300"
            @keyup.enter="handleSearch"
        />
      </div>

      <button
          @click="handleSearch"
          class="bg-[#059669] hover:bg-[#047857] transition-all w-full md:w-32 py-4 md:py-0 flex items-center justify-center text-white shadow-inner"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>

    <div class="mt-16 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">

      <div class="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-emerald-50 flex flex-col gap-6 hover:border-emerald-200 hover:shadow-md transition duration-300 h-80">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-emerald-50 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h4 class="font-bold text-xl text-gray-800 tracking-tight">최근 검색어</h4>
        </div>

        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <ul v-if="recentSearches.length > 0" class="space-y-3">
            <li v-for="(item, index) in recentSearches.slice(0, 5)" :key="index">
              <button
                  @click="clickRecentSearch(item)"
                  class="w-full text-left bg-gray-50 hover:bg-emerald-50 border border-gray-100 hover:border-emerald-200 px-4 py-3 rounded-xl transition-all group flex items-center justify-between"
              >
                <span class="text-[15px] font-medium text-gray-600 group-hover:text-emerald-700 truncate pr-4">
                  {{ item.label }}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300 group-hover:text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </li>
          </ul>
          <div v-else class="h-full flex flex-col items-center justify-center text-center pb-6">
            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <p class="text-sm font-medium text-gray-400">최근 검색한 정보가 없습니다.</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-emerald-50 flex flex-col gap-6 hover:border-emerald-200 hover:shadow-md transition duration-300 h-80">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-emerald-600 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <h4 class="font-bold text-xl text-gray-800 tracking-tight">대시보드</h4>
        </div>

        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <ul v-if="dashboardItems.length > 0" class="space-y-3">
            <li v-for="(item, index) in dashboardItems.slice(0, 5)" :key="index" class="bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl flex items-center justify-between">
              <div class="min-w-0 pr-4">
                <p class="text-[15px] font-bold text-gray-800 truncate">{{ item.productName }}</p>
                <p class="text-xs font-medium text-gray-500 truncate">{{ item.factoryName }}</p>
              </div>
              <span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-md uppercase shrink-0">저장됨</span>
            </li>
          </ul>
          <div v-else class="h-full flex flex-col items-center justify-center text-center pb-6">
            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <p class="text-sm font-medium text-gray-400">AI가 분석한 정보가 없습니다.</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const router = useRouter()

const searchForm = reactive({
  productName: '',
  factoryName: ''
})

const recentSearches = ref([])
const dashboardItems = ref([])

// 컴포넌트 마운트 시 로컬스토리지에서 데이터 불러오기
onMounted(() => {
  if (process.client) {
    recentSearches.value = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    dashboardItems.value = JSON.parse(localStorage.getItem('dashboardItems') || '[]')
  }
})

// 메인 검색바 검색 실행
const handleSearch = () => {
  if (!searchForm.productName && !searchForm.factoryName) {
    alert('검색어를 입력해 주세요.')
    return
  }
  router.push({
    path: '/search',
    query: {
      prod: searchForm.productName || undefined,
      fact: searchForm.factoryName || undefined
    }
  })
}

// 최근 검색어 클릭 시 검색 실행
const clickRecentSearch = (item) => {
  router.push({
    path: '/search',
    query: {
      prod: item.query.prod || undefined,
      fact: item.query.fact || undefined,
      page: 1
    }
  })
}
</script>

<style scoped>
/* 커스텀 스크롤바 스타일링 (목록이 길어질 경우 예쁘게 처리) */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #E5E7EB;
  border-radius: 10px;
}
</style>