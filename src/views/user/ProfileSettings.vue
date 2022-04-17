<template>
  <v-container>
    <v-tabs class="mb-8 admin-users__v-tabs" color="eprimary">
      <v-tab
        v-for="tab in tabs"
        :key="'course_tabs_' + tab.id"
        @click="currentTab = tab.id"
      >
        {{ tab.title }}</v-tab
      >
    </v-tabs>
    <v-tabs-items v-model="currentTab">
      <v-tab-item :value="0">
        <PasswordUpdateForm
          :loading="loading"
          @setLoading="(value) => (this.loading = value)"
        />
      </v-tab-item>
      <!--        <v-tab-item :value="1">-->
      <!--          <telegram-qr-tab/>-->
      <!--        </v-tab-item>-->
      <!-- <v-tab-item :value="1">
        <AdditionalSettings :settings="settings" :nickname="nickname" />
      </v-tab-item> -->
    </v-tabs-items>
  </v-container>
</template>

<script>
import PasswordUpdateForm from '@/components/Profile/PasswordUpdateForm'
// import AdditionalSettings from '@/components/Profile/AdditionalSettings'
import { mapState } from 'vuex'

export default {
  name: 'ProfileSettings',
  components: { PasswordUpdateForm },
  data() {
    return {
      currentTab: 0,
      // tabsContainerStyle: {
      //   width: 'calc(100% + 40px)',
      //   marginLeft: '-20px',
      //   marginTop: '-12px'
      // },
      tabs: [
        {
          id: 0,
          title: 'Пароль',
        },
      ],
      loading: false,
    }
  },
  computed: {
    ...mapState('user', ['settings', 'nickname', 'role']),
  },
  mounted() {
    this.$nextTick(() => {
      this.$store.dispatch('breadcrumbs/setLinks', [
        {
          text: 'Личный кабинет',
          to: {
            name: this.role.id === 2 ? 'Profile' : 'TeacherProfile',
          },
        },
        {
          text: 'Настройки портала',
          disabled: true,
        },
      ])
    })
  },
  methods: {},
}
</script>

<style lang="scss">
.profile-settings__tab--active {
  color: #0bc3b8 !important;
}
</style>
