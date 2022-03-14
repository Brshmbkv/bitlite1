<template>
  <div
    class="instructions-overlay" 
  >
    <div class="instructions-overlay__content">
      <h5 class="instructions-overlay__title mb-4">
        Перед тем как заливать задачу
      </h5>
      <p class="instructions-overlay__text mb-4">
        Прочитайте инструкцию о том, как нужно отсылать задачи нашему роботу. У нашего T-800 есть определенные правила, по которым он будет проверять задачи. Важно им следовать.
      </p>
      <v-btn
        color="#0BC3B8"
        :elevation="0"
        outlined
        @click="$emit('click')"
      >
        Как проверяет мою задачу Т-800
      </v-btn>
    </div>
  </div>
</template>
<script>
export default {

}
</script>

<style lang="scss">
.instructions-overlay{
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 3;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  .instructions-overlay__content{

    text-align: center;
    color: #FFFFFF;
    max-width: 450px;
    padding: 0 12px
  }
  .instructions-overlay__title{
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 40px;
  }
  .instructions-overlay__text{
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
  }
}
</style>