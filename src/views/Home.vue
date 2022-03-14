<template>
  <div class="home-loader-container">
    <div class="text-center">
      <v-progress-circular
        indeterminate
        color="#0bc4b8"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapGetters({ roleId: 'user/role_id' })
  },
  watch: {
    roleId: {
      handler(newValue) {
        // console.log('HOME roleId', newValue)
        if(localStorage.getItem('token') && newValue) {
          switch(newValue) {
          case 2:
            this.$router.replace({ name: 'CoursesIndex' })
            break
          case 3:
            this.$router.replace({ name: 'Streams' })
            break
          case 1:
            this.$router.replace({ name: 'AdminUsersIndex' })
            break
          default:
            break
          }
        } else {
          this.$router.replace({ name: 'Login' })
        }
      },
      immediate: true
    }
  }
  // redirect: () => {
  //     console.log('redirect-store:', store.getters['user/role_id'] )
  //     return (store.getters['user/role_id'] === 3)
  //       ? { name: 'Streams'}
  //       : { name: 'Courses', query: {q: 'all'}}
  //   }
};
</script>
<style lang="scss">
.home-loader-container {
  min-height: 75vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
