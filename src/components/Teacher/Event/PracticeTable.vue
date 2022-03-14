<template>
  <div>
    <v-skeleton-loader
      v-if="loading"
      class="mb-3"
      type="table-tbody"
      :types="{
        'table-tbody': 'table-row-divider@10',
      }"
    />
    <v-simple-table v-else-if="exercises.length > 0" class="my-table">
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
          <th class="text-right font-weight-regular grayLight--text pr-0">
            Требуют проверки
          </th>
          <th
            class="text-right font-weight-regular grayLight--text pr-0"
            width="10%"
          >
            Сложность
          </th>
        </tr>
      </thead>
      <tbody>
        <template>
          <tr
            v-for="(exercise, ekey) in exercises"
            :key="'event_exercises-' + ekey"
            :ref="`exercise-${exercise.id}`"
            :style="{
              cursor: 'pointer',
            }"
            @click="toPage($event, exercise.id)"
          >
            <td class="pl-0">{{ `#${ekey + 1 + (current_page - 1) * 10}` }}</td>
            <!-- <td class="text-capitalize text-no-wrap">
            {{ exercise.date | longFormat }}
          </td> -->
            <td style="font-weight: 600;font-size: 15px">
              {{ exercise.title }}
            </td>
            <td class="text-right pr-0">
              {{ exercise.passed + '/' + total_students }}
            </td>
            <td class="text-right pr-md-12" style="color: #0BC4B8">
              {{ exercise.not_checked }}
            </td>
            <td class="text-right pr-0" style="color: #0BC4B8">
              <LevelBars
                class="status-bar__level-bar--dark ml-5 mr-2"
                :class="{
                  'status-bar__level-bar--1': exercise.level_coef === '0.3',
                  'status-bar__level-bar--2': exercise.level_coef === '0.5',
                  'status-bar__level-bar--3': exercise.level_coef === '1',
                }"
              />
            </td>
          </tr>
        </template>
      </tbody>
    </v-simple-table>
    <courses-empty-placeholder v-else text="Задачи не найдены" />
  </div>
</template>

<script>
import LevelBars from '@/assets/svg/status_level_3.svg'
import CoursesEmptyPlaceholder from '@/components/EmptyPlaceholder'

export default {
  name: 'PracticeTable',
  components: {
    CoursesEmptyPlaceholder,
    LevelBars,
  },
  props: {
    total_students: [Number, String],
    current_page: Number,
    exercises: {
      type: Array,
      default() {
        return []
      },
    },
    group_id: Number,
    pageY: Number,
    loading: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    pageY: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.$nextTick(() => {
            window.scrollTo(0, newValue)
          })
        }
      },
    },
  },
  methods: {
    toPage(event, id) {
      this.$router.push({
        name: 'StreamExerciseShow',
        params: {
          group_id: this.group_id,
          exercise_id: id,
          pageY: (event.pageY > 40 && event.pageY - 40) || 0,
        },
      })
    },
  },
}
</script>
