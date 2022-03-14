<template>
  <div class="error-page space">
    <div class="error-wrapper">
      <AstronautSvg />
      <div class="error-block">
        <h1 class="error-block__title">Ведутся работы</h1>
        <p class="error_block__subtitle">
          Cкоро все будет доступно. До встречи на wземной орбите.
        </p>
      </div>
    </div>
    <div class="stars">
      <svg
        width="24"
        height="26"
        viewBox="0 0 24 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.8267 25V1M1 12.4582H23"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
      <svg
        width="24"
        height="26"
        viewBox="0 0 24 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.8267 25V1M1 12.4582H23"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
      <svg
        width="24"
        height="26"
        viewBox="0 0 24 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.8267 25V1M1 12.4582H23"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
      <svg
        width="24"
        height="26"
        viewBox="0 0 24 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.8267 25V1M1 12.4582H23"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
      <svg
        width="24"
        height="26"
        viewBox="0 0 24 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.8267 25V1M1 12.4582H23"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
      <svg
        width="24"
        height="26"
        viewBox="0 0 24 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.8267 25V1M1 12.4582H23"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
      <svg
        width="24"
        height="26"
        viewBox="0 0 24 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.8267 25V1M1 12.4582H23"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
      <svg
        width="24"
        height="26"
        viewBox="0 0 24 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.8267 25V1M1 12.4582H23"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
      <svg
        width="24"
        height="26"
        viewBox="0 0 24 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.8267 25V1M1 12.4582H23"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </div>
    <p class="copyright-text">
      This is a derivative of an
      <a
        target="_blank"
        href="https://www.figma.com/community/file/1015219633030143857/404-Illustration-Card-With-Cool-Caption?fuid=969149980961649370"
        >illustration</a
      >
      by
      <a target="_blank" href="https://craftwork.design/">Craftwork</a> used
      under
      <a target="_black" href="https://creativecommons.org/licenses/by/4.0/"
        >CC 4.0</a
      >
    </p>
  </div>
</template>

<script>
import AstronautSvg from '@/assets/svg/Cosmos.svg';
export default {
  components: {
    AstronautSvg,
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
.error-wrapper {
  position: relative;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 66px;
}
.error-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 66px;
}
.error-page.space {
  background-color: #171729;
  color: #fff;
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
  width: 368px;
  font-size: 18px;
  font-weight: 300;
  line-height: 24px;
}
.stars > svg {
  position: absolute;
}
.stars svg:nth-child(1) {
  top: 11.1%;
  left: 4.65%;
}
.stars svg:nth-child(2) {
  left: 40.42%;
  top: 11.1%;
}
.stars svg:nth-child(3) {
  right: 5.69%;
  top: 6.36%;
}
.stars svg:nth-child(4) {
  right: 24.03%;
  top: 29.13%;
}
.stars svg:nth-child(5) {
  right: 14.24%;
  bottom: 30.98%;
}
.stars svg:nth-child(6) {
  left: 3.89%;
  bottom: 17.57%;
}
.stars svg:nth-child(7) {
  left: 25%;
  bottom: 11.33%;
}
.stars svg:nth-child(8) {
  right: 45.62%;
  bottom: 13.41%;
}
.stars svg:nth-child(9) {
  right: 4.93%;
  bottom: 4.74%;
}
</style>
