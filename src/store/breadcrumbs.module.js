const state = () => ({
  // back: undefined,
  links: [],
  current: "",
})

const mutations = {
  // Object.keys(obj).length === 0
  setBack(state, { text, href }){
    state.back = {
      text, 
      href,
    }
  },
  setLinks(state, payload){
    state.links = payload;
  },
  
  setCurrent(state, payload ){
    state.current = payload
  },
}

const actions = {
  setLinks({ commit }, payload){
    commit('setLinks', payload);
  },
  addLink({ state, commit }, payload){
    commit('setLinks', [...state.links, payload])
  }
}

const getters = {
  items: state => ([
    // ...(state.back && { ...state.back }),
    ...(state.links),
    ...(state.current && { disabled: true, name: state.current }),
  ])
}

export const breadcrumbs = {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
}