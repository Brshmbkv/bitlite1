<template>
  <v-container>
    <v-row v-if="user_modules_loading">
      <v-col cols=12 md=4 lg=3>
        <v-skeleton-loader
          type="list-item-avatar-two-line, divider"
        />
      </v-col>
    </v-row>
    <v-row v-else-if="!user_modules_fetch_error">
      <v-col cols="12">
        <div class="d-flex">
          <v-avatar
            size="70"
            class="mx-3"
          >
            <v-img
              :src="u_avatar || UserPlaceholderSm"
              alt=""
            />
          </v-avatar>
          <div class="my-auto ml-2">
            <span class="groupStudent_name">{{ (u_firstname ? (u_firstname + ' ') : '') + (u_lastname || '') }}</span>
            <span class="groupStudent_phone">{{ u_phone || ' - ' }}</span>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="user_modules_loading">
      <v-col>
        <v-skeleton-loader
          type="button, divider"
        />
      </v-col>
    </v-row>
    <template v-else-if="user_modules">
      <v-tabs
      class="mt-6"
        color="#00665E"
        v-model="tab"
      >
        <v-tab
          v-for="mod in user_modules"
          class="text-capitalize student-module__tab"
          :disabled="m_loading"
          :ripple="false"
          :key="mod.id"
        >{{mod.title}}</v-tab>
      </v-tabs>
      <v-divider></v-divider>
    </template>
    <!-- MODULE LESSONS TABLE -->
    <v-row v-if="m_loading">
      <v-col>
        <v-skeleton-loader
          type="table"
        />
      </v-col>
    </v-row>
    <StudentLessonsTable
      class="mt-4"
      v-else-if="!m_fetch_error"
      :events="m_events"
      :student_id='student_id'
      :stream_id="stream_id"
      :are-links="true"
    />
    <!-- <student-information-panel
      v-if="!m_loading"
      :email="u_email"
      :experience="u_experience"
      :goal="u_goal"
      :age="u_age"
      :testScore="u_test_score"
    /> -->
    <!-- :are-links='m_is_practicant' -->
    <!-- MODULE LESSONS TABLE -->
    <!-- USER STATS -->
    <v-row v-if="m_loading">
      <v-col v-for="i in 3" :key="i" md="4">
        <v-skeleton-loader
          type="list-item-avatar-two-line"
        />
      </v-col>
    </v-row>

    <course-stats
    class="mt-8"
      v-else-if="!m_fetch_error"
      :loading="m_loading"
      :total_events="m_total_events"
      :passed_events="m_passed_events"
      :end_date="m_end_date"
      :points="!isNaN(Number(m_score)) ? Number(m_score) : undefined"
      :level="m_level"
      :prerequesit="m_prerequesit"
      hide_cheerups
    />
    <p v-else>Ошибка загрузки статисткик</p>
    <!-- USER STATS -->
  </v-container>
</template>
<script>

import UserPlaceholderSm from '@/assets/user_placeholder_sm.png';
import StudentLessonsTable from '@/components/Teacher/Student/LessonsTable';
import CourseStats from "@/components/Courses/show/CourseStats";
// import StudentInformationPanel from '@/components/Teacher/Student/StudentInformationPanel.vue';

