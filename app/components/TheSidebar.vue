<template>
  <aside class="w-64 bg-white dark:bg-[#1E293B] border-r border-gray-200 dark:border-slate-700/50 flex flex-col hidden md:flex shrink-0 z-20 transition-colors duration-300">
    <div class="h-20 flex items-center px-8 border-b border-gray-200 dark:border-slate-700/50 transition-colors">
      <NuxtLink to="/" class="text-2xl font-black text-blue-600 dark:text-blue-500 tracking-tighter transition-colors">
        D-INSIGHT
      </NuxtLink>
    </div>

    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
      <p class="px-4 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 transition-colors">Menu</p>

      <NuxtLink
          to="/search"
          class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors"
          :class="isActive('/search') ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        데이터 탐색
      </NuxtLink>

      <NuxtLink
          to="/competitor"
          class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors"
          :class="isActive('/competitor') ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
        경쟁사 분석
      </NuxtLink>

<!--      <a href="#" class="flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200 rounded-xl font-medium transition-colors">-->
<!--        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>-->
<!--        트렌드 분석-->
<!--      </a>-->

      <NuxtLink
          to="/reports"
          class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors"
          :class="isActive('/reports') ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
        저장된 리포트
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup>
const route = useRoute()
const isActive = (path) => route.path === path
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