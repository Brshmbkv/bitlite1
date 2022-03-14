<template>
  <div>
    <v-tabs
      v-model="currentTab"
      style="box-shadow: rgba(23, 23, 41, 0.08) 0 1px 0;"
      background-color="white"
      class="mb-8"
    >
      <v-tabs-slider/>
      <v-tab
        class="text-capitalize"
        :ripple="false"
        href="#students"
      >Список сдавших
      </v-tab>
      <v-tab
        class="text-capitalize"
        :ripple="false"
        href="#content"
      >Контент
      </v-tab>
      <!-- @click="handleTabClick('attendance')" -->
    </v-tabs>
    <v-tabs-items v-model="currentTab" touchless>
      <v-tab-item value="students">
        <v-row
          class="pa-0 ma-0 mb-5"
        >
          <v-chip-group
            v-model="type"
            mandatory
            :color="'#0BC3B8'"
            :active-class="'active-type__chip'"
          >
            <v-chip
              outlined
              :value="'need-score'"
              :color="'#0BC3B8'"
              :ripple="false"
            >Ожидают проверки
            </v-chip>
            <v-chip
              outlined
              :value="'scored'"
              :color="'#0BC3B8'"
              :ripple="false"
            >Оцененные
            </v-chip>
            <v-chip
              outlined
              :value="'not-passed'"
              :color="'#0BC3B8'"
              :ripple="false"
            >Не сдавшие
            </v-chip>
          </v-chip-group>
        </v-row>
        <v-skeleton-loader
          v-if="loading"
          type="table-tbody"
        />
        <StudentExercisesTable
          v-if="!loading"
          :content="exercise && exercise.content"
          :studentResults="studentResultsMap || []"
          :stream_id="stream_id"
          :group_id="group_id"
          :event_id="lesson && lesson.id"
          :exercise_id="exercise && exercise.id"
          @onScoreChange="handleScoreChange"
          @order-by-column="(col) => {
            this.column = col
            this.order = (this.order === 'asc') ?
              (this.order = 'desc') : this.order = 'asc'
          }"
        />
      </v-tab-item>
      <v-tab-item value="content">
        <v-skeleton-loader
          v-if="loading"
          type="article"
        />
        <div
          v-else-if="exercise"
        >
          <h2 class="mb-5">{{ exercise.title }}</h2>
          <div v-html="decodeHTML(exercise.content)"></div>
        </div>
        <div v-else>
          Нет информации
        </div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import StudentExercisesTable from "@/components/Teacher/Group/StudentExercisesTable";
import { decodeHTML } from "@/helpers";

export default {
  name: "PassedStudentsList",
  components: { StudentExercisesTable },
  props: {
    exercise_id: Number,
    stream_id: Number,
    group_id: Number,
    pageY: Number,
    from_exercises: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      exercise: undefined,
      exercise_results: undefined,
      studentResultsMap: undefined,
      loading: false,
      currentTab: undefined,
      lesson: undefined,
      column: 'score',
      order: 'desc',
      type: 'need-score',
    }
  },
  watch: {
    order(newValue, oldValue) {
      if(newValue !== oldValue) {
        this.fetchExercises()
      }
    },

    type(newVal, oldVal) {
      if(newVal !== oldVal) {
        this.fetchExercises()
      }
    },
  },
  mounted() {
    this.fetchExercises().then(() => {
      this.$nextTick(() => {
        this.$store.dispatch('breadcrumbs/setLinks', [
          ...(this.group_id ?
            [this.from_exercises ?
              {
                text: 'Задания на проверку',
                to: {
                  name: 'TeacherExercisesIndex'
                },
                back: true,
                underline: true
              } : {
                back: true,
                text: this.lesson.title,
                to: {
                  name: 'GroupEventShow',
                  params: {
                    event_id: this.lesson.id,
                    group_id: this.group_id,
                    pageY: this.pageY
                  },
                }
              }] : []),
          ...((this.stream_id) ?
            [{
              back: true,
              text: this.lesson.title,
              to: {
                name: 'StreamPracticeShow',
                params: {
                  stream_id: this.stream_id,
                  practice_id: this.lesson.id
                }
              }
            }] : []),
          {
            text: this.exercise.title,
            disabled: true,
            // to: { name: 'LessonShow', params: { lesson_id: this.lesson_id }}
          },
        ])
      })
    })
  },
  methods: {
    decodeHTML,
    async fetchExercises() {
      if(this.loading) return;
      let uri =
        (this.stream_id &&
          `teacher/lite/streams/${ this.stream_id }/exercises/${ this.exercise_id }`) ||
        (this.group_id &&
          `teacher/get-group/${ this.group_id }/exercises/${ this.exercise_id }`)

      this.loading = true;
      await this.$axios.get(uri, {
        params: {
          order: this.order,
          column: this.column,
          ...((this.type === 'need-score') ? { is_checked: false } : ((this.type === 'scored') ? { is_checked: true } : undefined)),
          ...((this.type === 'not-passed') ? { not_passed_students: true } : undefined)
        }
      })
        .then((res) => {
          if(res && res.data) {
            this.exercise = res.data.exercise;
            this.lesson = res.data.event || res.data.chapter;
            let exercise_results = this.type !== 'not-passed' ? (res.data.exercise.results || []) : (res.data.not_passed_students || []);
            let answer_type = res.data.exercise.answer_type || undefined;
            if(this.type === 'not-passed') {
              this.studentResultsMap = exercise_results.map((result) => {
                return {
                  ...result,
                  answer_type: answer_type,
                  result: undefined
                }
              });
            } else {
              this.studentResultsMap = exercise_results.map((result) => {
                return {
                  ...result.user,
                  answer_type: answer_type,
                  result: result
                }
              });
            }
            // console.log(`teacher/get-group/${this.group_id}/exercises/${this.exercise_id}`, res.data)
          }
        }).finally(() => {
          this.loading = false
        })
    },

    // async fetchEventAttendance(){
    //   if (this.attendance_loading) return;
    //   this.attendance_loading = true;
    //   this.attendance = undefined;
    //   await this.$axios.get('teacher/attendances/'+this.event_id).then((res) => {
    //     console.log('teacher/attendances/'+this.event_id, res.data)
    //     this.attendance = res.data;
    //   }).finally(() => {
    //     this.attendance_loading = false
    //   })
    // },

    handleScoreChange(data) {
      this.studentResultsMap = this.studentResultsMap.map((student) => {
        if(data.user_id === student.id) {
          student.result.comment = data.comment;
          student.result.score = data.score;
          student.result.is_checked = true;
        }
        this.$store.dispatch('snackbar/START_SNACKBAR', {
          text: 'Сохранено!',
          color: 'success'
        })
        return student
      })
    }
  },
}
</script>

<style lang="scss">
.v-chip.v-chip--outlined.v-chip.v-chip.active-type__chip {
  background-color: #0BC3B8 !important;
  color: white !important;
}
</style>
