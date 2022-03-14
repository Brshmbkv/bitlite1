<template>
  <div class="awesome-switch" @click="!noEmit && $emit('input', !value)">
    <input type="checkbox" v-model="value">
    <span class="awesome-switch__slider"></span>
  </div>
</template>

<script>
export default {
  name: "AwesomeSwitch",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    noEmit: {
      type: Boolean,
      default: false
    }
  },
}
</script>
