import defaultAxiosInstance from '@/settings/axios'


const state = () => ({
  list: undefined
});

const mutations = {
  setList(state, newUrl){
    state.list = newUrl;
  }
}

const actions = {
  async getCourseVacancies({ commit } , courseId){
    await defaultAxiosInstance.get(`/courses/${courseId}/vacancies`).then((res) => {
      if (res?.data){
        console.log(res.data);
        commit('setList', res.data)
      }
    }).catch(err => {
      console.error(err);
      throw err;
    });
  }
}

export const vacancies =  {
  namespaced: true,
  state,
  mutations,
  actions,
}