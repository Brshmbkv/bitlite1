<template>
  <v-dialog
    :value="value"
    :max-width="maxWidth"
    persistent
    content-class="custom-modal__dialog"
  >
    <div class="custom-modal">
      <div class="custom-modal__header">
        <h4>{{ title }}</h4>
        <div class="custom-modal__header__icon">
          <CloseIcon @click="$emit('close')"/>
        </div>
      </div>
      <div class="custom-modal__main" :style="{backgroundColor: bgColor}">
        <slot/>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import CloseIcon from "@/assets/svg/close.svg";

export default {
  name: "CustomModal",
  components: { CloseIcon },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: String,
    maxWidth: {
      type: Number,
      default: 570
    },
    bgColor: {
      type: String,
      default: '#FFFFFF'
    }
  },
}
</script>
