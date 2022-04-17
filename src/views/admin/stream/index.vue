<template>
  <v-container fluid>
    <template v-if="loading">
      <v-row class="flex-column">
        <v-col cols="12" class="d-flex">
          <v-skeleton-loader class="mr-3" type="button" />
          <v-skeleton-loader class="ml-auto mr-3" type="button" />
          <v-skeleton-loader type="button" />
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
    <template v-else>
      <div class="d-flex justify-space-between align-center flex-wrap mb-6">
        <div class="d-flex align-center">
          <h1 class="admin-page__title">Все потоки</h1>
          <v-text-field
            :prepend-inner-icon="mdiMagnify"
            v-model="searchField"
            dense
            outlined
            class="admin-search__v-text-field"
            color="#4376FB"
            :label="'Поиск по потокам'"
            style="max-width: 280px !important;height: 40px"
          />
          <v-btn
            text
            outlined
            elevation="0"
            :ripple="false"
            height="40"
            class="text-none ml-2 purchase-filter__btn"
            style="background-color: white;font-weight: 600"
            @click="filter_dialog = true"
          >
            <v-icon class="mr-2" size="20">{{ mdiFilterOutline }}</v-icon>
            Фильтры
          </v-btn>
        </div>
        <div class="d-flex align-center justify-end">
          <v-item-group
            mandatory
            class="mr-4 px-3"
            style="height: 100%"
            v-model="status"
          >
            <v-row
              style="border: 1px solid rgba(23, 23, 41, 0.08);border-radius: 5px;background-color: white; padding: 3px"
            >
              <v-col
                v-for="s in statuses"
                :key="s.name"
                class="pa-0"
                cols="12"
                sm="6"
              >
                <v-item v-slot="{ active, toggle }" :value="s.value">
                  <v-card
                    :color="active ? '#4376FB1a' : 'white'"
                    dark
                    :ripple="false"
                    :width="$vuetify.breakpoint.width < 600 ? '100%' : '140px'"
                    height="34"
                    @click="toggle"
                    elevation="0"
                    class="d-flex align-center"
                  >
                    <div
                      class="flex-grow-1 text-center align-self-center"
                      :style="{ color: active ? '#4376FB' : '#9FA4B1' }"
                    >
                      {{ s.name }}
                    </div>
                  </v-card>
                </v-item>
              </v-col>
            </v-row>
          </v-item-group>
          <AddButton @click="$router.push({ name: 'AdminStreamNew' })" />
        </div>
      </div>

      <StreamsTable
        :streams="streams"
        :total-pages="total_pages"
        :paginate-number="paginateNumber"
        :sort_loading="sort_loading"
        :current-page="currentPage"
        @fetch-streams="
          (page) => {
            this.currentPage = page
            this.fetchStreams
          }
        "
        @edit-stream="
          (id) => {
            this.streamForEditID = id
            this.dialog_edit = true
          }
        "
        @order-users="
          (column) => {
            this.streamColumn = column
            this.sortStream()
          }
        "
        @delete-stream="deleteStream"
      >
      </StreamsTable>

      <AddStreamDialog
        :dialog="dialog_add"
        :types="types"
        @close-dialog="dialog_add = false"
        @update-streams="fetchStreams"
      ></AddStreamDialog>
      <EditStreamDialog
        :dialog="dialog_edit"
        :types="types"
        :stream_id="streamForEditID"
        @close-dialog="dialog_edit = false"
        @update-streams="fetchStreams"
      ></EditStreamDialog>

      <FilterPurchaseDialog
        :dialog.sync="filter_dialog"
        :courses="courses"
        :value="['offline', 'online']"
        is-stream
        @filter-purchase="
          (from, to, filtered_courses, filtered_types) => {
            this.filterFrom = from
            this.filterTo = to
            this.coursesToFilter = filtered_courses
            this.filter_types = filtered_types
            this.fetchStreams()
          }
        "
      />
    </template>
  </v-container>
</template>

