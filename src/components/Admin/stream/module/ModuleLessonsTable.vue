<template>
  <div class="mb-8">
    <v-data-table
      :headers="headers"
      :items="events"
      :mobile-breakpoint="0"
      hide-default-footer
      hide-default-header
      :items-per-page="20"
      class="elevation-0 mt-3 "
      style="border-bottom-left-radius: 0;border-bottom-right-radius: 0;"
      :loading="loading"
      @click:row="openStudentsDialog"
    >
      <template #header="{props: {headers}}">
        <thead>
          <tr>
            <th v-for="header in headers" :key="header.value">
              <div style="display:flex; align-items:center; gap: 6px;">
                <SortIcon style="fill:  #A7ADC3" v-if="header.sortable" />
                <span
                  style="font-weight: 500;font-size: 14px;line-height: 20px;letter-spacing: 0.02em;color: #A7ADC3;"
                  >{{ header.text }}</span
                >
              </div>
            </th>
          </tr>
        </thead>
      </template>
      <template v-slot:loading>
        <span>Загрузка...</span>
      </template>
      <template v-slot:item.title="{ item }">
        <span
          :style="{
            color: getEventTitleColor(item.status),
          }"
          >{{ item.title }}</span
        >
      </template>
      <template v-slot:item.average_score="{ item }">
        <CustomProgress
          :score="Number(item.average_score)"
          :in-progress="item.status === 'Pending'"
        />
      </template>
      <template v-slot:item.count_attendant="{ item }">
        <span
          :style="{ color: item.count_attendant > 0 ? '#5CC689' : '#5A6275' }"
          >{{ item.count_attendant }}</span
        >
        / {{ studentsCount }}
      </template>
      <template v-slot:item.options="{ item }">
        <EditDropDownButton
          for-move
          @edit="$emit('edit-user', item.id)"
          @delete="removeEvent(item.id)"
        />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import EditDropDownButton from '@/components/Admin/EditDropDownButton'
import CustomProgress from '@/components/Admin/stream/group/CustomProgress'
import SortIcon from '@/assets/svg/sort-icon.svg'

export default {
  name: 'ModuleLessonsTable',
  components: {
    CustomProgress,
    EditDropDownButton,
    SortIcon,
  },
  props: {
    events: {
      type: Array,
    },
    loading: Boolean,
    studentsCount: Number,
  },
  data() {
    return {
      headers: [
        { text: 'Время начала', value: 'starts_at', sortable: true },
        { text: 'Глава', value: 'title', sortable: true },
        {
          text: 'Средняя успеваемость',
          value: 'average_score',
          sortable: true,
        },
        {
          text: 'Посещаемость',
          value: 'count_attendant',
          align: 'center',
          sortable: true,
        },
        { text: 'Править', value: 'options', align: 'center', sortable: false },
      ],
    }
  },
  methods: {
    async removeEvent(id) {
      await this.$axios.delete(`admin/events/${id}`).then((res) => {
        if (res && res.data) {
          // console.log(res.data)
          this.$store.dispatch('snackbar/START_SNACKBAR', {
            text: 'Удалено!',
            color: 'success',
          })
          this.$emit('refresh')
        }
      })
    },

    openStudentsDialog(item) {
      this.$emit('open-students-dialog', item)
    },

    getEventTitleColor(status) {
      return {
        Passed: '#5CC689',
        Coming: '#7A5AD6',
        Pending: '#3E77FF',
      }[status]
    },
  },
}
</script>
