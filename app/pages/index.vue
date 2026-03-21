<template>
  <div class="min-h-screen bg-[#F7F9F7] dark:bg-[#0F172A] flex flex-col items-center justify-center px-4 font-sans py-20 transition-colors duration-300">
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-extrabold text-blue-900 dark:text-white leading-tight transition-colors">
        D-INSIGHT<br />
        <span class="text-[#3873B6] dark:text-blue-400 text-2xl">쉽고 빠르게 찾는 최적의 영업 파트너</span>
      </h1>
      <p class="mt-4 text-gray-500 dark:text-slate-400 text-sm md:text-base transition-colors">
        스마트한 AI 리포트로 한눈에 파악 하세요.
      </p>
    </div>

    <div class="w-full max-w-5xl bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl flex flex-col md:flex-row items-stretch overflow-hidden border border-blue-100 dark:border-slate-700/50 transition-colors">

      <div class="flex-1 border-b md:border-b-0 md:border-r border-gray-100 dark:border-slate-700/50 p-4 md:p-6 group focus-within:bg-blue-50 dark:focus-within:bg-slate-800 transition-colors">
        <label class="block text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-wider">품목명</label>
        <input
            v-model="searchForm.productName"
            type="text"
            placeholder="제품명을 입력하세요 (예: 핫도그)"
            class="w-full bg-transparent text-lg font-semibold text-gray-900 dark:text-slate-200 focus:outline-none placeholder:text-gray-300 dark:placeholder:text-slate-500"
            @keyup.enter="handleSearch"
        />
      </div>

      <div class="flex-1 p-4 md:p-6 group focus-within:bg-blue-50 dark:focus-within:bg-slate-800 transition-colors">
        <label class="block text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-wider">제조사명</label>
        <input
            v-model="searchForm.factoryName"
            type="text"
            placeholder="제조사명 입력 (예: 풀무원)"
            class="w-full bg-transparent text-lg font-semibold text-gray-900 dark:text-slate-200 focus:outline-none placeholder:text-gray-300 dark:placeholder:text-slate-500"
            @keyup.enter="handleSearch"
        />
      </div>

      <button
          @click="handleSearch"
          class="bg-[#3873B6] dark:bg-blue-600 hover:bg-[#2C5C92] dark:hover:bg-blue-700 transition-colors w-full md:w-32 py-4 md:py-0 flex items-center justify-center text-white shadow-inner"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>

    <div class="mt-16 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">

      <div class="relative overflow-hidden rounded-3xl shadow-sm border border-blue-50 dark:border-slate-700/50 flex flex-col justify-center items-center text-center transition-all duration-300 h-[420px] bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-slate-800 dark:to-[#0F172A] group hover:shadow-lg">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-400 opacity-20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

        <div class="relative z-10 p-8 flex flex-col items-center w-full">
          <div class="w-20 h-20 bg-white/20 dark:bg-slate-700/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h3 class="text-3xl font-black text-white mb-3 tracking-tight">경쟁사 분석</h3>
          <p class="text-blue-100 dark:text-slate-300 font-medium mb-8 leading-relaxed text-sm sm:text-base">
            AI가 분석한 제품유형별 시장 동향과<br />경쟁업체 데이터를 한눈에 확인하세요.
          </p>

          <NuxtLink to="/dashboard" class="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl shadow-lg hover:bg-blue-50 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400 hover:scale-105 transition-all duration-300 w-full sm:w-auto">
            대시보드로 이동
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </NuxtLink>
        </div>
      </div>

      <div class="bg-white dark:bg-[#1E293B] p-6 md:p-8 rounded-3xl shadow-sm border border-blue-50 dark:border-slate-700/50 flex flex-col hover:border-blue-200 dark:hover:border-slate-500/50 hover:shadow-md transition-all duration-300 h-[420px]">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-600 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h4 class="font-bold text-xl text-gray-800 dark:text-white tracking-tight transition-colors">저장된 리포트</h4>
          </div>

          <div class="flex bg-gray-50 dark:bg-[#0F172A] border border-gray-100 dark:border-slate-700/50 rounded-lg p-1 transition-colors">
            <button @click="dashboardSortOrder = 'recent'" :class="dashboardSortOrder === 'recent' ? 'bg-white dark:bg-[#1E293B] shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'" class="px-3 py-1 text-[11px] font-bold rounded-md transition-all">등록순</button>
            <button @click="dashboardSortOrder = 'wholesale'" :class="dashboardSortOrder === 'wholesale' ? 'bg-white dark:bg-[#1E293B] shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'" class="px-3 py-1 text-[11px] font-bold rounded-md transition-all">도매가순</button>
            <button @click="dashboardSortOrder = 'retail'" :class="dashboardSortOrder === 'retail' ? 'bg-white dark:bg-[#1E293B] shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'" class="px-3 py-1 text-[11px] font-bold rounded-md transition-all">소매가순</button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <ul v-if="sortedDashboardItems.length > 0" class="space-y-3">
            <li v-for="(item, index) in sortedDashboardItems" :key="index" @click="openDashboardModal(item)" class="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-slate-500/50 hover:shadow-md px-4 py-3 rounded-xl flex items-center justify-between cursor-pointer transition-all group">
              <div class="min-w-0 pr-4 flex-1">
                <p class="text-[15px] font-bold text-gray-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 truncate transition-colors">{{ item.productName }}</p>
                <p class="text-[11px] font-medium text-gray-500 dark:text-slate-400 truncate mt-0.5 transition-colors">{{ item.factoryName }}</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-[10px] text-gray-400 dark:text-slate-500 mb-0.5 transition-colors">최신 도매가 <span class="font-bold text-blue-600 dark:text-blue-400 ml-1">{{ getLatestPrice(item).wholesale.toLocaleString() }}원</span></p>
                <p class="text-[10px] text-gray-400 dark:text-slate-500 transition-colors">최신 소매가 <span class="font-bold text-gray-800 dark:text-white ml-1">{{ getLatestPrice(item).retail.toLocaleString() }}원</span></p>
              </div>
            </li>
          </ul>
          <div v-else class="h-full flex flex-col items-center justify-center text-center pb-6">
            <div class="w-16 h-16 bg-gray-50 dark:bg-[#0F172A] rounded-full flex items-center justify-center mb-3 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-300 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <p class="text-sm font-medium text-gray-400 dark:text-slate-500 transition-colors">AI가 분석한 리포트 정보가 없습니다.</p>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchForm = reactive({
  productName: '',
  factoryName: ''
})

