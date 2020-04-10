import store from '@state/store'
import NProgress from 'nprogress/nprogress'
import Vue from 'vue'
import VueMeta from 'vue-meta'
import VueRouter from 'vue-router'
import routes from './routes'

Vue.use(VueRouter)
// TODO: 뭐하는 놈인지 알아보자
Vue.use(VueMeta, {
  keyName: 'page',
})

const router = new VueRouter({
  routes,
  // 라우터의 기본은 해시모드다. 해시모드일 시 봇이 크롤링 하지 못하기 때문에 history로 설정한다.
  mode: 'history',
  // 설정된 스크롤의 위치를 유지한다.
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
})

// 라우터 이동 전 Hook / to, from 의 값이 변하지 않는다.
router.beforeEach((routeTo, routeFrom, next) => {
  if (routeFrom.name !== null) {
    NProgress.start()
  }

  // 인증되지 않았다면...
  const authRequired = routeTo.matched.some((route) => route.meta.authRequired)
  if (!authRequired) return next()

  // 사용자가 인증 되었다면 인증이 유효한 사용자인지 검사한다.
  if (store.getters['auth/loggedIn']) {
    return store.dispatch('auth/validate').then((validUser) => {
      validUser ? next() : redirectToLogin()
    })
  }

  // 인증이 되지 않았다면 로그인 페이지로 이동한다.
  redirectToLogin()
  function redirectToLogin() {
    next({ name: 'login', query: { redirectFrom: routeTo.fullPath } })
  }
})

// 라우터 이동 중 Hook / 각 페이지 별 routeResolve 훅을 실행한다.
router.beforeResolve(async (routeTo, routeFrom, next) => {
  try {
    for (const route of routeTo.matched) {
      await new Promise((resolve, reject) => {
        if (route.meta && route.meta.beforeResolve) {
          route.meta.beforeResolve(routeTo, routeFrom, (...args) => {
            if (args.length) {
              if (routeFrom.name === args[0].name) {
                NProgress.done()
              }

              next(...args)
              reject(new Error('Redirected'))
            } else {
              resolve()
            }
          })
        } else {
          resolve()
        }
      })
    }
  } catch (error) {
    return
  }

  next()
})

// 라우터 이동 후 hook / 프로그레스를 종료한다.
router.afterEach((routeTo, routeFrom) => {
  NProgress.done()
})

export default router
