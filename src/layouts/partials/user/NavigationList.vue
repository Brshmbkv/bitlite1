<template>
  <v-list dense nav flat class="user__navigation-list pb-6 pa-0 primary--text">
    <v-list-item class="d-md-none d-flex">
      <v-btn icon elevation="0" class="ml-auto" @click="$emit('close-menu')">
        <v-icon>
          {{ mdiClose }}
        </v-icon>
      </v-btn>
    </v-list-item>
    <!-- STUDENT -->
    <template v-if="role_id === 2">
      <v-list-item link :ripple="false" :to="{ name: 'CoursesIndex' }">
        <v-list-item-icon>
          <MyCoursesIcon />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Мои курсы</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!-- <v-list-item link :ripple="false" :to="{ name: 'ExercisesIndex' }">
        <v-list-item-icon>
          <ExercisesIcon class="change-fill" />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Мои задания</v-list-item-title>
        </v-list-item-content>
      </v-list-item> -->
      <v-list-item :ripple="false" link :to="{ name: 'CoursesCatalogIndex' }">
        <v-list-item-icon>
          <CourseCatalogIcon />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Каталог курсов</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!--      <v-list-item-->
      <!--        :ripple="false"-->
      <!--        link-->
      <!--        :to="{ name: 'Guidelines' }"-->
      <!--      >-->
      <!--        <v-list-item-icon>-->
      <!--          <v-icon class="change-fill">{{ mdiHelpCircle }}</v-icon>-->
      <!--        </v-list-item-icon>-->
      <!--        <v-list-item-content>-->
      <!--          <v-list-item-title>Гайдлайны</v-list-item-title>-->
      <!--        </v-list-item-content>-->
      <!--      </v-list-item>-->
      <!--      <v-list-item-->
      <!--          :ripple="false"-->
      <!--          link-->
      <!--          :to="{-->
      <!--            name: 'TrainingCoursesIndex'-->
      <!--          }"-->
      <!--      >-->
      <!--        <v-list-item-icon>-->
      <!--          <TrainingIcon/>-->
      <!--        </v-list-item-icon>-->
      <!--        <v-list-item-content>-->
      <!--          <v-list-item-title>Тренажерка</v-list-item-title>-->
      <!--        </v-list-item-content>-->
      <!--      </v-list-item>-->
      <!--      <v-list-item-->
      <!--        :ripple="false"-->
      <!--        link-->
      <!--        exact-->
      <!--        :to="{-->
      <!--          name: 'Payments'-->
      <!--        }"-->
      <!--      >-->
      <!--        <v-list-item-icon>-->
      <!--          <PurchasesIcon/>-->
      <!--        </v-list-item-icon>-->
      <!--        <v-list-item-content>-->
      <!--          <v-list-item-title>История покупок</v-list-item-title>-->
      <!--        </v-list-item-content>-->
      <!--      </v-list-item>-->
      <v-list-item
        :ripple="false"
        link
        active-class="primary-text"
        :to="{
          path: '/u/profile',
        }"
      >
        <v-list-item-icon>
          <v-icon class="change-fill">{{ mdiAccount }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Личный кабинет</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <!-- STUDENT END -->
    <!-- TEACHER START -->
    <template v-if="role_id === 3">
      <v-list-item :ripple="false" link :to="{ path: '/t/stream' }">
        <v-list-item-icon>
          <MyCoursesIcon />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Потоки</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!-- <v-list-item :ripple="false" link :to="{ name: 'TeacherExercisesIndex' }">
        <v-list-item-icon>
          <ExercisesIcon class="change-fill" />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Задания на проверку</v-list-item-title>
        </v-list-item-content>
      </v-list-item> -->
      <!-- <v-list-item
        :ripple="false"
        link
        :to="{ name: 'TeacherGuidelinesIndex' }"
      >
        <v-list-item-icon>
          <v-icon class="change-fill">{{ mdiHelpCircle }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Гайдлайны</v-list-item-title>
        </v-list-item-content>
      </v-list-item> -->
      <v-list-item
        :ripple="false"
        link
        active-class="primary-text"
        :to="{
          path: '/t/profile',
        }"
      >
        <v-list-item-icon>
          <v-icon class="change-fill">{{ mdiAccount }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Личный кабинет</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <!-- TEACHER END -->
    <v-list-item :ripple="{ class: 'red--text' }" link @click="logout">
      <v-list-item-icon>
        <LogOutIcon />
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Выйти</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script>
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png'
import { mdiClose, mdiAccount, mdiHelpCircle } from '@mdi/js'
import MyCoursesIcon from '@/assets/svg/nav_courses.svg'
// import PurchasesIcon from '@/assets/svg/nav_purchases.svg'
import LogOutIcon from '@/assets/svg/nav_logout.svg'
// import ExercisesIcon from "@/assets/svg/task.svg";
// import TrainingIcon from '@/assets/svg/nav_training.svg'
import CourseCatalogIcon from '@/assets/svg/nav_course-catalog.svg'

export default {
  name: 'NavigationList',
  components: {
    MyCoursesIcon,
    // PurchasesIcon,
    LogOutIcon,
    // TrainingIcon,
    CourseCatalogIcon,
    // ExercisesIcon,
  },
  props: {
    avatar: {
      type: String,
      default: '',
    },
    fullname: {
      type: String,
      default: 'Имя',
    },
    role_id: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      default: 'Студент',
    },
  },
  data() {
    return {
      UserPlaceholderSm,
      mdiAccount,
      mdiClose,
      mdiHelpCircle,
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('session/delete').then(() => {
        this.$router.push('/login')
      })
    },
  },
}
</script>
<style lang="scss">
.v-list.user__navigation-list {
  padding: 0 24px !important;
}
.user__navigation-list {
  .v-list-item.v-list-item--link {
    padding: 4px 0 4px 26px;
    border-radius: 8 !important;
  }

  .v-list-item--link:not(.v-list-item--active) {
    .v-list-item__content {
      color: #5a6275;
    }
  }

  .highlighted {
    color: #4376fb;
  }

  .dark {
    &.highlighted {
      color: #4376fb;
    }
  }

  .v-list-item__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px !important;
  }

  .v-list-item--active {
    padding-left: 22px !important;
    background-color: #4376fb29;
    border-radius: 8 !important;
    color: #4376fb !important;

    path {
      stroke: #4376fb;
    }

    .change-fill {
      path {
        fill: #4376fb;
        stroke: transparent;
      }
    }
  }
}
</style>
