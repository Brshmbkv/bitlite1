<template>
  <v-dialog
    v-model="dialog"
    max-width="900"
    persistent
    content-class="group-students__dialog"
  >
    <CloseDialogButton
      @click="$emit('update:dialog', false)"
    />
    <div v-if="loading" class="d-flex justify-center align-center">
      <v-progress-circular
        indeterminate
        size="64"
        class="success--text group-students__dialog--loading"
      />
    </div>
    <div v-else class="group-students__table">
      <h1 class="group-students__dialog__event-title">{{ event_title }}</h1>
      <v-data-table
        :headers="headers"
        :items="students"
        :items-per-page="100"
        class="admin-users-table__v-table elevation-0"
        hide-default-footer
        :no-data-text="'Нет данных'"
        sort-by="score"
        sort-desc
      >
        <template v-slot:item.first_name="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="24" class="mr-2">
              <v-img
                :lazy-src="UserPlaceholderSm"
                :src="item.avatar || UserPlaceholderSm"
              />
            </v-avatar>
            <span class="font-weight-medium">
              {{ `${ item.first_name || '' } ${ item.last_name || '' }` }}
            </span>
          </div>
        </template>
        <template v-slot:item.score="{ item }">
          <CustomProgress
            :score="Number(item.score) || 0"
          />
        </template>
        <template v-slot:item.value="{ item }">
          <div class="d-flex justify-center align-center">
            <v-checkbox
              :input-value="item.value"
              :ripple="false"
              hide-details
              dense
              :off-icon="mdiCloseBox"
              :on-icon="mdiCheckboxMarked"
              class="pa-0 ma-0 student-attendance__checkbox"
              disabled
            />
          </div>
        </template>
        <template v-slot:item.passed_exercises_count="{ item }">
          <div class="d-flex justify-space-between align-center" style="position: relative">
            <div class="exercises-count exercises-count--success">
              <span>{{ item.passed_exercises_count }}</span>
              <div class="exercises-count__info exercises-count__info--success">
                <svg class="mr-3" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 10.7999L3.66666 8.46655C3.40666 8.20655 2.99333 8.20655 2.73333 8.46655C2.47333 8.72655 2.47333 9.13988 2.73333 9.39988L5.52666 12.1932C5.78666 12.4532 6.20666 12.4532 6.46666 12.1932L13.5333 5.13322C13.7933 4.87322 13.7933 4.45988 13.5333 4.19988C13.2733 3.93988 12.86 3.93988 12.6 4.19988L6 10.7999Z" fill="#FAFAFA"/>
                </svg>

                {{ item.passed_exercises_count }} проверено
              </div>
            </div>
            <div class="exercises-count exercises-count--warning">
              <span>{{ item.not_checked_count }}</span>
              <div class="exercises-count__info exercises-count__info--warning">
                <svg class="mr-3" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.99996 13.9997C8.73634 13.9997 9.33329 13.4027 9.33329 12.6663C9.33329 11.93 8.73634 11.333 7.99996 11.333C7.26358 11.333 6.66663 11.93 6.66663 12.6663C6.66663 13.4027 7.26358 13.9997 7.99996 13.9997Z" fill="#FAFAFA"/>
                  <path d="M7.99996 2C7.26663 2 6.66663 2.6 6.66663 3.33333V8.66667C6.66663 9.4 7.26663 10 7.99996 10C8.73329 10 9.33329 9.4 9.33329 8.66667V3.33333C9.33329 2.6 8.73329 2 7.99996 2Z" fill="#FAFAFA"/>
                </svg>
                {{ item.not_checked_count }} ожидает
              </div>
            </div>
            <div class="exercises-count exercises-count--error">
              <span>{{ total_exercises - (item.passed_exercises_count - item.not_checked_count) }}</span>
              <div class="exercises-count__info exercises-count__info--error">
                <svg class="mr-3" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.99996 1.66699C5.39996 1.66699 1.66663 5.40033 1.66663 10.0003C1.66663 14.6003 5.39996 18.3337 9.99996 18.3337C14.6 18.3337 18.3333 14.6003 18.3333 10.0003C18.3333 5.40033 14.6 1.66699 9.99996 1.66699ZM9.99996 10.8337C9.54163 10.8337 9.16663 10.4587 9.16663 10.0003V6.66699C9.16663 6.20866 9.54163 5.83366 9.99996 5.83366C10.4583 5.83366 10.8333 6.20866 10.8333 6.66699V10.0003C10.8333 10.4587 10.4583 10.8337 9.99996 10.8337ZM10.8333 14.167H9.16663V12.5003H10.8333V14.167Z" fill="#FAFAFA"/>
                </svg>
                {{ total_exercises - (item.passed_exercises_count - item.not_checked_count) }} пропущено
              </div>
            </div>
          </div>
        </template>
      </v-data-table>
    </div>
  </v-dialog>
