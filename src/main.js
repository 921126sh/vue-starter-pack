// Globally register all `_base`-prefixed components
import '@components/_globals'
import router from '@router'
import store from '@state/store'
import lodash from 'lodash'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import Vue from 'vue'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import VueLodash from 'vue-lodash'
import Notifications from 'vue-notification'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import App from './app.vue'

Vue.use(Vuetify)
Vue.use(Notifications)
Vue.use(VueLodash, { lodash: lodash })
Vue.use(VueDOMPurifyHTML);

const vuetify = new Vuetify({})

Vue.config.productionTip = process.env.NODE_ENV === 'production'
if (process.env.VUE_APP_TEST === 'e2e') {
  Vue.config.errorHandler = window.Cypress.cy.onUncaughtException
}

const app = new Vue({
  router,
  store,
  vuetify,
  theme: {
    dark: true,
  },
  render: (h) => h(App),
}).$mount('#app')

Vue.prototype.EventBus = new Vue();  // Vue에 등록

// e2e실행이라면...
if (process.env.VUE_APP_TEST === 'e2e') {
  // cypress커맨드 사용을 위한 설정
  window.__app__ = app
}
