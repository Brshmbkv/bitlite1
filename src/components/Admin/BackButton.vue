<template>
  <div>
    <v-btn
      class="show-user-courses__v-btn"
      outlined
      :ripple="false"
      @click="routeName ? $router.push({name: routeName}) : $router.back()"
    >
      <v-icon
        :color="'#5A6275'"
      >
        {{ mdiChevronLeft }}
      </v-icon>
      <span class="text-none">Вернуться назад</span>
    </v-btn>
  </div>
</template>

<script>
import { mdiChevronLeft } from '@mdi/js'

export default {
  name: "BackButton",
  props: {
    routeName: String
  },
  data() {
    return {
      mdiChevronLeft
    }
  }
}
</script>

<style scoped>

</style>
