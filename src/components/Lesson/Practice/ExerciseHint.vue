<template>
  <v-alert
    outlined
    :color="'#F16635'"
  >
    <div class="d-flex justify-space-between align-start">
      <v-chip
        :color="'#F16635'"
        outlined
        class="mb-4"
        style="font-size: 12px"
      >
        Подсказка
      </v-chip>
      <v-icon 
        class="cursor-pointer"
        @click="$emit('close')"
      >
        {{ mdiClose }}
      </v-icon>
    </div>
    <p
      class="mb-0"
      style="font-size: 14px; color: #5A6275; letter-spacing: 0.02em"
    >
      {{ value }}
    </p>
  </v-alert>
</template>

<script>
import { mdiClose } from "@mdi/js"
export default {
  props: {
    value: {
      type: String,
      required: true,
    }
  },
  data(){
    return {
      mdiClose,
    }
  }
}
</script>