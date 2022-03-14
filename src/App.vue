<template>
  <component :is="checkLayout">
    <router-view></router-view>
    <!-- EXAMPLE COMMENT -->
  </component>
</template>

<script>
import DefaultLayout from "@/layouts/default"
import SidePanelLayout from "@/layouts/sidePanel"
import TestLayout from "@/layouts/test"
import AdminLayout from "@/layouts/admin"
import { mapState } from "vuex"
// 

export default {
  name: 'App',

  components: {
    DefaultLayout, // login with bg-image
    SidePanelLayout, // Students 
    TestLayout,
    AdminLayout,
  },

  computed: {
    // 1 - admin, 2 - student, 3 - teacher
    ...mapState({
      userLayout: state => (
        state.session.token && state.user.role.id
          ? state.user.role.id !== 1 
            ? SidePanelLayout 
            : AdminLayout
          : DefaultLayout
      )
    }),

    checkLayout() {
      if (this.$route.meta.isEmptyLayout) {
        return TestLayout
      } else {
        return this.userLayout
      }
    },
  },
  
  beforeCreate() {
    this.$store.dispatch("initialize").then(() => {
      let userRoleId = this.$store.state.user.role.id;
      console.log('initialized', userRoleId)
      if (userRoleId < 0 ) return;
      let isDenied = this.$router?.currentRoute?.matched.some((match) => (
        match?.meta?.permit
        && match.meta.permit !== userRoleId
        
      ));
      if (isDenied) this.$router.replace({ name: 'Home' });
    })
  },
  
};
</script>
