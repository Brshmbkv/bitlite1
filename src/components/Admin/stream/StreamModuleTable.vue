<template>
  <div class="mb-8">
    <v-data-table
      :headers="headers"
      :items="modules"
      :loading="sort_loading || loading"
      :items-per-page="paginateNumber"
      :mobile-breakpoint="0"
      hide-default-footer
      hide-default-header
      @click:row="changeToModuleShowPage"
      class="elevation-0 mt-3 admin-users-table__v-table"
      style="border-bottom-left-radius: 0;border-bottom-right-radius: 0;"
    >
      <template v-slot:loading>
        <span>Загрузка...</span>
      </template>
      <template v-slot:item.active="{ item }">
        <div class="awesome-switch" @click.stop.prevent="changeModuleActive(item)">
          <input type="checkbox" v-model="item.active">
          <span class="awesome-switch__slider"></span>
        </div>
      </template>
      <template v-slot:item.starts_at="{ item }">
        <v-menu
          v-model="menu[modules.indexOf(item)]"
          :close-on-content-click="false"
          :return-value.sync="item.starts_at"
          transition="scale-y-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="item.starts_at"
              required
              outlined
              dense
              placeholder="Укажите дату"
              class="add-dialog__v-text-field purchase-date--v-text-field"
              v-bind="attrs"
              v-on="on"
              style="max-width: 200px;max-height: 40px"
            >
              <template v-slot:append>
                <v-icon
                  :color="'#171729'"
                  size="20"
                >
                  {{ mdiCalendarBlankOutline }}
                </v-icon>
              </template>
            </v-text-field>
          </template>
          <v-date-picker
            :value="item.starts_at"
            no-title
            :first-day-of-week="1"
            locale="ru-RU"
            @change="changeModuleStartsAt($event, item)"
            class="py-4"
          />
        </v-menu>
      </template>
      <template v-slot:header="{ props: { headers } }">
        <thead>
        <tr>
          <th
            v-for="header in headers"
            :key="header.value"
            class="text-capitalize"
            scope="col"
          >
            <div
              style="cursor:pointer; gap: 4px"
              class="d-flex align-center"
              :class="'justify-'+header.align"
              @click="$emit('order-users', header.value)"
            >
              <SortIcon v-if="header.sortable"/>
              <span>{{ header.text }}</span>
            </div>
          </th>
        </tr>
        </thead>
      </template>
      <template v-slot:item.options="{ item }">
        <template>
          <v-btn
            icon
            :color="'#EE5252'"
            :ripple="false"
            class="admin-stream-modules-table__v-btn mr-3"
            @click.stop.prevent="removeModule(item.course_module_id)"
          >
            <TrashIcon></TrashIcon>
          </v-btn>
        </template>
      </template>
    </v-data-table>
    <div
      class="d-flex justify-start py-2"
    >
      <v-pagination
        class="admin-users__v-pagination"
        v-model="page"
        :length="totalPages"
        :total-visible="7"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import { mdiCompareVertical, mdiPencilOutline, mdiCalendarBlankOutline } from '@mdi/js'
import TrashIcon from '@/assets/svg/trash.svg'
import SortIcon from '@/assets/svg/sort-icon.svg'

export default {
  name: "StreamModuleTable",
  components: {
    TrashIcon,
    SortIcon,
  },
  props: {
    modules: Array,
    stream_id: Number,
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
    loading: Boolean
  },

  data() {
    return {
      mdiPencilOutline,
      mdiCalendarBlankOutline,
      mdiCompareVertical,
      page: undefined,
      menu: [],
      headers: [
        { text: 'Модуль', value: 'module.title', sortable: true },
        { text: 'Начало', value: 'starts_at', sortable: true },
        { text: 'Активен', value: 'active' },
        { text: 'Править', value: 'options', align: 'end', sortable: false },
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
      immediate: true
    },

    page() {
      this.$emit('fetch-streams', this.page)
    }
  },

  methods: {
    async changeModuleActive(item) {
      console.log(item)
      await this.$axios.post(`admin/streams/${item.group_id}/changeGroupModuleActive`, {
        id: item.id,
        value: !item.active
      })
        .then(res => {
          if(res) {
            this.$emit('update-modules')
          }
        })
    },

    changeToModuleShowPage(item) {
      this.$router.push({
        name: 'AdminStreamModuleShow',
        params: {
          stream_id: item.group_id,
          module_id: item.module.id
        }
      })
    },

    async changeModuleStartsAt(date, item) {
      await this.$axios.post('admin/streams/changeGroupModuleStartsAt', {
        id: item.id,
        starts_at: date
      })
        .then(res => {
          if(res && res.data) {
            // console.log(res.data)
            this.$emit('update-modules')
            this.closeMenu(item)
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: 'Изменено!',
              color: 'success'
            })
          }
        })
    },

    async removeModule(id) {
      await this.$axios.post(`admin/streams/removeModule`, {
        course_module_id: id,
        group_id: this.stream_id
      }).then(res => {
        if(res && res.data) {
          console.log(res.data)
          this.$store.dispatch('snackbar/START_SNACKBAR', {
            text: 'Удалено!',
            color: 'success'
          })
          this.$emit('update-modules')
        }
      })
    },

    closeMenu(item) {
      this.$set(this.menu, this.modules.indexOf(item), false)
    }
  }
}
</script>
