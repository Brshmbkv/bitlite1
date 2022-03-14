<template>
  <div class="error-page cat">
    <CatSvg />
    <div class="error-block">
      <h1 class="error-block__title">Ведутся работы</h1>
      <p class="error-block__subtitle">
        Cкоро все будет доступно. Мы больше не будем допускать кота к работе.
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
import CatSvg from '@/assets/svg/ErrorCat.svg';
export default {
  components: {
    CatSvg,
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
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 66px;
}
.error-page.cat {
  background-color: #fff;
  color: #171729;
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
  width: 433px;
  font-size: 18px;
  font-weight: 300;
  line-height: 24px;
}
</style>
