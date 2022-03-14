<template>
  <v-container>
    <template v-if="loading">
      <v-row>
        <v-col>
          <v-skeleton-loader type="table-tbody" />
        </v-col>
      </v-row>
    </template>
    <v-row
      v-else-if="attempts && attempts.length === 0"
      justify="center"
      align="center"
    >
      <empty-placeholder :text="'Вы еще ни разу не проходили тест'">
        <v-btn
          @click="startTest(test_id)"
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
        {{ test_title }}
      </p>
      <v-btn
        @click="startTest(test_id)"
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
            <training-test-attempt-table :attempts="attempts" />
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col
            cols="12"
            sm="6"
            md="4"
            v-for="(item, idx) in attempts"
            :key="item.id"
            class="pa-5"
          >
            <training-test-attempt-card
              :attempt="attempts.length - idx"
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
import TrainingTestAttemptCard from '@/components/Training/Test/TrainingTestAttemptCard'
import TrainingTestAttemptTable from '@/components/Training/Test/TrainingTestAttemptTable'
import EventBus from '@/EventBus'

export default {
  name: 'TrainingCoursesTestShow',
  components: {
    TrainingTestAttemptTable,
    TrainingTestAttemptCard,
    EmptyPlaceholder,
  },
  props: ['test_id'],
  data() {
    return {
      mdiArrowLeft,
      mdiViewModule,
      mdiViewSequential,
      viewType: 1,
      loading: false,
      attempts: undefined,
      test_title: undefined,
      course_title: undefined,
      course_id: undefined,
    }
  },
  mounted() {
    this.fetchTestResults().then(() => {
      this.$nextTick(() => {
        this.$store.dispatch('breadcrumbs/setLinks', [
          {
            text: 'Тест по курсам',
            to: {
              name: 'TrainingCoursesIndex',
            },
            back: true,
            'font-normal': true,
            underlined: true,
          },
          {
            text: this.course_title || 'Курс',
            to: {
              name: 'TrainingCoursesShow',
              params: {
                // module_id: this.courseModuleId,
                course_id: this.course_id,
              },
            },
            'font-normal': true,
            underlined: true,
          },
          {
            text: this.test_title,
            disabled: true,
            'font-normal': true,
            // to: { name: 'LessonShow', params: { lesson_id: this.lesson_id }}
          },
        ])
      })
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
      EventBus.$on('refreshTestAttempts', this.fetchTestResults)
    },

    async fetchTestResults() {
      this.loading = true
      await this.$axios
        .get(`training/tests/${this.test_id}`)
        .then((res) => {
          if (res && res.data) {
            this.course_title = res.data.course && res.data.course.title
            this.test_title = res.data.test && res.data.test.title
            this.course_id = res.data.course && res.data.course.id
            this.attempts = (res.data.test && res.data.test.user_results) || []
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
