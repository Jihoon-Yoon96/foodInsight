<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity p-0 sm:p-4">
    <div class="bg-white dark:bg-[#1E293B]w-full max-w-3xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[85vh] sm:max-h-[90vh]">

      <div class="px-5 sm:px-8 py-4 sm:py-6 border-b dark:border-slate-700/50 flex justify-between items-start bg-blue-50/30 shrink-0">
        <div class="min-w-0 pr-4">
          <span class="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-sky-100 text-sky-700 text-[10px] sm:text-xs font-black rounded-md uppercase tracking-wide">AI 분석 리포트</span>
          <h2 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-slate-200 mt-1 sm:mt-2 truncate">{{ selectedItem?.PRDLST_NM }}</h2>
          <div class="flex items-center gap-3 mt-1 sm:mt-2">
            <p class="text-xs sm:text-sm text-gray-500 font-medium truncate">{{ selectedItem?.BSSH_NM }}</p>
            <a v-if="reportData?.isCoupangAvailable" :href="reportData.coupangLink" target="_blank" class="inline-flex px-2 py-1 bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-bold rounded hover:bg-blue-200 transition-colors items-center gap-1 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              쿠팡 판매처 확인
            </a>
          </div>
        </div>
        <button @click="$emit('close')" class="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div class="p-5 sm:p-8 overflow-y-auto flex-1 scroll-smooth" ref="modalContentRef">
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 sm:py-20">
          <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-4 border-blue-600 mb-4"></div>
          <p class="text-blue-700 font-bold animate-pulse text-sm sm:text-base text-center">AI가 제품 정보를 분석 중입니다...</p>
        </div>

        <div v-else-if="reportData" class="space-y-6 sm:space-y-8">
          <div>
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-0 mb-3">
              <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-slate-200 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>
                AI 시장 요약
              </h3>
              <button v-if="!isInputActive" @click="toggleInput" class="px-3 py-1.5 bg-white dark:bg-[#1E293B]border border-blue-200 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-1 shadow-sm w-full sm:w-auto">
                추가 분석 요청하기
              </button>
            </div>
            <div class="bg-gray-50 p-4 sm:p-5 rounded-2xl border dark:border-slate-700/50 text-gray-700 leading-relaxed text-[13px] sm:text-[15px]">
              {{ reportData.summary }}
            </div>
          </div>

          <div v-if="reportData?.annualSales && reportData.annualSales.length > 0">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-slate-200 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                최근 4년 예상 판매량 추이
              </h3>
              <span class="text-[10px] sm:text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                총 {{ reportData.totalSales.toLocaleString() }}개
              </span>
            </div>
            <div class="bg-white dark:bg-[#1E293B]border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm overflow-x-auto">
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
                      <span class="absolute -top-5 text-[9px] sm:text-[11px] font-black text-blue-600 w-max">{{ salesData.sales.toLocaleString() }}</span>
                    </div>
                    <div class="absolute w-full flex justify-center items-center pointer-events-none z-30" :style="{ bottom: `${(salesData.sales / getMaxSales(reportData)) * 100}%` }">
                      <div class="w-2 h-2 bg-blue-900 rounded-full border border-white"></div>
                    </div>
                  </div>
                </div>
                <div class="flex justify-between w-full mt-3 gap-2 sm:gap-6">
                  <div v-for="salesData in reportData.annualSales" :key="'sales-label-'+salesData.year" class="flex-1 text-center text-[10px] sm:text-xs font-bold text-gray-500">{{ salesData.year }}년</div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-[#1E293B]border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div class="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b dark:border-slate-700/50">
              <p class="text-gray-800 text-[11px] sm:text-sm font-bold tracking-wider uppercase">최근 4년 예상 도소매가 추이</p>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs sm:text-sm text-left min-w-[300px]">
                <thead class="bg-white dark:bg-[#1E293B]text-gray-400 border-b dark:border-slate-700/50">
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
                  <td class="px-4 sm:px-6 py-3 sm:py-4 text-right font-bold text-gray-900 dark:text-slate-200">{{ price.retail.toLocaleString() }}원</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-if="customAnalyses.length > 0 || isCustomLoading" class="pt-6 border-t dark:border-slate-700/50">
            <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-slate-200 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              추가 분석 내용
            </h3>

            <div class="space-y-4">
              <div v-for="(analysis, index) in customAnalyses" :key="index" class="bg-sky-50/50 rounded-2xl p-5 border border-sky-100">
                <div class="flex items-start gap-2 mb-3">
                  <span class="bg-gray-700 text-white text-[10px] px-2 py-0.5 rounded font-bold shrink-0 mt-0.5">Q</span>
                  <p class="text-sm font-bold text-gray-800">{{ analysis.prompt }}</p>
                </div>
                <div class="flex items-start gap-2">
                  <span class="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded font-bold shrink-0 mt-0.5">A</span>
                  <p class="text-[13px] sm:text-[15px] text-gray-700 leading-relaxed whitespace-pre-wrap">{{ analysis.response }}</p>
                </div>
              </div>

              <div v-if="isCustomLoading" class="bg-gray-50 rounded-2xl p-8 flex flex-col items-center justify-center border dark:border-slate-700/50">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                <p class="text-blue-700 font-bold text-sm animate-pulse">AI가 추가 분석을 진행 중입니다...</p>
              </div>
            </div>

            <div v-if="customAnalyses.length > 0 && !isCustomLoading" class="mt-4 text-right">
              <button @click="saveCustomAnalysis" class="px-5 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition shadow-sm">
                분석 내용 저장
              </button>
            </div>
          </div>

        </div>
      </div>

      <div class="px-5 sm:px-8 py-4 sm:py-5 bg-gray-50 border-t dark:border-slate-700/50 flex flex-col sm:flex-row justify-end items-center gap-3 shrink-0">

        <div v-if="isInputActive" class="w-full flex items-center gap-2 bg-white dark:bg-[#1E293B]border border-blue-200 rounded-xl px-2 py-1.5 shadow-inner flex-1 relative">
          <input
              v-model="userPrompt"
              @keyup.enter="sendCustomPrompt"
              type="text"
              placeholder="AI에게 무엇이든 물어보세요 (예: 경쟁사 강점)"
              class="flex-1 bg-transparent text-sm outline-none px-2 py-1 text-gray-800 placeholder:text-gray-400"
          >
          <button @click="sendCustomPrompt" :disabled="isCustomLoading" class="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
          <button @click="toggleInput" class="absolute -top-3 -right-2 bg-white dark:bg-[#1E293B]border border-gray-200 text-gray-400 hover:text-gray-600 rounded-full p-1 shadow-sm transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <button v-if="!isInputActive" @click="toggleInput" class="w-full sm:w-auto px-6 py-2.5 bg-white dark:bg-[#1E293B]border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm shrink-0">
          추가 분석 요청하기
        </button>

        <button @click="$emit('close')" class="w-full sm:w-auto px-6 py-2.5 bg-blue-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-md shrink-0">
          닫기
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  isLoading: { type: Boolean, default: false },
  selectedItem: { type: Object, default: () => ({}) },
  reportData: { type: Object, default: () => null }
})

