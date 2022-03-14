<template>
  <v-container>
    <v-row v-if="loading">
      <v-col>
        <v-skeleton-loader type="table" />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-if="exercises && exercises.length > 0">
        <v-simple-table class="my-table">
          <thead>
            <tr>
              <th
                class="text-left font-weight-regular grayLight--text pl-0"
                width="8%"
              >
                Урок
              </th>
              <th class="text-left font-weight-regular grayLight--text">
                Название
              </th>
              <th class="text-right font-weight-regular grayLight--text pr-0">
                Сдали
              </th>
              <th
                class="text-right font-weight-regular grayLight--text pr-0"
                width="20%"
              >
                Требуют проверки
              </th>
            </tr>
          </thead>
          <tbody>
            <template>
              <router-link
                v-for="(exercise, ekey) in exercises"
                tag="tr"
                :key="'event_exercises-' + ekey"
                :to="{
                  name: 'StreamExerciseShow',
                  params: {
                    stream_id: stream_id,
                    exercise_id: exercise.id,
                  },
                }"
                :style="{
                  cursor: 'pointer',
                }"
              >
                <td class="pl-0">{{ '#' + (ekey + 1) }}</td>
                <!-- <td class="text-capitalize text-no-wrap">
                {{ exercise.date | longFormat }}
              </td> -->
                <td style="font-weight: 600;font-size: 15px">
                  {{ exercise.title }}
                </td>
                <td class="text-right pr-0">
                  {{ exercise.passed + '/' + group_size }}
                </td>
                <td class="text-right pr-md-12" style="color: #0BC4B8">
                  {{ exercise.not_checked }}
                </td>
              </router-link>
            </template>
          </tbody>
        </v-simple-table>
      </v-col>
      <EmptyPlaceholder v-else :text="'Пусто...'" />
    </v-row>
  </v-container>
</template>

<script>
import EmptyPlaceholder from '@/components/EmptyPlaceholder'

export default {
  name: 'StreamPracticeShow',
  components: {
    EmptyPlaceholder,
  },
  props: ['stream_id', 'practice_id'],
  data() {
    return {
      loading: false,
      exercises: undefined,
      group_size: undefined,
      chapter_name: undefined,
    }
  },
  mounted() {
    this.fetchGroupLessons().then(() => {
      this.$store.dispatch('breadcrumbs/setLinks', [
        {
          text: 'Практики',
          to: {
            name: 'StreamPracticeIndex',
            params: {
              // module_id: this.courseModuleId,
              stream_id: this.stream_id,
            },
          },
          back: true,
        },
        {
          text: this.chapter_name,
          disabled: true,
          // to: { name: 'LessonShow', params: { lesson_id: this.lesson_id }}
        },
      ])
    })
  },
  methods: {
    async fetchGroupLessons() {
      this.loading = true
      await this.$axios
        .get(
          `teacher/lite/streams/${this.stream_id}/practices/${this.practice_id}`
        )
        .then((res) => {
          if (res && res.data) {
            // console.log(`teacher/get-group/${this.group_id}/practices/${this.event_id}`, res.data)
            // console.log('practice-show', res.data)
            this.chapter_name =
              (res.data.chapter && res.data.chapter.title) || ''
            this.exercises = res.data.exercises
            this.group_size = res.data.total_students || '-'
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
