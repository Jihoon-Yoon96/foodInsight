<template>
  <div class="min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A]">
    <header class="bg-white dark:bg-[#1E293B]border-b dark:border-slate-700/50 sticky top-0 z-30 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:h-20 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
        <NuxtLink to="/" class="text-2xl font-black text-blue-600 tracking-tighter shrink-0 w-full sm:w-auto text-center sm:text-left">
          D-INSIGHT
        </NuxtLink>
        <div class="flex-1 w-full sm:max-w-3xl sm:mx-8">
          <div class="flex flex-col sm:flex-row items-stretch w-full bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all shadow-inner sm:h-12">

            <select
                v-model="searchForm.type"
                class="bg-transparent py-3 sm:py-2 px-3 outline-none text-sm font-semibold border-b sm:border-b-0 sm:border-r border-gray-200 text-gray-700 cursor-pointer w-full sm:w-36 shrink-0"
                @change="refreshData"
            >
<!--              <option value="유제품">유제품</option>-->
              <option value="축산품">축산품</option>
              <option value="가공유">가공유</option>
              <option value="유산균음료">유산균음료</option>
              <option value="치즈">치즈</option>
              <option value="유크림">유크림</option>
              <option value="아이스크림믹스">아이스크림믹스</option>
              <option value="커피">커피</option>
              <option value="혼합음료">혼합음료</option>
              <option value="당류가공품">당류가공품</option>
              <option value="기타가공품">기타가공품</option>
            </select>

            <input
                v-model="searchForm.productName"
                type="text"
                class="flex-1 min-w-0 bg-transparent py-3 sm:py-2 px-4 outline-none text-sm font-semibold border-b sm:border-b-0 sm:border-r border-gray-200 placeholder:text-gray-400 placeholder:font-normal"
                placeholder="품목명 (예: 핫도그)"
                @keyup.enter="refreshData"
            />
            <input
                v-model="searchForm.factoryName"
                type="text"
                class="flex-1 min-w-0 bg-transparent py-3 sm:py-2 px-4 outline-none text-sm font-semibold placeholder:text-gray-400 placeholder:font-normal"
                placeholder="제조사명 (예: 풀무원)"
                @keyup.enter="refreshData"
            />
            <button @click="refreshData" class="py-3 sm:py-0 px-5 bg-white dark:bg-[#1E293B]border-t sm:border-t-0 sm:border-l border-gray-200 text-gray-400 hover:text-blue-600 transition-colors flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6 flex flex-col lg:flex-row gap-6 sm:gap-10">
      <aside class="w-full lg:w-64 shrink-0 hidden lg:block">
        <div class="sticky top-32">
          <h3 class="text-sm font-bold text-gray-400 mb-4 tracking-widest uppercase flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            최근 검색어
          </h3>
          <div class="bg-white dark:bg-[#1E293B]rounded-2xl p-6 border dark:border-slate-700/50 shadow-sm">
            <ul v-if="recentSearches.length > 0" class="space-y-3">
              <li v-for="(item, index) in recentSearches" :key="index" class="flex items-center justify-between group">
                <span @click="clickRecentSearch(item)" class="text-[13px] font-medium text-gray-600 cursor-pointer hover:text-blue-600 line-clamp-2 leading-tight transition-colors w-full break-all pr-2" :title="item.label">{{ item.label }}</span>
                <button @click.stop="removeRecentSearch(index)" class="text-gray-300 hover:text-red-500 transition-colors shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </li>
            </ul>
            <div v-else class="text-center text-sm text-gray-400 py-4">최근 검색 기록이 없습니다.</div>
            <div v-if="recentSearches.length > 0" class="mt-4 pt-4 border-t border-gray-50">
              <button @click="clearRecentSearches" class="w-full py-2 text-xs font-bold text-gray-400 bg-gray-50 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition">기록 전체 삭제</button>
            </div>
          </div>
        </div>
      </aside>

      <main class="flex-1 min-w-0">
        <div class="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <div>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-200 leading-tight">
              '<span class="text-blue-600">{{ currentSearchLabel }}</span>' 탐색 결과
              <span v-if="totalItems > 0" class="text-gray-400 font-light text-base sm:text-lg block sm:inline mt-1 sm:mt-0">({{ totalItems }}건)</span>
            </h2>
          </div>

          <div class="flex w-full sm:w-auto bg-white dark:bg-[#1E293B]border border-gray-200 rounded-xl p-1 shadow-sm">
            <button @click="changeSort('recent')" :class="sortOrder === 'recent' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'" class="flex-1 sm:flex-none px-4 py-2 sm:py-1.5 text-xs font-bold rounded-lg transition-all">최신순</button>
            <button @click="changeSort('name')" :class="sortOrder === 'name' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'" class="flex-1 sm:flex-none px-4 py-2 sm:py-1.5 text-xs font-medium rounded-lg transition-all">품목명순</button>
          </div>
        </div>

        <div v-if="pending" class="flex flex-col items-center justify-center py-32 sm:py-40">
          <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mb-4"></div>
          <p class="text-blue-600 font-bold text-sm sm:text-base text-center">전국 식품 제조 데이터를 분석하고 있습니다...</p>
        </div>

        <div v-else-if="items && items.length > 0">
          <div class="grid grid-cols-1 gap-4 sm:gap-6">
            <div v-for="(item, index) in items" :key="index" class="bg-white dark:bg-[#1E293B]rounded-2xl sm:rounded-3xl border dark:border-slate-700/50 p-5 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:border-blue-200 hover:shadow-lg transition-all shadow-sm group gap-4 sm:gap-0">

              <div class="flex gap-4 sm:gap-8 items-start sm:items-center w-full">
                <div class="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-blue-300 group-hover:scale-105 sm:group-hover:scale-110 transition-transform shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1 sm:mb-2">
                    <span class="text-[11px] sm:text-xs font-bold text-blue-600 truncate">{{ item.BSSH_NM }}</span>
                    <span v-if="item.PRDLST_DCNM" class="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded">{{ item.PRDLST_DCNM }}</span>
                  </div>
                  <h3 class="text-lg sm:text-2xl font-black text-gray-900 dark:text-slate-200 mb-1 sm:mb-2 group-hover:text-blue-700 transition-colors truncate">
                    {{ item.PRDLST_NM }}
                  </h3>
                  <p class="text-xs sm:text-[15px] text-gray-500 mb-1 sm:mb-2 line-clamp-1">
                    <span class="font-bold text-gray-400">원재료:</span> {{ item.RAWMTRL_NM }}
                  </p>
                  <p class="text-[10px] sm:text-xs text-gray-400 font-medium italic break-all">
                    신고번호: {{ item.PRDLST_REPORT_NO }}
                  </p>
                </div>
              </div>

              <div class="text-left sm:text-right border-t sm:border-t-0 sm:border-l dark:border-slate-700/50 w-full sm:w-auto pt-4 sm:pt-0 sm:pl-8 shrink-0 flex flex-row sm:flex-col justify-between items-center sm:items-end mt-2 sm:mt-0">
                <div class="mb-0 sm:mb-1">
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:block">보고일자</p>
                  <p class="text-base sm:text-2xl font-black text-blue-600 tracking-tight">{{ formatDate(item.PRMS_DT) }}</p>
                </div>
                <button
                    @click="openReportModal(item)"
                    class="mt-0 sm:mt-4 px-5 sm:px-4 py-2 bg-blue-900 text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-md w-auto sm:w-full"
                >
                  AI 리포트
                </button>
              </div>

            </div>
          </div>

          <div class="mt-8 sm:mt-12 flex justify-center items-center gap-2 flex-wrap">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#1E293B]border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-30 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div class="flex items-center gap-1 px-4 py-2 bg-white dark:bg-[#1E293B]border dark:border-slate-700/50 rounded-xl shadow-sm text-sm font-bold cursor-pointer hover:border-blue-300 transition-colors" @click="isEditingPage = true">
              <template v-if="!isEditingPage">
                <span class="text-blue-600">{{ currentPage }}</span>
                <span class="text-gray-300">/</span>
                <span class="text-gray-500">{{ Math.max(1, Math.ceil(totalItems / 10)) }}</span>
              </template>
              <template v-else>
                <input v-model="inputPage" type="number" class="w-12 text-center border-none focus:ring-0 text-blue-600 bg-transparent p-0" :max="Math.ceil(totalItems / 10)" min="1" @keyup.enter="goToInputPage" @blur="isEditingPage = false" ref="pageInputRef" />
              </template>
            </div>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage >= Math.ceil(totalItems / 10)" class="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#1E293B]border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-30 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <div v-else class="text-center py-32 sm:py-40 bg-white dark:bg-[#1E293B]rounded-2xl sm:rounded-3xl border border-dashed border-gray-200">
          <p class="text-gray-400 font-medium text-sm sm:text-base">검색된 식품 제조 정보가 없습니다.</p>
        </div>
      </main>
    </div>

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
// 💡 만들어둔 더미 데이터 임포트
import { DUMMY_FOOD_DATA } from '~/utils/dummyData'

