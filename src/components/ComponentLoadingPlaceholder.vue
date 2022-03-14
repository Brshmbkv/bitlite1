<template>
  <div class="clp__container">
    <v-progress-circular
      :size="70"
      :width="7"
      color="#0bc4b8"
      indeterminate
    ></v-progress-circular>
  </div>
</template>
<script>
export default {
  name: 'COMPONENT_LOADING_PLACEHOLDER'
}
</script>
<style lang="scss">
.clp__container{
  min-height: 75vh;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>