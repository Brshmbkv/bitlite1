import Vue from 'vue';
import Vuex from 'vuex';
import { session } from './session.module'
import { user } from './user.module'
import { breadcrumbs } from './breadcrumbs.module'
import { snackbar } from './snackbar.module'
import { vacancies } from './vacancies.module'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  actions: {
    // initialize store after
    initialize: ({ state, dispatch }, from) => {
      if (state.session.token){
        return dispatch('user/getUser', from)
      }
    }
  },
  modules: {
    breadcrumbs,
    session,
    user,
    snackbar,
    vacancies,
  },
});
