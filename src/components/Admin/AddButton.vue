<template>
  <div>
    <v-btn
      class="text-none admin__add-button px-4"
      :ripple="false"
      large
      text
      height="40"
      @click="$emit('click')"
    >
      <span>
        <v-icon size="20">{{ mdiPlus }}</v-icon>
        Добавить
      </span>
    </v-btn>
  </div>
</template>

<script>
import { mdiPlus } from '@mdi/js'
export default {
  name: 'AddButton',
  data() {
    return {
      mdiPlus,
    }
  },
}
</script>

<style lang="scss">
.admin__add-button {
  background-color: #4376fb1a;
  border: 1px solid #4376fb1a;
  height: 40px;
  transition: all 0.3s ease;
  border-radius: 5px;

  span {
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #4376fb;
  }

  &::before {
    background-color: transparent;
  }

  &:hover {
    border: 1px solid #4376fb;
  }
}
</style>
