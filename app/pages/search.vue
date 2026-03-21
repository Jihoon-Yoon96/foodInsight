<template>
  <div class="flex h-screen bg-[#F9FAFB] dark:bg-[#0F172A] font-sans text-gray-900 dark:text-slate-200 transition-colors duration-300">

    <TheSidebar />

    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <header class="h-20 bg-white dark:bg-[#1E293B] border-b border-gray-100 dark:border-slate-700/50 shrink-0 z-10 shadow-sm transition-colors px-6 sm:px-10 flex items-center justify-between">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors hidden lg:block w-32 shrink-0">데이터 탐색</h1>

        <div class="flex-1 w-full lg:max-w-3xl lg:ml-auto">
          <div class="flex flex-col sm:flex-row items-stretch w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700/50 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-500/50 transition-all shadow-inner sm:h-12">
            <input
                v-model="searchForm.productName"
                type="text"
                class="flex-1 min-w-0 bg-transparent py-3 sm:py-2 px-4 outline-none text-sm font-semibold text-gray-900 dark:text-slate-200 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-slate-700/50 placeholder:text-gray-400 dark:placeholder:text-slate-500 placeholder:font-normal"
                placeholder="품목명 (예: 핫도그)"
                @keyup.enter="refreshData"
            />
            <input
                v-model="searchForm.factoryName"
                type="text"
                class="flex-1 min-w-0 bg-transparent py-3 sm:py-2 px-4 outline-none text-sm font-semibold text-gray-900 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 placeholder:font-normal"
                placeholder="제조사명 (예: 풀무원)"
                @keyup.enter="refreshData"
            />
            <button @click="refreshData" class="py-3 sm:py-0 px-5 bg-white dark:bg-[#1E293B] border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-slate-700/50 text-gray-400 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar relative">
        <div class="max-w-7xl mx-auto">

          <div v-if="availableTypes.length > 0" class="mb-6 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm transition-colors">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white transition-colors">제품유형 필터</h3>
              <button @click="clearFilters" v-if="selectedTypes.length > 0" class="text-[11px] font-bold text-gray-400 hover:text-blue-500 transition-colors">필터 초기화</button>
            </div>
            <div class="flex flex-wrap gap-2 sm:gap-3">
              <label v-for="cat in availableTypes" :key="cat" class="cursor-pointer flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors">
                <input
                    type="checkbox"
                    :value="cat"
                    v-model="selectedTypes"
                    @change="refreshData"
                    class="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-500 transition-colors cursor-pointer"
                />
                <span class="text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors select-none">{{ cat }}</span>
              </label>
            </div>
          </div>

          <div class="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <div>
              <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight transition-colors">
                '<span class="text-blue-600 dark:text-blue-400">{{ currentSearchLabel }}</span>' 탐색 결과
                <span v-if="totalItems > 0" class="text-gray-400 dark:text-slate-500 font-light text-base sm:text-lg block sm:inline mt-1 sm:mt-0 transition-colors">({{ totalItems }}건)</span>
              </h2>
            </div>

            <div class="flex w-full sm:w-auto bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-slate-700/50 rounded-xl p-1 shadow-sm transition-colors">
              <button @click="changeSort('recent')" :class="sortOrder === 'recent' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'" class="flex-1 sm:flex-none px-4 py-2 sm:py-1.5 text-xs font-bold rounded-lg transition-all">최신순</button>
              <button @click="changeSort('name')" :class="sortOrder === 'name' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'" class="flex-1 sm:flex-none px-4 py-2 sm:py-1.5 text-xs font-medium rounded-lg transition-all">품목명순</button>
            </div>
          </div>

          <div v-if="pending" class="flex flex-col items-center justify-center py-32 sm:py-40">
            <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 dark:border-blue-500 mb-4"></div>
            <p class="text-blue-600 dark:text-blue-400 font-bold text-sm sm:text-base text-center transition-colors">전국 식품 제조 데이터를 분석하고 있습니다...</p>
          </div>

          <div v-else-if="items && items.length > 0">
            <div class="grid grid-cols-1 gap-4 sm:gap-6">
              <div v-for="(item, index) in items" :key="index" class="bg-white dark:bg-[#1E293B] rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-slate-700/50 p-5 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:border-blue-200 dark:hover:border-blue-500/50 hover:shadow-lg transition-all shadow-sm group gap-4 sm:gap-0">

                <div class="flex gap-4 sm:gap-8 items-start sm:items-center w-full">
                  <div class="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 dark:bg-[#0F172A] rounded-xl sm:rounded-2xl flex items-center justify-center text-blue-300 dark:text-slate-600 dark:border dark:border-slate-800 group-hover:dark:border-slate-600 group-hover:scale-105 sm:group-hover:scale-110 transition-all shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1 sm:mb-2">
                      <span class="text-[11px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 truncate transition-colors">{{ item.BSSH_NM }}</span>
                      <span v-if="item.PRDLST_DCNM" class="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-300 text-[10px] font-bold rounded transition-colors">{{ item.PRDLST_DCNM }}</span>
                    </div>
                    <h3 class="text-lg sm:text-2xl font-black text-gray-900 dark:text-white mb-1 sm:mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors truncate">
                      {{ item.PRDLST_NM }}
                    </h3>
                    <p class="text-xs sm:text-[15px] text-gray-500 dark:text-slate-400 mb-1 sm:mb-2 line-clamp-1 transition-colors">
                      <span class="font-bold text-gray-400 dark:text-slate-500">원재료:</span> {{ item.RAWMTRL_NM }}
                    </p>
                    <p class="text-[10px] sm:text-xs text-gray-400 dark:text-slate-500 font-medium italic break-all transition-colors">
                      신고번호: {{ item.PRDLST_REPORT_NO }}
                    </p>
                  </div>
                </div>

                <div class="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-gray-100 dark:border-slate-700/50 w-full sm:w-auto pt-4 sm:pt-0 sm:pl-8 shrink-0 flex flex-row sm:flex-col justify-between items-center sm:items-end mt-2 sm:mt-0 transition-colors">
                  <div class="mb-0 sm:mb-1">
                    <p class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest hidden sm:block transition-colors">보고일자</p>
                    <p class="text-base sm:text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight transition-colors">{{ formatDate(item.PRMS_DT) }}</p>
                  </div>
                  <button
                      @click="openReportModal(item)"
                      class="mt-0 sm:mt-4 px-5 sm:px-4 py-2 bg-blue-900 dark:bg-blue-600/20 text-white dark:text-blue-400 dark:border dark:border-blue-500/30 text-xs font-bold rounded-lg hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-colors shadow-md dark:shadow-none w-auto sm:w-full"
                  >
                    AI 리포트
                  </button>
                </div>

              </div>
            </div>

            <div class="mt-8 sm:mt-12 flex justify-center items-center gap-2 flex-wrap">
              <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-slate-700/50 text-gray-400 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-600 dark:hover:border-blue-500 disabled:opacity-30 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div class="flex items-center gap-1 px-4 py-2 bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-slate-700/50 rounded-xl shadow-sm text-sm font-bold cursor-pointer hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors" @click="isEditingPage = true">
                <template v-if="!isEditingPage">
                  <span class="text-blue-600 dark:text-blue-400">{{ currentPage }}</span>
                  <span class="text-gray-300 dark:text-slate-600">/</span>
                  <span class="text-gray-500 dark:text-slate-400">{{ Math.max(1, Math.ceil(totalItems / 10)) }}</span>
                </template>
                <template v-else>
                  <input v-model="inputPage" type="number" class="w-12 text-center border-none focus:ring-0 text-blue-600 dark:text-blue-400 bg-transparent p-0" :max="Math.ceil(totalItems / 10)" min="1" @keyup.enter="goToInputPage" @blur="isEditingPage = false" ref="pageInputRef" />
                </template>
              </div>
              <button @click="changePage(currentPage + 1)" :disabled="currentPage >= Math.ceil(totalItems / 10)" class="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-slate-700/50 text-gray-400 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-600 dark:hover:border-blue-500 disabled:opacity-30 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          <div v-else class="text-center py-32 sm:py-40 bg-white dark:bg-[#1E293B] rounded-2xl sm:rounded-3xl border border-dashed border-gray-200 dark:border-slate-700/50 transition-colors">
            <p class="text-gray-400 dark:text-slate-400 font-medium text-sm sm:text-base">검색된 식품 제조 정보가 없습니다.</p>
          </div>
        </div>
      </div>
    </main>

    <ReportModal
        :is-open="isModalOpen"
        :is-loading="isReportLoading"
        :selected-item="selectedItem"
        :report-data="reportData"
        @close="closeReportModal"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted } from 'vue'
