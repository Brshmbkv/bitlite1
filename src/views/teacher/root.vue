<template>
  <keep-alive :include="cachedRoutes">
    <router-view :key="$route.fullPath"/>
  </keep-alive>
</template>

<script>
import { roleGuard } from "@/helpers/router.js"
export default {
  name: "TeacherRoot",
  beforeRouteEnter: roleGuard,
  data() {
    return {
      cachedRoutes: [
        'GroupEventShow',
        'TeacherExercisesIndex'
      ]
    }
  }
}
</script>
