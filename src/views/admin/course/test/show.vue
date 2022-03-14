<template>
  <v-container fluid class="admin-chapter-show">
    <p class="chapter__title font-weight-bold mt-3 mb-6">{{ test_title }}</p>
    <v-divider
      style="background: rgba(23, 23, 41, 0.08);border-color:rgba(23, 23, 41, 0.08);"
    />
    <v-row justify="space-between" class="my-7 mx-1">
      <p class="chapter__subtitle mb-0 align-self-center">Вопросы</p>
      <div>
        <v-btn
          class="text-capitalize add-courses-module__btn ml-auto align-self-center mr-0"
          text
          :ripple="false"
          @click="dialog_add = true"
        >
          <span style="font-size: 18px;margin-right: 6px">+</span>
          Добавить
        </v-btn>
      </div>
    </v-row>
    <div>
      <v-data-table
        :headers="headers"
        :items="questions"
        :mobile-breakpoint="0"
        hide-default-footer
        class="elevation-0 mt-3 admin-users-table__v-table"
        style="border-bottom-left-radius: 0;border-bottom-right-radius: 0;"
      >
        <template v-slot:no-data>
          <CoursesEmptyPlaceholder
            :text="'Нету вопросов'"
          ></CoursesEmptyPlaceholder>
        </template>
        <template v-slot:item.options="{ item }">
          <v-hover v-slot="{ hover }">
            <template>
              <v-btn
                outlined
                icon
                height="30"
                width="30"
                :color="'#0ACCDA'"
                :ripple="false"
                class="admin-users-table__v-btn"
                @click.stop.prevent="
                  () => {
                    dialog_edit = true
                    questionForEdit = item
                  }
                "
              >
                <PenIcon :class="hover ? 'white-pen' : 'pen'"></PenIcon>
              </v-btn>
            </template>
          </v-hover>
        </template>
      </v-data-table>
      <AddQuestionDialog
        :dialog="dialog_add"
        :next-order="questions && questions.length + 1"
        :test_id="test_id"
        @close-dialog="dialog_add = false"
        @update-questions="fetchQuestions"
      ></AddQuestionDialog>
      <EditQuestionDialog
        :dialog="dialog_edit"
        :next-order="questions && questions.length + 1"
        :test_id="test_id"
        :question_id="questionForEdit && questionForEdit.id"
        @close-dialog="dialog_edit = false"
        @update-questions="fetchQuestions"
      ></EditQuestionDialog>
    </div>
  </v-container>
</template>

<script>
import CoursesEmptyPlaceholder from '@/components/EmptyPlaceholder'
import EditQuestionDialog from '@/components/Admin/course/EditQuestionDialog'
import AddQuestionDialog from '@/components/Admin/course/AddQuestionDialog'
import PenIcon from '@/assets/svg/pen.svg'

export default {
  name: 'AdminTestShow',
  components: {
    EditQuestionDialog,
    AddQuestionDialog,
    CoursesEmptyPlaceholder,
    PenIcon,
  },
  props: ['test_id'],
  data() {
    return {
      dialog_add: false,
      dialog_edit: false,
      questions: undefined,
      questionForEdit: undefined,
      chapter: undefined,
      module: undefined,
      course: undefined,
      test_title: undefined,
      headers: [
        {
          text: 'ID',
          align: 'start',
          value: 'id',
          sortable: true,
        },
        { text: 'Название', value: 'text', sortable: true },
        { text: 'Порядок', value: 'pivot.order', sortable: true },
        { text: '', value: 'options', align: 'end', sortable: false },
      ],
    }
  },
  mounted() {
    this.fetchQuestions().then(() => {
      this.$store.dispatch('breadcrumbs/setLinks', [
        {
          text: 'Все курсы',
          to: {
            name: 'AdminCoursesIndex',
          },
        },
        {
          text: this.course && this.course.title,
          to: {
            name: 'AdminCourseShow',
            params: {
              course_id: this.course && this.course.id,
            },
          },
        },
        {
          text: this.module && this.module.title,
          to: {
            name: 'AdminModuleShow',
            params: {
              course_id: this.course && this.course.id,
              module_id: this.module && this.module.id,
            },
          },
        },
        {
          text: this.chapter && this.chapter.title,
          to: {
            name: 'AdminChapterShow',
            params: {
              chapter_id: this.chapter && this.chapter.id,
            },
          },
        },
        {
          text: 'Тесты',
          to: {
            name: 'AdminTestIndex',
            params: {
              chapter_id: this.chapter && this.chapter.id,
            },
          },
        },
        {
          text: this.test_title && this.test_title,
          disabled: true,
        },
      ])
    })
  },
  methods: {
    async fetchQuestions() {
      await this.$axios
        .get('admin/tests/' + this.test_id + '/questions')
        .then((res) => {
          if (res && res.data) {
            this.chapter = res.data.chapter
            this.module =
              (res.data.chapter && res.data.chapter.module) || undefined
            this.course =
              (res.data.chapter &&
                res.data.chapter.module &&
                res.data.chapter.module.course) ||
              undefined
            this.questions =
              (res.data.test && res.data.test.questions) || undefined
            this.test_title =
              (res.data.test && res.data.test.title) || undefined
          }
        })
    },
  },
}
</script>
