<template>
  <v-alert
    outlined
    :color="'#F16635'"
  >
    <v-chip
      :color="'#F16635'"
      outlined
      class="mb-4"
      style="font-size: 12px"
    >
      Комментарий препода
    </v-chip>
    <template v-if="teacher">
      <div
        class="mb-4"
      >
        <v-avatar
          size="34"
          class="mr-3"
        >
          <v-img
            :src="teacher.avatar || UserPlaceholderSm"
          />
        </v-avatar>
        <span style="color: #171729;font-size: 16px;font-weight: 600">{{
            (teacher.first_name ? teacher.first_name : '')
            + ' '
            + (teacher.last_name ? teacher.last_name : '')
          }}</span>
      </div>
    </template>
    <div
      class="teacher-comment__text"
    >
      {{ comment }}
    </div>
  </v-alert>
</template>

<script>
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png'

export default {
  props: {
    teacher: {
      type: Object,
      default(){
        return {
          first_name: "Ваш",
          last_name: "Преподаватель",
          avatar: undefined,
        }
      }
    },
    comment: {
      type: String,
      default: undefined,
    }
  },
  data() {
    return {
      UserPlaceholderSm
    }
  }
}
</script>

<style lang="scss">
.teacher-comment__text {
  font-size: 14px;
  color: #5A6275;
  letter-spacing: 0.02em;
  white-space: pre;
}
</style>
