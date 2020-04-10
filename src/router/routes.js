import store from '@state/store'

export default [
  {
    path: '/',
    name: 'home',
    component: () => lazyLoadView(import('@views/home/home.vue')),
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => lazyLoadView(import('@views/login/login.vue')),
    meta: {
      authRequired: false,
      beforeResolve(routeTo, routeFrom, next) {
        // 이미 인증된 사용자라면...
        if (store.getters['auth/loggedIn']) {
          next()
        } else if (!this.authRequired) {
          next()
        }
      },
    },
  },
  {
    path: '/user',
    name: 'user',
    component: () => lazyLoadView(import('@views/user/user.vue')),
    meta: {
      authRequired: true,
      tmp: {},
      beforeResolve(routeTo, routeFrom, next) {
        store
          .dispatch('users/fetchUsers', { })
          .then((user) => {
            routeTo.meta.tmp.user = user
            next()
          })
          .catch(() => {
            next({ name: '404', params: { resource: 'User' } })
          })
      },
    },
    props: (route) => ({ users: route.meta.tmp.user || [] }),
  },
  {
    path: '/clinic',
    name: 'clinic',
    component: () => lazyLoadView(import('@views/clinic/clinic.vue')),
    meta: {
      authRequired: true,
    },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => lazyLoadView(import('@views/tmp/profile.vue')),
    meta: {
      authRequired: true,
    },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
  },
  {
    path: '/profile/:username',
    name: 'username-profile',
    component: () => lazyLoadView(import('@views/tmp/profile.vue')),
    meta: {
      authRequired: true,
      tmp: {},
      beforeResolve(routeTo, routeFrom, next) {
        store
          .dispatch('users/fetchUser', { username: routeTo.params.username })
          .then((user) => {
            routeTo.meta.tmp.user = user
            next()
          })
          .catch(() => {
            next({ name: '404', params: { resource: 'User' } })
          })
      },
    },
    props: (route) => ({ user: route.meta.tmp.user }),
  },
  {
    path: '/logout',
    name: 'logout',
    meta: {
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        store.dispatch('auth/logOut')
        next({ name: 'login' })
      },
    },
  },
  {
    path: '/404',
    name: '404',
    component: require('@viewsCommons/_404.vue').default,
    props: true,
  },
  {
    path: '*',
    redirect: '404',
  },
]

/**
 * lazy로딩을 설정 후 로딩화면과 타임아웃화면을 설정한다.
 *
 * @param {Component} AsyncView
 */
function lazyLoadView(AsyncView) {
  const AsyncHandler = () => ({
    component: AsyncView,
    loading: require('@viewsCommons/_loading.vue').default,
    delay: 400,
    error: require('@viewsCommons/_timeout.vue').default,
    timeout: 10000,
  })

  return Promise.resolve({
    functional: true,
    render(h, { data, children }) {
      return h(AsyncHandler, data, children)
    },
  })
}