const emit = defineEmits(['close'])

// 콘텐츠 영역 스크롤 제어를 위한 ref
const modalContentRef = ref(null)

const isInputActive = ref(false)
const userPrompt = ref('')
const isCustomLoading = ref(false)
const customAnalyses = ref([])

// 💡 2. 스크롤 자동 이동 로직 적용
const scrollToBottom = () => {
  nextTick(() => {
    if (modalContentRef.value) {
      modalContentRef.value.scrollTo({
        top: modalContentRef.value.scrollHeight,
        behavior: 'smooth'
      })
    }
  })
}

const toggleInput = () => {
  isInputActive.value = !isInputActive.value
  if (!isInputActive.value) {
    userPrompt.value = ''
  } else {
    // 입력창이 켜질 때 콘텐츠 영역 최하단으로 스크롤 이동
    scrollToBottom()
  }
}

const sendCustomPrompt = async () => {
  if (!userPrompt.value.trim() || isCustomLoading.value) return

  const promptText = userPrompt.value.trim()
  userPrompt.value = ''
  isCustomLoading.value = true

  // 입력 내용 제출 시 스크롤 아래로 내림
  scrollToBottom()

  try {
    const response = await $fetch('/api/custom-report', {
      method: 'POST',
      body: {
        prodName: props.selectedItem.PRDLST_NM,
        factName: props.selectedItem.BSSH_NM,
        userPrompt: promptText
      }
    })
    customAnalyses.value.push({
      prompt: promptText,
      response: response.result
    })

    // 분석 완료 후 답변을 보기 위해 다시 한번 스크롤 내림
    scrollToBottom()
  } catch (error) {
    customAnalyses.value.push({
      prompt: promptText,
      response: '오류가 발생했습니다. 다시 시도해 주세요.'
    })
    scrollToBottom()
  } finally {
    isCustomLoading.value = false
  }
}

const saveCustomAnalysis = () => {
  if (process.server) return
  const saved = JSON.parse(localStorage.getItem('dashboardItems') || '[]')

  const targetIndex = saved.findIndex(x => x.reportNo === props.selectedItem.PRDLST_REPORT_NO)
  if (targetIndex !== -1) {
    saved[targetIndex].customAnalyses = customAnalyses.value
    localStorage.setItem('dashboardItems', JSON.stringify(saved))
    alert('추가 분석 내용이 대시보드에 성공적으로 저장되었습니다.')
  }
}

watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    isInputActive.value = false
    userPrompt.value = ''
    customAnalyses.value = []
  }
})

// --- 기존 차트 계산 로직 유지 ---
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