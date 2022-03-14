<template>
  <v-breadcrumbs
    class="MyBreadcrumbs px-0"
    :items="items"
    large
  >
    <template v-slot:divider >
      <v-icon v-if="$route.meta.showCrumbs">{{mdiChevronRight}}</v-icon>
      <span v-else>/</span>
    </template>
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item
        :to="item.to"
        :class="{
          'font-weight-bold': !item['font-normal'],
          'MyBreadcrumbs__item--small': item['font-normal'],
          'MyBreadcrumbs__item--underlined': item['underlined']
        }"
        active-class="active-crumb"
        :style="{cursor: item.action && 'pointer' || 'default'}"
        :disabled="item.disabled"
        :ripple="false"
        v-on="item.action ? { click: item.action } : {}"
      >
        <v-icon
          v-if="item.back"
          class="mr-4"
          color="#232837"
        >{{ mdiChevronLeft }}</v-icon>
        <span
          :class="[
            items && items.length === 1 ?
              'MyBreadcrumbs__item__text--large' : 'MyBreadcrumbs__item__text'
          ]"
        >{{ item.text }}</span>
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script>
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { mapGetters } from "vuex"
export default {
  data(){
    return {
      mdiChevronLeft,
      mdiChevronRight,
    }
  },
  computed: {
    ...mapGetters('breadcrumbs', ['items'])
    // ...mapState('breadcrumbs', ['back', 'links', 'current']),
  }
}
</script>
<style lang="scss">
.MyBreadcrumbs {
  & .MyBreadcrumbs__item--small {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.02em;

    a.v-breadcrumbs__item{
      color: #171729 !important;
    }
  }
  & .MyBreadcrumbs__item__text--large {
    font-size: 24px !important;
  }
  & .MyBreadcrumbs__item--underlined {
    span:last-child {
      box-shadow: inset 0px -1px 0px rgba(23, 23, 41, 0.16);
    }
  }
}
</style>
