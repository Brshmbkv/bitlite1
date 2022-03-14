<template>
  <v-app>
    <v-navigation-drawer
      v-if="!$route.meta.hideSidePanel || $vuetify.breakpoint.smAndDown"
      v-model="drawer"
      app
      :right="$vuetify.breakpoint.smAndDown"
      :permanent="$vuetify.breakpoint.mdAndUp"
    >
      <img src="@/assets/logo.png" alt="logo"/>
      <NavigationList
        :role_id="role.id"
        @close-menu="() => (drawer = !drawer)"
      />
    </v-navigation-drawer>
    <v-app-bar
      v-if="$route.meta.appBarShow || $vuetify.breakpoint.smAndDown"
      app
      flat
      :absolute="$vuetify.breakpoint.mdAndUp"
      :height="'90px'"
      :color="($route.meta && $route.meta.appBarColor) || undefined"
      class="my-app-bar"
      :hide-on-scroll="$vuetify.breakpoint.smAndDown"
    >
    </v-app-bar>
    <v-main
      app
      :style="{ backgroundColor: $route.meta.backgroundColor || '#FFF' }"
    >
      <slot />
    </v-main>
    <!-- <v-footer
      app
      inset
      absolute
      :color="$route.meta.backgroundColor || '#FFF'"
      class="py-0"
    >
      <LayoutFooter />
    </v-footer> -->
    <SnackBar />
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
// import LayoutFooter from './partials/user/LayoutFooter'
import NavigationList from './partials/user/NavigationList'
import SnackBar from '@/layouts/partials/SnackBar'
export default {
  name: 'SidePanelLayout',
  components: {
    NavigationList,
    // LayoutFooter,
    SnackBar,
  },
  data() {
    return {
      drawer: null,
    }
  },
  computed: {
    ...mapState('user', ['name', 'surname', 'role', 'avatar', 'settings']),
    ...mapState('vacancies', {
      vacancyList: 'list',
    }),
  },
}
</script>
<style lang="scss">
.v-navigation-drawer__content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: hidden;
}

.v-navigation-drawer__border {
  background-color: rgba(23, 23, 41, 0.08) !important;
}
</style>
