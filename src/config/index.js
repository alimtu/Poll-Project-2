module.exports = {
  app_name: 'enghelab-university',
  manifest: {
    version: '1.0.0',
  },
  isDebug: process.env.IS_DEBUG || false,
  api: {
    baseURL: process.env.API_BASE_URL || 'https://crane.feham.ir',
    soketiUrl: process.env.NUXT_ENV_SOKETI_PUSHER_HOST,
    soketiPort: process.env.NUXT_ENV_SOKETI_PUSHER_PORT || 80,
    soketiAppKey: process.env.NUXT_ENV_SOKETI_PUSHER_APP_KEY,
    soketiAuthUrl: process.env.NUXT_ENV_SOKETI_AUTH_URL,
    browserBaseURL: null,
    proxy: false,
  },
  media: {
    baseUrl:
      process.env.MEDIA_BASE_URL ||
      process.env.API_BASE_URL ||
      'https://stagest.drnext.ir/stage.drnext.cbc/',
  },
  site: {
    baseUrl: (
      process.env.BASE_URL || 'http://localhost:' + (process.env.NUXT_PORT || '3000') + '/'
    ).replace(/\/$/, ''),
  },
  gtm: {
    id: process.env.NUXT_ENV_GTM_ID,
  },
};
