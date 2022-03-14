<template>
  <div class="scroll-to-top" :class="{'show-scroll-btn': showBtn}" @click="scrollToTop">
    <v-icon class="scroll-to-top__chevron-up" size="32">{{ mdiChevronUp }}</v-icon>
  </div>
</template>

<script>
import { mdiChevronUp } from '@mdi/js';

export default {
  name: 'ScrollToTop',
  data() {
    return {
      mdiChevronUp,
      showBtn: false
    }
  },
  created() {
    document.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    document.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    },
    handleScroll() {
      this.showBtn = document.documentElement.scrollTop > 1730
    }
  }
}
</script>

<style lang="scss">
.scroll-to-top {
  position: fixed;
  bottom: 16px;
  right: 100px;
  padding: 11px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #DBDFEA;
  border-radius: 50%;
  opacity: 0;
  transform: translateY(100px);
  transition: all .5s ease;
  cursor: pointer;

  &:hover {
    background: #171729;
    border-color: #171729;

    .scroll-to-top__chevron-up {
      color: #ffffff !important;
    }
  }

  &:hover::before {
    opacity: 1;
  }

  &::before {
    content: 'НАВЕРХ';
    opacity: 0;
    position: absolute;
    top: -46px;
    padding: 10px;
    font-size: 15px;
    font-weight: 600;
    line-height: 16px;
    color: #171729;
    background: #F5F6F8;
    letter-spacing: .02em;
    border: 1px solid #DBDFEA;
    border-radius: 9999px;
    text-transform: uppercase;
    transition: opacity .3s ease;
  }

  &__chevron-up {
    color: #171729 !important;
  }
}

.show-scroll-btn {
  opacity: 1;
  transform: translateY(0);
}
</style>
