<template>
  <v-row
    justify="center"
    align-content="center"
    style="min-height: 74vh;"
  >
    <div class="d-flex flex-column justify-center align-center">
      <NotFoundSvg />
      <p class="pt-5 grayLight--text">{{ text }}</p>
      <slot/>
    </div>
  </v-row>
</template>
<script>
import NotFoundSvg from '@/assets/svg/not-found.svg'
export default {
  name: 'CoursesEmptyPlaceholder',
  components: {
    NotFoundSvg,
  },
  props: {
    text: {
      type: String,
      default: 'Нет курсов'
    }
  }
}
</script>
