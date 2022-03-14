<template>
  <div class="questionnaire__type-scale">
    <v-item-group active-class="questionnaire__type-select__option--active">
      <div class="questionnaire__type-select__options">
        <div
          v-for="opt in options"
          :key="opt.id"
        >
          <v-item v-slot="{ active, toggle }">
            <div
              class="questionnaire__type-select__option"
              @click="toggle"
            >
              <component
                :is="getIcon('levels')"
                :level="1"
              />
              {{ opt.answer }}
            </div>
          </v-item>
        </div>
      </div>
    </v-item-group>
  </div>
</template>

<script>
export default {
  name: "QuestionnaireNewTypeScale"
}
</script>

<style lang="scss">

</style>
