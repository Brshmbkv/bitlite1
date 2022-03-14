<template>
  <div>
    <div v-if="loading">
      <v-row class="mt-4">
        <v-col
          cols="12"
          md="6"
        >
          <v-skeleton-loader
            type="article"
          />
          <v-skeleton-loader
            type="list-item-three-line"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-skeleton-loader
            type="image"
          />
        </v-col>
        <v-col cols="12">
          <v-skeleton-loader
            type="table-tbody"
          />
        </v-col>
      </v-row>
    </div>
    <template v-else>
      <CourseFreeDialog
        :dialog.sync="get_free_course_dialog"
        :course_id="Number(course_id)"
      />
      <PurchaseGetConsultation
        :dialog.sync="gc_dialog"
        :course_id="Number(course_id) || Number(course_id_for_gc)"
      />
      <v-slide-y-reverse-transition>
        <div
          v-if="modules && modules[0] && !modules[0].available && !course.totally_bought"
          class="show-course-price__div"
          :style="$vuetify.breakpoint.width > 960 ? 'padding-left: 256px;width:100%' : 'width: 100%'"
        >
        <span
          class="font-weight-bold ml-sm-8 ml-0"
          style="font-size: 20px; color: white"
        >
          Стоимость курса: {{ modules && modules[0].price.toLocaleString() }} ₸ в месяц
        </span>
          <v-btn
            class="get-consultation__btn mr-sm-6 mr-0"
            :ripple="false"
            :elevation="0"
            @click="gc_dialog = true"
          >
            Получить консультацию
          </v-btn>
        </div>
      </v-slide-y-reverse-transition>

      <v-row class="mt-3">
        <v-col
          v-if="course"
          md="6"
          cols="12"
          class="pa-5"
        >
          <p
            style="font-size: 24px; font-weight: 700"
            class="mb-2"
          >{{ course.title }}</p>
          <div
            v-if="group && group.starts_at"
            style="font-size: 14px; color: #0BC3B8"
            class="d-flex align-center"
          >
            <v-chip
              label
              color="rgba(11, 195, 184, 0.12)"
              text-color="#0BC3B8"
              class="text-uppercase"
            >
              Старт: {{ group && group.starts_at | withoutYear }}
            </v-chip>
            <div class="center-dot"></div>
            <span>Уже в группе {{ group && group.students_count }} из {{ group && group.max_limit }}</span>
          </div>
          <div
            class="my-4 catalog-course__info"
          >
            <p>
              <ChartBarIcon/>
              <span>Уровень: {{ course.level }}</span>
            </p>
            <p>
              <ClockIcon/>
              <span>{{ course.duration }} месяца</span>
            </p>
            <p>
              <MegaPhoneIcon/>
              <span>{{ course.total_chapters }} живых урока</span>
            </p>
            <p>
              <PeopleIcon/>
              <span>{{ course.total_finished > 0 ? `${ course.total_finished * 10 } человек прошли курс` : 'Новый курс!'
                }}</span>
            </p>
          </div>
          <v-btn
            v-if="module_id"
            elevation="0"
            :ripple="false"
            class="font-weight-bold primary--text catalog-course__btn"
            outlined
            style="font-size: 14px; border: 2px solid #0BC3B8"
            @click="gc_dialog = true"
          >
            Заказать обратный звонок
          </v-btn>
          <template v-else-if="course_id">
            <v-btn
              v-if="course && course.has_lite && !course.user_has_lite && !course.totally_bought"
              elevation="0"
              :ripple="false"
              class="font-weight-bold primary--text catalog-course__btn"
              outlined
              style="font-size: 14px; border: 2px solid #0BC3B8"
              @click="get_free_course_dialog = true"
            >
              Начать обучение бесплатно
            </v-btn>
            <v-btn
              v-else-if="course && course.totally_bought"
              elevation="0"
              :ripple="false"
              class="font-weight-bold primary--text catalog-course__btn"
              outlined
              style="font-size: 14px; border: 2px solid #0BC3B8"
              :to="{
            name: 'CourseShow',
            params: {
              course_id
            }
          }"
            >
              Перейти к курсу
            </v-btn>
            <v-btn
              v-else
              elevation="0"
              :ripple="false"
              class="font-weight-bold primary--text catalog-course__btn"
              outlined
              style="font-size: 14px; border: 2px solid #0BC3B8"
              @click="gc_dialog = true"
            >
              Получить консультацию
            </v-btn>
          </template>
        </v-col>
        <v-col
          md="6"
          cols="12"
        >
          <CourseImageCatalog
            v-if="course && !course.trailer"
            :course="getCourseTitle()"
          />
          <iframe
            v-else
            :src="course && course.trailer"
            frameborder="0"
            height="100%"
            width="100%"
            style="border-radius: 4px"
          />
        </v-col>
      </v-row>
      <div
        v-if="course && course.title && course.id === 2"
        class="catalog-course__employment"
      >
        <div class="catalog-course__employment--block">
          <p class="catalog-course__employment--number">115</p>
          <p class="catalog-course__employment--text">компаний ищут Джавистов</p>
        </div>
        <div class="catalog-course__employment--block">
          <p class="catalog-course__employment--number">415</p>
          <p class="catalog-course__employment--text">открытых вакансий</p>
        </div>
        <div class="catalog-course__employment--block">
          <p class="catalog-course__employment--number">1000$</p>
          <p class="catalog-course__employment--text">средняя зарплата Джависта</p>
        </div>
        <div class="catalog-course__employment--block">
          <p class="catalog-course__employment--text-only">
            Трудоустройство после 5 месяцев обучения!!!
          </p>
        </div>
      </div>
      <div
        v-if="course && course.description"
        style="border: 1px solid rgba(23, 23, 41, 0.08); border-radius: 4px"
        class="pa-4 mt-8"
      >
        <p style="font-weight: 600; color: #171729; letter-spacing: 0.02em">Подробное описание курса</p>
        <p
          style="font-size: 14px; letter-spacing: 0.02em; color: #171729"
          class="course-purchase--hidden__description"
          :class="showDescription ? 'not-hidden' : ''"
        >
          {{ course && course.description }}
        </p>
        <p
          style="color: #0BC3B8; font-size: 14px;"
          class="text-center ma-0"
        >
        <span
          v-if="course && course.description.length > 370"
          style="cursor: pointer"
          @click="showDescription = !showDescription"
        >{{ showDescription ? 'Свернуть' : 'Развернуть' }}</span>
        </p>
      </div>

      <div
        v-if="course && course.features && course.features.length"
        style="border: 1px solid rgba(23, 23, 41, 0.08); border-radius: 4px"
        class="pa-4 mt-8 pb-0"
      >
        <p style="font-weight: 600; color: #171729; letter-spacing: 0.02em">Чему научишься</p>
        <p
          v-for="(l, idx) in course.features"
          :key="`l-${idx}`"
          style="font-size: 14px; letter-spacing: 0.02em; color: #5A6275"
          class="course-purchase--hidden__learn"
          :class="showLearn ? 'not-hidden' : ''"
        >
          <v-icon
            :color="'#0BC3B8'"
          >{{ mdiCheck }}
          </v-icon>
          {{ l }}
        </p>
      </div>

      <v-divider
        class="my-8"
      />

      <div
        v-if="modules && modules.length>0"
      >
        <p
          class="font-weight-bold"
          style="font-size:20px"
        >Структура курса</p>
        <v-tabs
          background-color="white"
          v-model="currentModule"
          class="course-purchase__tabs"
          show-arrows
        >
          <v-tab
            v-for="module in modules"
            :key="module.id"
            :ripple="false"
          >
            {{ module.title }}
          </v-tab>
        </v-tabs>
        <v-divider/>
        <v-tabs-items
          v-model="currentModule"
        >
          <v-tab-item
            v-for="module in modules"
            :key="module.id"
          >
            <v-simple-table class="my-table">
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-left font-weight-regular grayLight--text pl-0" width="1px">
                    Урок
                  </th>
                  <th class="text-left font-weight-regular grayLight--text">
                    Название
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr
                  v-for="(chapter, idx) in module.chapters"
                  :key="chapter.id"
                  class="course-purchase__modules__tr"
                >
                  <td
                    class="pl-0 py-6"
                    style="font-size: 14px; font-weight: 500"
                  >
                    #{{ idx + 1 }}
                  </td>
                  <td
                    style="font-weight: 600"
                  >
                    <v-expansion-panels
                      tile
                      accordion
                      flat
                    >
                      <v-expansion-panel
                        active-class="course-purchase--active__expansion"
                      >
                        <v-expansion-panel-header>{{ chapter.title }}</v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <p
                            style="font-size: 14px; color: #5A6275;font-weight: 500"
                            class="ml-4"
                          >{{ chapter.description }}</p>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </template>
  </div>
