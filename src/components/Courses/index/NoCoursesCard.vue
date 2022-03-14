<template>
  <div class="no-courses-card">
    <img
      class="no-courses-card__emoji"
      src="https://cdn.shopify.com/s/files/1/1061/1924/products/Crying_Face_Emoji_large.png?v=1571606037"
    />
    <slot>
      <p class="no-courses-card__text">{{ text }}</p>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: 'Похоже что у вас нету курсов :(',
    },
  },
}
</script>

<style lang="scss">
.no-courses-card {
  height: 420px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  background-color: #f9fafb;
  &__emoji {
    display: block;
    width: 160px;
  }
  &__text {
    margin-top: 40px;
    font-size: 1.75rem;
    font-weight: 500;
    line-height: 1.15;
  }
}
</style>
