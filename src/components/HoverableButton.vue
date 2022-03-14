<template>
  <button
    :class="[`hoverable-button${small ? '--small' : ''}`]"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    :style="{'--color': color}"
    @click="$emit('click')"
  >
    <slot>
      <v-icon v-if="icon" :color="hovered ? (textColorOnHover || '#FFFFFF') : color">{{ icon }}</v-icon>
      <span
        class="hoverable-button__text"
        :style="{
          color: hovered ? (textColorOnHover || '#FFFFFF') : color
        }"
      >{{ text }}</span>
      <v-icon v-if="iconAppend" :color="hovered ? (textColorOnHover || '#FFFFFF') : color">{{ iconAppend }}</v-icon>
    </slot>
  </button>
</template>

<script>
export default {
  name: "HoverableButton",
  props: {
    color: {
      type: String,
    },
    icon: String,
    iconAppend: String,
    text: String,
    textColorOnHover: String,
    small: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hovered: false
    }
  }
}
</script>

<style lang="scss">
.hoverable-button {
  --color: #0BC3B8;
  border-radius: 7px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 2px solid var(--color);
  transition: all .1s linear;

  &--small {
    @extend .hoverable-button;
    padding: 6px 10px;
    font-size: 15px;
    line-height: 16px;
  }

  &__text {
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--color);
  }

  &:hover {
    background-color: var(--color);
    .hoverable-button__text {
      color: #ffffff;
    }
  }
}
</style>
