<template>
  <div>
    <v-container class="pb-0">
      <template v-if="modules_loading">
        <v-col cols="12">
          <v-skeleton-loader class="d-inline-block mr-3" type="button" />
          <v-skeleton-loader class="d-inline-block mr-3" type="button" />
          <v-skeleton-loader class="d-inline-block mr-3" type="button" />
        </v-col>
      </template>
      <v-row
        class="mb-6"
        justify="space-between"
        v-else-if="modules && modules.length > 0"
      >
        <v-col
          cols="auto"
          md="auto"
          class="d-flex pb-0"
          style="overflow-x: auto;"
        >
          <v-tabs color="#00665E" v-model="currentTab">
            <v-tab
              v-for="tab in modules"
              :key="tab.id"
              @click="handleTabClick(tab)"
              :disabled="events_loading"
            >
              <span
                class="text-capitalize font-weight-medium"
                style="font-size: 16px; line-height: 20px; letter-spacing: 0.02em"
                >{{ tab.title }}</span
              >
            </v-tab>
          </v-tabs>
        </v-col>
        <v-col cols="auto">
          <HoverableButton
            style="--color: #4376FB"
            text="Завершить модуль"
            :disabled="events_loading || !module_is_active"
            @click="finishModule"
            :loading="finish_loading"
          >
          </HoverableButton>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <template v-if="events_loading">
        <div>
          <v-skeleton-loader type="table" />
        </div>
      </template>
      <v-row v-else-if="events && events.length > 0">
        <v-col>
          <v-tabs-items v-model="currentTab">
            <v-tab-item v-for="tab in modules" :key="tab.id">
              <v-simple-table class="my-table">
                <thead>
                  <tr>
                    <th></th>
                    <th
                      class="text-left"
                      style="font-size: 14px; font-weight: 500; line-height: 20px; color: #A7ADC3;"
                    >
                      Дата и Время
                    </th>
                    <th
                      class="text-left"
                      style="font-size: 14px; font-weight: 500; line-height: 20px; color: #A7ADC3;"
                    >
                      Название
                    </th>
                    <th
                      class="text-right"
                      style="font-size: 14px; font-weight: 500; line-height: 20px; color: #A7ADC3;"
                    >
                      Статус
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="events">
                    <router-link
                      v-for="(event, ekey) in events"
                      tag="tr"
                      :key="'e+' + ekey"
                      :to="{
                        name: 'GroupEventShow',
                        params: {
                          group_id,
                          event_id: event.id,
                        },
                      }"
                      style="cursor: pointer"
                    >
                      <td class="pl-0" style="font-size: 14px">
                        {{ '#' + (ekey + 1) }}
                      </td>
                      <td
                        class="text-capitalize text-no-wrap"
                        style="font-size: 14px"
                      >
                        {{ event.starts_at | longFormat }}
                      </td>
                      <td style="font-size: 15px;font-weight: 600">
                        <template v-if="'chapter' in event">
                          {{ event.chapter.title || '' }}
                        </template>
                      </td>
                      <td class="text-right pr-0">
                        <span
                          style="color: #ffffff; font-size: 12px; line-height: 16px; font-weight: 600; border-radius:4px; padding: 4px 8px; white-space: nowrap;"
                          :style="{
                            backgroundColor:
                              event.status.color === 'disabled'
                                ? '#ef4444'
                                : event.status.color === 'success'
                                ? '#00665E'
                                : '#4376FB',
                          }"
                          >{{ event.status.text }}</span
                        >
                      </td>
                    </router-link>
                  </template>
                  <p v-else>Нет данных</p>
                </tbody>
              </v-simple-table>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
      <courses-empty-placeholder v-else :text="'пусто...'" />
    </v-container>
  </div>
</template>

<script>
import { mdiCircle } from '@mdi/js'
import CoursesEmptyPlaceholder from '@/components/EmptyPlaceholder'
import HoverableButton from '@/components/HoverableButton.vue'

