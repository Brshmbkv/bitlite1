<template>
  <v-container fluid>
    <v-skeleton-loader
      v-if="loading"
      type="table-tbody"
    />
    <v-alert
      v-else-if="errorText"
      type="error"
    >
      {{ errorText }}
    </v-alert>
    <div
      v-else-if="lesson_type === 'content'"
      class="admin__course-container"
    >
      <p class="d-flex justify-space-between align-center">
        <span class="text-h5 font-weight-medium">Контент лекции</span>
        <v-btn
          :ripple="false"
          :outlined="!editMode"
          color="primary"
          class="text-none d-flex align-center"
          elevation="0"
          @click="editMode = !editMode"
        >
          <PenIcon v-if="!editMode"/>
          <span v-else class="text-h5">&times;</span>
          <span class="ml-2">{{ !editMode ? 'Режим' : 'Закрыть режим' }} редактирования</span>
        </v-btn>
      </p>
      <div>
        <Constructor
          v-if="lesson && lesson.content_elements && lesson.content_elements.length"
          :show="!editMode"
          :value="lesson.content_elements"
          :loading="add_loading"
          @save="addLessonContent"
        />
        <div
          v-else
          v-html="decodeHTML(lesson && lesson.content)"
        ></div>
      </div>
    </div>
    <template v-else>
      <div class="mt-3 mb-5 d-flex">
        <p
          class="mb-0 align-self-center"
          style="font-size: 20px;font-weight: 600;color: #171729;line-height: 24px"
        >Список задач</p>
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
      <v-data-table
        :headers="headers"
        :items="exercises"
        :mobile-breakpoint="0"
        :items-per-page="10"
        class="elevation-0 mt-3 admin-users-table__v-table"
        style="border-bottom-left-radius: 0;border-bottom-right-radius: 0;"
        :loading="loading"
      >
        <template v-slot:[`item.level_coef`]="{ item }">
            <span>
              {{
                item.level_coef > 0.3
                  ? (item.level_coef > 0.5
                  ? 'Сложный' : 'Средний') : 'Легкий'
              }}
            </span>
        </template>
        <template v-slot:[`item.options`]="{ item }">
          <v-hover
            v-slot="{ hover }"
          >
            <template>
              <v-btn
                outlined
                icon
                height="30"
                width="30"
                :color="'#0ACCDA'"
                :ripple="false"
                class="admin-users-table__v-btn"
                @click.stop.prevent="() => {
                    dialog_edit = true
                    exerciseForEdit = item
                  }"
              >
                <PenIcon :class="hover ? 'white-pen' : 'pen'"></PenIcon>
              </v-btn>
            </template>
          </v-hover>
        </template>
      </v-data-table>
      <AddExerciseDialog
        :lesson_id="lesson_id"
        :next-order="exercises && exercises.length + 1"
        :dialog="dialog_add"
        @close-dialog="dialog_add = false"
        @update-exercises="fetchLesson"
      ></AddExerciseDialog>
      <EditExerciseDialog
        :lesson_id="lesson_id"
        :dialog="dialog_edit"
        :exercise_id="exerciseForEdit && exerciseForEdit.id"
        @close-dialog="dialog_edit = false"
        @update-exercises="fetchLesson"
      ></EditExerciseDialog>
    </template>
  </v-container>
</template>

<script>
import AddExerciseDialog from "@/components/Admin/course/AddExerciseDialog";
import EditExerciseDialog from "@/components/Admin/course/EditExerciseDialog";
import PenIcon from '@/assets/svg/pen.svg'
import { decodeHTML } from "@/helpers";
import Constructor from "@/components/LectureConstructor/editor";

export default {
  name: "AdminLessonShow",
  components: { Constructor, EditExerciseDialog, AddExerciseDialog, PenIcon },
  props: [
    'chapter_id',
    'lesson_id',
  ],
  data() {
    return {
      loading: false,
      add_loading: false,
      exerciseForEdit: undefined,
      editMode: false,
      dialog_add: false,
      dialog_edit: false,
      errorText: undefined,
      lesson: undefined,
      lesson_type: undefined,
      module_title: undefined,
      module_id: undefined,
      chapter_title: undefined,
      course_id: undefined,
      course_title: undefined,
      exercises: undefined,
      headers: [
        {
          text: 'ID',
          align: 'start',
          value: 'id',
          sortable: true
        },
        { text: 'Название', value: 'title', sortable: true },
        { text: 'Уровень', value: 'level_coef', sortable: true },
        { text: 'Порядок', value: 'order', sortable: true },
        { text: '', value: 'options', align: 'end', sortable: false },
      ],
    }
  },
  mounted() {
    this.fetchLesson()
      .then(() => {
        this.$store.dispatch("breadcrumbs/setLinks", [
          {
            text: 'Все курсы',
            to: {
              name: "AdminCoursesIndex",
            },
          },
          {
            text: this.course_title,
            to: {
              name: "AdminCourseShow",
              params: {
                course_id: this.course_id,
              },
            },
          },
          {
            text: this.module_title,
            to: {
              name: "AdminModuleShow",
              params: {
                module_id: this.module_id,
              },
            },
          },
          {
            text: this.chapter_title,
            to: {
              name: "AdminChapterShow",
              params: {
                chapter_id: this.chapter_id,
              },
            },
          },
          {
            text: this.lesson && this.lesson.title,
            disabled: true,
            // to: { name: 'LessonShow', params: { lesson_id: this.lesson_id }}
          },
        ]);
      })
  },
  methods: {
    decodeHTML,
    async fetchLesson() {
      this.loading = true
      try {
        let { data } = await this.$axios.get(`admin/chapters/${ this.chapter_id }/lessons/${ this.lesson_id }/edit`);
        if(!data) throw Error('Нет данных в ответе');
        this.lesson = data?.lesson
        this.module_id = data?.chapter?.module?.id;
        this.module_title = data?.chapter?.module?.title;
        this.chapter_title = data?.chapter?.title;
        this.course_id = data?.chapter?.module?.course?.id;
        this.course_title = data?.chapter?.module?.course?.title;
        this.exercises = data?.lesson?.exercises;
        this.lesson_type = data?.lesson?.type?.id === 1 && 'content'
        // TODO rewrite this
      } catch(err) {
        this.errorText = err;
      } finally {
        this.loading = false
      }
    },

    async addLessonContent(content) {
      console.log('content:', content)
      this.add_loading = true
      await this.$axios.post('admin/lessons', {
        id: this.lesson_id,
        content_elements: content,
        chapter_id: this.chapter_id
      })
        .then(res => {
          console.log(res)
          this.$store.dispatch('snackbar/START_SNACKBAR', {
            text: 'Сохранено!',
            color: 'success'
          })
        })
        .catch(err => {
          throw new Error(err)
        })
        .finally(() => this.add_loading = false)
    },
  },
}
</script>

<style lang="scss">
.admin__course-container {
  border-radius: 10px;
  padding: 32px 24px;
  background-color: #FFFFFF;
  border: 1px solid rgba(23, 23, 41, 0.08);
}
</style>
