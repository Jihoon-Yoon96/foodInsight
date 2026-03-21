<template>
  <div class="flex h-screen bg-gray-50 dark:bg-[#0F172A] font-sans text-gray-900 dark:text-slate-200 transition-colors duration-300">

    <TheSidebar />

    <main class="flex-1 flex flex-col min-w-0 overflow-hidden relative">

      <div v-if="activeDropdown" @click="activeDropdown = null" class="fixed inset-0 z-40"></div>

      <header class="h-20 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-slate-700/50 flex items-center justify-between px-6 sm:px-10 shrink-0 z-10 transition-colors">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">대시보드</h1>
      </header>

      <div class="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar relative">
        <div class="max-w-7xl mx-auto space-y-6 sm:space-y-10">

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
            <div
                v-for="(stat, idx) in computedStats" :key="idx"
                class="p-6 rounded-2xl shadow-sm border group transition-all duration-300 relative"
                :class="[
                  getCardBgClass(stat.status),
                  getHoverBorderClass(stat.status),
                  stat.isDropdown && activeDropdown === stat.id ? 'z-50 ring-2 ring-blue-500/50' : 'z-10',
                  stat.isDropdown ? 'cursor-pointer' : ''
                ]"
                @click="handleCardClick(stat)"
            >
              <div>
                <p class="text-sm font-bold mb-1 transition-colors flex items-center gap-1" :class="getLabelClass(stat.status)">
                  <span v-if="stat.labelHighlight">
                    {{ stat.labelPrefix }}
                    <span class="text-blue-600 dark:text-blue-400">{{ stat.labelHighlight }}</span>
                  </span>
                  <span v-else>{{ stat.label }}</span>

                  <svg v-if="stat.isDropdown" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform" :class="{ 'rotate-180': activeDropdown === stat.id }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </p>

                <div v-if="stat.status === 'warn'" class="flex items-center gap-3 mt-1">
                  <span class="w-4 h-4 rounded-full bg-red-500 dark:bg-[#C34A4A] shadow-[0_0_10px_rgba(239,68,68,0.3)] dark:shadow-[0_0_10px_rgba(195,74,74,0.5)] transition-colors"></span>
                  <h3 class="text-3xl font-black tracking-tight transition-colors" :class="getValueClass(stat.status)">{{ stat.value }}</h3>
                </div>
                <div v-else-if="stat.status === 'recommend'" class="flex items-center gap-3 mt-1">
                  <span class="w-4 h-4 rounded-full bg-yellow-400 dark:bg-yellow-500 shadow-[0_0_10px_rgba(250,204,21,0.3)] dark:shadow-[0_0_10px_rgba(234,179,8,0.4)] transition-colors"></span>
                  <h3 class="text-3xl font-black tracking-tight transition-colors" :class="getValueClass(stat.status)">{{ stat.value }}</h3>
                </div>
                <h3 v-else class="text-3xl font-black mt-1 transition-colors truncate" :class="getValueClass(stat.status)">
                  {{ stat.value }}<span v-if="stat.unit" class="text-base font-medium text-gray-400 dark:text-slate-500 ml-1 transition-colors">{{ stat.unit }}</span>
                </h3>
              </div>

              <p class="text-sm font-bold mt-4 truncate transition-colors" :class="getStatusClass(stat.status)">
                {{ stat.trend }}
              </p>

              <div v-if="stat.isDropdown && activeDropdown === stat.id" class="absolute top-[105%] left-0 w-full bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-slate-600 rounded-xl shadow-2xl z-50 overflow-hidden transform opacity-100 transition-all">
                <ul class="max-h-56 overflow-y-auto custom-scrollbar py-2">
                  <li
                      v-for="opt in stat.options" :key="opt"
                      @click.stop="selectOption(stat.id, opt)"
                      class="px-5 py-3 text-[15px] font-bold text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-400 cursor-pointer transition-colors"
                  >
                    {{ opt }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div class="lg:col-span-2 bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 p-6 sm:p-8 transition-colors">
              <div class="flex items-center justify-between mb-8">
                <div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white transition-colors">제품유형별 신제품 출시 동향</h3>
                  <p class="text-xs text-gray-500 dark:text-slate-400 mt-1 transition-colors">최근 6개월 간 주요 제품유형별 신제품 등록 추이</p>
                </div>
                <div class="flex gap-4 hidden sm:flex">
                  <div class="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-slate-300 transition-colors"><span class="w-3 h-3 rounded-sm bg-blue-500"></span>동원</div>
                  <div class="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-slate-300 transition-colors"><span class="w-3 h-3 rounded-sm bg-emerald-500"></span>{{ selectedCompetitor }}</div>
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
                  <polyline :points="bluePolyline" fill="none" stroke="#3B82F6" stroke-width="2.5" vector-effect="non-scaling-stroke" />
                  <polyline :points="greenPolyline" fill="none" stroke="#10B981" stroke-width="2.5" stroke-dasharray="4" vector-effect="non-scaling-stroke" />
                </svg>

                <div class="absolute inset-0 pb-8 z-20 pointer-events-none w-full h-full">
                  <span v-for="(p, i) in chartPoints.blue" :key="'bl'+i"
                        class="absolute text-[10px] font-black text-blue-600 dark:text-blue-400 transform -translate-x-1/2 -translate-y-full pb-1 transition-all"
                        :style="{ left: p.x + '%', top: p.y + '%' }">
                    {{ p.value }}
                  </span>
                  <span v-for="(p, i) in chartPoints.green" :key="'gl'+i"
                        class="absolute text-[10px] font-black text-emerald-600 dark:text-emerald-400 transform -translate-x-1/2 pt-1 transition-all"
                        :style="{ left: p.x + '%', top: p.y + '%' }">
                    {{ p.value }}
                  </span>
                </div>

                <div v-for="(month, idx) in last6Months" :key="idx" class="flex-1 flex flex-col items-center justify-end h-full relative z-20">
                  <span class="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-slate-400 mt-3 transition-colors">{{ month }}</span>
                </div>
              </div>
            </div>

            <div class="lg:col-span-1 bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 p-6 sm:p-8 flex flex-col items-center transition-colors">
              <div class="w-full mb-6">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white transition-colors">제품유형별 비중</h3>
              </div>

              <div class="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full shrink-0 shadow-lg transition-all" :style="{ background: donutStyle }">
                <div class="absolute inset-4 bg-white dark:bg-[#1E293B] rounded-full flex flex-col items-center justify-center transition-colors">
                  <span class="text-3xl font-black text-gray-900 dark:text-white transition-colors">{{ totalCategoryCount }}</span>
                  <span class="text-xs font-medium text-gray-400 dark:text-slate-400 mt-1 transition-colors">Total</span>
                </div>
              </div>

              <div class="w-full mt-8 space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                <div v-for="item in categoryWeights" :key="item.label" class="flex items-center justify-between text-sm group">
                  <div class="flex items-center gap-2 min-w-0 pr-2">
                    <span class="w-3 h-3 rounded-full shrink-0" :class="item.colorClass"></span>
                    <span class="text-gray-600 dark:text-slate-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors truncate">{{ item.label }}</span>
                  </div>
                  <div class="text-right shrink-0">
                    <span class="text-gray-900 dark:text-white font-bold mr-2 transition-colors">{{ item.value }}건</span>
                    <span class="text-gray-400 dark:text-slate-500 font-medium text-xs w-8 inline-block">{{ item.percent }}%</span>
                  </div>
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
                </div>

                <div class="flex items-center gap-1.5 bg-gray-100 dark:bg-[#1E293B] border border-gray-200 dark:border-slate-700/50 rounded-full p-1 shadow-inner transition-colors">
                  <button class="px-4 py-2 bg-white dark:bg-blue-600 text-blue-600 dark:text-white text-xs font-bold rounded-full shadow-sm transition-colors">전체</button>
                  <button class="px-4 py-2 bg-transparent text-gray-500 dark:text-slate-400 text-xs font-medium rounded-full hover:text-gray-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800 transition-colors">가공유</button>
                  <button class="px-4 py-2 bg-transparent text-gray-500 dark:text-slate-400 text-xs font-medium rounded-full hover:text-gray-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800 transition-colors">농후발효유</button>
                  <button class="px-4 py-2 bg-transparent text-gray-500 dark:text-slate-400 text-xs font-medium rounded-full hover:text-gray-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800 transition-colors">커피</button>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              <div v-for="i in 10" :key="i" class="bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-gray-100 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-blue-500/50 transition-all shadow-sm flex flex-col cursor-pointer group">
                <div class="w-full h-32 bg-blue-50 dark:bg-[#0F172A] rounded-xl mb-4 flex items-center justify-center border border-transparent dark:border-slate-800 group-hover:border-blue-100 dark:group-hover:border-slate-600 transition-colors">
                  <svg class="w-8 h-8 text-blue-400 dark:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">프리미엄 국내산 제품 {{ i }}호</h4>
                <p class="text-xs text-gray-500 dark:text-slate-400 mb-4 truncate transition-colors">{{ selectedCompetitor }}</p>
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

    <DashboardModal
        :is-open="isModalOpen"
        :selected-item="selectedDashboardItem"
        @close="closeDashboardModal"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { CATEGORY_OPTIONS, COMPETITOR_OPTIONS } from '~/utils/constants'

// 드롭다운 및 선택 상태 관리
const activeDropdown = ref(null)
const selectedCategory = ref('아이스크림믹스')
const selectedCompetitor = ref('빙그레')

const isModalOpen = ref(false)
const selectedDashboardItem = ref(null)

// -----------------------------------------------------
// 💡 상단 카드 통계 데이터 로직
// -----------------------------------------------------
const totalProducts = computed(() => {
  const seed = selectedCategory.value.length * 7 + selectedCompetitor.value.length * 13;
  return 80 + (seed % 150);
})

const computedStats = computed(() => {
  const seed = selectedCategory.value.length * 7 + selectedCompetitor.value.length * 13;
  const leadTime = (1.5 + (seed % 4) * 0.5).toFixed(1);

  const alertOptions = [
    { level: 'Low', trend: '안정적 유지', status: 'normal' },
    { level: 'Medium', trend: '점진적 확대', status: 'recommend' },
    { level: 'High', trend: '공격적 확장세', status: 'warn' }
  ];
  const alertState = alertOptions[seed % 3];

  return [
    {
      id: 'category',
      labelPrefix: '최근 6개월 ',
      labelHighlight: selectedCategory.value,
      value: totalProducts.value.toString(),
      unit: '건',
      trend: `${(seed % 20) + 5}% 상승`,
      status: 'info',
      isDropdown: true,
      options: CATEGORY_OPTIONS
    },
    {
      id: 'competitor',
      label: '집중 경쟁업체 설정',
      value: selectedCompetitor.value,
      unit: '',
      trend: seed % 2 === 0 ? '꾸준한 상승세' : '시장 점유율 확대',
      status: 'focus',
      isDropdown: true,
      options: COMPETITOR_OPTIONS
    },
    {
      id: 'leadTime',
      label: '평균 리드타임',
      value: leadTime,
      unit: '개월',
      trend: leadTime < 2.5 ? '리드타임 단축됨' : '통상수준 유지',
      status: 'normal',
      isDropdown: false
    },
    {
      id: 'alert',
      label: '경계 수준',
      value: alertState.level,
      unit: '',
      trend: alertState.trend,
      status: alertState.status,
      isDropdown: false
    }
  ]
})


// -----------------------------------------------------
// 💡 제품유형별 비중 도넛 차트 로직 (경쟁업체 값에 따라 데이터 변동)
// -----------------------------------------------------
const dynamicCategoryDataList = computed(() => {
  // 경쟁업체 이름을 활용한 시드로 각 카테고리별 건수를 무작위이면서 일정하게 생성
  const seedBase = selectedCompetitor.value.charCodeAt(0) + selectedCompetitor.value.length * 5;

  const colors = [
    { class: 'bg-blue-500', hex: '#3B82F6' },
    { class: 'bg-purple-500', hex: '#8B5CF6' },
    { class: 'bg-emerald-500', hex: '#10B981' },
    { class: 'bg-amber-500', hex: '#F59E0B' },
    { class: 'bg-red-500', hex: '#EF4444' },
    { class: 'bg-pink-500', hex: '#EC4899' },
    { class: 'bg-teal-500', hex: '#14B8A6' },
    { class: 'bg-orange-500', hex: '#F97316' },
    { class: 'bg-cyan-500', hex: '#06B6D4' },
    { class: 'bg-indigo-500', hex: '#6366F1' }
  ];

  return CATEGORY_OPTIONS.map((cat, index) => {
    const catSeed = cat.charCodeAt(0) + cat.length;
    const val = 10 + ((seedBase * (index + 1) + catSeed) % 150);
    return {
      label: cat,
      value: val,
      colorClass: colors[index % colors.length].class,
      hex: colors[index % colors.length].hex
    };
  });
});

const totalCategoryCount = computed(() => {
  return dynamicCategoryDataList.value.reduce((acc, curr) => acc + curr.value, 0);
});

const categoryWeights = computed(() => {
  const total = totalCategoryCount.value;
  // 값이 높은 순서대로 정렬해서 출력
  const sorted = [...dynamicCategoryDataList.value].sort((a, b) => b.value - a.value);

  return sorted.map(item => ({
    ...item,
    percent: Math.round((item.value / total) * 100)
  }));
});

const donutStyle = computed(() => {
  let gradientStr = [];
  let currentPercent = 0;
  const total = totalCategoryCount.value;

  categoryWeights.value.forEach((item, index) => {
    const start = currentPercent;
    const exactPercent = (item.value / total) * 100;
    const end = index === categoryWeights.value.length - 1 ? 100 : currentPercent + exactPercent;
    gradientStr.push(`${item.hex} ${start}% ${end}%`);
    currentPercent = end;
  });

  return `conic-gradient(${gradientStr.join(', ')})`;
});


// -----------------------------------------------------
// 💡 출시 동향 라인 차트 (동원 및 경쟁업체 데이터 변동 처리)
// -----------------------------------------------------
const last6Months = computed(() => {
  const result = [];
  const d = new Date();
  let month = d.getMonth();
  if (month === 0) month = 12;

  for (let i = 5; i >= 0; i--) {
    let m = month - i;
    if (m <= 0) m += 12;
    result.push(`${m}월`);
  }
  return result;
});

const chartPoints = computed(() => {
  const xs = [8, 25, 42, 59, 75, 92]; // X축 고정 % 좌표

  // 파란 실선 (동원) - 카테고리가 바뀌면 변경되도록 계산
  const catSeed = selectedCategory.value.charCodeAt(0) + selectedCategory.value.length * 11;
  const blueValues = xs.map((_, i) => 10 + ((catSeed * (i + 2)) % 70));

  // 초록 점선 (경쟁업체 + 선택된 카테고리 연동 데이터)
  const compSeed = selectedCompetitor.value.charCodeAt(0) + selectedCompetitor.value.length * 7;
  const greenValues = xs.map((_, i) => 15 + (((compSeed + catSeed) * (i + 3)) % 65));

  const maxVal = Math.max(...blueValues, ...greenValues) * 1.3;
  const toY = (val) => 100 - (val / maxVal * 80) - 10;

  const blue = blueValues.map((v, i) => ({ x: xs[i], y: toY(v), value: v }));
  const green = greenValues.map((v, i) => ({ x: xs[i], y: toY(v), value: v }));

  return { blue, green };
});

const bluePolyline = computed(() => chartPoints.value.blue.map(p => `${p.x},${p.y}`).join(' '));
const greenPolyline = computed(() => chartPoints.value.green.map(p => `${p.x},${p.y}`).join(' '));


// -----------------------------------------------------
// 이벤트 핸들러 및 UI 매핑
// -----------------------------------------------------
const handleCardClick = (stat) => {
  if (stat.isDropdown) {
    activeDropdown.value = activeDropdown.value === stat.id ? null : stat.id
  }
}

const selectOption = (type, opt) => {
  if (type === 'category') {
    selectedCategory.value = opt
  } else if (type === 'competitor') {
    selectedCompetitor.value = opt
  }
  activeDropdown.value = null
}

const closeDashboardModal = () => {
  isModalOpen.value = false
  setTimeout(() => { selectedDashboardItem.value = null }, 300)
}

const getCardBgClass = (status) => {
  if (status === 'focus') return 'bg-blue-50 dark:bg-[#111A2C] border-blue-200 dark:border-[#2B4168]';
  return 'bg-white dark:bg-[#1E293B] border-gray-100 dark:border-slate-700/50';
}

const getLabelClass = (status) => {
  if (status === 'focus') return 'text-blue-600 dark:text-[#608BCE]';
  return 'text-gray-500 dark:text-slate-400';
}

const getValueClass = (status) => {
  if (status === 'focus') return 'text-blue-900 dark:text-white';
  return 'text-gray-900 dark:text-white';
}

const getStatusClass = (status) => {
  const map = {
    normal: 'text-gray-500 dark:text-slate-400',
    info: 'text-emerald-500 dark:text-emerald-400',
    recommend: 'text-yellow-500 dark:text-yellow-500',
    warn: 'text-red-500 dark:text-[#E67E7E]',
    focus: 'text-blue-600 dark:text-[#608BCE]'
  }
  return map[status] || 'text-gray-500 dark:text-slate-400'
}

const getHoverBorderClass = (status) => {
  const map = {
    normal: 'hover:border-gray-300 dark:hover:border-slate-500/50',
    info: 'hover:border-emerald-300 dark:hover:border-emerald-500/50',
    recommend: 'hover:border-yellow-300 dark:hover:border-yellow-500/50',
    warn: 'hover:border-red-300 dark:hover:border-red-500/50',
    focus: 'hover:border-blue-400 dark:hover:border-[#3F5E94]'
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