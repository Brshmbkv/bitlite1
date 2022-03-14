<template>
  <div>
    <v-row
      class="ml-6"
      justify="start"
    >
      <v-item-group
        mandatory
      >
        <v-row
          style="border: 1px solid rgba(23, 23, 41, 0.08);border-radius: 5px;background-color: white"
          class="pa-1"
        >
          <v-col
            v-for="d in date"
            :key="d"
            cols="12"
            class="pa-0"
            md="3"
          >
            <v-item v-slot="{ active, toggle }">
              <v-card
                :color="active ? 'rgba(10, 204, 218, 0.15)' : 'white'"
                dark
                :ripple="false"
                width="104"
                height="34"
                @click="toggle"
                elevation="0"
                class="d-flex align-center"
              >
                <div
                  class="flex-grow-1 text-center align-self-center"
                  :style="{color: active ? '#0ACCDA' : '#9FA4B1'}"
                >
                  {{ d }}
                </div>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-item-group>
      <v-col
        cols="2"
        class="pa-0 ml-5"
      >
        <v-select
          :items="items"
          style="box-shadow: none !important;"
          label="другой диапазон"
          class="mb-0"
          outlined
          solo
          dense
          height="43"
        ></v-select>
      </v-col>
    </v-row>
    <v-row class="mx-0">
      <widget-course-profit></widget-course-profit>
      <widget-course-salary-costs></widget-course-salary-costs>
      <v-col cols="12" class="pa-0">
        <widget-course-module-profit></widget-course-module-profit>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import WidgetCourseModuleProfit from '@/components/Admin/widgets/CourseModuleProfit'
import WidgetCourseProfit from '@/components/Admin/widgets/CourseProfit'
import WidgetCourseSalaryCosts from '@/components/Admin/widgets/CourseSalaryCosts'

export default {
  name: "CourseFinanceShow",
  components: {
    WidgetCourseModuleProfit,
    WidgetCourseProfit,
    WidgetCourseSalaryCosts,
  },
  data() {
    return {
      date: ['месяц', 'квартал', 'полгода', 'год'],
      items: [],
    }
  }
}
</script>
