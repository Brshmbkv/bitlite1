<template>
  <div>
    <p style="font-weight: 600; font-size: 16px; line-height: 24px; margin-bottom: 12px;">{{ question }}</p>
    <v-item-group
      :value="value"
      @change="$emit('update:value', $event)"
      active-class="lesson-review__form--score__item--active"
      class="mb-6"
    >
      <div class="lesson-review__form--score">
        <div
          class="lesson-review__form--score__item"
          v-for="n in 11"
          :key="n"
        >
          <v-item v-slot="{ active, toggle }">
            <v-card
              class="d-flex align-center justify-center lesson-review__form--score__btn font-weight-bold"
              height="40"
              tile
              @click="toggle"
              :ripple="false"
              elevation="0"
            >
              {{ n - 1 }}
            </v-card>
          </v-item>
        </div>
      </div>
    </v-item-group>
  </div>
</template>

<script>
export default {
  name: "QuestionnaireTypeScale",
  props: {
    question: String,
    value: [Number, String]
  }
}
</script>

<style lang="scss">

</style>
