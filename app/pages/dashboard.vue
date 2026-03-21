<template>
  <div class="flex h-screen bg-[#0F172A] font-sans text-slate-200">

    <!-- 사이드바  -->
    <TheSidebar />

    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">

      <header class="h-20 bg-[#1E293B] border-b border-slate-700/50 flex items-center justify-between px-6 sm:px-10 shrink-0 z-10">
        <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">대시보드</h1>
      </header>

      <div class="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar relative">
        <div class="max-w-7xl mx-auto space-y-6 sm:space-y-10">

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
            <div
                v-for="(stat, idx) in stats" :key="idx"
                class="bg-[#1E293B] p-6 rounded-2xl shadow-sm border border-slate-700/50 group transition-colors cursor-pointer"
                :class="getHoverBorderClass(stat.status)"
            >
              <div>
                <p class="text-sm font-bold text-slate-400 mb-1">{{ stat.label }}</p>

                <div v-if="stat.status === 'warn'" class="flex items-center gap-3 mt-1">
                  <span class="w-4 h-4 rounded-full bg-[#C34A4A] shadow-[0_0_10px_rgba(195,74,74,0.5)]"></span>
                  <h3 class="text-3xl font-black text-white tracking-tight">{{ stat.value }}</h3>
                </div>

                <h3 v-else class="text-3xl font-black text-white mt-1">
                  {{ stat.value }}<span v-if="stat.unit" class="text-base font-medium text-slate-500 ml-1">{{ stat.unit }}</span>
                </h3>
              </div>

              <p
                  class="text-sm font-bold mt-4 truncate"
                  :class="getStatusClass(stat.status)"
              >
                {{ stat.trend }}
              </p>
            </div>
          </div>


          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 bg-[#1E293B] rounded-2xl shadow-sm border border-slate-700/50 p-6 sm:p-8">
              <div class="flex items-center justify-between mb-8">
                <div>
                  <h3 class="text-lg font-bold text-white">카테고리별 출시 동향</h3>
                  <p class="text-xs text-slate-400 mt-1">최근 6개월 간 주요 카테고리별 신제품 등록 추이</p>
                </div>
                <div class="flex gap-4 hidden sm:flex">
                  <div class="flex items-center gap-1.5 text-xs font-bold text-slate-300"><span class="w-3 h-3 rounded-sm bg-blue-500"></span>가공유</div>
                  <div class="flex items-center gap-1.5 text-xs font-bold text-slate-300"><span class="w-3 h-3 rounded-sm bg-emerald-500"></span>기타가공품</div>
                </div>
              </div>

              <div class="h-64 w-full flex items-end justify-between gap-2 sm:gap-4 relative pt-10">
                <div class="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none">
                  <div class="border-b border-slate-700/50 w-full"></div>
                  <div class="border-b border-slate-700/50 w-full"></div>
                  <div class="border-b border-slate-700/50 w-full"></div>
                  <div class="border-b border-slate-700/50 w-full"></div>
                  <div class="border-b border-slate-600 w-full"></div>
                </div>

                <svg class="absolute inset-0 w-full h-full pb-8 overflow-visible z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polyline points="8,70 25,50 42,65 58,35 75,45 92,20" fill="none" stroke="#3B82F6" stroke-width="2.5" vector-effect="non-scaling-stroke" />
                  <polyline points="8,85 25,75 42,50 58,60 75,30 92,40" fill="none" stroke="#10B981" stroke-width="2.5" stroke-dasharray="4" vector-effect="non-scaling-stroke" />
                </svg>

                <div v-for="i in 6" :key="i" class="flex-1 flex flex-col items-center justify-end h-full relative z-20">
                  <span class="text-[10px] sm:text-xs font-bold text-slate-400 mt-3">{{ i + 4 }}월</span>
                </div>
              </div>
            </div>

            <div class="lg:col-span-1 bg-[#1E293B] rounded-2xl shadow-sm border border-slate-700/50 p-6 sm:p-8 flex flex-col items-center justify-center">
              <div class="w-full mb-6">
                <h3 class="text-lg font-bold text-white">카테고리 비중</h3>
                <p class="text-xs text-slate-400 mt-1">저장된 리포트 기준</p>
              </div>

              <div class="relative w-48 h-48 rounded-full shrink-0 shadow-lg" style="background: conic-gradient(#3B82F6 0% 45%, #8B5CF6 45% 70%, #10B981 70% 90%, #F59E0B 90% 100%);">
                <div class="absolute inset-4 bg-[#1E293B] rounded-full flex flex-col items-center justify-center">
                  <span class="text-3xl font-black text-white">124</span>
                  <span class="text-xs font-medium text-slate-400 mt-1">Total</span>
                </div>
              </div>

              <div class="w-full mt-8 space-y-3">
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-blue-500"></span><span class="text-slate-300 font-medium">가공유</span></div>
                  <span class="text-white font-bold">45%</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-purple-500"></span><span class="text-slate-300 font-medium">기타가공품</span></div>
                  <span class="text-white font-bold">25%</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-emerald-500"></span><span class="text-slate-300 font-medium">유산균음료</span></div>
                  <span class="text-white font-bold">20%</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-orange-500"></span><span class="text-slate-300 font-medium">우유 등</span></div>
                  <span class="text-white font-bold">10%</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 sm:mt-12">
            <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">
              <h2 class="text-xl sm:text-2xl font-bold text-white tracking-tight">최적의 식품 제조 파트너 탐색</h2>

              <div class="flex flex-wrap items-center gap-3">
                <div class="relative group">
                  <button class="flex items-center gap-1.5 bg-[#1E293B] border border-slate-700/50 text-slate-300 text-xs font-medium rounded-xl px-4 py-2.5 shadow-sm hover:border-slate-600 transition">
                    <span class="font-bold">최신순</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <div class="absolute top-full left-0 mt-1 w-28 bg-[#1E293B] border border-slate-700/50 rounded-xl shadow-lg p-1 space-y-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity z-50">
                    <a href="#" class="block px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white rounded-md">최신순</a>
                    <a href="#" class="block px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white rounded-md">과거순</a>
                  </div>
                </div>

                <div class="flex items-center gap-1.5 bg-[#1E293B] border border-slate-700/50 rounded-full p-1 shadow-inner">
                  <button class="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-full shadow-sm">전체</button>
                  <button class="px-4 py-2 bg-transparent text-slate-400 text-xs font-medium rounded-full hover:bg-slate-800 hover:text-slate-200 transition">가공유</button>
                  <button class="px-4 py-2 bg-transparent text-slate-400 text-xs font-medium rounded-full hover:bg-slate-800 hover:text-slate-200 transition">농후발효유</button>
                  <button class="px-4 py-2 bg-transparent text-slate-400 text-xs font-medium rounded-full hover:bg-slate-800 hover:text-slate-200 transition">커피</button>
                </div>

                <div class="flex items-center gap-1.5 bg-[#1E293B] border border-slate-700/50 rounded-full p-1 shadow-inner">
                  <button class="px-4 py-2 bg-slate-700 text-white text-xs font-bold rounded-full shadow-sm">제조사</button>
                  <button class="px-4 py-2 bg-transparent text-slate-400 text-xs font-medium rounded-full hover:bg-slate-800 hover:text-slate-200 transition">품목명</button>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              <div v-for="i in 10" :key="i" class="bg-[#1E293B] rounded-2xl p-5 border border-slate-700/50 hover:border-blue-500/50 transition shadow-sm flex flex-col cursor-pointer group">
                <div class="w-full h-32 bg-[#0F172A] rounded-xl mb-4 flex items-center justify-center border border-slate-800 group-hover:border-slate-600 transition-colors">
                  <svg class="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>

                <h4 class="text-sm font-bold text-white mb-1 truncate group-hover:text-blue-400 transition-colors">프리미엄 국내산 제품 {{ i }}호</h4>
                <p class="text-xs text-slate-400 mb-4 truncate">풀무원식품(주)</p>

                <div class="flex items-center gap-2 mb-4">
                  <span class="text-[10px] font-medium text-slate-300 bg-slate-800 px-2 py-1 rounded">정상</span>
                  <span class="text-[10px] font-medium text-amber-400 bg-amber-400/10 px-2 py-1 rounded">쿠팡 소싱</span>
                </div>

                <button class="mt-auto w-full py-2 bg-blue-600/20 text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-colors border border-blue-500/30">
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
// 순수 퍼블리싱 UI (데이터 연동 없이 UI만 구성)
const stats = ref([
  { label: '최근 6개월 신제품', value: '124', unit: '건', trend: '15% 상승', status: 'info' },
  { label: '집중 카테고리', value: 'Frozen Dessert', unit: '', trend: '통산수준 유지', status: 'recommend' },
  { label: '평균 리드타임', value: '2.5', unit: '개월', trend: '통상수준 유지', status: 'normal' },
  { label: '경계 수준', value: 'High', unit: '', trend: '공격적 확장세', status: 'warn' }
])

// 상태에 따른 텍스트 색상 매핑 함수
const getStatusClass = (status) => {
  const map = {
    normal: 'text-slate-400',
    info: 'text-emerald-400',
    recommend: 'text-blue-400',
    warn: 'text-[#E67E7E]' // 이미지에 사용된 붉은색
  }
  return map[status] || 'text-slate-400'
}

// 상태에 따른 보더 호버 색상 매핑 (선택 사항)
const getHoverBorderClass = (status) => {
  const map = {
    normal: 'hover:border-slate-500/50',
    info: 'hover:border-emerald-500/50',
    recommend: 'hover:border-blue-500/50',
    warn: 'hover:border-red-500/50'
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
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #334155;
  border-radius: 10px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #475569;
}
</style>