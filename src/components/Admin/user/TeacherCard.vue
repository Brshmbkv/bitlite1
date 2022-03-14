<template>
  <div class="teacher-card">
    <v-btn
      :ripple="false"
      class="teacher-card__close-btn"
      fab
      icon
      small
      @click="$emit('remove')"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M13.3 0.710703C12.91 0.320703 12.28 0.320703 11.89 0.710703L6.99997 5.5907L2.10997 0.700703C1.71997 0.310703 1.08997 0.310703 0.699971 0.700703C0.309971 1.0907 0.309971 1.7207 0.699971 2.1107L5.58997 7.0007L0.699971 11.8907C0.309971 12.2807 0.309971 12.9107 0.699971 13.3007C1.08997 13.6907 1.71997 13.6907 2.10997 13.3007L6.99997 8.4107L11.89 13.3007C12.28 13.6907 12.91 13.6907 13.3 13.3007C13.69 12.9107 13.69 12.2807 13.3 11.8907L8.40997 7.0007L13.3 2.1107C13.68 1.7307 13.68 1.0907 13.3 0.710703Z"
          fill="#5A6275"/>
      </svg>
    </v-btn>
    <v-avatar
      size="60"
      class="mx-auto mb-4"
    >
      <v-img
        :src="avatar || UserPlaceholder"
        alt="Avatar"
      />
    </v-avatar>
    <span class="teacher-card__name">{{ name }}</span>
  </div>
</template>

<script>
import UserPlaceholder from '@/assets/user_placeholder_md.png'

export default {
  name: "TeacherCard",
  props: {
    avatar: String,
    name: String
  },
  data() {
    return {
      UserPlaceholder
    }
  }
}
</script>

<style lang="scss">
.teacher-card {
  position: relative;
  background-color: #FFFFFF;
  border: 1px solid rgba(23, 23, 41, 0.08);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 14px;
  min-height: 170px;
  width: 170px;
  box-sizing: border-box;
  transition: all 0.4s ease;

  &__close-btn {
    position: absolute;
    right: 2px;
    top: 2px;
  }

  &__name {
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.01em;
    overflow-wrap:anywhere;
    text-align: center;
  }

  &:hover {
    transform: scale(1.03) translateY(-5px);
    box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px;
  }
}

</style>
