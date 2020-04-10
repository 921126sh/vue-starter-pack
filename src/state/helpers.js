import { mapState, mapGetters, mapActions } from 'vuex'

/**
 * 인증 헬퍼
 */
export const authComputed = {
  ...mapState('auth', {
    currentUser: (state) => state.currentUser,
  }),
  ...mapGetters('auth', ['loggedIn']),
}

export const authMethods = mapActions('auth', ['logIn', 'logOut'])

/**
 * 사용자 헬퍼
 */
export const userComputed = {
  ...mapState('users', {
    users: (state) => state.users,
  }),
  ...mapGetters('users', ['getUsers']),
}

export const userMethods = mapActions('users', ['fetchUsers'])
