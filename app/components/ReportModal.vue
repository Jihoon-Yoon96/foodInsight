<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity p-0 sm:p-4">
    <div class="bg-white w-full max-w-3xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[85vh] sm:max-h-[90vh]">
      <div class="px-5 sm:px-8 py-4 sm:py-6 border-b border-gray-100 flex justify-between items-center bg-blue-50/30">
        <div class="min-w-0 pr-4">
          <span class="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-sky-100 text-sky-700 text-[10px] sm:text-xs font-black rounded-md uppercase tracking-wide">AI 분석 리포트</span>
          <h2 class="text-xl sm:text-2xl font-black text-gray-900 mt-1 sm:mt-2 truncate">{{ selectedItem?.PRDLST_NM }}</h2>
          <p class="text-xs sm:text-sm text-gray-500 font-medium truncate">{{ selectedItem?.BSSH_NM }}</p>
        </div>
        <button @click="$emit('close')" class="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div class="p-5 sm:p-8 overflow-y-auto flex-1">
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 sm:py-20">
          <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-4 border-blue-600 mb-4"></div>
          <p class="text-blue-700 font-bold animate-pulse text-sm sm:text-base text-center">AI가 제품 정보를 분석 중입니다...</p>
        </div>

        <div v-else-if="reportData" class="space-y-6 sm:space-y-8">
          <div>
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-0 mb-3">
              <h3 class="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>
                AI 시장 요약
              </h3>
              <a v-if="reportData.isCoupangAvailable" :href="reportData.coupangLink" target="_blank" class="px-3 py-2 sm:py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 shadow-sm w-full sm:w-auto">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                쿠팡 판매처 확인
              </a>
            </div>
            <div class="bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-100 text-gray-700 leading-relaxed text-[13px] sm:text-[15px]">
              {{ reportData.summary }}
            </div>
          </div>

          <div v-if="reportData?.annualSales && reportData.annualSales.length > 0">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                최근 4년 예상 판매량 추이
              </h3>
              <span class="text-[10px] sm:text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                총 {{ reportData.totalSales.toLocaleString() }}개
              </span>
            </div>
            <div class="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm overflow-x-auto">
              <div class="flex justify-end gap-4 mb-8 min-w-[350px]">
                <div class="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-gray-500">
                  <span class="w-3 h-3 rounded-sm bg-blue-500"></span>연간 판매량
                </div>
              </div>
              <div class="min-w-[350px] pt-4">
                <div class="relative h-40 sm:h-48 w-full border-b border-gray-200 flex items-end justify-between gap-2 sm:gap-6">
                  <svg class="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline :points="getSalesPolylinePoints(reportData)" fill="none" stroke="#1e3a8a" stroke-width="2" vector-effect="non-scaling-stroke" />
                  </svg>
                  <div v-for="salesData in reportData.annualSales" :key="'sales-'+salesData.year" class="flex-1 flex justify-center items-end h-full relative z-10">
                    <div class="relative w-1/2 sm:w-10 bg-blue-500/80 rounded-t-sm flex justify-center hover:brightness-110 transition-all" :style="{ height: `${(salesData.sales / getMaxSales(reportData)) * 100}%` }">
                      <span class="absolute -top-5 text-[9px] sm:text-[11px] font-black text-blue-600 w-max">
                        {{ salesData.sales.toLocaleString() }}
                      </span>
                    </div>
                    <div class="absolute w-full flex justify-center items-center pointer-events-none z-30" :style="{ bottom: `${(salesData.sales / getMaxSales(reportData)) * 100}%` }">
                      <div class="w-2 h-2 bg-blue-900 rounded-full border border-white"></div>
                    </div>
                  </div>
                </div>
                <div class="flex justify-between w-full mt-3 gap-2 sm:gap-6">
                  <div v-for="salesData in reportData.annualSales" :key="'sales-label-'+salesData.year" class="flex-1 text-center text-[10px] sm:text-xs font-bold text-gray-500">
                    {{ salesData.year }}년
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div class="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-100">
              <p class="text-gray-800 text-[11px] sm:text-sm font-bold tracking-wider uppercase">최근 4년 예상 도소매가 추이</p>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs sm:text-sm text-left min-w-[300px]">
                <thead class="bg-white text-gray-400 border-b border-gray-100">
                <tr>
                  <th class="px-4 sm:px-6 py-2 sm:py-3 font-medium">연도</th>
                  <th class="px-4 sm:px-6 py-2 sm:py-3 text-right font-medium">도매가(B2B)</th>
                  <th class="px-4 sm:px-6 py-2 sm:py-3 text-right font-medium">소매가(B2C)</th>
                </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                <tr v-for="price in reportData.priceHistory" :key="price.year" class="hover:bg-blue-50/30 transition-colors">
                  <td class="px-4 sm:px-6 py-3 sm:py-4 font-bold text-gray-700">{{ price.year }}년</td>
                  <td class="px-4 sm:px-6 py-3 sm:py-4 text-right font-bold text-blue-600">{{ price.wholesale.toLocaleString() }}원</td>
                  <td class="px-4 sm:px-6 py-3 sm:py-4 text-right font-bold text-gray-900">{{ price.retail.toLocaleString() }}원</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      <div class="px-5 sm:px-8 py-4 sm:py-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        <p class="text-[10px] sm:text-xs text-gray-400 font-medium text-center sm:text-left">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
          해당 리포트는 대시보드에 자동 저장됩니다.
        </p>
        <button @click="$emit('close')" class="w-full sm:w-auto px-6 py-2.5 sm:py-2.5 bg-blue-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-md">
          닫기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: { type: Boolean, default: false },
  isLoading: { type: Boolean, default: false },
  selectedItem: { type: Object, default: () => ({}) },
  reportData: { type: Object, default: () => null }
})

defineEmits(['close'])

// 판매량 차트를 그리기 위한 계산식 (ReportModal 전용)
const getMaxSales = (data) => {
  if (!data || !data.annualSales || data.annualSales.length === 0) return 10000;
  return Math.max(...data.annualSales.map(s => s.sales)) * 1.2;
}

const getSalesPolylinePoints = (data) => {
  if (!data?.annualSales) return '';
  const max = getMaxSales(data);
  return data.annualSales.map((s, i) => {
    const x = (i * 25) + 12.5;
    const y = 100 - ((s.sales / max) * 100);
    return `${x},${y}`;
  }).join(' ');
}
</script>