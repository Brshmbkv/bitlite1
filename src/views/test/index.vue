<template>
  <v-container>
    <template v-if="loading === true">
      <v-row>
        <v-col>
          <v-skeleton-loader type="table-tbody" />
        </v-col>
      </v-row>
    </template>
    <v-row
      v-else-if="attemptsOfTheTest.length === 0"
      justify="center"
      align="center"
    >
      <empty-placeholder :text="'Вы еще ни разу не проходили тест'">
        <v-btn
          @click="startTest(currentTest.id)"
          class="text-capitalize"
          elevation="0"
          color="success"
          large
          style="padding-left: 85px;padding-right: 85px"
        >
          Пройти тест
        </v-btn>
      </empty-placeholder>
    </v-row>
    <div v-else class="row">
      <p class="text-md-h4 text-h5 font-weight-bold ml-5">
        {{ currentTest.title }}
      </p>
      <v-btn
        @click="startTest(currentTest.id)"
        class="ml-auto text-capitalize mr-5"
        elevation="0"
        color="success"
      >
        Начать тест
      </v-btn>
      <v-col cols="12">
        <v-row class="justify-end mr-2">
          <v-icon
            class="ma-1"
            @click="viewType = 1"
            :color="viewType === 1 ? 'success' : ''"
          >
            {{ mdiViewSequential }}
          </v-icon>
          <v-icon
            class="ma-1"
            @click="viewType = 0"
            :color="viewType === 0 ? 'success' : ''"
          >
            {{ mdiViewModule }}
          </v-icon>
        </v-row>
        <v-row v-if="viewType === 1" class="justify-center">
          <v-col cols="12">
            <training-test-attempt-table :attempts="attemptsOfTheTest" />
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col
            cols="12"
            sm="6"
            md="4"
            v-for="(item, idx) in attemptsOfTheTest"
            :key="item.id"
            class="pa-5"
          >
            <training-test-attempt-card
              :attempt="attemptsOfTheTest.length - idx"
              :rights_percent="item.rights_percent"
              :created_at="item.created_at"
            />
          </v-col>
        </v-row>
      </v-col>
    </div>
  </v-container>
</template>

<script>
import { mdiArrowLeft, mdiViewSequential, mdiViewModule } from '@mdi/js'
import EmptyPlaceholder from '@/components/EmptyPlaceholder'
import EventBus from '@/EventBus'
import TrainingTestAttemptCard from '@/components/Training/Test/TrainingTestAttemptCard'
import TrainingTestAttemptTable from '@/components/Training/Test/TrainingTestAttemptTable'

export default {
  name: 'TestShow',
  components: {
    TrainingTestAttemptTable,
    TrainingTestAttemptCard,
    EmptyPlaceholder,
  },
  props: {
    chapter_id: {
      default: undefined,
    },
    lesson_id: {
      default: undefined,
    },
    test_id: {
      default: undefined,
    },
  },
  data() {
    return {
      mdiArrowLeft,
      mdiViewSequential,
      mdiViewModule,
      loading: false,
      attemptsOfTheTest: [],
      currentTest: '',
      viewType: 1,
      module_id: '',
      module_title: '',
      chapter_title: '',
      event_title: '',
    }
  },

  mounted() {
    this.loading = true
    this.fetchTest()
      .then(() => {
        this.$nextTick(() => {
          this.$store.dispatch('breadcrumbs/setLinks', [
            {
              text: this.module_title,
              to: {
                name: 'CourseShow',
                params: {
                  // module_id: this.courseModuleId,
                  course_id: this.module_id,
                },
              },
              back: true,
              'font-normal': true,
              underlined: true,
            },
            {
              text: this.chapter_title
                ? this.chapter_title
                : this.event_title
                ? this.event_title
                : '',
              to: {
                name: this.chapter_id
                  ? 'ChapterShow'
                  : this.lesson_id
                  ? 'LessonShow'
                  : '',
                params: {
                  // module_id: this.courseModuleId,
                  course_id: this.chapter_id
                    ? this.chapter_id
                    : this.lesson_id
                    ? this.lesson_id
                    : '',
                },
              },
              'font-normal': true,
              underlined: true,
            },
            {
              text: this.currentTest.title,
              disabled: true,
              'font-normal': true,
              // to: { name: 'LessonShow', params: { lesson_id: this.lesson_id }}
            },
          ])
        })
      })
      .finally(() => {
        this.loading = false
      })
  },
  destroyed() {
    EventBus.$off()
  },
  methods: {
    startTest(id) {
      let routeData = this.$router.resolve({
        name: 'TestStart',
        params: { test_id: id },
      })
      window.open(
        routeData.href,
        '_blank',
        'toolbar=yes,scrollbars=yes,resizable=yes,width=1920,height=1080'
      )
      EventBus.$on('refreshTestAttempts', this.fetchTest)
    },

    async fetchTest() {
      this.loading = true
      await this.$axios
        .get(
          (this.chapter_id
            ? '/lite/chapter/' + this.chapter_id
            : this.lesson_id
            ? '/events/' + this.lesson_id
            : '') +
            '/tests/' +
            this.test_id +
            '/results'
        )
        .then((res) => {
          if (res && res.data) {
            this.attemptsOfTheTest =
              (res.data.test && res.data.test.test_results) || undefined
            this.currentTest = res.data.test
            if (res.data.chapter) {
              this.chapter_title = res.data.chapter.title
            } else if (res.data.event) {
              this.event_title = res.data.event.title
            }
            this.module_id =
              (res.data.module && res.data.module.course_id) || undefined
            this.module_title =
              (res.data.module && res.data.module.title) || undefined
          }
        })
      this.loading = false
    },
  },
}
</script>
