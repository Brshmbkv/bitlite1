<template>
  <div>
    <v-row>
      <v-col><BackButton/></v-col>
    </v-row>
  </div>
</template>

<script>
import BackButton from "@/components/Admin/BackButton";
export default {
  name: "show",
  components: { BackButton }
}
</script>