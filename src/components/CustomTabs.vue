<template>
  <div class="custom-tabs">
    <div
      class="custom-tabs__slider"
      :style="{
        width: `${tab_width}px`,
        transform: `translateX(${tab_x}px)`
      }"
    />
    <div
      v-for="(item, index) in items"
      :key="`tab-item-${index}`"
      :ref="`items`"
      class="custom-tabs__item"
      :style="{ color: item.key === value ? '#FFF' : '#505768' }"
      @click="getWidth(index)"
    >
      {{ item.title }}
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomTabs",
  props: {
    items: {
      type: Array,
      default: () => ([])
    },
    value: {
      type: [Number, String],
      default: 0
    },
  },
  data() {
    return {
      tab_x: 3,
      tab_width: 50
    }
  },
  mounted() {
    this.$nextTick(() => {
      let _index = Math.max(this.items.findIndex(item => item.key === this.value), 0)
      this.tab_width = this.$refs.items?.[_index]?.clientWidth - 8
      this.tab_x = this.$refs.items?.[_index]?.offsetLeft
    })
  },
  methods: {
    // TODO починить custom tabs
    getWidth(index) {
      this.tab_x = this.$refs.items?.[index]?.offsetLeft
      this.tab_width = this.$refs.items?.[index]?.clientWidth - 8
      let key = this.items?.[index]?.key
      this.updateValue(key)
    },
    updateValue(value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style lang="scss">
.custom-tabs {
  padding: 3px;
  border-radius: 100px;
  background-color: #F5F6F8;
  min-height: 60px;
  margin-bottom: 24px;
  position: relative;
  display: inline-flex;
  align-items: center;

  &__slider {
    position: absolute;
    top: 6px;
    bottom: 6px;
    left: 3px;
    border-radius: 100px;
    background-color: #0BC3B8;
    z-index: 1;
    transition: all 0.4s ease;
  }

  &__item {
    line-height: 16px;
    letter-spacing: 0.01em;
    font-weight: 500;
    padding: 0 24px;
    z-index: 3;
    cursor: pointer;
    transition: all 0.4s linear;
  }
}
</style>
