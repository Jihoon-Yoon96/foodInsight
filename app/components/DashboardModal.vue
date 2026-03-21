<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity p-4">
    <div class="bg-white dark:bg-[#1E293B] w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh] transition-colors duration-300">

      <div class="px-6 sm:px-8 py-5 sm:py-6 border-b border-gray-100 dark:border-slate-700/50 flex justify-between items-center bg-blue-50/30 dark:bg-[#0F172A] shrink-0 transition-colors">
        <div class="min-w-0 pr-4">
          <span class="px-2.5 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 text-[10px] sm:text-xs font-black rounded-md uppercase tracking-wide transition-colors">
            AI 분석 정보
          </span>
          <h2 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-2 truncate transition-colors">{{ selectedItem?.productName }}</h2>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-slate-400 font-medium truncate transition-colors">{{ selectedItem?.factoryName }}</p>
        </div>
        <button @click="$emit('close')" class="p-2 text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div class="p-6 sm:p-8 overflow-y-auto flex-1 space-y-8">

        <div v-if="selectedItem?.summary">
          <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>
            AI가 분석했던 정보
          </h3>
          <div class="bg-gray-50 dark:bg-[#0F172A] p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-slate-700/50 text-gray-700 dark:text-slate-300 leading-relaxed text-[13px] sm:text-[15px] transition-colors">
            {{ selectedItem.summary }}
          </div>
        </div>

        <div v-if="selectedItem?.annualSales && selectedItem.annualSales.length > 0">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              최근 4년 예상 판매량 추이
            </h3>
            <span class="text-[10px] sm:text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-md border border-blue-100 dark:border-blue-800/50 transition-colors">
              총 {{ selectedItem.totalSales.toLocaleString() }}개
            </span>
          </div>
          <div class="bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700/50 rounded-2xl p-4 sm:p-6 shadow-sm overflow-x-auto transition-colors">
            <div class="flex justify-end gap-4 mb-8 min-w-[350px]">
              <div class="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-gray-500 dark:text-slate-400 transition-colors">
                <span class="w-3 h-3 rounded-sm bg-blue-500"></span>연간 판매량
              </div>
            </div>
            <div class="min-w-[350px] pt-4">
              <div class="relative h-40 sm:h-48 w-full border-b border-gray-200 dark:border-slate-700/50 flex items-end justify-between gap-2 sm:gap-6 transition-colors">
                <svg class="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polyline :points="getSalesPolylinePoints()" fill="none" class="stroke-blue-900 dark:stroke-blue-400 transition-colors" stroke-width="2" vector-effect="non-scaling-stroke" />
                </svg>
                <div v-for="salesData in selectedItem.annualSales" :key="'sales-'+salesData.year" class="flex-1 flex justify-center items-end h-full relative z-10">
                  <div class="relative w-1/2 sm:w-10 bg-blue-500/80 rounded-t-sm flex justify-center hover:brightness-110 transition-all" :style="{ height: `${(salesData.sales / maxSales) * 100}%` }">
                    <span class="absolute -top-5 text-[9px] sm:text-[11px] font-black text-blue-600 dark:text-blue-400 w-max transition-colors">{{ salesData.sales.toLocaleString() }}</span>
                  </div>
                  <div class="absolute w-full flex justify-center items-center pointer-events-none z-30" :style="{ bottom: `${(salesData.sales / maxSales) * 100}%` }">
                    <div class="w-2 h-2 bg-blue-900 dark:bg-blue-400 rounded-full border border-white dark:border-slate-800 transition-colors"></div>
                  </div>
                </div>
              </div>
              <div class="flex justify-between w-full mt-3 gap-2 sm:gap-6">
                <div v-for="salesData in selectedItem.annualSales" :key="'sales-label-'+salesData.year" class="flex-1 text-center text-[10px] sm:text-xs font-bold text-gray-500 dark:text-slate-400 transition-colors">{{ salesData.year }}년</div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedItem?.priceHistory && selectedItem.priceHistory.length > 0">
          <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
            최근 4년 예상 도/소매가 추이
          </h3>
          <div class="bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700/50 rounded-2xl p-4 sm:p-6 shadow-sm overflow-x-auto transition-colors">
            <div class="flex justify-end gap-4 mb-8 min-w-[350px]">
              <div class="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-gray-500 dark:text-slate-400 transition-colors"><span class="w-3 h-3 rounded-sm bg-sky-500"></span>도매가(B2B)</div>
              <div class="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-gray-500 dark:text-slate-400 transition-colors"><span class="w-3 h-3 rounded-sm bg-blue-800 dark:bg-blue-600"></span>소매가(B2C)</div>
            </div>
            <div class="min-w-[350px] pt-4">
              <div class="relative h-48 sm:h-56 w-full border-b border-gray-200 dark:border-slate-700/50 flex items-end justify-between gap-2 sm:gap-6 transition-colors">
                <svg class="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polyline :points="getPolylinePoints('wholesale')" fill="none" class="stroke-[#3873B6] dark:stroke-sky-500 transition-colors" stroke-width="2" stroke-dasharray="2" vector-effect="non-scaling-stroke" />
                  <polyline :points="getPolylinePoints('retail')" fill="none" class="stroke-[#1F2937] dark:stroke-blue-400 transition-colors" stroke-width="2" vector-effect="non-scaling-stroke" />
                </svg>
                <div v-for="(price, index) in selectedItem.priceHistory" :key="price.year" class="flex-1 flex justify-center items-end h-full gap-1 sm:gap-2 relative z-10">
                  <div class="relative w-1/3 sm:w-8 bg-sky-500/80 rounded-t-sm flex justify-center hover:brightness-110 transition-all" :style="{ height: `${(price.wholesale / maxPrice) * 100}%` }">
                    <span class="absolute -top-5 text-[9px] sm:text-[11px] font-black text-blue-600 dark:text-sky-400 w-max transition-colors">{{ price.wholesale.toLocaleString() }}</span>
                  </div>
                  <div class="relative w-1/3 sm:w-8 bg-blue-800/80 dark:bg-blue-600/80 rounded-t-sm flex justify-center hover:brightness-110 transition-all" :style="{ height: `${(price.retail / maxPrice) * 100}%` }">
                    <span class="absolute -top-5 text-[9px] sm:text-[11px] font-black text-gray-800 dark:text-slate-300 w-max transition-colors">{{ price.retail.toLocaleString() }}</span>
                  </div>
                  <div class="absolute w-full flex justify-center items-center pointer-events-none z-30" :style="{ bottom: `${(price.retail / maxPrice) * 100}%` }">
                    <div class="w-2 h-2 bg-blue-900 dark:bg-blue-400 rounded-full border border-white dark:border-slate-800 transition-colors"></div>
                  </div>
                  <div class="absolute w-full flex justify-center items-center pointer-events-none z-30" :style="{ bottom: `${(price.wholesale / maxPrice) * 100}%` }">
                    <div class="w-2 h-2 bg-sky-600 dark:bg-sky-400 rounded-full border border-white dark:border-slate-800 transition-colors"></div>
                  </div>
                </div>
              </div>
              <div class="flex justify-between w-full mt-3 gap-2 sm:gap-6">
                <div v-for="price in selectedItem.priceHistory" :key="'label-'+price.year" class="flex-1 text-center text-[10px] sm:text-xs font-bold text-gray-500 dark:text-slate-400 transition-colors">{{ price.year }}년</div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedItem?.customAnalyses && selectedItem.customAnalyses.length > 0" class="pt-6 border-t border-gray-100 dark:border-slate-700/50 transition-colors">
          <div class="flex items-center justify-between">
            <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              추가 분석 내용
            </h3>
            <button @click="showCustomDetails = true" class="px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
              상세 내용 확인
            </button>
          </div>
        </div>

      </div>

      <div class="px-6 sm:px-8 py-4 sm:py-5 bg-gray-50 dark:bg-[#0F172A] border-t border-gray-100 dark:border-slate-700/50 flex justify-end shrink-0 transition-colors">
        <button @click="$emit('close')" class="w-full sm:w-auto px-8 py-2.5 bg-blue-900 dark:bg-slate-700 text-white text-sm font-bold rounded-xl hover:bg-blue-600 dark:hover:bg-slate-600 transition-colors shadow-md">
          닫기
        </button>
      </div>

      <div v-if="showCustomDetails" class="absolute inset-0 z-50 bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-sm flex flex-col overflow-hidden transition-colors">
        <div class="px-6 sm:px-8 py-4 sm:py-5 border-b border-gray-100 dark:border-slate-700/50 flex justify-between items-center bg-white dark:bg-[#1E293B] shadow-sm shrink-0 transition-colors">
          <h3 class="font-bold text-gray-900 dark:text-white text-lg transition-colors">AI 추가 분석 상세</h3>
          <button @click="showCustomDetails = false" class="p-2 text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 bg-gray-50 dark:bg-[#0F172A] hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4">
          <div v-for="(analysis, idx) in selectedItem.customAnalyses" :key="idx" class="bg-sky-50/50 dark:bg-[#0F172A] rounded-2xl p-5 border border-sky-100 dark:border-slate-700/50 transition-colors">
            <div class="flex items-start gap-2 mb-3">
              <span class="bg-gray-700 dark:bg-slate-600 text-white text-[10px] px-2 py-0.5 rounded font-bold shrink-0 mt-0.5 transition-colors">Q</span>
              <p class="text-sm font-bold text-gray-800 dark:text-slate-200 transition-colors">{{ analysis.prompt }}</p>
            </div>
            <div class="flex items-start gap-2">
              <span class="bg-blue-600 dark:bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded font-bold shrink-0 mt-0.5 transition-colors">A</span>
              <p class="text-[13px] sm:text-[15px] text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap transition-colors">{{ analysis.response }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  selectedItem: { type: Object, default: () => null }
})

