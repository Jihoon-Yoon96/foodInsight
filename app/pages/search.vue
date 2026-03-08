<template>
  <div class="min-h-screen bg-[#F9FAFB]">
    <header class="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <NuxtLink to="/" class="text-2xl font-black text-emerald-600 tracking-tighter shrink-0">FoodInsight</NuxtLink>
        <div class="flex-1 max-w-3xl mx-8">
          <div class="flex items-stretch w-full bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 transition-all shadow-inner h-12">
            <input
                v-model="searchForm.productName"
                type="text"
                class="flex-1 bg-transparent py-2 px-4 outline-none text-sm font-semibold border-r border-gray-200 placeholder:text-gray-400 placeholder:font-normal"
                placeholder="품목명 (예: 핫도그)"
                @keyup.enter="refreshData"
            />
            <input
                v-model="searchForm.factoryName"
                type="text"
                class="flex-1 bg-transparent py-2 px-4 outline-none text-sm font-semibold placeholder:text-gray-400 placeholder:font-normal"
                placeholder="제조사명 (예: 풀무원)"
                @keyup.enter="refreshData"
            />
            <button @click="refreshData" class="px-5 bg-white border-l border-gray-200 text-gray-400 hover:text-emerald-600 transition-colors flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto py-10 px-6 flex gap-10">

      <aside class="w-64 shrink-0 hidden lg:block">
        <div class="sticky top-32">
          <h3 class="text-sm font-bold text-gray-400 mb-4 tracking-widest uppercase flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            최근 검색어
          </h3>
          <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <ul v-if="recentSearches.length > 0" class="space-y-3">
              <li v-for="(item, index) in recentSearches" :key="index" class="flex items-center justify-between group">
                <span
                    @click="clickRecentSearch(item)"
                    class="text-[13px] font-medium text-gray-600 cursor-pointer hover:text-emerald-600 line-clamp-2 leading-tight transition-colors w-full break-all pr-2"
                    :title="item.label"
                >
                  {{ item.label }}
                </span>
                <button @click.stop="removeRecentSearch(index)" class="text-gray-300 hover:text-red-500 transition-colors shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </li>
            </ul>
            <div v-else class="text-center text-sm text-gray-400 py-4">
              최근 검색 기록이 없습니다.
            </div>

            <div v-if="recentSearches.length > 0" class="mt-4 pt-4 border-t border-gray-50">
              <button @click="clearRecentSearches" class="w-full py-2 text-xs font-bold text-gray-400 bg-gray-50 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition">
                기록 전체 삭제
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main class="flex-1">
        <div class="mb-8 flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 leading-none">
              '<span class="text-emerald-600">{{ currentSearchLabel }}</span>' 탐색 결과
              <span v-if="totalItems > 0" class="text-gray-400 font-light text-lg">({{ totalItems }}건)</span>
            </h2>
          </div>

          <div class="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button
                @click="changeSort('recent')"
                :class="sortOrder === 'recent' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'"
                class="px-4 py-1.5 text-xs font-bold rounded-lg transition-all"
            >
              최신순
            </button>
            <button
                @click="changeSort('name')"
                :class="sortOrder === 'name' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'"
                class="px-4 py-1.5 text-xs font-medium rounded-lg transition-all"
            >
              품목명순
            </button>
          </div>
        </div>

        <div v-if="pending" class="flex flex-col items-center justify-center py-40">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
          <p class="text-emerald-600 font-bold">전국 식품 제조 데이터를 분석하고 있습니다...</p>
        </div>

        <div v-else-if="items && items.length > 0">
          <div class="grid grid-cols-1 gap-6">
            <div v-for="(item, index) in items" :key="index" class="bg-white rounded-3xl border border-gray-100 p-8 flex justify-between items-center hover:border-emerald-200 hover:shadow-lg transition-all shadow-sm group">
              <div class="flex gap-8 items-center">
                <div class="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-xs font-bold text-emerald-600">{{ item.BSSH_NM }}</span>
                  </div>
                  <h3 class="text-2xl font-black text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {{ item.PRDLST_NM }}
                  </h3>
                  <p class="text-[15px] text-gray-500 mb-2 line-clamp-1">
                    <span class="font-bold text-gray-400">원재료:</span> {{ item.RAWMTRL_NM }}
                  </p>
                  <p class="text-xs text-gray-400 font-medium italic">
                    신고번호: {{ item.PRDLST_REPORT_NO }}
                  </p>
                </div>
              </div>

              <div class="text-right border-l pl-8 border-gray-100 shrink-0">
                <p class="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-widest">보고일자</p>
                <p class="text-2xl font-black text-emerald-600 tracking-tight">{{ formatDate(item.PRMS_DT) }}</p>
                <button class="mt-4 px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors shadow-md w-full">리포트</button>
              </div>
            </div>
          </div>

          <div class="mt-12 flex justify-center items-center gap-2">
            <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-emerald-600 hover:border-emerald-600 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-gray-200 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>

            <div
                class="flex items-center gap-1 px-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm text-sm font-bold cursor-pointer hover:border-emerald-300 transition-colors"
                @click="isEditingPage = true"
            >
              <template v-if="!isEditingPage">
                <span class="text-emerald-600">{{ currentPage }}</span>
                <span class="text-gray-300">/</span>
                <span class="text-gray-500">{{ Math.max(1, Math.ceil(totalItems / 10)) }}</span>
              </template>
              <template v-else>
                <input
                    v-model="inputPage"
                    type="number"
                    class="w-12 text-center border-none focus:ring-0 text-emerald-600 bg-transparent p-0"
                    :max="Math.ceil(totalItems / 10)"
                    min="1"
                    @keyup.enter="goToInputPage"
                    @blur="isEditingPage = false"
                    ref="pageInputRef"
                />
              </template>
            </div>

            <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage >= Math.ceil(totalItems / 10)"
                class="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-emerald-600 hover:border-emerald-600 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-gray-200 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <div v-else class="text-center py-40 bg-white rounded-3xl border border-dashed border-gray-200">
          <p class="text-gray-400 font-medium">검색된 식품 제조 정보가 없습니다.</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

