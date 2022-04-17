<template>
  <v-container fluid>
    <template v-if="loading">
      <v-row class="pb-4">
        <v-col cols=12>
          <v-skeleton-loader class="d-inline-block mr-3" type="button"/>
          <v-skeleton-loader class="d-inline-block mr-3" type="button"/>
          <v-skeleton-loader class="d-inline-block mr-3" type="button"/>
        </v-col>
        <v-col>
          <v-skeleton-loader
            type="table-tbody"
            :types="{
              'table-tbody': 'table-row-divider@12',
            }"
          />
        </v-col>
      </v-row>
    </template>
    <template
      v-else
    >
      <v-row justify="space-between" class="flex-wrap">
        <v-col cols="auto">
          <v-tabs
            v-model="tab"
            background-color="transparent"
            class="admin-users__v-tabs"
          >
            <v-tabs-slider :color="'#4376FB'"></v-tabs-slider>
            <v-tab
              class="text-capitalize users__v-tab"
              :ripple="false"
              active-class="active--tab"
              :disabled="tab_loading"
              :key="'students'"
              href="#students"
            >
              <span style="letter-spacing: 0 !important;">Студенты</span>
            </v-tab>
            <v-tab
              class="text-capitalize users__v-tab"
              :ripple="false"
              active-class="active--tab"
              :disabled="tab_loading"
              :key="'teachers'"
              href="#teachers"
            >
              <span style="letter-spacing: 0 !important;" class="mx-2">Преподаватели</span>
            </v-tab>
            <v-tab
              class="text-capitalize users__v-tab"
              :ripple="false"
              active-class="active--tab"
              :disabled="tab_loading"
              :key="'admins'"
              href="#admins"
            >
              <span style="letter-spacing: 0 !important;">Админы</span>
            </v-tab>
          </v-tabs>
        </v-col>
        <v-col
          class="d-flex justify-end" style="gap: 12px"
        >
          <!-- class="pr-sm-6 pr-4 pb-0" -->
          <div
            v-if="tab === 'students'"
            class="users-filter__div"
          >
            <UsersFilter
              :has_finished_course.sync="has_finished_course"
              :has_no_group.sync="has_no_group"
              :has_return_course.sync="has_return_course"
              :has_unpaid_course.sync="has_unpaid_course"
              @search="fetchUsers"
            />
          </div>
          <AddButton @click="dialog_add = true"/>
          <v-text-field
            :prepend-inner-icon="mdiMagnify"
            v-model="searchField"
            dense
            outlined
            color="#4376FB"
            class="admin-search__v-text-field"
            :label="searchLabelFromRoleName(tab)"
            style="max-width: 280px !important;height: 40px"
          >
          </v-text-field>
        </v-col>
      </v-row>

      <UsersTable
        :users="users"
        :total-pages="total_pages"
        :paginate-number="paginateNumber"
        :table_loading="table_loading"
        :user-role-type="tab"
        :current-page="currentPage"
        @fetch-users="(page) => {
          this.currentPage = page
          this.fetchUsers
        }"
        @edit-user="(id) => {
          this.userForEditID = id
          this.dialog_edit = true
        }"
        @delete-user="(user) => {
          this.userForDelete = user
          this.remove_dialog = true
        }"
        @order-users="(column) => {
          if(column === 'full_name') {
            this.userColumn = 'first_name'
            this.sortUsers()
          } else {
            this.userColumn = column
            this.sortUsers()
          }
        }"
      >
      </UsersTable>
    </template>
    <EditUserDialog
      :dialog="dialog_edit"
      :user_id="userForEditID"
      :roles="roles"
      @close-dialog="dialog_edit = false"
      @fetch-users="fetchUsers"
    ></EditUserDialog>
    <AddUserDialog
      :dialog="dialog_add"
      :roles="roles"
      :current-role-id="{
        'admins':1,
        'students':2,
        'teachers':3,
      }[tab]"
      @fetch-users="fetchUsers"
      @close-dialog="dialog_add = false"
    ></AddUserDialog>
    <ConfirmationModal
      :dialog.sync="remove_dialog"
      :title="'Удаление пользователя'"
      :text="`Вы действительно хотите удалить пользователя ${userForDelete && ((userForDelete.first_name || '') + ' ' + (userForDelete.last_name || ''))}?`"
      :action="'Удалить'"
      :loading="remove_loading"
      @success="removeUser"
    />
  </v-container>
</template>

<script>
import { mdiMagnify } from '@mdi/js'
import UsersTable from "@/components/Admin/user/UsersTable";
import AddButton from "@/components/Admin/AddButton";
import UsersFilter from "@/components/Admin/user/UsersFilter";
const ConfirmationModal = () => import("@/components/Admin/ConfirmationModal");
const AddUserDialog = () => import("@/components/Admin/user/AddUserDialog");
const EditUserDialog = () => import("@/components/Admin/user/EditUserDialog");

