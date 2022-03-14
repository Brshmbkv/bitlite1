<template>
  <div class="catalog__banner">
    <div
      v-for="i in 8"
      :key="i"
      class="catalog__banner__icon-container"
      :style="{
        top: randomTop(),
        right: randomRight(),
        opacity: randomOpacity(),
        transform: `scale(${randomScale()})`,
      }"
    >
      <StarIcon />
    </div>
    <div class="catalog__banner__rocket">
      <RocketIcon />
    </div>
    <div class="catalog__banner__content">
      <template v-if="isLite">
        <h1>LITE курсы</h1>
        <p class="mb-6">
          Не уверены какой вам выбрать курс?<br />
          Здесь вы можете пройти наши бесплатные вводные курсы, которые помогут
          вам с выбором.
        </p>
      </template>
      <template v-else>
        <h1>Не знаете с чего начать?</h1>
        <p class="mb-6" v-if="!isLite">
          У нас есть бесплатные уроки, которые помогут вам сделать выбор.
        </p>
        <v-btn
          :ripple="false"
          class="align-self-baseline text-none mb-3"
          style="color: #171729; background-color: #0ACCDA; letter-spacing: 0.02rem"
          elevation="0"
          @click="$emit('click')"
        >
          Посмотреть бесплатные курсы
        </v-btn>
      </template>
    </div>
  </div>
</template>

<script>
import StarIcon from '@/assets/svg/star_catalog.svg'
import RocketIcon from '@/assets/svg/rocket_catalog.svg'

export default {
  name: 'CourseCatalogBanner',
  components: {
    StarIcon,
    RocketIcon,
  },
  props: {
    isLite: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    randomTop() {
      return `${Math.floor(Math.random() * 200) + 30}px`
    },
    randomRight() {
      return `${Math.floor(Math.random() * 500) + 30}px`
    },
    randomOpacity() {
      return Math.random()
    },
    randomScale() {
      return Math.floor(Math.random() * 1.2) + 1.05
    },
  },
}
</script>

<style lang="scss">
.catalog__banner {
  position: relative;
  background: #262940;
  border-radius: 10px;
  padding: 24px 32px;
  margin-top: 12px;

  &__icon-container {
    position: absolute;
  }

  &__content {
    display: flex;
    flex-direction: column;
    color: #ffffff;
    width: 69%;

    h1 {
      font-weight: 900;
      font-size: 28px;
      line-height: 32px;
      letter-spacing: 0.02em;
      margin-bottom: 24px;
    }
    h3 {
      font-size: 16px;
      line-height: 24px;
    }
  }

  &__rocket {
    position: absolute;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    right: 40px;
  }
}
</style>
