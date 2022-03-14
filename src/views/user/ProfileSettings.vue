<template>
  <div>
    <div
      style="background-color: #F5F6F8"
    >
      <v-container>
        <template v-if="loading">
          <v-col cols=12>
            <v-skeleton-loader class="d-inline-block mr-3" type="button"/>
            <v-skeleton-loader class="d-inline-block mr-3" type="button"/>
            <v-skeleton-loader class="d-inline-block mr-3" type="button"/>
          </v-col>
        </template>
        <v-row
          v-else-if="tabs && tabs.length > 0">
          <v-col
            cols="12"
            class="d-flex pb-0"
            style="overflow-x: auto;"
          >
            <div
              v-for="(tab) in tabs"
              :key="'course_tabs_'+ tab.id"
              class="CourseIndex__tab"
              :class="{
                'CourseIndex__tab--disabled': loading,
                'CourseIndex__tab--active profile-settings__tab--active': currentTab === tab.id
              }"
              @click="currentTab = tab.id"
            >
              <span>{{ tab.title }}</span>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-container class="pt-10">
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
        <v-tab-item :value="1">
          <AdditionalSettings
            :settings="settings"
            :nickname="nickname"
          />
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </div>
</template>

<script>
import PasswordUpdateForm from "@/components/Profile/PasswordUpdateForm";
import AdditionalSettings from "@/components/Profile/AdditionalSettings";
import { mapState } from "vuex";

export default {
  name: "ProfileSettings",
  components: { PasswordUpdateForm, AdditionalSettings },
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
          title: 'Пароль'
        },
        {
          id: 1,
          title: 'Дополнительные'
        }
      ],
      loading: false
    }
  },
  computed: {
    ...mapState("user", ["settings", "nickname", "role"]),
  },
  mounted() {
    this.$nextTick(() => {
      this.$store.dispatch("breadcrumbs/setLinks", [
        {
          text: 'Личный кабинет',
          to: {
            name: this.role.id === 2 ? "Profile" : "TeacherProfile",
          },
        },
        {
          text: 'Настройки портала',
          disabled: true,
        },
      ]);
    })
  },
  methods: {

  }
}
</script>

<style lang="scss">
.profile-settings__tab--active {
  color: #0BC3B8 !important;
}
</style>