export default {
  name: 'GroupEventIndex',
  components: { CoursesEmptyPlaceholder, HoverableButton },
  filters: {
    getChipColor(status) {
      let statusBgColorMap = {
        default: 'rgba(23, 23, 41, 0.08)',
        pizdec: 'rgba(241, 102, 53, 0.08)',
        success: 'rgba(11, 196, 184, 0.08)',
        warning: 'rgba(231, 174, 30, 0.12)',
        disabled: '#F8F8F8',
      }
      return statusBgColorMap[status] || 'chip--default'
    },
    getChipTextColor(status) {
      let statusTextColorMap = {
        default: '#5A6275',
        pizdec: '#F16635',
        success: '#0BC3B8',
        warning: '#E7AE1E',
        disabled: '#9FA4B1',
      }
      return statusTextColorMap[status] || 'chip--default'
    },
  },
  props: ['group_id'],
  data() {
    return {
      currentTab: 0,
      loading: false,
      events: undefined,
      events_loading: true,
      finish_loading: false,
      modules: undefined,
      modules_loading: true,
      module_active_id: undefined,
      module_is_active: undefined,
      group_name: '',
      stream_id: undefined,
      // UserPlaceholderSm,
      // mdiLock,
      mdiCircle,
    }
  },

  watch: {
    module_active_id(newValue, oldValue) {
      if (newValue > 0 && newValue !== oldValue) {
        this.fetchGroupEvents()
      }
    },
  },

  mounted() {
    this.fetchGroupModules()
      .then(() => {
        this.$store.dispatch('breadcrumbs/setLinks', [
          {
            text: this.group_name,
            to: {
              name: 'StreamGroupIndex',
              params: {
                stream_id: this.stream_id,
                group_id: this.group_id,
              },
            },
            back: true,
          },
          {
            text: 'Занятия',
            disabled: true,
            // to: { name: 'LessonShow', params: { lesson_id: this.lesson_id }}
          },
        ])
      })
      .finally(() => {
        this.modules_loading = false
      })
  },

  methods: {
    async finishModule() {
      this.finish_loading = true
      await this.$axios
        .post('teacher/finish/module', {
          group_id: this.group_id,
          module_id: this.module_active_id,
        })
        .then((res) => {
          if (res && res.data) {
            console.log(res.data)
            this.fetchGroupModules()
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: res.data.message || 'Модуль успешно завершен!',
              color: 'success',
            })
          }
        })
        .catch((err) => {
          if (err && err.response && err.response.data) {
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: err.response.data.message || 'Ошибка!',
              color: 'error',
            })
          } else {
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: 'Произошла ошибочка!',
              color: 'error',
            })
          }
        })
        .finally(() => {
          this.finish_loading = false
        })
    },

    async fetchGroupModules() {
      await this.$axios
        .get(`teacher/get-group/${this.group_id}/modules`)
        .then((res) => {
          if (res && res.data) {
            // console.log(res.data)
            this.modules = res.data.group && res.data.group.modules
            let active_module = this.modules.find((module) => module.active)
            let first_module = this.modules[0]
            this.module_active_id =
              (active_module && active_module.id) ||
              (first_module && first_module.id)
            this.module_is_active =
              (active_module && active_module.active) ||
              (first_module && first_module.active)
            this.group_name =
              (res.data.group && res.data.group.name) || undefined
            this.stream_id =
              (res.data.group && res.data.group.parent_id) || undefined
          }
        })
    },

    async fetchGroupEvents() {
      this.events_loading = true
      await this.$axios
        .get(
          `teacher/get-group/${this.group_id}/modules/${this.module_active_id}/practices`
        )
        .then((res) => {
          if (res && res.data) {
            // console.log('teacher/get-group/'+this.group_id+'/practices', res.data)
            this.events = res.data.practices
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.events_loading = false
        })
    },

    handleTabClick(module) {
      if (!this.events_loading) {
        this.module_active_id = module.id
        this.module_is_active = module.active
      }
    },
  },
}
</script>
