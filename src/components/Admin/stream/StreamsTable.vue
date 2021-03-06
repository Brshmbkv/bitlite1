<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="streams"
      :loading="sort_loading"
      :items-per-page="paginateNumber"
      :mobile-breakpoint="0"
      hide-default-footer
      hide-default-header
      class="elevation-0 mt-3"
      style="border-bottom-left-radius: 0;border-bottom-right-radius: 0;"
    >
      <template #progress>
        <v-progress-linear class="mt-4" indeterminate color="#4376FB" />
      </template>
      <template v-slot:loading>
        <span>Загрузка...</span>
      </template>
      <template v-slot:header="{ props: { headers } }">
        <thead>
          <tr>
            <th
              v-for="header in headers"
              :key="header.value"
              class="text-none"
              scope="col"
            >
              <span
                style="cursor:pointer; gap: 6px"
                class="d-flex align-center"
                :class="`justify-${header.align}`"
                @click="$emit('order-users', header.value)"
              >
                <SortIcon style="fill: #A7ADC3;" v-if="header.sortable" />
                <span
                  style="font-weight: 500;font-size: 14px;line-height: 20px;letter-spacing: 0.02em; color: #A7ADC3;"
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
            style="cursor: pointer"
            @click="changeToStreamShowPage(item)"
          >
            <td>
              {{ item.id }}
            </td>
            <td>
              {{ item.name }}
            </td>
            <td>
              <span
                style="display:flex; justify-content: center;"
                :style="{
                  color: daysLeftColor(item.days_left),
                }"
                >{{ dateText(item.days_left) }}</span
              >
            </td>
            <td>
              <EditDropDownButton
                style="display:flex; justify-content: center;"
                @edit="$emit('edit-stream', item.id)"
                @delete="triggerDeleteModal(item)"
              />
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
    <div class="float-left mt-5 mb-5">
      <v-pagination
        class="admin-users__v-pagination"
        v-model="page"
        :length="totalPages"
        :total-visible="7"
      ></v-pagination>
    </div>
    <ConfirmationModal
      :dialog.sync="delete_modal"
      title="Удаление потока"
      :text="
        `Вы действительно хотите удалить поток - ${stream_for_delete &&
          stream_for_delete.name}?`
      "
      action="Удалить"
      @success="
        () => {
          $emit('delete-stream', stream_for_delete && stream_for_delete.id)
          this.delete_modal = false
        }
      "
    />
  </div>
</template>

<script>
import { mdiCompareVertical, mdiPencilOutline } from '@mdi/js'
import SortIcon from '@/assets/svg/sort-icon.svg'
import EditDropDownButton from '@/components/Admin/EditDropDownButton'
import ConfirmationModal from '@/components/Admin/ConfirmationModal'

export default {
  name: 'StreamsTable',
  components: {
    ConfirmationModal,
    EditDropDownButton,
    SortIcon,
  },
  props: {
    streams: {
      type: Array,
    },
    totalPages: {
      type: Number,
      default: 1,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    paginateNumber: {
      type: Number,
      default: 10,
    },
    sort_loading: {
      type: Boolean,
      default: false,
    },
    userRoleType: {
      type: String,
      default: undefined,
    },
  },

  data() {
    return {
      mdiPencilOutline,
      mdiCompareVertical,
      delete_modal: false,
      stream_for_delete: undefined,
      page: undefined,
      headers: [
        {
          text: 'ID',
          align: 'start',
          value: 'id',
          sortable: true,
        },
        { text: 'Название', value: 'name', align: 'start', sortable: true },
        {
          text: 'До завершения модуля',
          value: 'days_left',
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
      this.$emit('fetch-streams', this.page)
    },
  },

  methods: {
    changeToStreamShowPage(item) {
      this.$router.push({
        name: 'AdminStreamShow',
        params: {
          stream_id: item.id,
        },
      })
    },

    dateText(date) {
      if (Number(date) === 0) return 'Сегодня'
      else if (!date) return '-'

      let text =
        date > 0 ? ([1, 21].includes(date) ? 'Остался' : 'Осталось') : 'Прошло'
      let days = [1, 21].includes(Math.abs(date))
        ? 'день'
        : [2, 3, 4].includes(Math.abs(date % 10)) &&
          ![12, 13, 14].includes(Math.abs(date))
        ? 'дня'
        : 'дней'
      return `${text} ${Math.abs(date)} ${days}`
    },

    daysLeftColor(days) {
      if (!days) return '#171729'

      return days > 0
        ? '#5CC689'
        : days < 0 && days >= -7
        ? '#E7AE1E'
        : '#EE5252'
    },

    triggerDeleteModal(item) {
      this.stream_for_delete = item
      this.delete_modal = true
    },
  },
}
</script>
