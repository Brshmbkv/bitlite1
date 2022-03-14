<template>
  <v-container fluid>
    <v-row>
      <v-col><BackButton/></v-col>
    </v-row>
    <v-row>
      <v-col cols="auto">
        <v-sheet class="pa-4">
          <v-avatar
            size="56"
            class="mr-4"
          >
            <v-img
              :src="avatar || UserPlaceholderSm"
              alt=""
            />
          </v-avatar>
          <span class="admin__teacher-name">{{ (first_name || ' ') + ' ' + (last_name || ' ') }}</span>
          <v-btn
            color="success"
            outlined
            rounded
            icon
            class="ml-5"
            @click="editUserDialog = true"
          >
            <v-icon>
              {{ mdiPencilOutline }}
            </v-icon>
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row>
      <widget-teacher-payments/>
      <widget-teacher-profit/>
      <widget-teacher-calendar
        :events="schedule"
        :loading="schedule_loading"
      />
      <widget-teacher-groups
        expand
        :groups="groups"
        :groups_loading="groups_loading"
        @fetch="(active) => {
          this.active_group = active
          this.fetchTeacherGroups()
        }"
      />
    </v-row>
    <dialog-edit-teacher
      v-model="editUserDialog"
    />
  </v-container>
</template>

<script>
import { mdiChevronLeft, mdiPencilOutline } from '@mdi/js';
import DialogEditTeacher from '@/components/Admin/user/DialogEditTeacher'
import WidgetTeacherPayments from '@/components/Admin/widgets/TeacherPayments';
import WidgetTeacherProfit from '@/components/Admin/widgets/TeacherProfit';
import WidgetTeacherCalendar from '@/components/Admin/widgets/TeacherCalendar';
import WidgetTeacherGroups from '@/components/Admin/widgets/TeacherGroups';
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png'
import BackButton from "@/components/Admin/BackButton";

export default {
  name: 'AdminTeacherShow',
  components: {
    BackButton,
    DialogEditTeacher,
    WidgetTeacherCalendar,
    WidgetTeacherGroups,
    WidgetTeacherPayments,
    WidgetTeacherProfit,
  },

  props: ['user_id'],

  data() {
    return {
      UserPlaceholderSm,
      mdiChevronLeft,
      mdiPencilOutline,
      editUserDialog: false,
      user: undefined,
      first_name: undefined,
      last_name: undefined,
      avatar: undefined,
      groups: undefined,
      groups_loading: false,
      active_group: undefined,
      schedule: undefined,
      schedule_loading: undefined,
      options1: {
        chart: {
          id: 'payments_analitics'
        },
        xaxis: {
          categories: [21, 22, 23, 24, 25, 26, 27, 28]
        }
      },
      series1: [{
        name: 'series-1',
        data: [300000, 299999, 289999, 279999, 239999, 229999, 259999, 5000000]
      }]
    }
  },

  mounted() {
    this.fetchUser()
      .then(() => {
        this.fetchTeacherGroups()
        this.fetchTeacherSchedule()
      })
  },

  methods: {
    async fetchUser() {
      await this.$axios.get(`admin/teachers/${ this.user_id }`)
        .then(res => {
          if(res && res.data) {
            console.log(`admin/teachers/${ this.user_id }`, res.data)
            this.first_name = res.data.first_name
            this.last_name = res.data.last_name
            this.avatar = res.data.avatar
          }
        })
    },

    async fetchTeacherGroups() {
      this.groups_loading = true
      await this.$axios.get(`admin/teachers/${ this.user_id }/groups`, {
        params: {
          active: this.active_group
        }
      })
        .then(res => {
          if(res && res.data) {
            console.log(res.data)
            this.groups = res.data.data
          }
        })
        .finally(() => {
          this.groups_loading = false
        })
    },

    async fetchTeacherSchedule() {
      this.schedule_loading = true
      await this.$axios.get(`admin/teachers/${ this.user_id }/schedules`)
        .then(res => {
          if(res && res.data) {
            console.log('teacher-schedule', res.data)
            this.schedule = res.data
          }
        })
        .finally(() => {
          this.schedule_loading = false
        })
    }
  }
};
</script>
<style lang="scss">
.admin__teacher-name {
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
}
</style>
