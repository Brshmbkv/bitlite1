<template>
  <div>
    <v-list-item
      style="height: 59px"
      :class="isMini ? 'px-0' : 'px-5'"
      class="py-2"
    >
      <v-list-item-avatar
        tile
        :height="'100%'"
        :min-width="isMini ? '10' : 0"
        :style="{width: isMini ? '100%' : '22px'}"
        class="ma-0 d-flex justify-center align-center"
      >
        <v-img
          :src="BitlabLogo"
          alt="Logo"
          contain
          max-height="22"
          max-width="15"
        ></v-img>
        <v-icon
          v-if="isMini"
          @click="$emit('open-menu')"
          size="24"
          class="ml-2"
        >
          {{ mdiMenu }}
        </v-icon>
      </v-list-item-avatar>
      <v-list-item-title
        class="bitlab-logo-title ml-1"
      >
        Bitlab
      </v-list-item-title>
      <v-list-item-action>
        <v-icon
          :color="'#9FA4B1'"
          @click="$emit('close-menu')"
        >
          {{ mdiMenu }}
        </v-icon>
      </v-list-item-action>
    </v-list-item>
    <v-divider style="background: rgba(23, 23, 41, 0.08);"></v-divider>
    <v-list
      dense
      nav
      class="px-md-1 px-2 primary--text"
    >
      <v-list-item-group>
        <v-list-item
          :class="{'d-none d-md-flex py-1 my-1 mx-2 justify-center admin-nav__remove-background' : !isMini, 'admin-nav__remove-background' : isMini}"
          active-class="admin__list-item--active"
          :to="{
            name: 'Profile'
          }"
          :ripple="false"
        >
          <v-list-item-avatar
            width="47"
            height="47"
          >
            <img
              :src="avatar || UserPlaceholderSm"
            >
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              style="line-height: 20px"
            >{{ fullname }}
            </v-list-item-title>
            <v-list-item-subtitle
              class="grayLight--text"
              style="line-height: 20px; font-weight:400;"
            >{{ role }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="item in nav_items"
          :key="item.title"
          :ripple="false"
          class="py-1 my-1 mx-2"
          active-class="admin__list-item--active"
          :to="item.to"
        >
          <v-list-item-icon class="ma-2 mr-2">
            <v-icon :color="'#9FA4B1'">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="admin__list-item-content">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider
          class="my-4"
        ></v-divider>

        <v-list-item
          :ripple="false"
          class="py-1 my-1 mx-2"
          link
          exact
          active-class="admin__list-item--active"
          :to="{
          path: '/u/profile'
        }"
        >
          <v-list-item-icon class="ma-2 mr-2">
            <v-icon :color="'#9FA4B1'">
              {{ mdiDotsHorizontal }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="admin__list-item-content">Настройки</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-btn
      fixed
      bottom
      large
      style="border-radius: 10px; left: 18px"
      :width="!isMini ? 220 : ''"
      :color="'#EE5252'"
      outlined
      :icon="isMini"
      :ripple="false"
      @click="logout"
    >
      <span
        v-if="!isMini"
        class="text-capitalize admin-signout__v-btn--text"
      >Выйти</span>
      <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5" stroke="#EE5252" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M13.334 14.1667L17.5007 10L13.334 5.83334" stroke="#EE5252" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M17.5 10H7.5" stroke="#EE5252" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </v-btn>
  </div>
</template>

<script>
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png'
import BitlabLogo from '@/assets/png/bitlab_logo.png'
import {
  mdiBriefcaseVariantOutline,
  mdiViewDashboardOutline,
  mdiViewAgendaOutline,
  mdiViewWeekOutline,
  mdiAccountOutline,
  mdiDotsHorizontal,
  mdiHelpCircle,
  mdiExitToApp,
  mdiClose,
  mdiMenu,
} from "@mdi/js";

export default {
  name: "NavigationList",
  props: {
    isMini: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: ''
    },
    fullname: {
      type: String,
      default: 'Имя'
    },
    role_id: {
      type: Number,
      default: 0
    },
    role: {
      type: String,
      default: 'Студент'
    },
  },
  data() {
    return {
      BitlabLogo,
      mdiMenu,
      UserPlaceholderSm,
      mdiDotsHorizontal,
      mdiExitToApp,
      mdiClose,
      selectedItem: 'Пользователи',
      nav_items: [
        {
          title: 'Пользователи',
          icon: mdiAccountOutline,
          to: { name: 'AdminUsersIndex' }
        },
        {
          title: 'Курсы',
          icon: mdiViewAgendaOutline,
          to: { name: 'AdminCoursesIndex' }
        },
        {
          title: 'Потоки',
          icon: mdiViewWeekOutline,
          to: { name: 'AdminStreamIndex' }
        },
        {
          title: 'Заявки',
          icon: mdiViewDashboardOutline,
          to: { name: 'AdminPurchaseIndex' }
        },
        {
          title: 'Гайдлайны',
          icon: mdiHelpCircle,
          to: { name: 'AdminGuidelinesIndex' }
        },
        {
          title: 'Финансы курсов',
          icon: mdiBriefcaseVariantOutline,
          to: { name: 'AdminFinanceIndex' }
        }
      ]
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('session/delete').then(() => {
        this.$router.push('/login')
      });
    },
  },
}
</script>

<style lang="scss">
.v-list--nav .v-list-item, .v-list--nav .v-list-item::before {
  border-radius: 10px !important;
}

.admin__list-item--active {
  .v-icon {
    color: #0BC3B8 !important;
  }
}

.admin__list-item-content {
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0.01em;
  color: #5A6275;
  margin-left: 8px;
}

.admin__list-item--active::before {
  border-radius: 10px !important;
}

.admin__list-item--active .v-list-item__title {
  color: #0BC4B8 !important;
}

.bitlab-logo-title {
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  color: #0ACCDA;
}

.admin-nav__remove-background {
  &::before {
    background-color: transparent !important;
  }
}

.admin-signout__v-btn--text {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
}

</style>
