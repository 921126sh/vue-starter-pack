import dispatchActionForAllModules from '@utils/dispatch-action-for-all-modules'
import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules,
  // true일 경우 Vuex 상태가 변이 핸들러 외부에서 변이 될 때 마다 오류가 발생
  strict: process.env.NODE_ENV !== 'production',
})

export default store

// 모든 액션 모듈을 초기화 한다.
dispatchActionForAllModules('init')
