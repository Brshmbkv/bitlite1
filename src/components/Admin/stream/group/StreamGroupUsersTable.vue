<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="users"
      :loading="table_loading"
      :items-per-page="100"
      hide-default-footer
      hide-default-header
      class="elevation-0 mt-3 mb-10"
      style="border-bottom-left-radius: 0;border-bottom-right-radius: 0;"
    >
      <template #header="{props: {headers}}">
        <thead>
          <tr>
            <th v-for="header in headers" :key="header.value">
              <span
                style="cursor:pointer; gap: 4px"
                class="d-flex align-center"
                :class="'justify-' + (header.align || 'start')"
                @click="$emit('order-users', header.value)"
              >
                <SortIcon style="fill: #A7ADC3;" v-if="header.sortable" />
                <span
                  style="font-weight: 500;font-size: 14px;line-height: 20px;letter-spacing: 0.02em;color: #A7ADC3;"
                  >{{ header.text }}</span
                >
              </span>
            </th>
          </tr>
        </thead>
      </template>
      <template #body="{items}">
        <tbody>
          <tr
            v-for="item in items"
            :key="item.id"
            @click="changeToUserShowPage(item)"
            style="cursor: pointer"
          >
            <td>
              <div style="display: flex; align-items: center; gap: 8px">
                <v-avatar size="30" class="mr-2">
                  <v-img :src="item.avatar || UserPlaceholderSm" alt="Avatar" />
                </v-avatar>
                <span
                  style="font-size: 16px; line-height: 24px; font-weight: 500; color: #4376FB;"
                  >{{ item.first_name }} {{ item.last_name }}</span
                >
              </div>
            </td>
            <td>
              <span>
                {{ item.phone | VMask('+# (###) ###-##-##') }}
              </span>
            </td>
            <td>
              <div style="display:flex; justify-content: center">
                <span style="color: #5cc689">{{ item.attendances }}</span> /
                {{ events_count }}
              </div>
            </td>
            <td>
              <div style="display:flex; justify-content: center">
                <CustomProgress :score="Number(item.score)" />
              </div>
            </td>
            <td>
              <div style="display:flex; justify-content: center">
                {{ item.exercise_not_checked }}
              </div>
            </td>
            <td>
              <div style="display:flex; justify-content: center">
                <EditDropDownButton
                  for-move
                  @move="openSwapStudentModal(item.id)"
                  @edit="$emit('edit-user', item.id)"
                  @delete="removeUser(item)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </template>

      <template v-slot:loading>
        <span>Загрузка...</span>
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
import SortIcon from '@/assets/svg/sort-icon.svg'

import CustomProgress from '@/components/Admin/stream/group/CustomProgress'
import EditDropDownButton from '@/components/Admin/EditDropDownButton'
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png'
import { mdiCompareVertical, mdiPencilOutline } from '@mdi/js'
import SwapStudentDialog from '@/components/Admin/stream/group/SwapStudentDialog'

export default {
  name: 'StreamGroupUsersTable',
  components: {
    SwapStudentDialog,
    EditDropDownButton,
    CustomProgress,
    SortIcon,
  },
  props: {
    users: Array,
    table_loading: {
      type: Boolean,
      default: false,
    },
    group_id: Number,
    stream_id: Number,
    events_count: Number,
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
        {
          text: 'Успеваемость',
          value: 'score',
          align: 'center',
          sortable: true,
        },
        {
          text: 'Задач на проверку',
          value: 'exercise_not_checked',
          align: 'center',
          sortable: true,
        },
        { text: 'Править', value: 'options', align: 'center', sortable: false },
      ],
    }
  },

  watch: {
    currentPage: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue && newValue > 0) {
          this.page = this.currentPage
        }
      },
      immediate: true,
    },

    page() {
      this.$emit('fetch-users', this.page)
    },
  },

  methods: {
    changeToUserShowPage(item) {
      this.$router.push({
        name: 'AdminStudentShow',
        params: {
          user_id: item.id,
        },
      })
    },

    openSwapStudentModal(id) {
      this.swap_user_id = id
      this.swap_user_dialog = true
    },

    async removeUser(teacher) {
      await this.$axios
        .post('admin/removeUser', {
          user_id: teacher.id,
          group_id: this.group_id,
        })
        .then((res) => {
          if (res && res.data) {
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: `Студент ${teacher.first_name || ''} ${teacher.last_name ||
                ''} был удален.`,
              color: '#E7AE1E',
            })
            this.$emit('fetch-users')
          }
        })
    },
  },
}
</script>
