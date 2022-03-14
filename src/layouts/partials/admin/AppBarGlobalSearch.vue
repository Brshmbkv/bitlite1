<template>
  <div style="width: 100%; background-color: #F5F6F8">
    <v-row
      v-if="$route.meta.showCrumbs"
      :style="{
        height: '60px',
        backgroundColor: $route.meta.backgroundColor
      }"
      class="ma-0 pa-0"
    >
      <v-col
        cols="12"
        class="align-self-center py-0 pl-6"
      >
        <slot></slot>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "AppBarGlobalSearch",
}
</script>

<style lang="scss">

</style>