const route = useRoute()
const router = useRouter()

const searchForm = reactive({
  // 💡 기본값을 목록에 있는 '가공유'로 수정
  type: route.query.type || '가공유',
  productName: route.query.prod || '',
  factoryName: route.query.fact || ''
})

const items = ref([])
const totalItems = ref(0)
const currentPage = ref(Number(route.query.page) || 1)
const sortOrder = ref(route.query.sort || 'recent')
const pending = ref(false)

const recentSearches = ref([])
const isEditingPage = ref(false)
const inputPage = ref(currentPage.value)
const pageInputRef = ref(null)

const isModalOpen = ref(false)
const isReportLoading = ref(false)
const selectedItem = ref(null)
const reportData = ref(null)

const createSearchLabel = (form) => {
  const parts = []
  if (form.type) parts.push(`유형: ${form.type}`)
  if (form.productName) parts.push(`품목: ${form.productName}`)
  if (form.factoryName) parts.push(`제조사: ${form.factoryName}`)
  return parts.join(' + ') || '전체'
}
const currentSearchLabel = computed(() => createSearchLabel(searchForm))

const formatDate = (dateString) => {
  if (!dateString || dateString.length !== 8) return dateString || '-'
  return `${dateString.slice(0, 4)}.${dateString.slice(4, 6)}.${dateString.slice(6, 8)}`
}