defineEmits(['close'])

const showCustomDetails = ref(false)

watch(() => props.isOpen, (newVal) => {
  if (!newVal) showCustomDetails.value = false
})

// --- 차트 계산 로직 ---
const maxSales = computed(() => {
  if (!props.selectedItem || !props.selectedItem.annualSales || props.selectedItem.annualSales.length === 0) return 10000;
  return Math.max(...props.selectedItem.annualSales.map(s => s.sales)) * 1.2;
})

const getSalesPolylinePoints = () => {
  if (!props.selectedItem?.annualSales) return '';
  return props.selectedItem.annualSales.map((s, i) => {
    const x = (i * 25) + 12.5;
    const y = 100 - ((s.sales / maxSales.value) * 100);
    return `${x},${y}`;
  }).join(' ');
}

const maxPrice = computed(() => {
  if (!props.selectedItem || !props.selectedItem.priceHistory || props.selectedItem.priceHistory.length === 0) return 10000;
  return Math.max(...props.selectedItem.priceHistory.map(p => Math.max(p.retail, p.wholesale))) * 1.2;
})

const getPolylinePoints = (type) => {
  if (!props.selectedItem?.priceHistory) return '';
  return props.selectedItem.priceHistory.map((p, i) => {
    const x = (i * 25) + 12.5;
    const y = 100 - ((p[type] / maxPrice.value) * 100);
    return `${x},${y}`;
  }).join(' ');
}
</script>