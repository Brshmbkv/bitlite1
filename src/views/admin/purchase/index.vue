<template>
  <v-container fluid>
    <v-row class="mb-4">
      <v-col class="d-flex">
        <h1 class="admin-page__title">Заявки</h1>
        <v-text-field
          :prepend-inner-icon="mdiMagnify"
          v-model="searchField"
          dense
          solo
          outlined
          class="admin-search__v-text-field mr-3"
          :label="'Поиск по заявкам'"
          style="max-width: 280px;width: 280px !important;height: 40px"
        ></v-text-field>
        <v-btn
          text
          outlined
          elevation="0"
          :ripple="false"
          height="40"
          class="text-capitalize purchase-filter__btn"
          style="background-color: white;font-weight: 600"
          @click="dialog_filter = true"
        >
          <FilterIcon/>
          <span class="ml-2 d-none d-md-block" style="font-size: 14px;letter-spacing: 0">Расширенный фильтр</span>
        </v-btn>
      </v-col>
      <v-col
        class="d-flex justify-space-between justify-lg-end"
      >
        <v-item-group
          mandatory
          class="mr-4"
          v-model="purchaseType"
        >
          <div
            style="border: 1px solid rgba(23, 23, 41, 0.08);border-radius: 5px;background-color: white"
            class="d-flex pa-1"
          >
            <v-col
              v-for="d in status"
              :key="d"
              class="pa-0"
              cols="6"
            >
              <v-item v-slot="{ active, toggle }">
                <v-card
                  :color="active ? 'rgba(10, 204, 218, 0.15)' : 'white'"
                  dark
                  :ripple="false"
                  width="130"
                  height="30"
                  @click="toggle"
                  elevation="0"
                  class="d-flex align-center"
                >
                  <div
                    class="flex-grow-1 text-center align-self-center"
                    :style="{color: active ? '#0ACCDA' : '#9FA4B1'}"
                  >
                    <span style="font-size: 14px">{{ d }}</span>
                  </div>
                </v-card>
              </v-item>
            </v-col>
          </div>
        </v-item-group>
        <AddButton @click="dialog_add = true"/>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="purchases"
      :loading="table_loading"
      :items-per-page="paginateNumber"
      :mobile-breakpoint="0"
      hide-default-footer
      hide-default-header
      class="elevation-0 admin-users-table__v-table"
      style="border-bottom-left-radius: 0;border-bottom-right-radius: 0;"
    >
      <template v-slot:header="{ props: { headers } }">
        <thead>
        <tr>
          <th
            v-for="header in headers"
            :key="header.value"
            class="text-capitalize"
          >
            <span
              style="cursor: pointer; gap: 4px"
              class="d-flex align-center"
              @click="() => {
                header.value === 'user.first_name'
                  ? purchaseColumn = 'users.first_name' : header.value === 'created_at'
                    ? purchaseColumn = header.value : purchaseColumn = 'users.phone'

                sortPurchase()
              }"
            >
              <SortIcon
                v-if="header.sortable"
              />
              <span>{{ header.text }}</span>
            </span>
          </th>
        </tr>
        </thead>
      </template>
      <template v-slot:loading>
        <span>Загрузка...</span>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip
          v-if="item.status"
          style="cursor: inherit; height: 24px;"
          :color=" item.status | getChipColor"
          :text-color=" item.status | getChipTextColor"
          label
        >
          <span class="chip__text text-capitalize">
            {{ item.status | getChipText }}
          </span>
        </v-chip>
      </template>
      <template

        v-slot:item.created_at="{ item }"
      >
        <span style="white-space: nowrap;">
          {{ item.created_at | shortFormat }}
        </span>
      </template>
      <template v-slot:item.contact="{ item }">
        <span v-if="item.user.email" style="white-space: nowrap">
          {{ item.user.email }}
        </span>
        <span v-else style="white-space: nowrap;">
          {{ item.user.phone | VMask('+# (###) ###-##-##') }}
        </span>
      </template>
      <template v-slot:loading>
        <span>Загрузка...</span>
      </template>
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
              @click.stop.prevent="openEditDialog(item)"
            >
              <PenIcon :class="hover ? 'white-pen' : 'pen'"></PenIcon>
            </v-btn>
          </template>
        </v-hover>
      </template>
    </v-data-table>

    <v-pagination
      class="float-left my-5 admin-users__v-pagination"
      v-model="currentPage"
      total-visible="7"
      :length="totalPages"
    ></v-pagination>

    <FilterPurchaseDialog
      :dialog.sync="dialog_filter"
      :courses="courses"
      :statuses="statuses"
      @filter-purchase="(from, to, filtered_courses) => {
        this.purchaseFrom = from
        this.purchaseTo = to
        this.coursesToFilter = filtered_courses
        this.fetchPurchases()
      }"
    ></FilterPurchaseDialog>
    <AddPurchaseDialog
      :dialog.sync="dialog_add"
      :courses="courses && courses"
      :statuses="statuses"
      @update-purchases="fetchPurchases"
    ></AddPurchaseDialog>
    <EditPurchaseDialog
      :dialog.sync="dialog_edit"
      :purchase_id="purchaseForEdit && purchaseForEdit.id"
      :user="purchaseForEdit && purchaseForEdit.user"
      :current-course="purchaseForEdit && purchaseForEdit.course_module.course"
      :courses="courses || []"
      @update-purchases="fetchPurchases"
    ></EditPurchaseDialog>
  </v-container>