</template>

<script>
import ChartBarIcon from '@/assets/svg/chartbar.svg'
import ClockIcon from '@/assets/svg/clock.svg'
import PeopleIcon from '@/assets/svg/people.svg'
import MegaPhoneIcon from '@/assets/svg/megaphone.svg'
import { mdiCheck } from '@mdi/js'
import CourseImageCatalog from "@/components/Courses/index/CourseImageCatalog";
// import CourseFreeDialog from "@/components/Courses/show/CourseFreeDialog";
// import PurchaseGetConsultation from "@/components/Purchase/PurchaseGetConsultation";

export default {
  name: "CoursePurchase",
  components: {
    PurchaseGetConsultation: () => import(/* webpackPrefetch: true */"@/components/Purchase/PurchaseGetConsultation"),
    CourseFreeDialog: () => import(/* webpackPrefetch: true */"@/components/Courses/show/CourseFreeDialog"),
    CourseImageCatalog,
    ChartBarIcon,
    ClockIcon,
    PeopleIcon,
    MegaPhoneIcon,
  },
  props: {
    module_id: Number,
    course_id: Number,
  },
  data() {
    return {
      mdiCheck,
      loading: true,
      course: undefined,
      group: undefined,
      chapters: undefined,
      modules: undefined,
      showDescription: false,
      showLearn: false,
      progressValue: 0,
      currentModule: undefined,
      get_free_course_dialog: false,
      gc_dialog: false,
      course_id_for_gc: this.$route.params.course_id || -1
    }
  },
  mounted() {
    this.loading = true
    this.fetchCourse()
      .then(() => {
        if(this.course_id) {
          this.$store.dispatch('breadcrumbs/setLinks', [
            {
              text: "Каталог курсов",
              underlined: true,
              to: {
                name: 'CoursesCatalogIndex'
              }
            },
            {
              text: this.course && this.course.title
            }
          ]);

          this.$store.dispatch('vacancies/getCourseVacancies', this.course?.id)
        }
      })
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    getCourseTitle() {
      let course_id = this.course && this.course.id
      return {
        2: 'java',
        3: 'cpp',
        4: 'python',
        6: 'php',
        8: 'ios'
      }[course_id] || 'ios'
    },
    async fetchCourse() {
      let uri = (this.module_id && `modules/${ this.module_id }/preview`)
        || (this.course_id && `catalog/courses/${ this.course_id }`)

      await this.$axios.get(uri)
        .then(res => {
          if(res && res.data) {
            // console.log('preview', res.data)
            this.course = res.data.course
            this.group = res.data.group
            this.modules = res.data.course && res.data.course.modules
            this.progressValue = res.data.group && ((res.data.group.students_count / res.data.group.max_limit) * 100)
          }
        })
    }
  }
}
</script>
