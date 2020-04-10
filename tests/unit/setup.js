import fs from 'fs'
import path from 'path'
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

// ==========================================================================
// 유틸리티
// ==========================================================================

// 테스트 유틸 및 loadash전역 변수를 선언한다.
const vueTestUtils = require('@vue/test-utils')
const _ = require('lodash')
_.mixin({
  pascalCase: _.flow(_.camelCase, _.upperFirst),
})


// ===========================================================================
// Axios 설정
// ===========================================================================

// axios가 xhr을 사용하도록 설정한다.
axios.defaults.adapter = require('axios/lib/adapters/xhr')


// ===========================================================================
// 뷰 설정
// ===========================================================================

// production빌드를 하지 않는것에 경고를 끈다.
Vue.config.productionTip = false

// ===========================================================================
// 글로벌 컴포넌트
// ===========================================================================

const globalComponentFiles = fs
  .readdirSync(path.join(__dirname, '../../src/components'))
  .filter((fileName) => /^_base-.+\.vue$/.test(fileName))

for (const fileName of globalComponentFiles) {
  const componentName = _.pascalCase(fileName.match(/^_(base-.+)\.vue$/)[1])
  const componentConfig = require('../../src/components/' + fileName)
  Vue.component(componentName, componentConfig.default || componentConfig)
}

// ===========================================================================
// window localStorage객체 설정
// ===========================================================================

// jsDom이 처리하지 않는 Mock 윈도우 속성을 설정한다.
Object.defineProperty(window, 'localStorage', {
  value: (function() {
    let store = {}
    return {
      getItem: function(key) {
        return store[key] || null
      },
      setItem: function(key, value) {
        store[key] = value.toString()
      },
      clear: function() {
        store = {}
      },
    }
  })(),
})

// ===========================================================================
// Console handlers
// ===========================================================================

// Make console.error throw, so that Jest tests fail
const error = console.error
console.error = function(message) {
  error.apply(console, arguments)
  // NOTE: You can whitelist some `console.error` messages here
  //       by returning if the `message` value is acceptable.
  throw message instanceof Error ? message : new Error(message)
}

// Jest tests 실패
const warn = console.warn
console.warn = function(message) {
  warn.apply(console, arguments)
  // NOTE: You can whitelist some `console.warn` messages here
  //       by returning if the `message` value is acceptable.
  throw message instanceof Error ? message : new Error(message)
}

// ===========================================================================
// Global helpers
// ===========================================================================

global.mount = vueTestUtils.mount

global.shallowMount = vueTestUtils.shallowMount

global.shallowMountView = (Component, options = {}) => {
  return global.shallowMount(Component, {
    ...options,
    stubs: {
      Layout: {
        functional: true,
        render(h, { slots }) {
          return <div>{slots().default}</div>
        },
      },
      ...(options.stubs || {}),
    },
  })
}

// A helper for creating Vue component mocks
global.createComponentMocks = ({ store, router, style, mocks, stubs }) => {
  // Use a local version of Vue, to avoid polluting the global
  // Vue and thereby affecting other tests.
  // https://vue-test-utils.vuejs.org/api/#createlocalvue
  const localVue = vueTestUtils.createLocalVue()
  const returnOptions = { localVue }

  // https://vue-test-utils.vuejs.org/api/options.html#stubs
  returnOptions.stubs = stubs || {}
  // https://vue-test-utils.vuejs.org/api/options.html#mocks
  returnOptions.mocks = mocks || {}

  // Converts a `store` option shaped like:
  //
  // store: {
  //   someModuleName: {
  //     state: { ... },
  //     getters: { ... },
  //     actions: { ... },
  //   },
  //   anotherModuleName: {
  //     getters: { ... },
  //   },
  // },
  //
  // to a store instance, with each module namespaced by
  // default, just like in our app.
  if (store) {
    localVue.use(Vuex)
    returnOptions.store = new Vuex.Store({
      modules: Object.keys(store)
        .map((moduleName) => {
          const storeModule = store[moduleName]
          return {
            [moduleName]: {
              state: storeModule.state || {},
              getters: storeModule.getters || {},
              actions: storeModule.actions || {},
              namespaced:
                typeof storeModule.namespaced === 'undefined'
                  ? true
                  : storeModule.namespaced,
            },
          }
        })
        .reduce((moduleA, moduleB) => Object.assign({}, moduleA, moduleB), {}),
    })
  }

  // If using `router: true`, we'll automatically stub out
  // components from Vue Router.
  if (router) {
    returnOptions.stubs['router-link'] = true
    returnOptions.stubs['router-view'] = true
  }

  // If a `style` object is provided, mock some styles.
  if (style) {
    returnOptions.mocks.$style = style
  }

  return returnOptions
}

global.createModuleStore = (vuexModule, options = {}) => {
  vueTestUtils.createLocalVue().use(Vuex)
  const store = new Vuex.Store({
    ..._.cloneDeep(vuexModule),
    modules: {
      auth: {
        namespaced: true,
        state: {
          currentUser: options.currentUser,
        },
      },
      user: {
        namespaced: true,
        state: {
          currentUser: options.currentUser,
        },
      },

    },
    // Enable strict mode when testing Vuex modules so that
    // mutating state outside of a mutation results in a
    // failing test.
    // https://vuex.vuejs.org/guide/strict.html
    strict: true,
  })
  axios.defaults.headers.common.Authorization = options.currentUser
    ? options.currentUser.token
    : ''
  if (vuexModule.actions.init) {
    store.dispatch('init')
  }
  return store
}
