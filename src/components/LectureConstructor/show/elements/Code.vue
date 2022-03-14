<template>
  <highlight 
    :code="value"
    :language="options.lang"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: String
    },
    options: {
      type: Object, 
      default(){
        return {}
      }
    }
  },
}
</script>

<style>

</style>