<template>
  <div class="min-h-screen d-flex justify-center align-center">
    <div class="brand-wrapper">
      <div class="logo-img__wrapper">
        <img class="logo__img" src="@/assets/png/bitlab_logo_circle.png" alt="bitlab logo" />
      </div>
      <h1><span>Bitlab</span> <span>Academy</span></h1>
    </div>
    <transition name="component-fade" mode="out-in">
      <component
        :is="currentComponent"
        :params="params"
        @change="changeComponent"
      />
    </transition>
  </div>
</template>

<script>
import Login from '@/components/LoginNew/Login'
import Register from '@/components/LoginNew/Register'
import InfoModal from '@/components/LoginNew/InfoModal'
import ForgotPassword from '@/components/LoginNew/ForgotPassword'
export default {
  components: {
    Login,
    Register,
    InfoModal,
    ForgotPassword,
  },
  props: {
    componentFrom: String,
    paramsFrom: Object,
  },
  data() {
    return {
      currentComponent: this.componentFrom || Login,
      params: this.paramsFrom || undefined,
    }
  },
  methods: {
    changeComponent(val, params) {
      if (params) this.params = params
      this.currentComponent = val
    },
  },
}
</script>

<style lang="scss" scoped>
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.component-fade-enter, .component-fade-leave-to
    /* .component-fade-leave-active below version 2.1.8 */
 {
  opacity: 0;
}
.min-h-screen {
  min-height: 100vh;
}
.brand-wrapper {
  position: absolute;
  display: flex;
  align-items: center;
  color: #fff;
  left: 64px;
  top: 16px;
  @media (min-width: 714px) {
    top: 24px;
  }
}
.brand-wrapper > h1 {
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: 500;
  line-height: 15px;
  text-transform: uppercase;
}
.logo-img__wrapper {
  height: 48px;
  width: 54px;
}
.logo__img {
  width: 100%;
  object-fit: cover;
}
</style>
