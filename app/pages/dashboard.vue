<template>
  <div class="flex h-screen bg-[#0F172A] font-sans text-slate-200">

    <aside class="w-64 bg-[#1E293B] border-r border-slate-700/50 flex flex-col hidden md:flex shrink-0 z-20">
      <div class="h-20 flex items-center px-8 border-b border-slate-700/50">
        <NuxtLink to="/" class="text-2xl font-black text-blue-500 tracking-tighter">
          D-INSIGHT
        </NuxtLink>
      </div>

      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        <p class="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Menu</p>

        <a href="#" class="flex items-center gap-3 px-4 py-3 bg-blue-600/20 text-blue-400 rounded-xl font-bold transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          대시보드
        </a>
        <NuxtLink to="/search" class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-xl font-medium transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          데이터 탐색
        </NuxtLink>
        <a href="#" class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-xl font-medium transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          트렌드 분석
        </a>
        <a href="#" class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-xl font-medium transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
          저장된 리포트
        </a>
      </nav>

      <div class="p-4 border-t border-slate-700/50">
        <a href="#" class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-xl font-medium transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          설정
        </a>
      </div>
    </aside>

    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">

      <header class="h-20 bg-[#1E293B] border-b border-slate-700/50 flex items-center justify-between px-6 sm:px-10 shrink-0 z-10">
        <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">대시보드</h1>

        <div class="flex items-center gap-4 sm:gap-6">
          <div class="hidden sm:flex items-center bg-[#0F172A] border border-slate-700/50 rounded-full px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="저장된 데이터 검색..." class="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-200 placeholder:text-slate-500">
          </div>
          <button class="text-slate-400 hover:text-blue-400 transition-colors relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1E293B]"></span>
          </button>
          <div class="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-lg border border-blue-500/30 cursor-pointer">
            M
          </div>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar relative">
        <div class="max-w-7xl mx-auto space-y-6 sm:space-y-10">

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div class="bg-[#1E293B] p-6 rounded-2xl shadow-sm border border-slate-700/50 flex items-center justify-between group hover:border-blue-500/50 transition-colors cursor-pointer">
              <div>
                <p class="text-sm font-bold text-slate-400 mb-1">최근 6개월 신제품</p>
                <h3 class="text-3xl font-black text-white">124<span class="text-base font-medium text-slate-500 ml-1">건</span></h3>
              </div>
              <div class="w-14 h-14 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
            </div>

            <div class="bg-[#1E293B] p-6 rounded-2xl shadow-sm border border-slate-700/50 flex items-center justify-between group hover:border-blue-500/50 transition-colors cursor-pointer">
              <div>
                <p class="text-sm font-bold text-slate-400 mb-1">이번 달 분석 횟수</p>
                <h3 class="text-3xl font-black text-white">42<span class="text-base font-medium text-slate-500 ml-1">회</span></h3>
              </div>
              <div class="w-14 h-14 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
            </div>

            <div class="bg-[#1E293B] p-6 rounded-2xl shadow-sm border border-slate-700/50 flex items-center justify-between group hover:border-blue-500/50 transition-colors cursor-pointer">
              <div>
                <p class="text-sm font-bold text-slate-400 mb-1">자주 찾는 카테고리</p>
                <h3 class="text-xl sm:text-2xl font-black text-purple-400 truncate max-w-[120px]">가공유</h3>
              </div>
              <div class="w-14 h-14 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
              </div>
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