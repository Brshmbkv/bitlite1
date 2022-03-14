<template>
  <div class="completed-course__card">
    <template v-if="loading">
      <v-skeleton-loader type="list-item-avatar" max-height="50" class="d-flex align-center" :types="{
        'list-item-avatar': 'avatar@1'
      }"/>
      <v-skeleton-loader type="text"/>
      <v-skeleton-loader type="text"/>
    </template>
    <template v-else>
      <div class="completed-course__card__icon-container">
        <component
          :is="logo"
          class="completed-course__card__icon"
        />
      </div>
      <h4 class="completed-course__card__title">{{ title }}</h4>
      <span class="completed-course__card__date">{{ date | shortFormat }}</span>
    </template>
  </div>
</template>

<script>
export default {
  name: "CompletedCourseCard",
  props: {
    icon: Number,
    title: String,
    date: String,
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    logo() {
      return {
        4: require('@/assets/svg/catalog_python.svg'),
        2: require('@/assets/svg/catalog_java.svg'),
        7: require('@/assets/svg/catalog_java.svg'),
        3: require('@/assets/svg/catalog_cpp.svg'),
        6: require('@/assets/svg/catalog_php.svg'),
        8: require('@/assets/svg/catalog_ios.svg'),
      }[this.icon]
    }
  }
}
</script>

<style lang="scss">
.completed-course__card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  flex-direction: column;
  background: #FFFFFF;
  border-radius: 10px;
  padding: 15px 20px 25px 20px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  height: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 3px 5px rgba(23, 23, 41, 0.12);
  }

  &__icon {
    width: 30px;
    height: 30px;

    &-container {
      width: 50px;
      height: 50px;
      border-radius: 100px;
      background-color: #171729;
      display: grid;
      place-items: center;
    }
  }

  &__title {
    font-size: 18px;
    line-height: 24px;
  }

  &__date {
    font-weight: 500;
    font-size: 15px;
    line-height: 20px;
    color: #5A6275;
  }
}
</style>
