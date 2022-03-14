import defaultAxiosInstance from '@/settings/axios'

const state = () => ({
  avatar: "",
  email: "",
  id: -1,
  loading: false,
  name: "",
  phone: "",
  role: {
    id: -1,
    name: "",
  },
  surname: "",
  nickname: "",
  settings: {
    show_hh: false,
    show_nickname: false
  },
  questioned: false,
  logic_test_score: "",
  is_test: false,
  linked_in: "",
  github: ""
})

const mutations = {
  // update state with new user
  set(state, {
    name = "",
    surname = "",
    nickname = "",
    role = {},
    phone = "",
    email = "",
    avatar = "",
    id = -1,
    settings = {},
    questioned = false,
    logic_test_score = "",
    is_test = false,
    linked_in = "",
    github = ""
  }) {
    Object.assign(state, {
      name,
      surname,
      nickname,
      role,
      phone,
      email,
      avatar,
      id,
      settings,
      questioned,
      logic_test_score,
      is_test,
      linked_in,
      github
    });
  },
  // updating existing user fields
  update(state, userFields) {
    Object.assign(state, userFields);
  },
  setLoading(state, value = true) {
    state.loading = value;
  },
  setShowHH(state, value) {
    state.settings.show_hh = value
  },
  setShowNickname(state, value) {
    state.settings.show_nickname = value
  }
}

const actions = {
  // Initialize (after login)
  init: ({ commit }, payload) => {
    commit('set', {
      ...payload,
      ...({
        name: payload.first_name,
        surname: payload.last_name
      })
    });
  },
  // Update user info before change
  async getUser({ commit }) {
    // called on profile edit and on page reload
    // check if request is not sent already
    // if (!state.loading){
    commit('setLoading', true);
    await defaultAxiosInstance.get('me').then((res) => {
      if(res && res.data) {
        // console.log('me', res.data)
        commit('set', {
          name: res.data.first_name || '',
          surname: res.data.last_name || '',
          ...res.data
        });
      } else throw new Error("Не удалось обновить: пришли неверные данные")
    })
      .catch((err) => {
        throw err
      })
      .finally(() => {
        commit('setLoading', false);
      });
    // }

  },

  logout({ commit, dispatch }) {
    commit('set', {});
    // localStorage.removeItem('role_id')
    dispatch('session/delete', undefined, { root: true });
  },

  async updateInfo({ commit }, payload) {
    // return new Promise((resolve, reject) => {
    const { phone, first_name, last_name, email, role, nickname, linked_in, github } = payload;
    await defaultAxiosInstance.post('profile/update', {
      ...(phone && { phone }),
      ...(first_name && { first_name }),
      ...(last_name && { last_name }),
      ...((nickname || nickname === '') && { nickname }),
      ...(email && { email }),
      ...(linked_in && { linked_in }),
      ...(github && { github }),
    }).then((res) => {
      if(res && res.data) {
        commit('set', {
          name: res.data.first_name || '',
          surname: res.data.last_name || '',
          role: role || '',
          ...res.data
        });
      }
      return res;
      // resolve(res);
    }).catch((err) => {
      let errMsg = err;
      if(err && err.response && err.response.data) {
        errMsg = err.response.data.errors
      }
      throw errMsg;
      // reject(errMsg);
    })
    // })
  },
  editUser({ commit }, { name, surname, title }) {
    // user info upgrade request goes here
    commit('setUser', { name, surname, title })
  },
  updateSettings({ commit }, { show_hh, show_nickname }) {
    commit('setShowHH', show_hh)
    commit('setShowNickname', show_nickname)
  }
}

const getters = {
  role_id: (state) => (state.role ? state.role.id : undefined),
}

export const user = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
