<template>
  <v-app
    :style="{
      backgroundColor:
        $route.meta && $route.meta.backgroundColor
          ? $route.meta.backgroundColor
          : '#FFF',
    }"
  >
    <v-navigation-drawer
      v-model="drawer"
      app
      :right="$vuetify.breakpoint.smAndDown"
      :permanent="$vuetify.breakpoint.mdAndUp"
      style="box-shadow: 6px 0 18px 0 rgba(0, 0, 0, 0.06)"
    >
      <img src="@/assets/logo.png" alt="logo" />
      <NavigationList @close-menu="isMini = true" @open-menu="isMini = false" />
    </v-navigation-drawer>
    <v-app-bar
      v-if="$route.meta.appBarShow || $vuetify.breakpoint.smAndDown"
      app
      flat
      class="admin__my-app-bar"
      :height="
        $vuetify.breakpoint.smAndDown
          ? '90px'
          : $route.meta.showCrumbs
          ? '60px'
          : '0'
      "
    >
      <AppBarContent
        v-if="$vuetify.breakpoint.smAndDown"
        :fullname="(name || '') + ' ' + (surname || '')"
        :role="role.name"
        :avatar="avatar"
        @menu-click="drawer = !drawer"
      />
      <AppBarGlobalSearch v-else>
        <Crumbs v-if="$route.meta.showCrumbs"></Crumbs>
      </AppBarGlobalSearch>
    </v-app-bar>
    <v-main app>
      <div class="px-md-5 py-md-3 pa-2">
        <slot />
      </div>
    </v-main>
    <SnackBar for-admins />
  </v-app>
</template>

<script>
import NavigationList from './partials/admin/NavigationList'
import SnackBar from '@/layouts/partials/SnackBar'
import Crumbs from '@/components/Courses/Crumbs'
import AppBarContent from './partials/admin/AppBarContent'
import AppBarGlobalSearch from '@/layouts/partials/admin/AppBarGlobalSearch'

export default {
  name: 'AdminLayout',
  components: {
    AppBarGlobalSearch,
    AppBarContent,
    NavigationList,
    SnackBar,
    Crumbs,
  },
  data() {
    return {
      drawer: null,
      isMini: false,
    }
  },

}
</script>
