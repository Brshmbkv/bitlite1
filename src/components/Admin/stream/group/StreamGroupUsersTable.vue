<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="users"
      :loading="table_loading"
      :items-per-page="100"
      hide-default-footer
      class="elevation-0 mt-3 admin-users-table__v-table"
      style="border-bottom-left-radius: 0;border-bottom-right-radius: 0;"
      @click:row="changeToUserShowPage"
    >
      <template v-slot:item.first_name="{ item }">
        <v-avatar
          size="30"
          class="mr-2"
        >
          <v-img
            :src="item.avatar || UserPlaceholderSm"
            alt="Avatar"
          />
        </v-avatar>
        {{ item.first_name }} {{ item.last_name }}
      </template>
      <template v-slot:item.phone="{ item }">
        <span>
          {{ item.phone | VMask('+# (###) ###-##-##') }}
        </span>
      </template>
      <template v-slot:item.attendances="{ item }">
        <span style="color: #5cc689">{{ item.attendances }}</span>  / {{ events_count }}
      </template>
      <template v-slot:loading>
        <span>Загрузка...</span>
      </template>
      <template v-slot:item.options="{ item }">
        <EditDropDownButton
          for-move
          @move="openSwapStudentModal(item.id)"
          @edit="$emit('edit-user', item.id)"
          @delete="removeUser(item)"
        />
      </template>
      <template v-slot:item.score="{ item }">
        <div>
          <CustomProgress :score="Number(item.score)"/>
        </div>
      </template>
    </v-data-table>
    <SwapStudentDialog
      :value.sync="swap_user_dialog"
      :stream-id="stream_id"
      :user-id="swap_user_id"
      @refresh="$emit('fetch-users')"
    />
  </div>
</template>

<script>
import CustomProgress from "@/components/Admin/stream/group/CustomProgress";
import EditDropDownButton from "@/components/Admin/EditDropDownButton";
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png'
import { mdiCompareVertical, mdiPencilOutline } from '@mdi/js'
import SwapStudentDialog from "@/components/Admin/stream/group/SwapStudentDialog";

export default {
  name: "StreamGroupUsersTable",
  components: {
    SwapStudentDialog,
    EditDropDownButton,
    CustomProgress,
  },
  props: {
    users: Array,
    table_loading: {
      type: Boolean,
      default: false,
    },
    group_id: Number,
    stream_id: Number,
    events_count: Number
  },

  data() {
    return {
      mdiPencilOutline,
      mdiCompareVertical,
      UserPlaceholderSm,
      page: undefined,
      swap_user_dialog: false,
      swap_user_id: undefined,
      headers: [
        { text: 'Полное имя', value: 'first_name', sortable: true },
        { text: 'Контакты', value: 'phone', sortable: true },
        { text: 'Посещаемость', value: 'attendances', align: 'center' },
        { text: 'Успеваемость', value: 'score', align: 'center', sortable: true },
        { text: 'Задач на проверку', value: 'exercise_not_checked', align: 'center', sortable: true },
        { text: 'Править', value: 'options', align: 'center', sortable: false },
      ],
    }
  },

  watch: {
    currentPage: {
      handler(newValue, oldValue) {
        if(newValue !== oldValue && newValue > 0) {
          this.page = this.currentPage
        }
      },
      immediate: true
    },

    page() {
      this.$emit('fetch-users', this.page)
    }
  },

  methods: {
    changeToUserShowPage(item) {
      this.$router.push({
        name: 'AdminStudentShow',
        params: {
          user_id: item.id
        }
      })
    },

    openSwapStudentModal(id) {
      this.swap_user_id = id
      this.swap_user_dialog = true
    },

    async removeUser(teacher) {
      await this.$axios.post('admin/removeUser', {
        user_id: teacher.id,
        group_id: this.group_id
      }).then(res => {
        if(res && res.data) {
          this.$store.dispatch('snackbar/START_SNACKBAR', {
            text: `Студент ${ teacher.first_name || '' } ${ teacher.last_name || '' } был удален.`,
            color: '#E7AE1E'
          })
          this.$emit('fetch-users')
        }
      })
    }
  }
}
</script>
