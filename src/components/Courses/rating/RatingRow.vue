<template>
  <div class="course-rating__row" :class="{ 'current-user': place === idx }">
    <span class="course-rating-row__counter">{{ idx }}</span>
    <div class="course-rating-row__info">
      <img
        class="course-rating-row__avatar"
        v-if="user.avatar"
        :src="user.avatar"
        alt="User avatar"
      />
      <img
        v-else
        class="course-rating-row__avatar"
        src="@/assets/user_placeholder_sm.png"
        alt="User Placeholder"
      />
      <p class="course-rating-row__name">{{ user.name }}</p>
    </div>
    <p class="course-rating-row__points">{{ user.points }} xp</p>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {},
    },
    idx: {
      type: Number,
      default: 0,
    },
    place: {
      type: Number,
    },
  },
}
</script>

<style lang="scss">
.course-rating__row {
  display: flex;
  align-items: center;
  gap: 48px;
  padding: 24px 16px;
  & + & {
    border-top: 1px solid #ebeff2;
  }
  &.current-user-card {
    box-shadow: 0 2px 8px rgb(0 0 0 / 12%);
    border-radius: 16px;
    .course-rating-row__counter,
    .course-rating-row__points,
    .course-rating-row__name {
      color: #0bc3b8;
    }
  }
  &.current-user {
    .course-rating-row__counter,
    .course-rating-row__points,
    .course-rating-row__name {
      color: #0bc3b8;
    }
  }
}
.course-rating-row {
  &__counter {
    font-size: 20px;
    line-height: 24px;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.01em;
    color: #828bab;
  }
  &__info {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  &__avatar,
  &__avatar-placeholder {
    flex: 1 0 auto;
    width: 46px;
    height: 46px;
    border-radius: 50%;
  }
  &__avatar {
    border: 2px solid #dee0e3;
  }
  &__name {
    color: #000221a3;
    font-size: 20px;
    line-height: 24px;
    font-weight: 600;
  }
  &__points {
    margin-left: auto;
    font-size: 20px;
    line-height: 24px;
    color: #000221a3;
    font-weight: 600;
  }
}
</style>