// 1. 상태 관리 (정렬 기준 'sortOrder' 추가)
const searchForm = reactive({
  // rawMaterial: route.query.raw || '',
  productName: route.query.prod || '',
  factoryName: route.query.fact || ''
})

const items = ref([])
const totalItems = ref(0)
const currentPage = ref(Number(route.query.page) || 1)
const sortOrder = ref(route.query.sort || 'recent') // 'recent' or 'name'
const pending = ref(false)

const recentSearches = ref([])
const isEditingPage = ref(false)
const inputPage = ref(currentPage.value)
const pageInputRef = ref(null)

const createSearchLabel = (form) => {
  const parts = []
  // if (form.rawMaterial) parts.push(`원재료: ${form.rawMaterial}`)
  if (form.productName) parts.push(`품목: ${form.productName}`)
  if (form.factoryName) parts.push(`제조사: ${form.factoryName}`)
  return parts.join(' + ') || '전체'
}

const currentSearchLabel = computed(() => createSearchLabel(searchForm))

// 날짜 포맷 함수 (YYYYMMDD -> YYYY.MM.DD)
const formatDate = (dateString) => {
  if (!dateString || dateString.length !== 8) return dateString || '-'
  return `${dateString.slice(0, 4)}.${dateString.slice(4, 6)}.${dateString.slice(6, 8)}`
}

// --- [최근 검색어 기능] ---
const loadRecentSearches = () => {
  if (process.client) {
    const saved = localStorage.getItem('recentSearches')
    if (saved) recentSearches.value = JSON.parse(saved)
  }
}

const saveRecentSearch = (form) => {
  if (!form.productName && !form.factoryName) return
  if (process.server) return

  const label = createSearchLabel(form)
  const newEntry = {
    label,
    query: {
      prod: form.productName,
      fact: form.factoryName
    }
  }

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
  searchForm.productName = item.query.prod || ''
  searchForm.factoryName = item.query.fact || ''
  refreshData()
}

// --- [데이터 페칭 및 정렬 기능] ---
const fetchFoodData = async () => {
  if (!searchForm.productName && !searchForm.factoryName) return

  pending.value = true
  try {
    const response = await $fetch('/api/food', {
      query: {
        // raw: searchForm.rawMaterial || undefined,
        prod: searchForm.productName || undefined,
        fact: searchForm.factoryName || undefined,
        page: currentPage.value,
        sort: sortOrder.value // 서버로 정렬 상태 전송
      }
    })

    items.value = response?.items || []
    totalItems.value = response?.total || 0
    saveRecentSearch(searchForm)

    if (process.client) window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) {
    items.value = []
  } finally {
    pending.value = false
  }
}

// 정렬 기준이 바뀔 때 (1페이지로 강제 이동)
const changeSort = (sort) => {
  if (sortOrder.value === sort) return
  sortOrder.value = sort
  currentPage.value = 1 // 정렬을 바꾸면 무조건 1페이지

  router.push({
    query: {
      prod: searchForm.productName || undefined,
      fact: searchForm.factoryName || undefined,
      sort: sortOrder.value,
      page: 1
    }
  })
  fetchFoodData()
}

const changePage = (newPage) => {
  currentPage.value = newPage
  router.push({
    query: {
      prod: searchForm.productName || undefined,
      fact: searchForm.factoryName || undefined,
      sort: sortOrder.value, // 기존 정렬 기준 유지
      page: newPage
    }
  })
  fetchFoodData()
}

const goToInputPage = () => {
  const maxPage = Math.max(1, Math.ceil(totalItems.value / 10))
  const targetPage = Math.min(Math.max(1, inputPage.value), maxPage)
  isEditingPage.value = false
  changePage(targetPage)
}

const refreshData = () => {
  if (!searchForm.productName && !searchForm.factoryName) return
  currentPage.value = 1
  router.push({
    query: {
      prod: searchForm.productName || undefined,
      fact: searchForm.factoryName || undefined,
      sort: sortOrder.value, // 검색 버튼 눌러도 정렬 유지
      page: 1
    }
  })
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
  searchForm.productName = newQ.prod || ''
  searchForm.factoryName = newQ.fact || ''
  currentPage.value = Number(newQ.page) || 1
  sortOrder.value = newQ.sort || 'recent'

  if (items.value.length === 0) fetchFoodData()
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