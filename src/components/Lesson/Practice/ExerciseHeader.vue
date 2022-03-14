<template>
  <div class="mb-8">
    <v-row align="center" justify="space-between" class="flex-wrap">
      <!--      <v-col cols="auto" class="px-0">-->
      <!--        <v-btn-->
      <!--          :ripple="false"-->
      <!--          fab-->
      <!--          retain-focus-on-click-->
      <!--          small-->
      <!--          light-->
      <!--          text-->
      <!--          color="success"-->
      <!--          @click="value > 0 ? $emit('input', value-1) : undefined"-->
      <!--          :disabled="value === 0"-->
      <!--          class="transparent-before__btn"-->
      <!--        >-->
      <!--          <v-icon>{{ mdiArrowLeft }}</v-icon>-->
      <!--        </v-btn>-->
      <!--      </v-col>-->
      <v-col cols="auto">
        <h3>
          {{ title || "" }}
        </h3>
      </v-col>
      <v-col
        v-if="[3, 4, 6, 8].includes(status && status.code)"
        cols="auto"
        class="d-flex align-center"
        style="gap: 20px"
      >
        <ExerciseChip
          v-if="!isNaN(parseInt(score))"
          :text="`Оценка: ${score}%`"
          bg-color="#171729"
        />
      </v-col>
      <!--      <v-col-->
      <!--        cols="auto"-->
      <!--        class="ml-auto px-0"-->
      <!--      >-->
      <!--        <v-btn-->
      <!--          :ripple="false"-->
      <!--          class="transparent-before__btn"-->
      <!--          fab-->
      <!--          small-->
      <!--          retain-focus-on-click-->
      <!--          light-->
      <!--          text-->
      <!--          color="success"-->
      <!--          @click="value < length-1 ? $emit('input', value + 1): ''"-->
      <!--          :disabled="value === length-1"-->
      <!--        >-->
      <!--          <v-icon>{{ mdiArrowRight }}</v-icon>-->
      <!--        </v-btn>-->
      <!--      </v-col>-->
    </v-row>
  </div>
</template>

<script>
// import {
//   mdiArrowLeft,
//   mdiArrowRight,
// } from "@mdi/js";

import ExerciseChip from "@/components/Lesson/Practice/ExerciseChip";

export default {
  name: 'ExerciseHeader',
  components: { ExerciseChip },
  props: {
    value: {
      type: Number,
      required: true,
    },
    title: String,
    length: {
      type: Number,
      required: true,
    },
    score: Number,
    points: Number,
    status: Object,
  },
}
</script>
