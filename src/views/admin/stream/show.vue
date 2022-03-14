<template>
  <v-container fluid class="px-md-6 px-5 pt-5">
    <BackButton
      :route-name="'AdminStreamIndex'"
    />
    <div
      class="my-5"
    >
      <p style="font-size: 24px" class="font-weight-bold">Поток: {{ stream_name }}</p>
    </div>
    <v-divider></v-divider>
    <h1
      class="my-5 font-weight-bold"
      style="font-size: 20px"
    >Лекторы</h1>

    <TeacherCardList
      :teachers="teachers"
      :loading="teachers_loading"
      :stream_id="Number(stream_id)"
      @add="dialog_teacher_add = true"
      @refresh="fetchTeachers"
    />

    <v-row
      class="ma-0 pa-0 mt-6 mb-4"
      justify="space-between"
      align-content="center"
    >
      <p
        class="mb-0 align-self-center font-weight-bold"
        style="font-size: 20px"
      >Модули</p>
      <v-btn
        class="text-capitalize add-courses-module__btn mr-0"
        text
        :ripple="false"
        @click="dialog_module_add = true"
      >
        <span style="font-size: 18px;margin-right: 4px">+</span>
        Добавить
      </v-btn>
    </v-row>

    <StreamModuleTable
      :modules="modules"
      :stream_id="Number(stream_id)"
      :loading="loading"
      @update-modules="fetchModules"
    ></StreamModuleTable>

    <div class="d-flex justify-space-between align-center my-4">
      <p
        class="mb-0 align-self-center font-weight-bold"
        style="font-size: 20px"
      >Группы</p>
      <v-btn
        class="text-capitalize add-courses-module__btn mr-0"
        text
        :ripple="false"
        @click="dialog_group_add = true"
      >
        <span style="font-size: 18px;margin-right: 4px">+</span>
        Добавить
      </v-btn>
    </div>

    <StreamGroupTable
      :groups="groups"
      :stream_id="stream_id"
      :loading="loading"
      @update-groups="fetchGroups"
      @edit-group="openEditGroupDialog"
    ></StreamGroupTable>

    <AddStreamModuleDialog
      :stream_id="Number(stream_id)"
      :dialog.sync="dialog_module_add"
      @update-modules="fetchModules"
    />

    <AddGroupDialog
      :stream_id="stream_id"
      :stream_type="stream_type"
      :dialog.sync="dialog_group_add"
      :group_id.sync="editable_group"
      @update-groups="fetchGroups"
    ></AddGroupDialog>

    <AddStreamGroupUserDialog
      :dialog.sync="dialog_teacher_add"
      :user_role="0"
      :group_id="Number(stream_id)"
      @update-users="fetchTeachers()"
    />
  </v-container>
</template>

<script>
import StreamModuleTable from "@/components/Admin/stream/StreamModuleTable";
import StreamGroupTable from "@/components/Admin/stream/StreamGroupTable";
import BackButton from "@/components/Admin/BackButton";
import TeacherCardList from "@/components/Admin/user/TeacherCardList";

export default {
  name: "AdminStreamShow",
  components: {
    TeacherCardList,
    BackButton,
    AddStreamGroupUserDialog: () => import("@/components/Admin/stream/group/AddStreamGroupUserDialog"),
    AddStreamModuleDialog: () => import("@/components/Admin/stream/module/AddStreamModuleDialog"),
    AddGroupDialog: () => import("@/components/Admin/stream/AddGroupDialog"),
    StreamGroupTable,
    StreamModuleTable
  },
  props: {
    stream_id: [Number, String]
  },

  data() {
    return {
      loading: true,
      teachers_loading: true,
      dialog_group_add: undefined,
      dialog_module_add: undefined,
      dialog_teacher_add: undefined,
      edit_group_add: undefined,
      edit_module_add: undefined,
      edit_teacher_add: undefined,
      modules: undefined,
      groups: undefined,
      teachers: undefined,
      stream_name: undefined,
      stream_type: undefined,
      editable_group: undefined
    }
  },

  mounted() {
    // this.fetchModules()
    // this.fetchGroups()
    // this.fetchTeachers()
    Promise.all([this.fetchModules(), this.fetchGroups(), this.fetchTeachers()])
      .finally(() => {
        this.loading = false
      })
  },

  methods: {
    async fetchModules() {
      await this.$axios.get(`admin/streams/${ this.stream_id }/modules`)
        .then((res) => {
          if(res && res.data) {
            this.modules = res.data.group_modules
            this.stream_name = res.data.name
            this.stream_type = res.data.type
          }
        })
    },

    async fetchGroups() {
      await this.$axios.get(`admin/streams/${ this.stream_id }/groups`)
        .then((res) => {
          if(res && res.data) {
            console.log(`admin/streams/${ this.stream_id }/groups`, res.data)
            this.groups = res.data
          }
        })
    },

    async fetchTeachers() {
      await this.$axios.get(`admin/groups/${ this.stream_id }/teachers`)
        .then((res) => {
          if(res && res.data) {
            console.log(`admin/groups/${ this.stream_id }/teachers`, res.data)
            this.teachers = res.data
          }
        })
        .finally(() => {
          this.teachers_loading = false
        })
    },

    openEditGroupDialog(group_id) {
      this.editable_group = group_id
      this.dialog_group_add = true
    }
  }
}
</script>

<style scoped>

</style>
