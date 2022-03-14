<template>
  <div>
    <HoverableButton
      v-if="!hideButton"
      text="Решение тренера"
      color="#4376FB"
      :icon="mdiLightbulbOutline"
      :text-color-on-hover="textColorOnHover"
      @click="$emit('open')"
    />
    <v-dialog v-model="dialog" width="80%" persistent>
      <div class="pa-6 teacher-answer__content">
        <CloseDialogButton @click="$emit('close')" />
        <div v-if="loading" class="teacher-answer__progress">
          <v-progress-circular indeterminate color="#0BC3B8" size="44" />
        </div>
        <v-row
          v-else-if="hasAnswersInProps || (teacher_answer && student_answer)"
          class="ma-0 pa-0"
        >
          <v-col
            cols="12"
            md="6"
            :style="{
              borderRight: $vuetify.breakpoint.mdAndUp
                ? '1px solid rgba(23, 23, 41, 0.1)'
                : '',
            }"
          >
            <p class="teacher-answer__title">Ваше решение:</p>
            <highlight
              autodetect
              class="teacher-answer__code"
              :code="studentAnswer || student_answer"
            />
          </v-col>
          <v-col cols="12" md="6">
            <p class="teacher-answer__title">Решение тренера:</p>
            <highlight
              autodetect
              class="teacher-answer__code"
              :code="teacherAnswer || teacher_answer"
            />
          </v-col>
        </v-row>
        <div v-else>
          <h3>Решение тренера не найдено</h3>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { mdiLightbulbOutline } from '@mdi/js'
import highlight from '@/components/highlight.vue'
import HoverableButton from '@/components/HoverableButton'
import CloseDialogButton from '@/components/Admin/CloseDialogButton'

export default {
  name: 'LessonPracticeTeacherAnswer',
  components: {
    CloseDialogButton,
    HoverableButton,
    highlight,
  },
  props: {
    dialog: Boolean,
    exerciseId: Number,
    studentAnswer: String,
    teacherAnswer: String,
    textColorOnHover: {
      type: String,
      default: '#FFFFFF',
    },
    hideButton: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mdiLightbulbOutline,
      loading: false,
      student_answer: undefined,
      teacher_answer: undefined,
    }
  },
  computed: {
    hasAnswersInProps() {
      return !!this.studentAnswer && !!this.teacherAnswer
    },
  },
  watch: {
    dialog: {
      handler(value) {
        if (value && this.exerciseId && !this.hasAnswersInProps) {
          this.loading = true
          this.fetchTeacherAnswer()
        }
      },
      immediate: true,
    },
  },
  methods: {
    async fetchTeacherAnswer() {
      this.loading = true
      try {
        const res = await this.$axios.get(
          `submit-exercise/${this.exerciseId}/teacher-answer`
        )
        this.student_answer = res?.data?.student_answer
        this.teacher_answer = res?.data?.teacher_answer
      } catch (e) {
        throw new Error(e)
      }
      this.loading = false
    },
  },
}
</script>

<style lang="scss">
.teacher-answer__progress {
  height: 100%;
}
.teacher-answer__content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background-color: #ffffff;
}
.teacher-answer__title {
  font-size: max(1.5vw, 20px);
  font-weight: 700;
}
.teacher-answer__code {
  .hljs {
    max-height: 70vh;
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(23, 23, 41, 0.08);
      border-radius: 100px;
    }

    &::-webkit-scrollbar-thumb {
      background: #5a6275;
      border-radius: 100px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  }
}
</style>
