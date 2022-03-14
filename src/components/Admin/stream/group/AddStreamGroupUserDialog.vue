<template>
  <div>
    <v-dialog
      v-model="dialog"
      @click:outside="closeDialog"
      max-width="700px"
      content-class="add-user__dialog"
    >
      <h2>Добавить {{ isStudent ? 'студента' : 'преподавателя' }}</h2>
      <v-text-field
        :label="isStudent ? 'поиск по студентам' : 'поиск по преподавателям'"
        v-model="search"
        class="add-user__dialog__input"
        height="40"
        outlined
        dense
        single-line
        hide-details
      >
        <template v-slot:prepend-inner>
          <SearchIcon/>
        </template>
      </v-text-field>
      <div class="add-user__dialog__list">
        <div v-if="loading" class="add-user__dialog__list--loading">
          <v-progress-circular
            size="54"
            indeterminate
            color="white"
          />
        </div>
        <div v-else-if="users && users.length === 0" class="d-flex justify-center align-center" style="position: absolute; inset: 0">
          <span>Нет данных</span>
        </div>
        <div
          v-for="user in users"
          :key="user.id"
          class="add-user__dialog__list-item"
        >
          <v-avatar size="24">
            <v-img
              :src="user.avatar || UserPlaceholderSm"
            />
          </v-avatar>
          <span class="add-user__dialog__list-item__name">{{ `${user.first_name || ''} ${user.last_name || ''}` }}</span>
          <v-btn
            :ripple="false"
            icon
            small
            elevation="0"
            class="ml-auto add-user__dialog__list-item__btn"
            @click="addUser(user.id)"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 8H8V13C8 13.55 7.55 14 7 14C6.45 14 6 13.55 6 13V8H1C0.45 8 0 7.55 0 7C0 6.45 0.45 6 1 6H6V1C6 0.45 6.45 0 7 0C7.55 0 8 0.45 8 1V6H13C13.55 6 14 6.45 14 7C14 7.55 13.55 8 13 8Z" fill="#0ACCDA"/>
            </svg>
          </v-btn>
        </div>
      </div>
      <div class="add-user__dialog__pagination">
        <Pagination 
          v-model="page"
          :length="total_pages"
          :disabled="loading"
        />
      </div>
    </v-dialog>
  </div>
</template>

<script>
import SearchIcon from '@/assets/svg/search.svg'
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png'
import Pagination from '@/components/Admin/Pagination'
export default {
  name: "AddStreamGroupUserDialog",
  components: {
    SearchIcon,
    Pagination
  },
  props: {
    group_id: Number,
    dialog: Boolean,
    isStudent: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      UserPlaceholderSm,
      SearchIcon,
      users: undefined,
      loading: false,
      search: undefined,
      page: 1,
      total_pages: undefined,
      searchTimeout: undefined,
    }
  },
  watch: {
    dialog: {
      immediate: true,
      handler(newValue) {
        if(newValue) {
          this.fetchUsers()
        }
      }
    },
    search() {
      clearTimeout(this.searchTimeout)
      this.page = 1
      this.searchTimeout = setTimeout(() => {
        this.fetchUsers()
          .finally(() => {
            this.loading = false
          })
      }, 400)
    },
    page() {
      this.fetchUsers()
    }
  },
  methods: {
    async fetchUsers() {
      this.loading = true
      let uri = this.isStudent
        ? `admin/groups/${this.group_id}/newStudents` : `admin/groups/${this.group_id}/newTeachers`
      await this.$axios.get(uri, {
        params: {
          page: this.page,
          search: this.search,
          paginate: 7
        }
      })
        .then(res => {
          if (res && res.data) {
            // console.log(res.data)
            this.users = res.data.data
            this.total_pages = Math.ceil(res.data.meta.total / res.data.meta.per_page)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    async addUser(id) {
      await this.$axios.post(`admin/addUser`, {
        user_id: id,
        group_id: this.group_id
      })
        .then(res => {
          if (res && res.data) {
            let user = this.users.find(user => user.id === id)
            this.users = this.users.filter(user => user.id !== id)
            let role = this.isStudent ? 'Студент' : 'Преподаватель'
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: `${role} ${user.first_name || ''} ${user.last_name || ''} успешно добавлен!`,
              color: '#5CC689'
            })
            this.fetchUsers()
            this.$emit('update-users')
          }
        })
    },

    closeDialog() {
      this.users = []
      this.page = 1
      this.search = ''
      this.$emit('update:dialog', false)
    }
  }
}
</script>

<style lang="scss">
.add-user__dialog {
  background: #F5F6F8;
  border-radius: 10px;
  min-height: 400px;
  padding: 30px 35px;
  display: flex;
  flex-direction: column;
  gap: 30px;

  &::-webkit-scrollbar {
    width: 0;
  }

  &__input {
    background-color: #FFFFFF;
    &:not(.v-input--is-focused, .error--text) {
      .v-input__slot {
        fieldset {
          border: 1px solid rgba(23, 23, 41, 0.15);
        }
      }
    }
    .v-input--is-focused {
      svg {
        fill: #0BC3B8;
      }
    }
    .v-input__prepend-inner {
      margin-top: 0 !important;
      align-self: center;

    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    background-color: #FFFFFF;
    position: relative;
    min-height: 400px;

    &-item {
      padding: 15px;
      display: flex;
      align-items: center;

      &__name {
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0.01em;
        margin-left: 8px;
      }
    }

    &--loading {
      position: absolute;
      border-radius: 4px;
      pointer-events: none;
      user-select: none;
      display: flex;
      justify-content: center;
      align-items: center;
      backdrop-filter: blur(2px);
      z-index: 2;
      inset: 0;
      background-color: rgba(23, 23, 41, 0.13);
    }
  }
}

.add-user__dialog__list-item:not(:last-child) {
  box-shadow: 0px 1px 0px rgba(23, 23, 41, 0.08);
}

.add-user__dialog__list-item__btn:hover {
  background: rgba(10, 204, 218, 0.12);
}

@media screen and (max-width: 600px){
  .add-user__dialog {
    padding: 20px;
  }
}

.add-user__dialog__pagination {
  background: transparent;

  .v-pagination__navigation--disabled {
    .theme--light.v-icon {
      color: rgba(23, 23, 41, 0.2);
    }
  }

  .v-pagination__navigation {
    box-shadow: none;
    box-sizing: border-box;
    border-radius: 4px;
    background: none !important;
  }

  .v-pagination__item.v-pagination__item--active {
    box-shadow: none;
    border: 1px solid rgba(23, 23, 41, 0.2);
    box-sizing: border-box;
    border-radius: 6px;
    background: #0BC3B8 !important;
  }

  .v-pagination__item {
    box-shadow: none;
    border-radius: 6px;
    background: none !important;
    font-weight: 600;
    color: #5A6275;
    &:not(.v-pagination__item--active):hover {
      background-color: rgba(10, 204, 218, 0.24) !important;
    }
  }
}
</style>
