<template>
  <v-container>
    <v-row v-if="loading">
      <v-col>
        <v-skeleton-loader type="table" />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-if="practices && practices.length > 0">
        <v-simple-table class="my-table">
          <thead>
            <tr>
              <th class="text-left font-weight-regular grayLight--text pl-0">
                Урок
              </th>
              <th class="text-left font-weight-regular grayLight--text">
                Название
              </th>
              <th class="text-right font-weight-regular grayLight--text pr-0">
                Статус
              </th>
            </tr>
          </thead>
          <tbody>
            <template>
              <router-link
                v-for="(practice, ekey) in practices"
                tag="tr"
                :key="'e+' + ekey"
                :to="{
                  name: 'StreamPracticeShow',
                  params: {
                    practice_id: practice.id,
                    stream_id: stream_id,
                  },
                }"
                :style="{
                  color:
                    (practice.status && practice.status.color) === 'disabled'
                      ? '#9FA4B1'
                      : (practice.status && practice.status.color) === 'success'
                      ? '#0BC3B8'
                      : '#171729',
                  cursor: 'pointer',
                }"
              >
                <td class="pl-0" style="font-size: 14px">
                  {{ '#' + (ekey + 1) }}
                </td>
                <td style="font-size: 15px;font-weight: 600">
                  <template>
                    {{ practice.title || '' }}
                  </template>
                </td>
                <td class="text-right pr-0">
                  <v-chip
                    v-if="practice.status"
                    style="cursor: inherit; height: 24px;"
                    :color="practice.status.color | getChipColor"
                    :text-color="practice.status.color | getChipTextColor"
                    label
                  >
                    <span class="chip__text">
                      {{ practice.status.text || '' }}
                    </span>
                  </v-chip>
                </td>
              </router-link>
            </template>
          </tbody>
        </v-simple-table>
      </v-col>
      <EmptyPlaceholder v-else />
    </v-row>
  </v-container>
</template>

<script>
import EmptyPlaceholder from '@/components/EmptyPlaceholder'

export default {
  name: 'StreamPracticeIndex',
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
  components: {
    EmptyPlaceholder,
  },
  props: ['stream_id'],
  data() {
    return {
      loading: false,
      practices: undefined,
      group_name: '',
    }
  },
  mounted() {
    this.fetchStreamPractices().then(() => {
      this.$store.dispatch('breadcrumbs/setLinks', [
        {
          text: this.group_name,
          to: {
            name: 'StreamShow',
            params: {
              // module_id: this.courseModuleId,
              stream_id: this.stream_id,
            },
            query: {
              type: 'lite',
            },
          },
          back: true,
        },
        {
          text: 'Практики',
          disabled: true,
          // to: { name: 'LessonShow', params: { lesson_id: this.lesson_id }}
        },
      ])
    })
  },
  methods: {
    async fetchStreamPractices() {
      this.loading = true
      await this.$axios
        .get(`teacher/lite/streams/${this.stream_id}/practices`)
        .then((res) => {
          if (res && res.data) {
            // console.log('teacher/get-group/'+this.group_id+'/practices', res.data)
            this.group_name =
              (res.data.group && res.data.group.name) || undefined
            this.practices = res.data.practices
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
