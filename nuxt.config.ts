// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  // 서버와 클라이언트에서 사용할 환경 변수 설정
  runtimeConfig: {
    // 서버에서만 접근 가능한 키 (Private)
    foodApiKey: process.env.FOOD_API_KEY,
    geminiApiKey: process.env.GEMINI_API_KEY,

    public: {
      // 클라이언트(브라우저)에서도 필요한 정보가 있다면 여기에 넣습니다.
    }
  },
  // 폰트나 기본 스타일이 깨지지 않게 보장
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard.css' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
})