import { CATEGORY_OPTIONS } from '~/utils/constants'
import { DUMMY_FOOD_DATA } from '~/utils/dummyData'

const route = useRoute()
const router = useRouter()

const searchForm = reactive({
  productName: route.query.prod || '',
  factoryName: route.query.fact || ''
})

const initialTypes = route.query.types ? route.query.types.split(',') : []
const selectedTypes = ref(initialTypes)

const items = ref([])
const totalItems = ref(0)
const currentPage = ref(Number(route.query.page) || 1)
const sortOrder = ref(route.query.sort || 'recent')
const pending = ref(false)

const isEditingPage = ref(false)
const inputPage = ref(currentPage.value)
const pageInputRef = ref(null)

const isModalOpen = ref(false)
const isReportLoading = ref(false)
const selectedItem = ref(null)
const reportData = ref(null)

// 💡 1. 실제 검색결과(라우터 쿼리 기준)에 존재하는 제품유형만 동적으로 추출
const availableTypes = computed(() => {
  let baseItems = [...DUMMY_FOOD_DATA]

  const prodQuery = route.query.prod || ''
  const factQuery = route.query.fact || ''

  if (prodQuery) {
    baseItems = baseItems.filter(item => item.PRDLST_NM.includes(prodQuery))
  }
  if (factQuery) {
    baseItems = baseItems.filter(item => item.BSSH_NM.includes(factQuery))
  }

  // 중복 제거된 실제 결과 내 카테고리 목록
  const existingTypes = new Set(baseItems.map(item => item.PRDLST_DCNM).filter(Boolean))

  // 기존 상수 배열(CATEGORY_OPTIONS)의 정렬 순서를 유지하며 필터링
  return CATEGORY_OPTIONS.filter(cat => existingTypes.has(cat))
})

