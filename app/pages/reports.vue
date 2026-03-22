<template>
  <div class="flex h-screen bg-[#F9FAFB] dark:bg-[#0F172A] font-sans text-gray-900 dark:text-slate-200 transition-colors duration-300">

    <TheSidebar />

    <main class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      <header class="h-20 bg-white dark:bg-[#1E293B] border-b border-gray-100 dark:border-slate-700/50 flex items-center px-6 sm:px-10 shrink-0 z-10 transition-colors">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">저장된 리포트</h1>
      </header>

      <div class="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar">
        <div class="max-w-7xl mx-auto h-full flex flex-col">

          <div class="bg-white dark:bg-[#1E293B] p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex flex-col flex-1 transition-all duration-300">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
              <div class="flex items-center gap-4">
                <div class="p-3 bg-blue-600 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                </div>
                <div>
                  <h4 class="font-bold text-xl text-gray-800 dark:text-white tracking-tight transition-colors">리포트 보관함</h4>
                  <p class="text-sm text-gray-500 dark:text-slate-400 mt-1">AI가 분석한 결과를 다시 확인할 수 있습니다.</p>
                </div>
              </div>

              <div class="flex bg-gray-50 dark:bg-[#0F172A] border border-gray-100 dark:border-slate-700/50 rounded-lg p-1 transition-colors">
                <button @click="dashboardSortOrder = 'recent'" :class="dashboardSortOrder === 'recent' ? 'bg-white dark:bg-[#1E293B] shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'" class="px-4 py-1.5 text-xs font-bold rounded-md transition-all">등록순</button>
                <button @click="dashboardSortOrder = 'wholesale'" :class="dashboardSortOrder === 'wholesale' ? 'bg-white dark:bg-[#1E293B] shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'" class="px-4 py-1.5 text-xs font-bold rounded-md transition-all">도매가순</button>
                <button @click="dashboardSortOrder = 'retail'" :class="dashboardSortOrder === 'retail' ? 'bg-white dark:bg-[#1E293B] shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'" class="px-4 py-1.5 text-xs font-bold rounded-md transition-all">소매가순</button>
              </div>
            </div>

            <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <ul v-if="sortedDashboardItems.length > 0" class="space-y-3">
                <li v-for="(item, index) in sortedDashboardItems" :key="index" @click="openDashboardModal(item)" class="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-slate-500/50 hover:shadow-md px-5 py-4 rounded-xl flex items-center justify-between cursor-pointer transition-all group">
                  <div class="min-w-0 pr-4 flex-1">
                    <p class="text-base font-bold text-gray-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 truncate transition-colors">{{ item.productName }}</p>
                    <p class="text-xs font-medium text-gray-500 dark:text-slate-400 truncate mt-1 transition-colors">{{ item.factoryName }}</p>
                  </div>
                  <div class="text-right shrink-0">
                    <p class="text-[11px] text-gray-400 dark:text-slate-500 mb-1 transition-colors">최신 도매가 <span class="font-bold text-blue-600 dark:text-blue-400 ml-1">{{ getLatestPrice(item).wholesale.toLocaleString() }}원</span></p>
                    <p class="text-[11px] text-gray-400 dark:text-slate-500 transition-colors">최신 소매가 <span class="font-bold text-gray-800 dark:text-white ml-1">{{ getLatestPrice(item).retail.toLocaleString() }}원</span></p>
                  </div>
                </li>
              </ul>
              <div v-else class="h-full flex flex-col items-center justify-center text-center pb-6">
                <div class="w-20 h-20 bg-gray-50 dark:bg-[#0F172A] rounded-full flex items-center justify-center mb-4 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-300 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <p class="text-base font-bold text-gray-500 dark:text-slate-400 transition-colors">보관된 AI 리포트가 없습니다.</p>
                <p class="text-sm text-gray-400 dark:text-slate-500 mt-2">데이터 탐색에서 원하는 제품을 찾아 AI 리포트를 생성해 보세요.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <DashboardModal
        :is-open="isModalOpen"
        :selected-item="selectedDashboardItem"
        @close="closeDashboardModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const dashboardItems = ref([])
const dashboardSortOrder = ref('recent')

const isModalOpen = ref(false)
const selectedDashboardItem = ref(null)

onMounted(() => {
  if (process.client) {
    dashboardItems.value = JSON.parse(localStorage.getItem('dashboardItems') || '[]')
  }
})

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