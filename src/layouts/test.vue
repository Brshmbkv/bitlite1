<template>
  <v-app>
    <div>
      <slot/>
    </div>
  </v-app>
</template>

<script>
export default {
  name: "test"
}
</script>

<style lang="scss">
.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge add Firefox */
.scrollbar-hidden {
  -ms-overflow-style: none;
  scrollbar-width: none; /* Firefox */
}
</style>