</template>

<script>
import { mdiMagnify } from '@mdi/js'
import FilterIcon from '@/assets/svg/filter.svg'
import SortIcon from '@/assets/svg/sort-icon.svg'
import PenIcon from '@/assets/svg/pen.svg'
import FilterPurchaseDialog from "@/components/Admin/purchase/FilterPurchaseDialog";

import AddPurchaseDialog from "@/components/Admin/purchase/AddPurchaseDialog";
import EditPurchaseDialog from "@/components/Admin/purchase/EditPurchaseDialog";
import AddButton from "@/components/Admin/AddButton";

export default {
  name: "AdminPurchaseIndex",
  components: {
    AddButton,
    EditPurchaseDialog,
    AddPurchaseDialog,
    FilterPurchaseDialog,
    FilterIcon,
    PenIcon,
    SortIcon,
  },
  filters: {
    getChipColor(value) {
      let statusBgColorMap = {
        'created': 'rgba(23, 23, 41, 0.08)',
        'finished': '#9FA4B1',
        'payed': 'rgba(92, 198, 137, 0.12)',
        'error': 'rgba(238, 82, 82, 0.12)',
        'returned': 'rgba(241, 102, 53, 0.12)',
      }
      return statusBgColorMap[value] || 'chip--default';
    },

    getChipTextColor(value) {
      let colors = {
        'created': '#171729',
        'finished': 'white',
        'payed': '#5CC689',
        'error': '#EE5252',
        'returned': '#F16635',
      }
      return colors[value] || 'chip--default'
    },

    getChipText(value) {
      let texts = {
        'created': 'Не оплачено',
        'finished': 'Завершенный',
        'payed': 'Оплачено',
        'error': 'Ошибка',
        'returned': 'Возврат',
      }
      return texts[value] || 'Неизвестно'
    },

  },
  data() {
    return {
      mdiMagnify,
      purchases: undefined,
      purchaseForEdit: undefined,
      purchaseType: 0,
      searchField: undefined,
      dialog_add: false,
      dialog_edit: false,
      dialog_filter: false,
      coursesToFilter: undefined,
      table_loading: false,
      totalPages: undefined,
      paginateNumber: 10,
      courses: undefined,
      statuses: undefined,
      purchaseFrom: undefined,
      purchaseTo: undefined,
      purchaseOrder: undefined,
      purchaseColumn: undefined,
      currentPage: 1,
      status: ['не оплачено', 'оплачено'],
      headers: [
        {
          text: 'Имя',
          align: 'start',
          value: 'user.first_name',
          sortable: true
        },
        { text: 'Контакт', value: 'contact', sortable: true },
        { text: 'Дата', value: 'created_at', sortable: true },
        { text: 'Курс', value: 'course_module.course.title', sortable: true },
        { text: 'Статус', value: 'status', sortable: true },
        { text: '', value: 'options', align: 'end', sortable: false },
      ],
    }
  },

  watch: {
    purchaseType: {
      handler(newValue, oldValue) {
        if(newValue !== oldValue && newValue < 2) {
          this.currentPage = 1
          this.table_loading = true
          this.fetchPurchases()
            .finally(() => {
              this.table_loading = false
            })
        }
      },
      immediate: true
    },

    searchField(newValue, oldValue) {
      if(newValue !== oldValue) {
        this.table_loading = true
        this.currentPage = 1
        this.fetchPurchases()
          .finally(() => {
            this.table_loading = false
          })
      }
    },

    purchaseColumn(newValue, oldValue) {
      if(newValue !== oldValue) {
        this.purchaseOrder = 'asc'
      }
    },

    currentPage(newValue, oldValue) {
      if(newValue > 0 && newValue !== oldValue) {
        this.table_loading = true
        this.fetchPurchases()
          .finally(() => {
            this.table_loading = false
          })
      }
    }
  },

  mounted() {
    this.fetchCourses()
  },

  methods: {
    openEditDialog(item) {
      this.dialog_edit = true
      this.purchaseForEdit = item
    },

    async fetchPurchases() {
      this.purchases = undefined
      this.table_loading = true
      await this.$axios.get(this.purchaseType > 0 ? 'admin/purchases/payed' : 'admin/purchases/notPayed', {
        params: {
          column: this.purchaseColumn,
          order: this.purchaseOrder,
          search: this.searchField,
          page: this.currentPage,
          from: this.purchaseFrom,
          to: this.purchaseTo,
          course_id: this.coursesToFilter
        }
      })
        .then(res => {
          if(res && res.data) {
            this.purchases = res.data.data
            this.totalPages = res.data.meta && Math.ceil(res.data.meta.total / res.data.meta.per_page)
          }
        })
        .finally(() => {
          this.table_loading = false
        })
    },

    async fetchCourses() {
      await this.$axios.get('admin/purchases/courses')
        .then(res => {
          if(res && res.data) {
            this.courses = res.data.courses
            // this.statuses = res.data.status
          }
        })
    },

    sortPurchase() {
      this.purchaseOrder = (this.purchaseOrder === 'asc') ?
        (this.purchaseOrder = 'desc') : this.purchaseOrder = 'asc'
      this.table_loading = true
      this.fetchPurchases()
        .finally(() => {
          this.table_loading = false
        })
    },
  }
}
</script>

<style lang="scss">
.purchase-filter__btn {
  &::before {
    background-color: white;
  }
}
</style>
