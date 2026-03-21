<template>
  <div class="flex h-screen bg-gray-50 dark:bg-[#0F172A] font-sans text-gray-900 dark:text-slate-200 transition-colors duration-300">

    <TheSidebar />

    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">

      <header class="h-20 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-slate-700/50 flex items-center justify-between px-6 sm:px-10 shrink-0 z-10 transition-colors">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">대시보드</h1>
      </header>

      <div class="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar relative">
        <div class="max-w-7xl mx-auto space-y-6 sm:space-y-10">

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
            <div
                v-for="(stat, idx) in stats" :key="idx"
                class="bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 group transition-all duration-300 cursor-pointer"
                :class="getHoverBorderClass(stat.status)"
            >
              <div>
                <p class="text-sm font-bold text-gray-500 dark:text-slate-400 mb-1 transition-colors">{{ stat.label }}</p>

                <div v-if="stat.status === 'warn'" class="flex items-center gap-3 mt-1">
                  <span class="w-4 h-4 rounded-full bg-red-500 dark:bg-[#C34A4A] shadow-[0_0_10px_rgba(239,68,68,0.3)] dark:shadow-[0_0_10px_rgba(195,74,74,0.5)] transition-colors"></span>
                  <h3 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight transition-colors">{{ stat.value }}</h3>
                </div>

                <h3 v-else class="text-3xl font-black text-gray-900 dark:text-white mt-1 transition-colors">
                  {{ stat.value }}<span v-if="stat.unit" class="text-base font-medium text-gray-400 dark:text-slate-500 ml-1 transition-colors">{{ stat.unit }}</span>
                </h3>
              </div>

              <p
                  class="text-sm font-bold mt-4 truncate transition-colors"
                  :class="getStatusClass(stat.status)"
              >
                {{ stat.trend }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 p-6 sm:p-8 transition-colors">
              <div class="flex items-center justify-between mb-8">
                <div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white transition-colors">카테고리별 출시 동향</h3>
                  <p class="text-xs text-gray-500 dark:text-slate-400 mt-1 transition-colors">최근 6개월 간 주요 카테고리별 신제품 등록 추이</p>
                </div>
                <div class="flex gap-4 hidden sm:flex">
                  <div class="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-slate-300 transition-colors"><span class="w-3 h-3 rounded-sm bg-blue-500"></span>가공유</div>
                  <div class="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-slate-300 transition-colors"><span class="w-3 h-3 rounded-sm bg-emerald-500"></span>기타가공품</div>
                </div>
              </div>

              <div class="h-64 w-full flex items-end justify-between gap-2 sm:gap-4 relative pt-10">
                <div class="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none">
                  <div class="border-b border-gray-100 dark:border-slate-700/50 w-full transition-colors"></div>
                  <div class="border-b border-gray-100 dark:border-slate-700/50 w-full transition-colors"></div>
                  <div class="border-b border-gray-100 dark:border-slate-700/50 w-full transition-colors"></div>
                  <div class="border-b border-gray-100 dark:border-slate-700/50 w-full transition-colors"></div>
                  <div class="border-b border-gray-300 dark:border-slate-600 w-full transition-colors"></div>
                </div>

                <svg class="absolute inset-0 w-full h-full pb-8 overflow-visible z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polyline points="8,70 25,50 42,65 58,35 75,45 92,20" fill="none" stroke="#3B82F6" stroke-width="2.5" vector-effect="non-scaling-stroke" />
                  <polyline points="8,85 25,75 42,50 58,60 75,30 92,40" fill="none" stroke="#10B981" stroke-width="2.5" stroke-dasharray="4" vector-effect="non-scaling-stroke" />
                </svg>

                <div v-for="i in 6" :key="i" class="flex-1 flex flex-col items-center justify-end h-full relative z-20">
                  <span class="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-slate-400 mt-3 transition-colors">{{ i + 4 }}월</span>
                </div>
              </div>
            </div>

            <div class="lg:col-span-1 bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 p-6 sm:p-8 flex flex-col items-center justify-center transition-colors">
              <div class="w-full mb-6">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white transition-colors">카테고리 비중</h3>
                <p class="text-xs text-gray-500 dark:text-slate-400 mt-1 transition-colors">저장된 리포트 기준</p>
              </div>

              <div class="relative w-48 h-48 rounded-full shrink-0 shadow-lg" style="background: conic-gradient(#3B82F6 0% 45%, #8B5CF6 45% 70%, #10B981 70% 90%, #F59E0B 90% 100%);">
                <div class="absolute inset-4 bg-white dark:bg-[#1E293B] rounded-full flex flex-col items-center justify-center transition-colors">
                  <span class="text-3xl font-black text-gray-900 dark:text-white transition-colors">124</span>
                  <span class="text-xs font-medium text-gray-400 dark:text-slate-400 mt-1 transition-colors">Total</span>
                </div>
              </div>

              <div class="w-full mt-8 space-y-3">
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-blue-500"></span><span class="text-gray-600 dark:text-slate-300 font-medium transition-colors">가공유</span></div>
                  <span class="text-gray-900 dark:text-white font-bold transition-colors">45%</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-purple-500"></span><span class="text-gray-600 dark:text-slate-300 font-medium transition-colors">기타가공품</span></div>
                  <span class="text-gray-900 dark:text-white font-bold transition-colors">25%</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-emerald-500"></span><span class="text-gray-600 dark:text-slate-300 font-medium transition-colors">유산균음료</span></div>
                  <span class="text-gray-900 dark:text-white font-bold transition-colors">20%</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-orange-500"></span><span class="text-gray-600 dark:text-slate-300 font-medium transition-colors">우유 등</span></div>
                  <span class="text-gray-900 dark:text-white font-bold transition-colors">10%</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 sm:mt-12">
            <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">
              <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">최적의 식품 제조 파트너 탐색</h2>

              <div class="flex flex-wrap items-center gap-3">
                <div class="relative group">
                  <button class="flex items-center gap-1.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-slate-700/50 text-gray-700 dark:text-slate-300 text-xs font-medium rounded-xl px-4 py-2.5 shadow-sm hover:border-gray-300 dark:hover:border-slate-600 transition-colors">
                    <span class="font-bold">최신순</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <div class="absolute top-full left-0 mt-1 w-28 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-slate-700/50 rounded-xl shadow-lg p-1 space-y-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-50">
                    <a href="#" class="block px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors">최신순</a>
                    <a href="#" class="block px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors">과거순</a>
                  </div>
                </div>

                <div class="flex items-center gap-1.5 bg-gray-100 dark:bg-[#1E293B] border border-gray-200 dark:border-slate-700/50 rounded-full p-1 shadow-inner transition-colors">
                  <button class="px-4 py-2 bg-white dark:bg-blue-600 text-blue-600 dark:text-white text-xs font-bold rounded-full shadow-sm transition-colors">전체</button>
                  <button class="px-4 py-2 bg-transparent text-gray-500 dark:text-slate-400 text-xs font-medium rounded-full hover:text-gray-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800 transition-colors">가공유</button>
                  <button class="px-4 py-2 bg-transparent text-gray-500 dark:text-slate-400 text-xs font-medium rounded-full hover:text-gray-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800 transition-colors">농후발효유</button>
                  <button class="px-4 py-2 bg-transparent text-gray-500 dark:text-slate-400 text-xs font-medium rounded-full hover:text-gray-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800 transition-colors">커피</button>
                </div>

                <div class="flex items-center gap-1.5 bg-gray-100 dark:bg-[#1E293B] border border-gray-200 dark:border-slate-700/50 rounded-full p-1 shadow-inner transition-colors">
                  <button class="px-4 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-xs font-bold rounded-full shadow-sm transition-colors">제조사</button>
                  <button class="px-4 py-2 bg-transparent text-gray-500 dark:text-slate-400 text-xs font-medium rounded-full hover:text-gray-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800 transition-colors">품목명</button>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              <div v-for="i in 10" :key="i" class="bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-gray-100 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-blue-500/50 transition-all shadow-sm flex flex-col cursor-pointer group">
                <div class="w-full h-32 bg-blue-50 dark:bg-[#0F172A] rounded-xl mb-4 flex items-center justify-center border border-transparent dark:border-slate-800 group-hover:border-blue-100 dark:group-hover:border-slate-600 transition-colors">
                  <svg class="w-8 h-8 text-blue-400 dark:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>

                <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">프리미엄 국내산 제품 {{ i }}호</h4>
                <p class="text-xs text-gray-500 dark:text-slate-400 mb-4 truncate transition-colors">풀무원식품(주)</p>

                <div class="flex items-center gap-2 mb-4">
                  <span class="text-[10px] font-medium text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded transition-colors">정상</span>
                  <span class="text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 px-2 py-1 rounded transition-colors">쿠팡 소싱</span>
                </div>

                <button class="mt-auto w-full py-2 bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white transition-colors border border-blue-100 dark:border-blue-500/30">
                  AI 리포트
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const stats = ref([
  { label: '최근 6개월 신제품', value: '124', unit: '건', trend: '15% 상승', status: 'info' },
  { label: '집중 카테고리', value: 'Frozen Dessert', unit: '', trend: '통산수준 유지', status: 'recommend' },
  { label: '평균 리드타임', value: '2.5', unit: '개월', trend: '통상수준 유지', status: 'normal' },
  { label: '경계 수준', value: 'High', unit: '', trend: '공격적 확장세', status: 'warn' }
])

// 상태에 따른 텍스트 색상 (라이트/다크 분기)
const getStatusClass = (status) => {
  const map = {
    normal: 'text-gray-500 dark:text-slate-400',
    info: 'text-emerald-500 dark:text-emerald-400',
    recommend: 'text-blue-500 dark:text-blue-400',
    warn: 'text-red-500 dark:text-[#E67E7E]'
  }
  return map[status] || 'text-gray-500 dark:text-slate-400'
}

// 호버시 테두리 색상 (라이트/다크 분기)
const getHoverBorderClass = (status) => {
  const map = {
    normal: 'hover:border-gray-300 dark:hover:border-slate-500/50',
    info: 'hover:border-emerald-300 dark:hover:border-emerald-500/50',
    recommend: 'hover:border-blue-300 dark:hover:border-blue-500/50',
    warn: 'hover:border-red-300 dark:hover:border-red-500/50'
  }
  return map[status]
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
/* 라이트모드 기본 스크롤바 */
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #94a3b8;
}

/* 다크모드 스크롤바 (.dark 클래스 하위) */
:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #334155;
}
:deep(.dark) .custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #475569;
}
</style>