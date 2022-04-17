<template>
  <div class="teacher-card">
    <v-avatar size="36" class="mr-4">
      <v-img :src="avatar || UserPlaceholder" alt="Avatar" />
    </v-avatar>
    <span class="teacher-card__name">{{ name }}</span>
    <div class="teacher-card__close-wrapper" @click="$emit('remove')">
      <svg
        width="16"
        height="16"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.3 0.710703C12.91 0.320703 12.28 0.320703 11.89 0.710703L6.99997 5.5907L2.10997 0.700703C1.71997 0.310703 1.08997 0.310703 0.699971 0.700703C0.309971 1.0907 0.309971 1.7207 0.699971 2.1107L5.58997 7.0007L0.699971 11.8907C0.309971 12.2807 0.309971 12.9107 0.699971 13.3007C1.08997 13.6907 1.71997 13.6907 2.10997 13.3007L6.99997 8.4107L11.89 13.3007C12.28 13.6907 12.91 13.6907 13.3 13.3007C13.69 12.9107 13.69 12.2807 13.3 11.8907L8.40997 7.0007L13.3 2.1107C13.68 1.7307 13.68 1.0907 13.3 0.710703Z"
          fill="#5A6275"
        />
      </svg>
    </div>
    <!-- <v-btn
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
    <span class="teacher-card__name">{{ name }}</span> -->
  </div>
</template>

<script>
import UserPlaceholder from '@/assets/user_placeholder_md.png'

export default {
  name: 'TeacherCard',
  props: {
    avatar: String,
    name: String,
  },
  data() {
    return {
      UserPlaceholder,
    }
  },
}
</script>

<style lang="scss">
.teacher-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
  &__close-wrapper {
    width: 36px;
    height: 36px;
    display: grid;
    place-content: center;
    margin-left: auto;
    border-radius: 50%;
    transition: all .3s ease;
    cursor: pointer;
    &:hover {
      background-color: rgba(#e4e4e4, 0.4);
    }
  }
  & + & {
    border-top: 1px solid #e4e4e4;
    padding-top: 8px;
  }
}
</style>