// ==========================================
// 💡 더미 데이터 호출 로직 교체
// ==========================================
const applyDummyDataFallback = () => {
  const targetType = searchForm.type || '가공유';

  // utils/dummyData.js 에서 가져온 전체 1000개 데이터 중 선택된 카테고리(100개)만 필터링
  let dummyItems = DUMMY_FOOD_DATA.filter(item => item.PRDLST_DCNM === targetType);

  // 더미 데이터 안에서 2차 검색(품목명, 제조사명) 적용
  if (searchForm.productName) {
    dummyItems = dummyItems.filter(item => item.PRDLST_NM.includes(searchForm.productName));
  }
  if (searchForm.factoryName) {
    dummyItems = dummyItems.filter(item => item.BSSH_NM.includes(searchForm.factoryName));
  }

  // 정렬 처리
  if (sortOrder.value === 'name') {
    dummyItems.sort((a, b) => a.PRDLST_NM.localeCompare(b.PRDLST_NM, 'ko'));
  } else {
    dummyItems.sort((a, b) => Number(b.PRMS_DT) - Number(a.PRMS_DT));
  }

  // 페이징 처리
  totalItems.value = dummyItems.length;
  const pageSize = 10;
  const startIndex = (currentPage.value - 1) * pageSize;
  items.value = dummyItems.slice(startIndex, startIndex + pageSize);
}
// ==========================================

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

