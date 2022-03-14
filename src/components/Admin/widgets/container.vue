<template>
  <v-col 
    cols="12"
    :md="expanded ? 12 : column ? column : 6"
    :lg="expanded ? 12 : column ? column : 4"
    :xl="expanded ? 12 : column ? column : 3"
  >
    <v-sheet 
      rounded
      style="border: 1px solid rgba(23, 23, 41, 0.08); border-radius: 10px !important;"
      :height="expanded ? 'auto' : column ? 'auto' : 350"
      class="d-flex flex-column pa-4"
    >
      <div class="d-flex justify-space-between">
        <span class="d-block mb-3" style="font-weight: 500;font-size: 18px">{{ title }}</span>
        <div style="cursor: pointer;" @click="expanded = !expanded">
          <ExpandSvg v-if="!expanded"/>
          <ShrinkSvg v-else />
        </div>
      </div>
      <slot></slot>
    </v-sheet>
  </v-col>
</template>
<script>
import ExpandSvg from '@/assets/svg/expand.svg'
import ShrinkSvg from '@/assets/svg/shrink.svg'

export default {
  name:"WidgetContainer",
  components: {
    ExpandSvg,
    ShrinkSvg,
  },
  props: {
    title: {
      type: String,
      default: 'Widget'
    },
    expand: {
      type: Boolean,
      default: false,
    },
    column: {
      type: Number,
    }
  },
  data(){
    return {
      expanded: this.expand,
    }
  }
}
</script>