const createSearchLabel = (form) => {
  const parts = []
  if (selectedTypes.value.length > 0) parts.push(`유형: ${selectedTypes.value.length}개 선택`)
  if (form.productName) parts.push(`품목: ${form.productName}`)
  if (form.factoryName) parts.push(`제조사: ${form.factoryName}`)
  return parts.join(' + ') || '전체'
}
const currentSearchLabel = computed(() => createSearchLabel(searchForm))

const formatDate = (dateString) => {
  if (!dateString || dateString.length !== 8) return dateString || '-'
  return `${dateString.slice(0, 4)}.${dateString.slice(4, 6)}.${dateString.slice(6, 8)}`
}

const clearFilters = () => {
  selectedTypes.value = []
  refreshData()
}

const applyDummyDataFallback = () => {
  let dummyItems = [...DUMMY_FOOD_DATA];

  if (selectedTypes.value.length > 0) {
    dummyItems = dummyItems.filter(item => selectedTypes.value.includes(item.PRDLST_DCNM));
  }
  if (searchForm.productName) {
    dummyItems = dummyItems.filter(item => item.PRDLST_NM.includes(searchForm.productName));
  }
  if (searchForm.factoryName) {
    dummyItems = dummyItems.filter(item => item.BSSH_NM.includes(searchForm.factoryName));
  }

  if (sortOrder.value === 'name') {
    dummyItems.sort((a, b) => a.PRDLST_NM.localeCompare(b.PRDLST_NM, 'ko'));
  } else {
    dummyItems.sort((a, b) => Number(b.PRMS_DT) - Number(a.PRMS_DT));
  }

  totalItems.value = dummyItems.length;
  const pageSize = 10;
  const startIndex = (currentPage.value - 1) * pageSize;
  items.value = dummyItems.slice(startIndex, startIndex + pageSize);
}