export default {
  name: "AdminUsersIndex",
  components: { UsersFilter, AddButton, ConfirmationModal, EditUserDialog, AddUserDialog, UsersTable },
  data() {
    return {
      loading: false,
      tab_loading: false,
      table_loading: false,
      remove_loading: false,
      mdiMagnify,
      dialog_add: false,
      dialog_edit: false,
      paginateNumber: 10,
      per_page: undefined,
      roles: undefined,
      searchField: undefined,
      tab: 'students',
      total_pages: undefined,
      total_users: undefined,
      users: undefined,
      usersOrderBy: 'desc',
      userColumn: undefined,
      currentPage: 1,
      userForEditID: undefined,
      show_filter: false,
      remove_dialog: false,
      userForDelete: undefined,

      // USER FILTERS
      has_no_group: false,
      has_unpaid_course: false,
      has_finished_course: false,
      has_return_course: false,
    }
  },
  watch: {
    currentPage(newValue, oldValue) {
      if(newValue >= 0 && newValue !== oldValue) {
        this.table_loading = true
        this.fetchUsers()
          .finally(() => {
            this.table_loading = false
          })
      }
    },

    searchField(newValue, oldValue) {
      if(newValue !== oldValue) {
        this.table_loading = true
        clearTimeout(this.searchTimeout)
        this.currentPage = 1
        this.searchTimeout = setTimeout(() => {
          this.fetchUsers()
            .finally(() => {
              this.table_loading = false
            })
        }, 400)
      }
    },

    tab(newValue, oldValue) {
      if(newValue !== oldValue) {
        this.table_loading = true
        this.currentPage = 1
        this.userColumn = undefined
        this.usersOrderBy = 'desc'
        this.has_no_group = false
        this.has_finished_course = false
        this.has_unpaid_course = false
        this.has_return_course = false
        this.fetchUsers()
          .finally(() => {
            this.table_loading = false
          })
      }
    }
  },
  mounted() {
    this.loading = true
    this.fetchUsers()
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    async fetchUsers() {
      if(!this.tab_loading) {
        this.tab_loading = true;
        this.table_loading = true
        let url = `admin/${ this.tab }`

        await this.$axios.get(url, {
          params: {
            page: this.currentPage,
            order: this.usersOrderBy,
            column: this.userColumn,
            paginate: this.paginateNumber,
            search: this.searchField,
            ...(this.tab === 'students' && {
              has_no_group: this.has_no_group ? '1' : '0',
              has_unpaid_course: this.has_unpaid_course ? '1' : '0',
              has_finished_course: this.has_finished_course ? '1' : '0',
              has_return_course: this.has_return_course ? '1' : '0'
            })
          }
        })
          .then(res => {
            if(res && res.data) {
              console.log(url, res.data)
              this.users = res.data.data;
              this.per_page = res.data.meta && Number(res.data.meta.per_page)
              this.total_users = res.data.meta && res.data.meta.total
              this.total_pages = res.data.meta && Math.ceil(res.data.meta.total / res.data.meta.per_page)
              this.roles = res.data.roles
            }
          })
          .finally(() => {
            this.tab_loading = false
            this.table_loading = false
          })
      }
    },

    sortUsers() {
      this.usersOrderBy = (this.usersOrderBy === 'asc') ?
        (this.usersOrderBy = 'desc') : this.usersOrderBy = 'asc'
      this.table_loading = true
      this.fetchUsers()
        .finally(() => {
          this.table_loading = false
        })
    },

    searchLabelFromRoleName(role) {
      return {
        admins: 'Поиск по администраторам',
        students: 'Поиск по студентам',
        teachers: 'Поиск по преподавателям',
      }[role]
    },

    async removeUser() {
      if(this.userForDelete?.id) {
        this.remove_loading = true
        await this.$axios.delete(`admin/users/${this.userForDelete?.id}`)
          .then(() => {
            this.remove_dialog = false
            this.fetchUsers()
          })
          .catch((err) => {
            throw new Error(err)
          })
          .finally(() => {
            this.remove_loading = false
          })
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    console.log("TO:", to)
    let currentTabFromRouteName = {
      'AdminStudentShow': 'students',
      'AdminTeacherShow': 'teachers',
      'AdminAdminShow': 'admins',
    }
    // console.log(currentTabFromRouteName[from && from.name])
    next((vm) => {
      vm.tab = currentTabFromRouteName[from && from.name] || 'students'
    })
  },
}
</script>
