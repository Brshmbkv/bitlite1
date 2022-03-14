<template>
  <v-dialog
    v-model="dialog"
    @click:outside="$emit('update:dialog', false)"
    max-width="600px"
  >
    <div class="get-free-course__card">
      <div v-if="!loading">
        <div
          class="get-free-course__success"
          :style="{
            backgroundColor: error_message ? '#EE5252' : '#5CC689'
          }"
        >
          <CheckIcon v-if="!error_message"/>
          <v-icon
            v-else
            :size="88"
            color="white"
          >{{ mdiClose }}
          </v-icon>
        </div>
        <p class="get-free-course__text">{{ error_message ? 'Ошибка!' : 'Поздравляем!' }}</p>
        <p class="get-free-course__subtext">{{ error_message || 'Вы записались на наш бесплатный курс!' }}</p>
        <v-btn
          :ripple="false"
          elevation="0"
          class="primary mt-2 font-weight-bold text-none"
          :to="this.module_id  ? {
            name: 'CourseShow',
            params: {
              course_id: this.course_id,
              active_module_id: this.module_id
            }
          } : undefined"
          @click="$emit('update:dialog', false)"
        >
          {{ !this.module_id ? 'Закрыть' : 'Перейти к курсу!' }}
        </v-btn>
      </div>
      <div v-else>
        <div>
          <v-progress-circular
            :size="88"
            color="#9FA4B1"
            indeterminate
          />
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import CheckIcon from '@/assets/svg/check.svg'
import { mdiClose } from '@mdi/js'

export default {
  name: "CourseFreeDialog",
  components: {
    CheckIcon
  },
  props: {
    dialog: Boolean,
    course_id: Number,
  },
  data() {
    return {
      loading: false,
      error_message: undefined,
      module_id: undefined,
      mdiClose,
    }
  },
  watch: {
    dialog: {
      immediate: true,
      handler(newValue) {
        if(newValue) {
          this.loading = true
          this.getFreeCourse()
        }
      }
    }
  },
  methods: {
    async getFreeCourse() {
      await this.$axios.post('free-purchase', {
        course_id: this.course_id
      }).then(res => {
        if(res && res.data) {
          this.module_id = res.data.module_id
        }
      }).catch((err) => {
        if(err && err.response && err.response.data) {
          // console.log(err.response.data)
          this.error_message = err.response.data.message
          this.module_id = err.response.data.module_id || undefined
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
.get-free-course__card {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  .get-free-course__success {
    width: 120px;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px auto;
    border-radius: 50%;
  }

  .get-free-course__text {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .get-free-course__subtext {
    font-weight: 500;
    color: #5A6275;
  }

}
</style>