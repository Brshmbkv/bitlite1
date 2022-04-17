<template>
  <v-container fluid>
    <template v-if="loading">
      <v-sheet color="white" class="pa-4 my-5" width="100%">
        <div class="d-flex">
          <v-skeleton-loader
            class="ma-0"
            width="120"
            height="120"
            type="image"
          />
          <v-skeleton-loader type="article" width="100%" />
        </div>
        <v-row style="flex-basis: 100%">
          <v-col v-for="i in 4" :key="i">
            <v-skeleton-loader type="list-item-avatar-two-line" />
          </v-col>
        </v-row>
      </v-sheet>
      <v-sheet color="white" class="pa-4 my-5" height="270">
        <v-skeleton-loader height="200px" type="table-tbody" />
      </v-sheet>
      <v-sheet color="white" class="pa-3 my-5" width="50%" height="150">
        <v-skeleton-loader height="100" type="table-tbody" />
      </v-sheet>
    </template>
    <template v-else>
      <v-row align="center">
        <v-col>
          <BackButton />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <StudentInfoAdmin :user="user" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <StudentCoursesAdmin
            :courses="courses || []"
            :user_id="Number(user_id)"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col md="7" cols="12">
          <StudentPaymentsAdmin :payments="payments" />
        </v-col>
        <v-col cols="12" md="5">
          <StudentQuestionnaireAdmin :questions="questions" />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import { mdiChevronLeft } from '@mdi/js'
import StudentPaymentsAdmin from '@/components/Admin/user/student/StudentPaymentsAdmin'
import StudentCoursesAdmin from '@/components/Admin/user/student/StudentCoursesAdmin'
import StudentInfoAdmin from '@/components/Admin/user/student/StudentInfoAdmin'
import StudentQuestionnaireAdmin from '@/components/Admin/user/student/StudentQuestionnaireAdmin'
import BackButton from '@/components/Admin/BackButton'

export default {
  name: 'StudentShow',
  components: {
    BackButton,
    StudentQuestionnaireAdmin,
    StudentInfoAdmin,
    StudentCoursesAdmin,
    StudentPaymentsAdmin,
  },
  props: ['user_id'],
  data() {
    return {
      mdiChevronLeft,
      loading: false,
      user: undefined,
      courses: undefined,
      payments: undefined,
      questions: undefined,
    }
  },

  beforeMount() {
    this.loading = true
    this.fetchUser().finally(() => {
      this.loading = false
    })
  },
  methods: {
    async fetchUser() {
      await this.$axios.get('admin/students/' + this.user_id).then((res) => {
        if (res && res.data) {
          this.user = res.data.user
          this.courses = res.data.courses
          this.payments = res.data.purchases
          this.questions = res.data.questionnaires
        }
      })
    },
  },
}
</script>

<style lang="scss">
.show-user-courses__v-card.v-card--link {
  &::before {
    background: none !important;
  }
}

.show-user__card {
  border-radius: 10px !important;
  border: 1px solid rgba(23, 23, 41, 0.08) !important;
  background-color: #ffffff;
}

.show-user__card-footer-top-text {
  font-weight: 500;
  font-size: 16px;
  line-height: 140%;
  color: #5a6275;
  @media screen and (max-width: 576px) {
    font-weight: 500;
    font-size: 14px;
    line-height: 140%;
    color: #5a6275;
  }
}

.show-user__card-footer-bot-text {
  font-size: 12px;
  line-height: 15px;
  color: #9fa4b1;
}

.show-user__label {
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
}

.show-user__goal {
  p {
    font-size: 12px;
    line-height: 15px;
    color: #9fa4b1;
  }

  font-size: 14px;
  line-height: 140%;
  color: #5a6275;
}

.active-courses__buttons {
  background: #ffffff;
  border: 1px solid rgba(23, 23, 41, 0.08);
  border-radius: 5px;
}

.show-user-courses__table {
  td {
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: #171729;
    border-bottom: 0 !important;
    padding-bottom: 5px;
  }

  th {
    border-bottom: 0 !important;
  }
}
</style>