const dashboardItems = ref([])
const dashboardSortOrder = ref('recent')

const isModalOpen = ref(false)
const selectedDashboardItem = ref(null)

onMounted(() => {
  if (process.client) {
    dashboardItems.value = JSON.parse(localStorage.getItem('dashboardItems') || '[]')
  }
})

const handleSearch = () => {
  if (!searchForm.productName && !searchForm.factoryName) {
    alert('검색 조건을 확인해 주세요.')
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

const getLatestPrice = (item) => {
  if (!item.priceHistory || item.priceHistory.length === 0) return { wholesale: 0, retail: 0 }
  return item.priceHistory[item.priceHistory.length - 1]
}

const sortedDashboardItems = computed(() => {
  const items = [...dashboardItems.value]
  if (dashboardSortOrder.value === 'recent') {
    return items.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
  } else if (dashboardSortOrder.value === 'wholesale') {
    return items.sort((a, b) => getLatestPrice(b).wholesale - getLatestPrice(a).wholesale)
  } else if (dashboardSortOrder.value === 'retail') {
    return items.sort((a, b) => getLatestPrice(b).retail - getLatestPrice(a).retail)
  }
  return items
})

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
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #94a3b8;
}

:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #334155;
}
:deep(.dark) .custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #475569;
}
</style>