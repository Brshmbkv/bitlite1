<template>
  <div class="error-page">
    <DogeSvg />
    <div class="error-block">
      <h1 class="error-block__title">Ведутся работы</h1>
      <p class="error_block__subtitle">
        Cкоро все будет доступно. За животными нужен глаз да глаз.
      </p>
    </div>
    <p class="copyright-text">
      This is a derivative of an
      <a
        target="_blank"
        href="https://www.figma.com/community/file/1015219633030143857/404-Illustration-Card-With-Cool-Caption?fuid=969149980961649370"
        >illustration</a
      >
      by
      <a target="_blank" href="https://www.figma.com/@abellvo">Abell Vo</a> used
      under
      <a target="_black" href="https://creativecommons.org/licenses/by/4.0/"
        >CC 4.0</a
      >
    </p>
  </div>
</template>

<script>
import DogeSvg from '@/assets/svg/ErrorDoge.svg';
export default {
  components: {
    DogeSvg,
  },
};
</script>

<style scoped>
.copyright-text {
  position: absolute;
  left: 18px;
  bottom: 18px;
  margin-bottom: 0;
  font-weight: 300;
  font-size: 13px;
  color: #9fa4b1;
}
.copyright-text > a {
  color: #9fa4b1;
}
.error-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  color: #171729;
  /* background-image: url('https://sun9-58.userapi.com/impg/p9Ct_5p-MDtckav-n6KcOUKQD2iwLMoF-yZqfw/tpTfMvT8lc0.jpg?size=1280x598&quality=96&sign=a3eade49ccd9fced6e6ce0cf7cf71fec&type=album');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover; */
}
.error-block {
  display: flex;
  flex-direction: column;
  gap: 52px;
}
.error-block > p {
  margin: 0;
}
.error-block__title {
  font-weight: 600;
  font-size: 48px;
  line-height: 56px;
}
.error-block__subtitle {
  width: 436px;
  font-size: 18px;
  font-weight: 300;
  line-height: 24px;
}
</style>
