import defaultAxiosInstance from '@/settings/axios'

const state = {
  token: localStorage.getItem('token') || '',
}

const actions = {
  set({ commit }, { token = '', /* user */ }) {
    commit('setToken', token);
    localStorage.setItem('token', token);
    defaultAxiosInstance.defaults.headers.common['Authorization'] = "Bearer " + token;
  },

  delete({ commit }) {
    commit('setToken', '');
    localStorage.removeItem('token');
    defaultAxiosInstance.defaults.headers.common['Authorization'] = '';
  }

};

const mutations = {
  setToken(state, value) {
    state.token = value;
  }
};

export const session = {
  namespaced: true,
  state,
  actions,
  mutations
};