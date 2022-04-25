<template>
  <div>
    <AddCourseDialog
      :dialog.sync="dialog_add"
      :next-order="courses && courses.length + 1"
      @refresh="fetchCourses"
    />
    <v-container fluid>
      <v-row align="center" justify-md="space-between">
        <v-col cols="auto" class="d-flex align-center">
          <h1 class="admin-page__title d-inline">Все курсы</h1>
          <AddButton @click="dialog_add = true" />
        </v-col>
      </v-row>
      <template v-if="loading">
        <v-skeleton-loader type="table"></v-skeleton-loader>
      </template>
      <v-data-table
        class="mt-6"
        :headers="headers"
        :items="courses"
        hide-default-footer
        disable-sort
        @click:row="
          (item) => {
            $router.push({
              name: 'AdminCourseShow',
              params: {
                course_id: item.id,
              },
            })
          }
        "
      >
        <template #item.total_paid="{item: {total_paid}}">
          <span style="color: #5cc689;">+ {{ total_paid }} KZT</span>
        </template>
        <template #item.churn_rate="{item: {churn_rate}}">
          <span
            :style="{ color: parseInt(churn_rate) === 100 ? '#5cc689' : '' }"
            >{{ parseInt(churn_rate) }}%</span
          >
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import {
  mdiAccountGroup,
  mdiFlagCheckered,
  mdiViewGrid,
  mdiCurrencyUsd,
  mdiMenu,
  mdiChevronDown,
} from '@mdi/js'
import AddCourseDialog from '@/components/Admin/course/AddCourseDialog'
import AddButton from '@/components/Admin/AddButton'

export default {
  name: 'AdminCoursesIndex',
  components: { AddButton, AddCourseDialog },
  data() {
    return {
      loading: false,
      dialog_add: false,
      mdiAccountGroup,
      mdiFlagCheckered,
      mdiChevronDown,
      mdiCurrencyUsd,
      mdiMenu,
      mdiViewGrid,
      courses: undefined,
      viewType: 0,
      items: ['Best', 'Worst'],
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Название', value: 'title' },
        { text: 'Активные группы', value: 'groups_count' },
        { text: 'Завершенные группы', value: 'total_finished' },
        { text: 'Прибыль', value: 'total_paid' },
        { text: 'Churn rate', value: 'churn_rate' },
      ],
    }
  },
  mounted() {
    this.loading = true
    this.fetchCourses().finally(() => {
      this.loading = false
    })
  },
  methods: {
    async fetchCourses() {
      await this.$axios.get('admin/courses').then((res) => {
        if (res && res.data) {
          this.courses = res.data
        }
      })
    },
  },
}
</script>
