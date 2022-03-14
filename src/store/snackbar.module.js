const state = () => ({
  snackbar: {
    state: false,
    text: '',
    color: ''
  }
})

const mutations = {
  SET_SNACKBAR_STATE(state, data) {
    state.snackbar.state = data
  },
  SET_SNACKBAR_TEXT(state, data) {
    state.snackbar.text = data
  },
  SET_SNACKBAR_COLOR(state, data) {
    state.snackbar.color = data
  }
}

const actions = {
  START_SNACKBAR({ commit }, payload) {
    commit('SET_SNACKBAR_STATE', true)
    commit('SET_SNACKBAR_TEXT', payload.text)
    commit('SET_SNACKBAR_COLOR', payload.color)
  }
}

export const snackbar = {
  namespaced: true,
  state,
  mutations,
  actions,
}