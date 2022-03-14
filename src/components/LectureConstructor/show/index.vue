<template>
  <div class="constructor__content-show">
    <template v-if="value && value.length > 0">
      <component 
        v-for="(element, k) in value"
        :key="k"
        :is="p"
      />
    </template>
    <p>No content :(</p>
  </div>
</template>

<script>
export default {
  name: 'ConstructorContentShow',
  props: {
    value: {
      type: Array,
    }
  }
}
</script>

<style>

</style>