<template>
  <div class="add-dialog">
    <v-dialog
      v-model="dialog"
      @click:outside="$emit('update:dialog', false)"
      max-width="700px"
    >
      <v-card
        class="px-3"
      >
        <v-card-title>
          <span class="add-dialog__header-text mt-4 mb-4">Добавление модуля</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            label="поиск по модулям"
            v-model="search"
          />
          <v-data-table
            v-model="selected_modules"
            :items="modules"
            :headers="headers"
            :loading="loading"
            item-key="id"
            hide-default-footer
            hide-default-header
          >
            <template v-slot:header="{ props: { headers } }">
              <thead>
              <tr>
                <th
                  v-for="header in headers"
                  :key="header.value"
                  class="text-capitalize"
                  scope="col"
                >
            <span
              style="cursor:pointer; gap: 4px"
              class="d-flex align-center"
              @click="$emit('order-users', header.value)"
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
            <template v-slot:item.options="{item}">
              <v-btn
                elevation="0"
                :ripple="false"
                color="#0ACCDA"
                fab
                tile
                style="border-radius: 5px"
                height="35"
                width="35"
                :loading="btn_loading"
                :disabled="btn_loading"
                @click="addModule(item.id)"
              >
                <v-icon
                  color="white"
                >
                  {{ mdiPlus }}
                </v-icon>
              </v-btn>
            </template>
          </v-data-table>
          <v-pagination
            class="admin-users__v-pagination"
            v-model="page"
            :length="total_pages"
            :total-visible="7"
          ></v-pagination>
        </v-card-text>
        <v-card-actions
          class="justify-end mr-4 pb-5"
        >
          <v-btn
            :ripple="false"
            :elevation="0"
            color="#9FA4B1"
            class="text-capitalize white--text px-sm-8 py-sm-6 ml-5"
            @click="() => {
                  $emit('update:dialog', false)
                }"
          >
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import SortIcon from '@/assets/svg/sort-icon.svg'
import { mdiPlus } from '@mdi/js'

export default {
  name: "AddStreamModuleDialog",
  components: {
    SortIcon,
  },
  props: {
    stream_id: Number,
    dialog: Boolean
  },
  data() {
    return {
      mdiPlus,
      modules: undefined,
      selected_modules: [],
      loading: false,
      btn_loading: false,
      search: undefined,
      page: 1,
      total_pages: undefined,
      headers: [
        {
          text: 'ID',
          align: 'start',
          value: 'id',
          width: '12%'
        },
        { text: 'Название', value: 'title', sortable: true },
        { text: '', value: 'options', align: 'end' },
      ],
    }
  },
  watch: {
    dialog: {
      immediate: true,
      handler(newValue) {
        if(newValue)
          this.fetchModules()
      }
    },
    search() {
      this.fetchModules()
    },
    page() {
      this.fetchModules()
    }
  },
  methods: {
    async fetchModules() {
      this.loading = true
      await this.$axios.get(`admin/streams/${this.stream_id}/newModules`, {
        params: {
          page: this.page,
          search: this.search,
          paginate: 6
        }
      })
        .then(res => {
          if (res && res.data) {
            // console.log(res.data)
            this.modules = res.data.data
            this.total_pages = Math.ceil(res.data.total / res.data.per_page)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    async addModule(id) {
      this.btn_loading = true
      await this.$axios.post(`admin/streams/addModule`, {
        course_module_id: id,
        group_id: this.stream_id
      })
        .then(res => {
          if (res && res.data) {
            // console.log(res.data)
            this.modules = this.modules.filter(module => module.id !== id)
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: 'Добавлено!',
              color: 'success'
            })
            this.$emit('update-modules')
          }
        })
        .finally(() => {
          this.btn_loading = false
        })
    }
  }
}
</script>

<style scoped>

</style>
