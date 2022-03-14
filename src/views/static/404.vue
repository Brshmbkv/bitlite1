<template>
  <div>
    <component :is="currentComponent"></component>
  </div>
</template>

<script>
import NotFoundSpace from '@/components/NotFound/404Space'
import NotFoundServer from '@/components/NotFound/404Server'
import NotFoundCat from '@/components/NotFound/404Cat'
import NotFoundBigfoot from '@/components/NotFound/404Bigfoot'
import NotFoundDoge from '@/components/NotFound/404Doge'
export default {
  name: 'NOT_FOUND',
  components: {
    NotFoundSpace,
    NotFoundServer,
    NotFoundCat,
    NotFoundBigfoot,
    NotFoundDoge
  },
  data() {
    return {
      currentComponent: '',
      components: [NotFoundSpace, NotFoundServer, NotFoundCat, NotFoundBigfoot, NotFoundDoge]
    }
  },
  mounted() {
    this.currentComponent = this.components[Math.floor(Math.random() * this.components.length)];
  }
}
</script>

<style></style>