const loadRecentSearches = () => {
  if (process.client) {
    const saved = localStorage.getItem('recentSearches')
    if (saved) recentSearches.value = JSON.parse(saved)
  }
}

const saveRecentSearch = (form) => {
  if (!form.type && !form.productName && !form.factoryName) return
  if (process.server) return
  const label = createSearchLabel(form)
  const newEntry = { label, query: { type: form.type, prod: form.productName, fact: form.factoryName } }
  let searches = [...recentSearches.value]
  searches = searches.filter(t => t.label !== label)
  searches.unshift(newEntry)
  if (searches.length > 10) searches = searches.slice(0, 10)
  recentSearches.value = searches
  localStorage.setItem('recentSearches', JSON.stringify(searches))
}

const removeRecentSearch = (index) => {
  recentSearches.value.splice(index, 1)
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
}

const clearRecentSearches = () => {
  recentSearches.value = []
  localStorage.removeItem('recentSearches')
}

const clickRecentSearch = (item) => {
  searchForm.type = item.query.type || '가공유'
  searchForm.productName = item.query.prod || ''
  searchForm.factoryName = item.query.fact || ''
  refreshData()
}

const fetchFoodData = async () => {
  if (!searchForm.type && !searchForm.productName && !searchForm.factoryName) return
  pending.value = true
  try {
    const response = await $fetch('/api/food', {
      query: {
        type: searchForm.type || undefined,
        prod: searchForm.productName || undefined,
        fact: searchForm.factoryName || undefined,
        page: currentPage.value,
        sort: sortOrder.value
      }
    })

    if (response.isTimeout || response.error) {
      console.warn("==================================================");
      console.warn("🚨 공공데이터 API 응답시간(10초) 초과 🚨");
      console.warn(`선택된 유형('${searchForm.type || '가공유'}')의 더미 데이터를 표기합니다.`);
      console.warn("==================================================");

      applyDummyDataFallback();
    } else {
      items.value = response?.items || []
      totalItems.value = response?.total || 0
    }

    saveRecentSearch(searchForm)
    if (process.client) window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) {
    console.warn("네트워크 또는 서버 에러 발생: 더미 데이터를 표기합니다.");
    applyDummyDataFallback();
  } finally {
    pending.value = false
  }
}

const changeSort = (sort) => {
  if (sortOrder.value === sort) return
  sortOrder.value = sort
  currentPage.value = 1
  router.push({ query: { type: searchForm.type || undefined, prod: searchForm.productName || undefined, fact: searchForm.factoryName || undefined, sort: sortOrder.value, page: 1 } })
  fetchFoodData()
}

const changePage = (newPage) => {
  currentPage.value = newPage
  router.push({ query: { type: searchForm.type || undefined, prod: searchForm.productName || undefined, fact: searchForm.factoryName || undefined, sort: sortOrder.value, page: newPage } })
  fetchFoodData()
}

const goToInputPage = () => {
  const maxPage = Math.max(1, Math.ceil(totalItems.value / 10))
  const targetPage = Math.min(Math.max(1, inputPage.value), maxPage)
  isEditingPage.value = false
  changePage(targetPage)
}

const refreshData = () => {
  if (!searchForm.type && !searchForm.productName && !searchForm.factoryName) return
  currentPage.value = 1
  router.push({ query: { type: searchForm.type || undefined, prod: searchForm.productName || undefined, fact: searchForm.factoryName || undefined, sort: sortOrder.value, page: 1 } })
  fetchFoodData()
}

onMounted(() => {
  loadRecentSearches()
  fetchFoodData()
})

watch(isEditingPage, (newVal) => {
  if (newVal) {
    inputPage.value = currentPage.value
    nextTick(() => { pageInputRef.value?.focus() })
  }
})

watch(() => route.query, (newQ) => {
  searchForm.type = newQ.type || '가공유'
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
</style>