</template>

<script>
import { mdiCheckboxMarked, mdiCloseBox } from '@mdi/js'
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png'
import CustomProgress from "@/components/Admin/stream/group/CustomProgress";
import CloseDialogButton from "@/components/Admin/CloseDialogButton";

export default {
  name: "ModuleGroupStudentsDialog",
  components: { CloseDialogButton, CustomProgress },
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    group_id: Number,
    event_id: Number,
  },
  data() {
    return {
      headers: [
        { text: 'Полное имя', value: 'first_name', sortable: true },
        { text: 'Успеваемость', value: 'score', sortable: true },
        { text: 'Присутствие', value: 'value', align: 'center', sortable: true },
        { text: 'Задачи на проверку', value: 'passed_exercises_count', align: 'center', sortable: true },
      ],
      students: undefined,
      event_title: undefined,
      total_exercises: undefined,
      loading: false,
      UserPlaceholderSm,
      mdiCheckboxMarked,
      mdiCloseBox,
    }
  },
  watch: {
    dialog: {
      immediate: true,
      handler(newValue) {
        if(newValue && this.event_id) {
          this.loading = true
          this.fetchStudents()
            .finally(() => this.loading = false)
        }
      }
    }
  },
  methods: {
    async fetchStudents() {
      await this.$axios.get(`admin/groups/${ this.group_id }/events/${ this.event_id }`)
        .then(res => {
          this.event_title = res?.data?.event?.title || 'Урок'
          this.students = res?.data?.students || []
          this.total_exercises = res?.data?.total_exercises_count || 0
        })
    },
  }
}
</script>

<style lang="scss">
.group-students__dialog {
  background-color: #F5F6F8;
  border-radius: 10px;
  padding: 30px 16px 30px 35px;
  min-height: 600px;
  display: flex;

  &__event-title {
    font-size: 24px;
    margin-bottom: 30px;
  }
}

.group-students__table {
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 16px;

  &::-webkit-scrollbar {
    width: 7px;
    padding-left: 10px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(23, 23, 41, 0.08);
    border-radius: 100px;
  }

  &::-webkit-scrollbar-thumb {
    background: #9FA4B1;
    border-radius: 100px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
}

.exercises-count {
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  min-width: 40px;

  &--success {
    color: #5cc689;

    &:hover {
      .exercises-count__info--success {
        right: 0;
        opacity: 1;
        z-index: 2;
      }
    }
  }

  &--warning {
    color: #E7AE1E;

    &:hover {
      .exercises-count__info--warning {
        top: 50%;
        opacity: 1;
        z-index: 2;
      }
    }
  }

  &--error {
    color: #EB5757;

    &:hover {
      .exercises-count__info--error {
        left: 0;
        opacity: 1;
        z-index: 2;
      }
    }
  }

  &__info {
    position: absolute;
    transition: all 0.5s ease;
    color: #FFFFFF;
    font-weight: 600;
    font-size: 14px;
    padding: 10px 12px;
    border-radius: 5px;
    top: 50%;
    transform: translateY(-50%);
    white-space: nowrap;
    opacity: 0;
    width: 100%;
    z-index: -1;
    display: flex;
    align-items: center;
    justify-content: center;

    &--success {
      background-color: #5cc689;
      right: 100%;
    }

    &--warning {
      background-color: #E7AE1E;
      left: 0;
      top: -130%;
    }

    &--error {
      background-color: #EB5757;
      left: 100%;
    }
  }
}

.student-attendance__checkbox {
  svg {
    fill: #5cc689;
  }
  &:not(.v-input--is-label-active) {
    svg {
      fill: #EB5757;
    }
  }
}
</style>
