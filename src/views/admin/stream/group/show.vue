<template>
  <v-container fluid class="px-md-6 px-5 pt-5">
    <div>
      <p style="font-size: 24px" class="font-weight-bold">{{ group_name || 'Группа' }}</p>
      <p class="add-dialog__label-for-input">Телеграм чат</p>
      <v-text-field
        v-model="group_telegram"
        required
        outlined
        dense
        style="width: 300px"
        class="add-dialog__v-text-field"
        :readonly="!edit_telegram"
      >
        <template v-slot:append>
          <PenIcon
            v-if="!edit_telegram"
            class="bigger-svg"
            @click="edit_telegram = true"
            style="cursor:pointer;"
          />
          <v-icon
            v-else
            :color="'#0ACCDA'"
            @click="edit_telegram = false"
          >{{ mdiCheck }}
          </v-icon>
        </template>
      </v-text-field>
    </div>
    <v-divider></v-divider>
    <h1
      class="my-5 font-weight-bold"
      style="font-size: 20px"
    >Преподаватели</h1>

    <TeacherCardList
      :teachers="teachers"
      :loading="teachers_loading"
      :stream_id="Number(group_id)"
      @add="openDialog"
      @refresh="fetchTeachers"
    />

    <div class="d-flex justify-space-between align-center my-6">
      <p
        class="mb-0 align-self-center"
        style="font-size: 20px; font-weight: 600"
      >Студенты</p>
      <v-btn
        class="text-capitalize add-courses-module__btn mr-0"
        text
        :ripple="false"
        @click="openDialog(true)"
      >
        <span style="font-size: 18px;margin-right: 4px">+</span>
        Добавить
      </v-btn>
    </div>

    <StreamGroupUsersTable
      :table_loading="loading"
      :users="students"
      :group_id="Number(group_id)"
      :stream_id="Number(stream_id)"
      :events_count="Number(events_count)"
      @fetch-users="fetchStudents"
    />

    <AddStreamGroupUserDialog
      :dialog.sync="add_user_dialog"
      :is-student="add_student"
      :group_id="Number(group_id)"
      @update-users="add_student ? fetchStudents() : fetchTeachers()"
    />
  </v-container>
</template>

<script>
import StreamGroupUsersTable from "@/components/Admin/stream/group/StreamGroupUsersTable";
import PenIcon from '@/assets/svg/pen.svg'
import { mdiCheck } from '@mdi/js'
import TeacherCardList from "@/components/Admin/user/TeacherCardList";

export default {
  name: "AdminStreamGroupShow",
  components: {
    TeacherCardList,
    StreamGroupUsersTable,
    AddStreamGroupUserDialog: () => import('@/components/Admin/stream/group/AddStreamGroupUserDialog'),
    PenIcon,
  },
  props: ['group_id'],
  data() {
    return {
      mdiCheck,
      loading: false,
      teachers_loading: true,
      modules: undefined,
      group_name: undefined,
      group_telegram: undefined,
      teachers: undefined,
      students: undefined,
      stream_id: undefined,
      stream_name: undefined,
      events_count: undefined,
      edit_telegram: false,
      // TRUE if u need to add student otherwise FALSE
      add_student: false,
      add_user_dialog: false,
    }
  },

  mounted() {
    this.fetchGroup()
      .then(() => {
        Promise.all([this.fetchTeachers(), this.fetchStudents()])
          .finally(() => {
            this.$store.dispatch("breadcrumbs/setLinks", [
              {
                text: 'Все потоки',
                to: {
                  name: "AdminStreamIndex",
                },
              },
              {
                text: this.stream_name,
                to: {
                  name: "AdminStreamShow",
                  params: {
                    stream_id: this.stream_id
                  }
                },
              },
              {
                text: this.group_name || 'Группа',
                disabled: true,
                // to: { name: 'LessonShow', params: { lesson_id: this.lesson_id }}
              },
            ]);
            this.loading = false
          })
      })
  },

  methods: {
    openDialog(is_student = false) {
      this.add_student = is_student
      this.add_user_dialog = true
    },

    async fetchGroup() {
      this.loading = true
      await this.$axios.get(`admin/groups/${this.group_id}`)
        .then(res => {
          if (res && res.data) {
            this.group_name = res.data.name
            this.group_telegram = res.data.telegram_chat
            this.stream_id = res.data.parent_id
            this.stream_name = res.data.parent_name || 'Поток'
            this.events_count = res.data.events_count
          }
        })
    },

    async fetchStudents() {
      await this.$axios.get(`admin/groups/${this.group_id}/students`, {
        params: {
          paginate: 20
        }
      })
        .then(res => {
          if (res && res.data) {
            console.log(`admin/groups/${this.stream_id}/students`, res.data)
            this.students = res.data
          }
        })
    },

    async fetchTeachers() {
      this.teachers_loading = true
      this.teachers = []
      await this.$axios.get(`admin/groups/${this.group_id}/teachers`)
        .then(res => {
          if (res && res.data) {
            console.log(`admin/groups/${this.stream_id}/teachers`, res.data)
            this.teachers = res.data
          }
        })
        .finally(() => {
          this.teachers_loading = false
        })
    }
  },

}
</script>

<style scoped>

</style>
