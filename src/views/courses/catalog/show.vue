<template>
  <v-container>
    <CoursePurchase
      :course_id="Number(course_id)"
    />
  </v-container>
</template>

<script>
import CoursePurchase from "@/components/Courses/show/CoursePurchase";

export default {
  name: "CourseCatalogShow",
  components: {
    CoursePurchase,
  },
  props: ['course_id'],
}
</script>



