<template>
  <v-chip
    :color="bgColor"
    :text-color="color"
    pill
  >
    <span class="catalog__chip-text">{{ text }}</span>
    <v-icon :color="color" size="20" right>
      {{ icon }}
    </v-icon>
  </v-chip>
</template>

<script>
export default {
  name: "ChipCatalog",
  props: {
    text: String,
    color: String,
    bgColor: String,
    icon: [String, Function]
  }
}
</script>

<style lang="scss">
.catalog__chip-text {
  font-weight: 500;
  font-size: 15px;
  line-height: 16px;
}
</style>
