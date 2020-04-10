import { getAllUsers } from '@api/users.api';
import axios from 'axios';
import Vue from 'vue';
export const state = {
  cached: [],
  users: []
}

export const getters = {
  /**
   * 사용자를 반환한다.
   *
   * @param { Context } state 컨텍스트 state
   */
  getUsers(state) {
    return state.users;
  }
}

export const mutations = {
  CACHE_USER(state, newUser) {
    state.cached.push(newUser)
  },
  SET_USERS(state, data) {
    state.users = data;
  }
}

export const actions = {
  fetchUser({ commit, state, rootState }, { username }) {
    const { currentUser } = rootState.auth
    if (currentUser && currentUser.username === username) {
      return Promise.resolve(currentUser)
    }

    const matchedUser = state.cached.find((user) => user.username === username)
    if (matchedUser) {
      return Promise.resolve(matchedUser)
    }

    return axios.get(`/api/users/${username}`).then((response) => {
      const user = response.data
      commit('CACHE_USER', user)
      return user
    })
  },

  /**
   * 조회조건에 따른 사용자를 조회한다.
   *
   * @param { Context } commit 컨텍스트 커밋
   * @param { Object } params 조회조건
   */
  fetchUsers({ commit }, params = {}) {
      getAllUsers(params).then(response => {
        const users = response;
        commit('SET_USERS', users);
        return users;
      },
      error =>{
        Vue.notify({
          group: 'notifyApp',
          title: '에러!!',
          type: 'error',
          text: error,
          duration: -10
        })
      })
  },
}