const openReportModal = async (item) => {
  selectedItem.value = item
  isModalOpen.value = true
  isReportLoading.value = true
  reportData.value = null

  try {
    const response = await $fetch('/api/report', {
      query: { prod: item.PRDLST_NM, fact: item.BSSH_NM }
    })
    reportData.value = response
    saveToDashboard(item, response)
  } catch (error) {
    console.error("리포트 생성 실패:", error)
  } finally {
    isReportLoading.value = false
  }
}

const closeReportModal = () => {
  isModalOpen.value = false
  selectedItem.value = null
  reportData.value = null
}

const saveToDashboard = (item, reportResponse) => {
  if (process.server) return
  const saved = JSON.parse(localStorage.getItem('dashboardItems') || '[]')

  const newEntry = {
    reportNo: item.PRDLST_REPORT_NO,
    productName: item.PRDLST_NM,
    factoryName: item.BSSH_NM,
    priceHistory: reportResponse.priceHistory,
    annualSales: reportResponse.annualSales,
    totalSales: reportResponse.totalSales,
    summary: reportResponse.summary,
    savedAt: new Date().toISOString()
  }

  const filtered = saved.filter(x => x.reportNo !== newEntry.reportNo)
  filtered.unshift(newEntry)

  localStorage.setItem('dashboardItems', JSON.stringify(filtered.slice(0, 20)))
}

const saveRecentSearch = (form) => {
  if (!form.productName && !form.factoryName && selectedTypes.value.length === 0) return
  if (process.server) return
  const label = createSearchLabel(form)
  const newEntry = {
    label,
    query: {
      types: selectedTypes.value.join(','),
      prod: form.productName,
      fact: form.factoryName
    }
  }

  let searches = JSON.parse(localStorage.getItem('recentSearches') || '[]')
  searches = searches.filter(t => t.label !== label)
  searches.unshift(newEntry)
  if (searches.length > 10) searches = searches.slice(0, 10)

  localStorage.setItem('recentSearches', JSON.stringify(searches))
}

const fetchFoodData = async () => {
  pending.value = true
  try {
    const response = await $fetch('/api/food', {
      query: {
        types: selectedTypes.value.join(',') || undefined,
        prod: searchForm.productName || undefined,
        fact: searchForm.factoryName || undefined,
        page: currentPage.value,
        sort: sortOrder.value
      }
    })

    if (response.isTimeout || response.error) {
      applyDummyDataFallback();
    } else {
      items.value = response?.items || []
      totalItems.value = response?.total || 0
    }
  } catch (error) {
    applyDummyDataFallback();
  } finally {
    pending.value = false
  }
}

const changeSort = (sort) => {
  if (sortOrder.value === sort) return
  sortOrder.value = sort
  currentPage.value = 1
  pushRouter()
  fetchFoodData()
}

const changePage = (newPage) => {
  currentPage.value = newPage
  pushRouter()
  fetchFoodData()
}

const goToInputPage = () => {
  const maxPage = Math.max(1, Math.ceil(totalItems.value / 10))
  const targetPage = Math.min(Math.max(1, inputPage.value), maxPage)
  isEditingPage.value = false
  changePage(targetPage)
}

const pushRouter = () => {
  router.push({
    query: {
      types: selectedTypes.value.join(',') || undefined,
      prod: searchForm.productName || undefined,
      fact: searchForm.factoryName || undefined,
      sort: sortOrder.value,
      page: currentPage.value
    }
  })
}

const refreshData = () => {
  currentPage.value = 1
  pushRouter()
  fetchFoodData()
}

onMounted(() => {
  fetchFoodData()
})

watch(isEditingPage, (newVal) => {
  if (newVal) {
    inputPage.value = currentPage.value
    nextTick(() => { pageInputRef.value?.focus() })
  }
})

watch(() => route.query, (newQ) => {
  const typesArr = newQ.types ? newQ.types.split(',') : []
  selectedTypes.value = typesArr
  searchForm.productName = newQ.prod || ''
  searchForm.factoryName = newQ.fact || ''
  currentPage.value = Number(newQ.page) || 1
  sortOrder.value = newQ.sort || 'recent'

  fetchFoodData()
}, { deep: true })
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}

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