export default {
  name: 'TeacherGroupStudentShow',
  components: {
    CourseStats,
    StudentLessonsTable,
    // StudentInformationPanel
  },
  props: ['group_id', 'student_id'],
  data() {
    return {
      UserPlaceholderSm,
      stream_id: '',
      module_id: undefined,
      group_name: '',
      tab: undefined,
      tab_disabled: false,
      // Module Info
      m_events: undefined,
      m_end_date: undefined,
      m_fetch_error: false,
      m_is_practicant: undefined,
      m_level: undefined,
      m_loading: true,
      m_name: undefined,
      m_passed_events: undefined,
      m_prerequesit: undefined,
      m_score: undefined,
      m_total_events: undefined,
      m_chapters: undefined,
      // User info
      u_id: undefined,
      u_avatar: undefined,
      u_firstname: undefined,
      u_lastname: undefined,
      u_phone: undefined,
      u_email: undefined,
      u_test_score: undefined,
      u_experience: undefined,
      u_goal: undefined,
      u_age: undefined,
      // User Modules (Tabs)
      user_modules: undefined,
      user_modules_loading: true,
      user_modules_fetch_error: false,
      // CHART
      // chart_scores: [],
      // total_passed: undefined,
      // total_exercises: undefined,
    }
  },
  watch: {
    tab: {
      immediate: true,
      handler(newId, oldId) {
        if(newId !== oldId) {
          this.fetchModule(this.user_modules[newId]?.id)
            .finally(() => this.m_loading = false)
          // .then(() => {
          //   this.fetchActivities()
          //     .finally(() => {
          //       this.m_loading = false;
          //     })
          // })
        }
      }
    }
  },
  mounted(){
    this.fetchUserModules()
      .finally(() => {
        this.$store.dispatch('breadcrumbs/setLinks', [
          {
            text: this.group_name || 'Назад',
            // expression returns < to: {...} > OR < action: () => {...} >
            ...((this.stream_id && this.group_id) ? {
              to: {
                name: "StreamGroupIndex",
                params: {
                  stream_id: this.stream_id,
                  group_id: this.group_id,
                },
              }
            } : {
              action: () => {
                this.$router.back();
              }
            }),
            back: true,
            underline: true,
          },
          ...(this.u_firstname || this.u_lastname ? [{
            text: (this.u_firstname || '') + ' ' + (this.u_lastname || ''),
            disabled: true,
          }] : []),
        ])
      });
  },
  methods:{

    // handleTabClick(tab) {
    //   if (!this.loading) {
    //     this.module_id = tab.id;
    //   }
    // },

    async fetchUserModules(){
      await this.$axios.get(`teacher/get-group/${this.group_id}/get-student/${this.student_id}/modules`).then(({ data }) => {
        if (data){
          // console.log( data)
          this.group_name = data.group.name
          this.user_modules = data.modules
          this.tab = data.modules.findIndex((module) => (module.active)) > 0 ? data.modules.findIndex(module => module.active) : 0;
          this.stream_id = data.group.parent_id
          if (data.student && data.additional_info){
            this.u_id = data.student.id;
            this.u_avatar =  data.student.avatar;
            this.u_firstname = data.student.first_name;
            this.u_lastname = data.student.last_name;
            this.u_phone = data.student.phone;
            this.u_email = data.student.email || '-';
            this.u_experience = data.additional_info.experience || '-';
            this.u_goal = data.additional_info.goal || '-';
            this.u_age = data.additional_info.age || '0';
            this.u_test_score = data.student.logic_test_score || '0';
          }

        }
      }).catch((err) => {
        console.error(err);
        return Promise.reject(err)
      }).finally(() => {
        this.user_modules_loading = false;
      })
    },

    async fetchModule(module_id){
      this.m_loading = true;
      this.module_id = module_id
      await this.$axios.get(`teacher/get-group/${this.group_id}/get-student/${this.student_id}/modules/${module_id}` //to $axios
      ).then(({ data }) => {
        if (data) {
          try {
            let {
              ends_at,
              events,
              level,
              module_title,
              passed_events,
              prerequesit,
              score,
              total_events,
            } = data;
            this.m_end_date = ends_at;
            this.m_events = events;
            this.m_level = level;
            this.m_name = module_title;
            this.m_passed_events = passed_events;
            this.m_prerequesit = prerequesit;
            this.m_score = score;
            this.m_total_events = total_events;
            this.m_chapters = events.map(chapter => {
              return chapter.chapter && chapter.chapter.title
            })
          } catch (err) {
            console.error("Error response:", err);
            this.m_end_date = undefined;
            this.m_events = undefined
            this.m_fetch_error = true
            this.m_level = undefined;
            this.m_name = undefined;
            this.m_passed_events = undefined;
            this.m_prerequesit = undefined;
            this.m_score = undefined;
            this.m_total_events = undefined;
          }
          if (data.group){
            this.is_practicant = data.group.is_practicant
          }
        } else {
          throw new Error('Ошибка ответа: нет data');
        }
        // console.log(`teacher/get-group/${this.group_id}/get-student/${this.student_id}:`, data);
      }).catch((err) => {
        console.error(err);
      })
    },

    // async fetchActivities() {
    //   await this.$axios.get(`teacher/get-group/${this.group_id}/get-student/${this.student_id}/modules/${this.module_id}/dashboard`) //to $axios
    //     .then(res => {
    //       if(res && res.data) {
    //         let scores = res.data.scores.map(num => {
    //           if(num)
    //             return num
    //           return 0
    //         })
    //         // let passed = res.data.total_passed.map((ex, idx) => {
    //         //   return (ex + '/' + res.data.total_exercises[idx])
    //         // })
    //         this.chart_scores[0] = {
    //           name: 'Оценка',
    //           type: 'area',
    //           data: scores
    //         }
    //         this.total_exercises = res.data.total_exercises
    //         this.total_passed = res.data.total_passed
    //         // this.chart_scores[1] = {
    //         //   name: 'Сдано',
    //         //   type: '',
    //         //   data: passed
    //         // }
    //       }
    //     })
    // },
  },
}
</script>
<style lang="scss">
.groupStudent_name {
  display: block;
  color: #171729;
  padding-bottom: 5px;
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.02em;
  text-align: left;
}

.groupStudent_phone {
  display: block;
  color: #5A6275;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.02em;
  text-align: left;
}

// .student-module__tab {
//   font-weight: 600 !important;
//   font-size: 16px !important;
//   line-height: 19px !important;
//   color: #171729 !important;
//   letter-spacing: 0 !important;

//   &.v-tab--active {
//     font-weight: 600 !important;
//     font-size: 16px !important;
//     line-height: 19px !important;
//     color: #0BC3B8 !important;
//     letter-spacing: 0 !important;
//   }

//   &::before {
//     background-color: transparent !important;
//   }
// }
</style>