<script>
import { mdiMagnify, mdiFilterOutline } from '@mdi/js'
import StreamsTable from '@/components/Admin/stream/StreamsTable'
import AddStreamDialog from '@/components/Admin/stream/AddStreamDialog'
import EditStreamDialog from '@/components/Admin/stream/EditStreamDialog'
import FilterPurchaseDialog from '@/components/Admin/purchase/FilterPurchaseDialog'
import AddButton from '@/components/Admin/AddButton'

export default {
  name: 'AdminStreamIndex',
  components: {
    AddButton,
    FilterPurchaseDialog,
    EditStreamDialog,
    AddStreamDialog,
    StreamsTable,
  },
  data() {
    return {
      loading: false,
      sort_loading: false,
      mdiMagnify,
      mdiFilterOutline,
      dialog_add: false,
      dialog_edit: false,
      paginateNumber: 10,
      per_page: undefined,
      streams: undefined,
      searchField: undefined,
      total_pages: undefined,
      total_streams: undefined,
      streamOrderBy: undefined,
      streamColumn: undefined,
      currentPage: 1,
      streamForEditID: undefined,
      types: undefined,
      filter_types: ['online', 'offline'],
      filter_dialog: false,
      courses: undefined,
      coursesToFilter: undefined,
      filterFrom: undefined,
      filterTo: undefined,
      status: 1,
      statuses: [
        {
          name: 'Активные',
          value: 1,
        },
        {
          name: 'Завершенные',
          value: 0,
        },
      ],
    }
  },
  watch: {
    currentPage(newValue, oldValue) {
      if (newValue >= 0 && newValue !== oldValue) {
        this.sort_loading = true
        this.fetchStreams().finally(() => {
          this.sort_loading = false
        })
      }
    },

    streamColumn(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.streamOrderBy = 'asc'
      }
    },

    searchField(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.sort_loading = true
        this.currentPage = 1
        this.fetchStreams().finally(() => {
          this.sort_loading = false
        })
      }
    },

    status() {
      this.currentPage = 1
      this.fetchStreams()
    },

    filter_dialog(newValue) {
      if (newValue) this.fetchCourses()
    },
  },

  mounted() {
    this.loading = true
    this.fetchStreams().finally(() => {
      this.loading = false
    })
  },

  methods: {
    async fetchStreams() {
      this.streams = undefined
      this.sort_loading = true
      await this.$axios
        .get('admin/streams', {
          params: {
            page: this.currentPage,
            order: this.streamOrderBy,
            column: this.streamColumn,
            paginate: this.paginateNumber,
            search: this.searchField,
            active: this.status,
            course_ids: this.coursesToFilter,
            from: this.filterFrom,
            to: this.filterTo,
            types: this.filter_types,
          },
        })
        .then((res) => {
          if (res && res.data) {
            console.log('admin/streams', res.data)
            this.streams = res.data.data
            this.types = res.data.types
            this.per_page = res.data.meta && Number(res.data.meta.per_page)
            this.total_streams = res.data.meta && res.data.meta.total
            this.total_pages =
              res.data.meta &&
              Math.ceil(res.data.meta.total / res.data.meta.per_page)
          }
        })
        .finally(() => {
          this.sort_loading = false
        })
    },

    async fetchCourses() {
      await this.$axios.get('admin/purchases/courses').then((res) => {
        if (res && res.data) {
          this.courses = res.data.courses
        }
      })
    },

    sortStream() {
      this.streamOrderBy =
        this.streamOrderBy === 'asc'
          ? (this.streamOrderBy = 'desc')
          : (this.streamOrderBy = 'asc')
      this.sort_loading = true
      this.fetchStreams().finally(() => {
        this.sort_loading = false
      })
    },

    async deleteStream(id) {
      try {
        await this.$axios.delete(`admin/groups/${id}`)
        this.$store.dispatch('snackbar/START_SNACKBAR', {
          text: 'Удалено!',
          color: 'success',
        })
        this.fetchStreams()
      } catch (e) {
        throw new Error(e)
      }
    },
  },
}
</script>
