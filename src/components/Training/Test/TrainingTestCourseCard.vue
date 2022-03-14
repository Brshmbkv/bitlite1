<template>
  <v-card
    flat
    width="380px"
    style="border: 1px solid rgba(23, 23, 41, 0.08); border-radius: 4px"
    :ripple="false"
    :disabled="total_tests === 0"
    :to="{
       name: 'TrainingCoursesShow',
       params: {
         course_id
       }
    }"
  >
    <v-card-text class="pa-6">
      <v-row justify="space-between">
        <v-col
          cols="auto"
        >
          <p style="font-size: 18px; font-weight: 600; color: #171729" class="mt-2 mb-6">{{ title }}</p>
          <p class="d-flex align-center mb-2" style="font-size: 13px; color: #5A6275; gap: 5px">
            <ChartBarIcon
              class="training-test__icon"
            />
            Уровень: {{ level }}
          </p>
          <p class="d-flex align-center mb-0" style="font-size: 13px; color: #5A6275; gap: 10px">
            <GridFourIcon/>
            Кол-во тестов: {{ total_tests }}
          </p>
        </v-col>
        <v-col
          cols="auto"
        >
          <JavaIcon
            v-if="title.toLowerCase().includes('java')"
          />
          <PythonIcon
              v-if="title.toLowerCase().includes('python')"
          />
          <PHPIcon
              v-if="title.toLowerCase().includes('php')"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider/>
    <v-card-text v-if="total_tests > 0">
      <p class="d-flex align-center justify-space-between">
        <span style="font-size: 12px; color: #9FA4B1">
          Пройдено
        </span>
        <span class="font-weight-bold error--text">
          {{ Math.floor((passed_tests/total_tests) * 100) }}%
        </span>
      </p>
      <p class="mb-0">
        <v-progress-linear
          color="red darken-2"
          rounded
          :value="(passed_tests/total_tests) * 100"
        ></v-progress-linear>
      </p>
    </v-card-text>
    <v-card-text
      v-else
      class="d-flex align-center justify-center"
    >
      <span class="font-weight-bold">
        Тесты скоро появятся!
      </span>
    </v-card-text>
  </v-card>
</template>

<script>
import ChartBarIcon from '@/assets/svg/chartbar.svg'
import GridFourIcon from '@/assets/svg/grid_four.svg'
import JavaIcon from '@/assets/svg/java.svg'
import PythonIcon from '@/assets/svg/python.svg'
import PHPIcon from '@/assets/svg/php.svg'

export default {
  name: "TrainingTestCourseCard",
  components: {
    ChartBarIcon,
    GridFourIcon,
    JavaIcon,
    PHPIcon,
    PythonIcon,
  },
  props: {
    course_id: Number,
    title: String,
    total_tests: Number,
    passed_tests: Number,
    level: String,
  }
}
</script>

<style lang="scss">
.training-test__icon {
  path {
    stroke: #5A6275;
    transform: scale(0.8);
  }
}
</style>
