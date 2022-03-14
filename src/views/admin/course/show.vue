<template>
  <v-container fluid>
    <template
      v-if="loading"
    >
      <div class="d-flex justify-space-between mb-8">
        <v-skeleton-loader
          type="button"
        />
        <v-skeleton-loader
          type="button"
        />
      </div>
      <div>
        <v-skeleton-loader
          type="card"
        />
      </div>
      <v-skeleton-loader
        type="table-tbody"
      />
    </template>
    <template v-else-if="!loading && course">
      <div class="d-flex align-center justify-space-between flex-wrap">
        <v-btn
          class="show-user-courses__v-btn align-self-center"
          outlined
          :ripple="false"
          @click="$router.push({name: 'AdminCoursesIndex'})"
        >
          <v-icon
            :color="'#5A6275'"
          >
            {{ mdiChevronLeft }}
          </v-icon>
          <span class="text-capitalize">Вернуться назад</span>
        </v-btn>
        <div class="d-flex align-center flex-wrap">
          <v-btn
            class="text-capitalize add-courses-module__btn mr-3"
            text
            :ripple="false"
            @click="dialog_add = true"
          >
            <span style="font-size: 18px;margin-right: 4px">+</span>
            Добавить модуль
          </v-btn>
          <v-btn
            color="#5CC689"
            class="text-capitalize py-5 white--text"
            elevation="0"
            :ripple="false"
            :to="{
              name: 'CourseFinanceShow',
              params: {
                course_id: this.course_id
              }
            }"
          >
            <CoinIcon
              class="coin-icon--white"
            />
            Финансы
          </v-btn>
        </div>
      </div>
      <v-row
        justify="space-between"
        class="admin-courses-show__header"
      >
        <v-col
          cols="auto"
          class="pa-0"
        >
          <p class="admin-courses-show__title">{{ course.title }}</p>
          <p class="admin-courses-show__subtitle">{{ course.description }}</p>
        </v-col>
      </v-row>
      <v-card
        class="admin-courses-show__card pa-5"
        elevation="0"
      >
        <v-card-title
          class="pa-0"
        >
          <span>
            Модули
          </span>
        </v-card-title>
        <v-card-text class="pa-0">
          <CourseModulesTable
            :course_id="Number(course_id)"
            :modules="modules"
            @edit-module="(module) => {
              this.moduleForEdit = module
              this.dialog_edit = true
            }"
            @refresh="fetchCourse"
          />
        </v-card-text>
      </v-card>
      <AddModuleDialog
        :dialog.sync="dialog_add"
        @close-dialog="dialog_add = false"
        :next-order="modules ? modules.length + 1 : 0"
        :course_id="Number(course_id)"
        :module_types="module_types"
        @update-modules="fetchCourse"
      ></AddModuleDialog>
      <EditModuleDialog
        :dialog.sync="dialog_edit"
        :course_id="Number(course_id)"
        :module_id="moduleForEdit && moduleForEdit.id"
        :module_types="module_types"
        @update-modules="fetchCourse"
      ></EditModuleDialog>
    </template>
  </v-container>
</template>

<script>
import {
  mdiCurrencyUsd,
  mdiStar,
  mdiViewSequential,
  mdiViewModule,
  mdiChevronLeft,
} from '@mdi/js'
import CoinIcon from '@/assets/svg/coin.svg'
import AddModuleDialog from "@/components/Admin/course/AddModuleDialog"
import EditModuleDialog from "@/components/Admin/course/EditModuleDialog"
import CourseModulesTable from "@/components/Admin/course/CourseModulesTable";

export default {
  name: "AdminCourseShow",
  components: { CourseModulesTable, EditModuleDialog, AddModuleDialog, CoinIcon },
  props: ['course_id'],
  data() {
    return {
      mdiCurrencyUsd,
      moduleForEdit: undefined,
      mdiChevronLeft,
      mdiStar,
      mdiViewModule,
      mdiViewSequential,
      loading: false,
      course: undefined,
      modules: undefined,
      module_types: undefined,
      dialog_add: false,
      dialog_edit: false,
    }
  },
  mounted() {
    this.loading = true
    this.fetchCourse()
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    async fetchCourse() {
      await this.$axios.get('admin/courses/' + this.course_id)
        .then(res => {
          if(res && res.data) {
            this.course = res.data.course
            this.modules = res.data.course && res.data.course.modules
            this.module_types = res.data.module_types
          }
        })
    },
  },
}
</script>

<style lang="scss">
.coin-icon--white {
  circle {
    stroke: #FFFFFF
  }
  path {
    fill: #FFFFFF;
  }
  transform: scale(1.1);
  margin-right: 8px;
}
</style>
