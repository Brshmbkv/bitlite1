<template>
  <v-card
      class="pa-5"
      outlined
      rounded
      elevation="0"
  >
    <p class="font-weight-bold mb-5">Попытка #{{ attempt }}</p>
    <v-divider light></v-divider>
    <div class="mt-4 mb-4 subtitle-2">
      <v-icon color="black">
        {{ mdiStarOutline }}
      </v-icon>
      Сдал на {{ rights_percent }}%
    </div>
    <v-divider light></v-divider>
    <div class="mt-4 subtitle-2">
      <v-icon class="mb-1" color="black">
        {{ mdiClockTimeFourOutline }}
      </v-icon>
      <span class="text-capitalize ml-2">{{ created_at | longFormat }}</span>
    </div>
  </v-card>
</template>

<script>
import { mdiClockTimeFourOutline, mdiStarOutline } from '@mdi/js'

export default {
  name: "TrainingTestAttemptCard",
  props: {
    attempt: Number,
    rights_percent: Number,
    created_at: [Date, String],
  },
  data() {
    return {
      mdiClockTimeFourOutline,
      mdiStarOutline,
    }
  }
}
</script>

