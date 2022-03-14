import App from './App.vue';
import defaultAxios from '@/settings/axios.js';
import pusher from "@/settings/pusher";
import EventBus from './EventBus.js'
import router from './router';
import store from './store';
import Vue from 'vue';
import vuetify from './plugins/vuetify';
import vueScrollTo from 'vue-scrollto'
import VueYouTubeEmbed from  'vue-youtube-embed';
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";
import { VueMaskDirective, VueMaskFilter } from 'v-mask';
import { longFormat, deadlineFormat, shortFormat, withoutYear, monthName } from "@/filters";
import '@/styles/index.scss'

// EVENTBUS
window.EventBus = EventBus;
Vue.use(VueYouTubeEmbed, { global: true, componentId: "youtube-embed" })
Vue.use(vueScrollTo)
// Vue.use(hljs.vuePlugin);
Vue.directive('mask', VueMaskDirective);
Vue.filter('VMask', VueMaskFilter)
Vue.filter('shortFormat', shortFormat)
Vue.filter('longFormat', longFormat)
Vue.filter('deadlineFormat', deadlineFormat)
Vue.filter('withoutYear', withoutYear)
Vue.filter('monthName', monthName)
Vue.prototype.$axios = defaultAxios; 
Vue.prototype.$pusher = pusher;
Vue.config.productionTip = false;


// PRODUCTION ONLY START
// DO NOT REMOVE
if (process.env.NODE_ENV === 'development'){
  console.log('Yandex Mertrica disabled in development mode.')
  window['disableYaCounter69270721'] = true
}
// SENTRY
Sentry.init({
  Vue,
  dsn: "https://60b3ea14f43a43648c1a5102cf57aec9@o491769.ingest.sentry.io/5557853",
  autoSessionTracking: true,
  integrations: [
    new Integrations.BrowserTracing(),
  ],
  
  // Sentry will call original Vue's logError function as well
  logErrors: true,
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  tracingOptions: {
    trackComponents: true,
  },
});
// PRODUCTION ONLY END
new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app');
