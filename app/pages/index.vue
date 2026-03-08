<template>
  <div class="min-h-screen bg-[#F7F9F7] flex flex-col items-center justify-center px-4 font-sans">
    <div class="text-center mb-12">
      <p class="text-lg md:text-xl font-medium text-emerald-700 mb-2 tracking-tight">
        데이터로 연결하는 식품 비즈니스 파트너
      </p>
      <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
        정확하게 찾는<br />
        <span class="text-[#059669]">최적의 제조 파트너</span>
      </h1>
      <p class="mt-4 text-gray-500 text-sm md:text-base">
        식품 공장 및 품목 제조 데이터를 제공합니다.
      </p>
    </div>

    <div class="w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex items-stretch overflow-hidden border border-emerald-100">

      <div class="flex-1 border-r border-gray-100 p-4 md:p-6 group focus-within:bg-emerald-50 transition">
        <label class="block text-xs font-bold text-emerald-600 mb-1 uppercase tracking-wider">품목명</label>
        <input
            v-model="searchForm.productName"
            type="text"
            placeholder="제품명을 입력하세요"
            class="w-full bg-transparent text-lg font-semibold focus:outline-none placeholder:text-gray-300"
            @keyup.enter="handleSearch"
        />
      </div>

      <div class="flex-1 p-4 md:p-6 group focus-within:bg-emerald-50 transition">
        <label class="block text-xs font-bold text-emerald-600 mb-1 uppercase tracking-wider">제조사명</label>
        <input
            v-model="searchForm.factoryName"
            type="text"
            placeholder="공장명 입력"
            class="w-full bg-transparent text-lg font-semibold focus:outline-none placeholder:text-gray-300"
            @keyup.enter="handleSearch"
        />
      </div>

      <button
          @click="handleSearch"
          class="bg-[#059669] hover:bg-[#047857] transition-all w-20 md:w-32 flex items-center justify-center text-white shadow-inner"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>

    <div class="mt-16 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50 flex gap-5 hover:border-emerald-200 transition">
        <div class="p-4 bg-emerald-50 rounded-xl h-fit">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        </div>
        <div>
          <h4 class="font-bold text-lg mb-1 text-gray-800">전국 제조시설 데이터</h4>
          <p class="text-sm text-gray-500 leading-relaxed">HACCP 인증 공장부터 신규 영업 신고 업체까지<br/>실시간으로 업데이트되는 DB를 확인하세요.</p>
        </div>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50 flex gap-5 hover:border-emerald-200 transition">
        <div class="p-4 bg-emerald-600 rounded-xl h-fit">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        </div>
        <div class="w-full">
          <h4 class="font-bold text-lg mb-1 text-gray-800">인기 품목 트렌드</h4>
          <div class="flex gap-2 mt-2">
            <span class="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-medium">#냉동식품</span>
            <span class="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-medium">#밀키트</span>
            <span class="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-medium">#소스류</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()

const searchForm = reactive({
  // rawMaterial: '', // [주석처리] 원재료명
  productName: '',
  factoryName: ''
})

const handleSearch = () => {
  // if (!searchForm.rawMaterial && !searchForm.productName && !searchForm.factoryName) {
  if (!searchForm.productName && !searchForm.factoryName) {
    alert('검색어를 입력해 주세요.')
    return
  }
  router.push({
    path: '/search',
    query: {
      // raw: searchForm.rawMaterial, // [주석처리] 원재료명
      prod: searchForm.productName,
      fact: searchForm.factoryName
    }
  })
}
</script>