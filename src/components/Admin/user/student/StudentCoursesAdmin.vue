<template>
  <v-card
    class="show-user__card"
    elevation="0"
  >
    <v-card-title class="mb-3">Курсы</v-card-title>
    <v-card-text>
      <v-item-group
        mandatory
        v-model="showActiveCourses"
      >
        <v-row
          class="active-courses__buttons mx-1"
        >
          <v-col
            v-for="course in courses_value"
            :key="course.value"
            cols="12"
            md="6"
            class="pa-1"
          >
            <v-item v-slot="{ active, toggle }">
              <v-card
                elevation="0"
                :color="active ? 'rgba(23, 23, 41, 0.08)' : 'white'"
                class="d-flex align-center show-user-courses__v-card"
                height="30"
                @click="toggle"
                :ripple="false"
              >
                <v-scroll-x-transition>
                  <div
                    class="flex-grow-1 text-center black--text"
                  >
                    {{ course.name }}
                  </div>
                </v-scroll-x-transition>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-item-group>
      <div
        v-if="active_courses.length === 0"
        class="text-center mt-7"
      >
        <p style="font-size: 20px;font-weight: 600; margin-top: 45px">Нет данных</p>
      </div>
      <v-simple-table v-else class="show-user-courses__table mt-4">
        <thead>
        <tr>
          <th class="text-left font-weight-regular grayLight--text pl-0">Название курса</th>
          <th class="text-left font-weight-regular grayLight--text text-no-wrap">Дата</th>
          <th class="text-left font-weight-regular grayLight--text">Группа</th>
          <th class="text-center font-weight-regular grayLight--text pr-0">Итоговая оценка</th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="(course, idx) in active_courses"
          :key="'c+'+idx"
        >
          <td class="pl-0">
            {{ idx + 1 }}.
            <router-link
              tag="span"
              :to="{
                    name: 'AdminStudentCourseShow',
                    params: {
                      user_id: user_id,
                      course_id: course && course.id
                    }
                  }"
              style="color: #0BC3B8;text-decoration: underline;cursor: pointer"
            >{{ course.title }}
            </router-link>
          </td>
          <td>
            {{ course.starts_at | shortFormat }}
          </td>
          <td class="text-left">
            {{ course.group_name || '-' }}
          </td>
          <td class="text-center pr-0">{{ course.total_score + ((course.total_score >= 0) ? '%' : '') }}</td>
        </tr>
        </tbody>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script>
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png'

export default {
  name: "StudentCoursesAdmin",
  props: {
    courses: Array,
    user_id: Number,
  },
  data() {
    return {
      UserPlaceholderSm,
      courses_value: [
        {
          value: 1,
          name: 'Активные'
        },
        {
          value: 2,
          name: 'Завершенные'
        }
      ],
      showActiveCourses: 0,
    }
  },
  computed: {
    active_courses() {
      let vm = this
      return this.courses.filter(course => course.active !== !!vm.showActiveCourses)
    }
  },
}
</script>
