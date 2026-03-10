<template>
  <div class="min-h-screen bg-[#F7F9F7] flex flex-col items-center justify-center px-4 font-sans py-20">
    <div class="text-center mb-12">
<!--      <p class="text-lg md:text-xl font-medium text-blue-700 mb-2 tracking-tight">-->
<!--&lt;!&ndash;        데이터로 연결하는 식품 비즈니스 파트너&ndash;&gt;-->
<!--        쉽고 빠르게 찾는 최적의 영업 파트너-->
<!--      </p>-->
      <h1 class="text-4xl md:text-5xl font-extrabold text-blue-900 leading-tight">
<!--        쉽고 빠르게 찾는<br />-->
<!--        <span class="text-[#3873B6]">최적의 영업 파트너</span>-->
        D-INSIGHT<br />
        <span class="text-[#3873B6] text-2xl">쉽고 빠르게 찾는 최적의 영업 파트너</span>
      </h1>
      <p class="mt-4 text-gray-500 text-sm md:text-base">
        스마트한 AI 리포트로 한눈에 파악 하세요.
      </p>
    </div>

    <div class="w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row items-stretch overflow-hidden border border-blue-100">
      <div class="flex-1 border-b md:border-b-0 md:border-r border-gray-100 p-4 md:p-6 group focus-within:bg-blue-50 transition">
        <label class="block text-xs font-bold text-blue-600 mb-1 uppercase tracking-wider">품목명</label>
        <input
            v-model="searchForm.productName"
            type="text"
            placeholder="제품명을 입력하세요 (예: 토마토)"
            class="w-full bg-transparent text-lg font-semibold focus:outline-none placeholder:text-gray-300"
            @keyup.enter="handleSearch"
        />
      </div>

      <div class="flex-1 p-4 md:p-6 group focus-within:bg-blue-50 transition">
        <label class="block text-xs font-bold text-blue-600 mb-1 uppercase tracking-wider">제조사명</label>
        <input
            v-model="searchForm.factoryName"
            type="text"
            placeholder="제조사명 입력 (예: 오뚜기)"
            class="w-full bg-transparent text-lg font-semibold focus:outline-none placeholder:text-gray-300"
            @keyup.enter="handleSearch"
        />
      </div>

      <button
          @click="handleSearch"
          class="bg-[#3873B6] hover:bg-[#2C5C92] transition-all w-full md:w-32 py-4 md:py-0 flex items-center justify-center text-white shadow-inner"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>

    <div class="mt-16 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">

      <div class="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-blue-50 flex flex-col hover:border-blue-200 hover:shadow-md transition duration-300 h-[420px]">
        <div class="flex items-center gap-4 mb-6">
          <div class="p-3 bg-blue-50 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h4 class="font-bold text-xl text-gray-800 tracking-tight">최근 검색어</h4>
        </div>

        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <ul v-if="recentSearches.length > 0" class="space-y-3">
            <li v-for="(item, index) in recentSearches.slice(0, 5)" :key="index">
              <button
                  @click="clickRecentSearch(item)"
                  class="w-full text-left bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 px-4 py-3 rounded-xl transition-all group flex items-center justify-between"
              >
                <span class="text-[15px] font-medium text-gray-600 group-hover:text-blue-700 truncate pr-4">
                  {{ item.label }}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300 group-hover:text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
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

      <div class="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-blue-50 flex flex-col hover:border-blue-200 hover:shadow-md transition duration-300 h-[420px]">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-600 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h4 class="font-bold text-xl text-gray-800 tracking-tight">대시보드</h4>
          </div>

          <div class="flex bg-gray-50 border border-gray-100 rounded-lg p-1">
            <button @click="dashboardSortOrder = 'recent'" :class="dashboardSortOrder === 'recent' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'" class="px-3 py-1 text-[11px] font-bold rounded-md transition-all">등록순</button>
            <button @click="dashboardSortOrder = 'wholesale'" :class="dashboardSortOrder === 'wholesale' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'" class="px-3 py-1 text-[11px] font-bold rounded-md transition-all">도매가순</button>
            <button @click="dashboardSortOrder = 'retail'" :class="dashboardSortOrder === 'retail' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'" class="px-3 py-1 text-[11px] font-bold rounded-md transition-all">소매가순</button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <ul v-if="sortedDashboardItems.length > 0" class="space-y-3">
            <li v-for="(item, index) in sortedDashboardItems" :key="index" @click="openDashboardModal(item)" class="bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md px-4 py-3 rounded-xl flex items-center justify-between cursor-pointer transition-all group">
              <div class="min-w-0 pr-4 flex-1">
                <p class="text-[15px] font-bold text-gray-800 group-hover:text-blue-700 truncate transition-colors">{{ item.productName }}</p>
                <p class="text-[11px] font-medium text-gray-500 truncate mt-0.5">{{ item.factoryName }}</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-[10px] text-gray-400 mb-0.5">최신 도매가 <span class="font-bold text-blue-600 ml-1">{{ getLatestPrice(item).wholesale.toLocaleString() }}원</span></p>
                <p class="text-[10px] text-gray-400">최신 소매가 <span class="font-bold text-gray-800 ml-1">{{ getLatestPrice(item).retail.toLocaleString() }}원</span></p>
              </div>
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

    <DashboardModal
        :is-open="isModalOpen"
        :selected-item="selectedDashboardItem"
        @close="closeDashboardModal"
    />
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
const dashboardSortOrder = ref('recent') // recent, wholesale, retail

// 모달 상태
const isModalOpen = ref(false)
const selectedDashboardItem = ref(null)

onMounted(() => {
  if (process.client) {
    recentSearches.value = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    dashboardItems.value = JSON.parse(localStorage.getItem('dashboardItems') || '[]')
  }
})

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

// 아이템의 가장 최신(마지막 배열) 가격 가져오기
const getLatestPrice = (item) => {
  if (!item.priceHistory || item.priceHistory.length === 0) return { wholesale: 0, retail: 0 }
  return item.priceHistory[item.priceHistory.length - 1]
}

// 대시보드 정렬 로직 (Computed)
const sortedDashboardItems = computed(() => {
  const items = [...dashboardItems.value]

  if (dashboardSortOrder.value === 'recent') {
    return items.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
  } else if (dashboardSortOrder.value === 'wholesale') {
    // 도매가 내림차순 (비싼 순)
    return items.sort((a, b) => getLatestPrice(b).wholesale - getLatestPrice(a).wholesale)
  } else if (dashboardSortOrder.value === 'retail') {
    // 소매가 내림차순 (비싼 순)
    return items.sort((a, b) => getLatestPrice(b).retail - getLatestPrice(a).retail)
  }
  return items
})

// 대시보드 모달 열기/닫기
const openDashboardModal = (item) => {
  selectedDashboardItem.value = item
  isModalOpen.value = true
}

const closeDashboardModal = () => {
  isModalOpen.value = false
  setTimeout(() => { selectedDashboardItem.value = null }, 300)
}
</script>

<style scoped>
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