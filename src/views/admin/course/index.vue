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
          <AddButton @click="dialog_add = true"/>
        </v-col>
        <v-col cols="auto">
          <v-row align="center">
            <v-col>
              <v-select
                flat
                :items="items"
                :menu-props="{ top: false, offsetY: true }"
                background-color="white"
                dense
                outlined
                height="40"
                class="sort-courses__v-select"
                solo
              >
                <template v-slot:prepend-inner>
                  <span style="font-size: 12px;color: #9FA4B1; white-space: nowrap" class="mr-2">Сортировать по:</span>
                </template>
                <template v-slot:label>
                  <span>Все категории</span>
                </template>
                <template v-slot:selection="{ item }">
                  <span>{{ item }}</span>
                </template>
                <template v-slot:append>
                  <div
                    class="sort-courses__v-select__v-append text-center"
                  >
                    <v-icon>{{ mdiChevronDown }}</v-icon>
                  </div>
                </template>
              </v-select>
            </v-col>
            <v-col>
              <v-item-group
                mandatory
                v-model="viewType"
              >
                <v-row
                  justify="end"
                  style="border: 1px solid rgba(23, 23, 41, 0.08);border-radius: 5px;box-sizing: border-box;background-color: white"
                >
                  <v-col
                    v-for="n in 2"
                    :key="n"
                    cols="6"
                    class="justify-end"
                    style="padding: 3px"
                  >
                    <v-item v-slot="{ active, toggle }">
                      <v-card
                        :color="active ? '#0ACCDA' : 'transparent'"
                        :ripple="false"
                        class="d-flex align-center justify-center"
                        elevation="0"
                        dark
                        height="34"
                        width="34"
                        @click="toggle"
                      >
                        <v-icon
                          v-if="n===1"
                          class="align-self-center"
                          :color=" active ? 'white' : '#0ACCDA'"
                        >
                          {{ mdiMenu }}
                        </v-icon>
                        <v-icon
                          v-else
                          :color=" active ? 'white' : '#0ACCDA'"
                        >
                          {{ mdiViewGrid }}
                        </v-icon>
                      </v-card>
                    </v-item>
                  </v-col>
                </v-row>
              </v-item-group>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <template
        v-if="loading"
      >
        <v-card
          v-for="n in 5"
          :key="n"
          class="my-4"
          style="display: flex"
          elevation="0"
        >
          <v-col cols="4">
            <v-skeleton-loader
              type="article"
              height="150"
            />
          </v-col>
          <v-col cols="4">
            <v-skeleton-loader
              type="article"
              height="150"
            />
          </v-col>
          <v-col cols="4">
            <v-skeleton-loader
              type="avatar"
            />
          </v-col>
        </v-card>
      </template>
      <v-row
        v-else
      >
        <v-col
          v-for="(course, idx) in courses"
          :key="idx"
          class="course-row__v-col"
          :class="(viewType<1) && 'px-6'"
          :cols="viewType === 0 ? '12' : '12'"
          :lg="(viewType === 0) ? '12' : '3'"
          :md="(viewType === 0) ? '12' : '4'"
          :sm="(viewType === 0) ? '12' : '6'"
          style="position: relative"
        >
          <v-card
            :ripple="false"
            elevation="0"
            height="auto"
            :to="{
              name: 'AdminCourseShow',
              params: {
                course_id: course.id
              }
            }"
            :class="viewType < 1 ? 'admin-courses-index__v-card mr-md-11 mr-0' : 'admin-courses-index__v-card'"
            style="position: relative;z-index: 0"
          >
            <v-sheet
              height="30"
              width="30"
              class="text-center"
              style="border-radius: 0 0 25px 25px;background-color: rgba(23, 23, 41, 0.08);position: absolute;right: 30px;top: 0;z-index: 2"
            >
              <span class="admin-courses-index__label">{{ idx + 1 }}</span>
            </v-sheet>
            <v-sheet
              v-if="viewType < 1"
              height="120"
              width="15"
              class="left-line"
              style="position: absolute; left: -5px;top: 12%;"
            >
            </v-sheet>
            <v-row>
              <v-col
                :cols="viewType<1 ? 4 : 12"
              >
                <div
                  class="col align-self-start"
                  style="white-space: nowrap;overflow:hidden;text-overflow:ellipsis !important"
                >
                  <p class="admin-courses-index__label">Название</p>
                  <span class="font-weight-bold" style="font-size: 20px">{{ course.title }}</span>
                </div>
                <div
                  class="col align-self-end"
                >
                  <p class="admin-courses-index__label">Прибыль</p>
                  <p class="admin-courses-index__price-text mt-2 mb-0">+ {{ course.total_paid || 0 }} KZT</p>
                </div>
              </v-col>
              <v-col
                class="align-self-center"
                :cols="viewType<1 ? '' : '6'"
              >
                <div class="px-3">
                  <p class="admin-courses-index__label mt-auto">Текущие группы</p>
                  <p class="admin-courses-index__big-digit--red mb-0">{{ course.groups_count || 0 }}</p>
                </div>
              </v-col>
              <v-col
                class="align-self-center"
                :cols="viewType<1 ? '' : '6'"
              >
                <div
                >
                  <p class="admin-courses-index__label">Завершенные группы</p>
                  <p class="admin-courses-index__big-digit--gray mb-0">{{ course.total_finished || 0 }}</p>
                </div>
              </v-col>
              <v-col
                style="position: relative"
                class="align-self-center"
              >
                <v-progress-circular
                  v-if="viewType < 1"
                  :size="120"
                  :width="10"
                  :value="69"
                  :color="'#0ACCDA'"
                  class="text-center"
                >
                  <p class="admin-courses-index__label mb-0">Churn rate</p>
                  <span class="bitlab-logo-title">69%</span>
                </v-progress-circular>
                <div v-else class="mx-4 pb-4">
                  <p class="admin-courses-index__label mb-0 float-left">Churn rate</p>
                  <span class="bitlab-logo-title float-right mb-2">69%</span>
                  <v-progress-linear
                    :size="120"
                    :width="10"
                    :value="69"
                    :color="'#0ACCDA'"
                    class="text-center"
                    height="5"
                  >
                  </v-progress-linear>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>

import { mdiAccountGroup, mdiFlagCheckered, mdiViewGrid, mdiCurrencyUsd, mdiMenu, mdiChevronDown } from '@mdi/js'
import AddCourseDialog from "@/components/Admin/course/AddCourseDialog";
import AddButton from "@/components/Admin/AddButton";

export default {
  name: "AdminCoursesIndex",
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
      items: [
        'Best',
        'Worst'
      ]
    }
  },
  mounted() {
    this.loading = true
    this.fetchCourses()
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    async fetchCourses() {
      await this.$axios.get('admin/courses')
        .then(res => {
          if (res && res.data) {
            this.courses = res.data
          }
        })
    }
  },
}
</script>
