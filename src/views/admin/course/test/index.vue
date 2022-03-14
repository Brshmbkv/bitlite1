<template>
  <v-container fluid>
    <div
      class="d-flex"
    >
      <p
        class="mb-0 align-self-center font-weight-bold"
        style="font-size: 22px;color: #171729;line-height: 24px"
      >Тесты</p>
      <v-btn
        class="text-capitalize add-courses-module__btn ml-auto align-self-center mr-0"
        text
        :ripple="false"
        @click="dialog_add = true"
      >
        <span style="font-size: 18px;margin-right: 6px">+</span>
        Добавить тест
      </v-btn>
    </div>
    <v-data-table
      :headers="headers"
      :items="tests"
      :mobile-breakpoint="0"
      hide-default-footer
      @click:row="changeToTestShowPage"
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
                    testForEdit = item
                  }"
            >
              <PenIcon :class="hover ? 'white-pen' : 'pen'" ></PenIcon>
            </v-btn>
          </template>
        </v-hover>
      </template>
    </v-data-table>
    <AddTestDialog
      :dialog="dialog_add"
      :next-order="tests && tests.length + 1"
      :testable_id="chapter_id"
      @close-dialog="dialog_add = false"
      @update-tests="fetchTests"
    ></AddTestDialog>
    <EditTestDialog
      :dialog="dialog_edit"
      :test="testForEdit && testForEdit"
      :testable_id="chapter_id"
      @close-dialog="dialog_edit = false"
      @update-tests="fetchTests"
    ></EditTestDialog>
  </v-container>
</template>

<script>
import EditTestDialog from "@/components/Admin/course/EditTestDialog";
import AddTestDialog from "@/components/Admin/course/AddTestDialog";
import PenIcon from '@/assets/svg/pen.svg'

export default {
  name: "AdminTestIndex",
  components: {
    EditTestDialog,
    AddTestDialog,
    PenIcon,
  },
  props: ['chapter_id'],
  data() {
    return {
      dialog_add: false,
      dialog_edit: false,
      tests: undefined,
      module: undefined,
      course: undefined,
      chapter_title: undefined,
      testForEdit: undefined,
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
    this.fetchTests()
      .then(() => {
        this.$store.dispatch("breadcrumbs/setLinks", [
          {
            text: 'Все курсы',
            to: {
              name: "AdminCoursesIndex",
            },
          },
          {
            text: this.course && this.course.title,
            to: {
              name: "AdminCourseShow",
              params: {
                course_id: this.course && this.course.id,
              },
            },
          },
          {
            text: this.module && this.module.title,
            to: {
              name: "AdminModuleShow",
              params: {
                module_id: this.module && this.module.id,
              },
            },
          },
          {
            text: this.chapter_title && this.chapter_title,
            to: {
              name: "AdminChapterShow",
              params: {
                chapter_id: this.chapter_id,
              },
            },
          },
          {
            text: 'Тесты',
            disabled: true,
          }
        ]);
      })
  },
  methods: {
    changeToTestShowPage(item) {
      this.$router.push({
        name: 'AdminTestShow',
        params: {
          test_id: item.id,
        },
      })
    },

    async fetchTests() {
      await this.$axios.get('admin/chapters/' + this.chapter_id + '/tests')
        .then(res => {
          if(res && res.data) {
            console.log('admin/tests', res.data)
            this.tests = res.data.tests
            this.module = res.data.module
            this.course = res.data.module && res.data.module.course || undefined;
            this.chapter_title = res.data.title
          }
        })
    }
  }
}
</script>
