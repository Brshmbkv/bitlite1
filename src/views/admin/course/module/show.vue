<template>
  <v-container fluid>
    <div
      class="d-flex justify-space-between align-center"
    >
      <span style="font-size: 20px; font-weight: 700">{{ module && module.title }}</span>
      <v-btn
          class="text-capitalize add-courses-module__btn"
          text
          :ripple="false"
          @click="dialog_add = true"
      >
        <span style="font-size: 18px;margin-right: 6px">+</span>
        Добавить главу
      </v-btn>
    </div>
    <v-card
      elevation="0"
      style="border-radius: 3px"
    >
      <v-data-table
        :headers="headers"
        :items="chapters"
        :mobile-breakpoint="0"
        hide-default-footer
        hide-default-header
        :loading="loading"
        @click:row="changeToChapterShowPage"
        class="elevation-0 mt-3 admin-users-table__v-table"
        style="border-bottom-left-radius: 0;border-bottom-right-radius: 0;"
      >
        <template v-slot:item.options="{ item }">
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
                    chapterForEdit = item
                  }"
              >
                <PenIcon :class="hover ? 'white-pen' : 'pen'" ></PenIcon>
              </v-btn>
            </template>
          </v-hover>
        </template>
      </v-data-table>
    </v-card>
    <AddChapterDialog
      :dialog="dialog_add"
      :next-order="chapters && chapters.length + 1"
      :course_module_id="module_id"
      @close-dialog="dialog_add = false"
      @update-chapters="fetchModule"
    ></AddChapterDialog>
    <EditChapterDialog
      :dialog="dialog_edit"
      :course_module_id="module_id"
      :chapter_id="chapterForEdit && chapterForEdit.id"
      @close-dialog="dialog_edit = false"
      @update-chapters="fetchModule"
    ></EditChapterDialog>
  </v-container>
</template>

<script>

import AddChapterDialog from "@/components/Admin/course/AddChapterDialog";
import PenIcon from '@/assets/svg/pen.svg'
import EditChapterDialog from "@/components/Admin/course/EditChapterDialog";

export default {
  name: "AdminModuleShow",
  components: {
    EditChapterDialog,
    AddChapterDialog,
    PenIcon,
  },
  props: ['module_id'],
  data() {
    return {
      loading: true,
      chapterForEdit: undefined,
      module: undefined,
      chapters: undefined,
      course_id: undefined,
      dialog_add: false,
      dialog_edit: false,
      headers: [
        {
          text: 'ID',
          align: 'start',
          value: 'id',
          sortable: true
        },
        { text: 'Название', value: 'title', sortable: true },
        { text: 'Порядок', value: 'order', sortable: true },
        { text: '', value: 'options', align: 'end', sortable: false },
      ],
    }
  },
  mounted() {
    this.fetchModule()
      .then(() => {
        this.$store.dispatch("breadcrumbs/setLinks", [
          {
            text: 'Все курсы',
            to: {
              name: "AdminCoursesIndex",
            },
          },
          {
            text: this.module.course.title,
            to: {
              name: "AdminCourseShow",
              params: {
                course_id: this.course_id,
              },
            },
          },
          {
            text: this.module.title,
            disabled: true,
            // to: { name: 'LessonShow', params: { lesson_id: this.lesson_id }}
          },
        ]);
      })
  },
  methods: {
    async fetchModule() {
      this.loading = true
      await this.$axios.get('admin/modules/' + this.module_id + '/chapters')
        .then(res => {
          if(res && res.data) {
            this.chapters = res.data.chapters
            this.module = res.data
            this.course_id = res.data.course.id
          }
        })
        .finally(() => this.loading = false)
    },

    changeToChapterShowPage(item) {
      this.$router.push({
        name: 'AdminChapterShow',
        params: {
          course_id: this.course_id,
          module_id: this.module_id,
          chapter_id: item.id
        }
      })
    }
  },
}
</script>
