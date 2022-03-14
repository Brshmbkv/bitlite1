<template>
  <v-img
    v-if="course"
    :src="require(`@/assets/png/${course}-bg.png`)"
    lazy-src="@/assets/png/lazy-image.png"
    style="border-radius: 4px; height: 100%; width: 100%;"
  >
    <v-overlay
      absolute
      class="d-flex justify-center align-center"
      style=" background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)"
    >
      <component
        :is="logo"
      />
    </v-overlay>
  </v-img>
</template>

<script>
export default {
  name: "CourseImageCatalog",
  props: {
    course: String
  },
  computed: {
    logo() {
      return {
        'python': require('@/assets/svg/catalog_python.svg'),
        'java': require('@/assets/svg/catalog_java.svg'),
        'cpp': require('@/assets/svg/catalog_cpp.svg'),
        'php': require('@/assets/svg/catalog_php.svg'),
        'ios': require('@/assets/svg/catalog_ios.svg')
      }[this.course]
    }
  }
}
</script>
