<template>
  <v-row class="ma-0 ">
    <v-col cols="12" v-if="trial">
      <v-alert outlined style="border-radius: 10px" color="#E7AE1E">
        <span class="d-flex align-center">
          <v-icon class="mr-2" color="#E7AE1E">
            {{ mdiAlert }}
          </v-icon>
          Вам доступен только первый урок. Оплатите за курс, чтобы открыть
          остальные уроки.
        </span>
      </v-alert>
    </v-col>
    <v-col class="pa-0" cols="12">
      <h2 :style="{ color: disabled && '#5A6275' }">
        {{ module_title }}
      </h2>
    </v-col>
    <v-col class="px-0">
      <v-simple-table class="my-table">
        <thead>
          <tr>
            <th class="text-left my-table__header pl-3"></th>
            <th class="text-left my-table__header text-no-wrap">
              Дата и Время
            </th>
            <th class="text-left my-table__header" style="min-width: 278px;">
              Название
            </th>
            <th class="text-center my-table__header">Статус</th>
            <th class="text-right my-table__header pr-3">Балл</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="events">
            <router-link
              v-for="(event, ekey) in events"
              tag="tr"
              :key="'e+' + ekey"
              :to="
                !(trial && ekey !== 0) && !disabled
                  ? {
                      name: 'LessonShow',
                      params: {
                        lesson_id: event.id,
                      },
                    }
                  : ''
              "
              :style="{
                color:
                  trial && !disabled
                    ? ekey !== 0
                      ? '#9FA4B1'
                      : '#0BC3B8'
                    : getRowTextColor(event.status && event.status.color),
                cursor: trial && ekey !== 0 ? 'default' : 'pointer',
              }"
              :class="!(trial && ekey !== 0) && 'CourseTable__row--hoverable'"
            >
              <td class="pl-3 py-4">
                <span v-if="!disabled">{{ ekey + 1 }}</span>
                <LockedIcon v-else />
              </td>
              <td class="text-capitalize py-4">
                {{ event.starts_at | longFormat }}
              </td>
              <td class="font-weight-medium py-4">
                <template v-if="'chapter' in event">
                  {{ event.chapter.title || '' }}
                </template>
              </td>
              <td class="text-center py-4">
                <v-chip
                  v-if="event.status"
                  style="cursor: inherit; height: 24px; color: white;"
                  :text-color="getChipTextColor(event.status.color)"
                  :class="[disabled && 'px-10']"
                  label
                >
                  <v-icon x-small v-if="event.is_live" color="red" class="mr-1"
                    >{{ mdiCircle }}
                  </v-icon>
                  <span class="chip__text">
                    {{ disabled ? '...' : event.status.text || '' }}
                  </span>
                </v-chip>
              </td>
              <td class="text-right pr-3 py-4">
                {{ event.real_score + (event.real_score >= 0 ? '%' : '') }}
              </td>
            </router-link>
          </template>
          <p v-else>Нет данных</p>
        </tbody>
      </v-simple-table>
    </v-col>
  </v-row>
</template>

<script>
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png'
import LockedIcon from '@/assets/svg/locked.svg'
import { mdiLock, mdiCircle, mdiAlert } from '@mdi/js'

export default {
  components: {
    LockedIcon,
  },
  props: {
    next_event_id: {
      type: Number,
      default: -1,
    },
    module_id: {
      default: undefined,
    },
    module_title: String,
    events: {
      type: Array,
      default() {
        return []
      },
    },
    trial: Boolean,
    disabled: Boolean,
  },
  data() {
    return {
      UserPlaceholderSm,
      mdiLock,
      mdiCircle,
      mdiAlert,
    }
  },

  methods: {
    getRowTextColor(status) {
      if (this.disabled) return '#5A6275'
      return (
        {
          disabled: '#9FA4B1',
          success: '#0BC3B8',
        }[status] || '#171729'
      )
    },

    getChipColor(status) {
      if (this.disabled) return '#F5F6F8'

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
      if (this.disabled) return '#5A6275'

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
}
</script>
<style lang="scss">
.CourseTable__row--hoverable {
  &:hover {
    background: chartreuse;
  }
}
.my-table__header {
  font-size: 14px !important;
  line-height: 20px;
  letter-spacing: 0.02em;
  color: #a7adc3 !important;
  font-weight: 500;
}
</style>
