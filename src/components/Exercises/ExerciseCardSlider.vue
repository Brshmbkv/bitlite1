<script>
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
import { VIcon } from 'vuetify/lib'
export default {
  props: {
    gap: {
      type: Number,
      required: false,
      default: 16,
    },
    shownItems: {
      type: Number,
      required: false,
      // default: 3,
    },
  },
  data() {
    return {
      mdiChevronLeft,
      mdiChevronRight,
      shownItemsCount: 0,
      scrollX: 0,
      itemWidth: 0,
      contentWidth: 0,
    }
  },
  computed: {
    scrollValue() {
      return (this.itemWidth + this.gap) * this.shownItemsCount
    },
  },
  created() {
    window.addEventListener('resize', this.bootstrap)
  },
  mounted() {
    this.bootstrap()
  },
  destroyed() {
    window.removeEventListener('resize', this.bootstrap)
  },
  methods: {
    bootstrap() {
      // //isolating this component from each other with uid of component
      const parent = document.querySelector(
        `.slider-wrapper[data-v-id="${this._uid}"]`
      )
      this.itemWidth = parent.querySelector('.exercise__card').offsetWidth
      this.contentWidth = parent.querySelector('.slider-content').scrollWidth
      if (!this.shownItems) {
        this.shownItemsCount = Math.round(
          parent.querySelector('.slider-content__wrapper').offsetWidth /
            this.itemWidth
        )
      }
    },
    handlePrevArrowClick() {
      if (this.scrollX - this.scrollValue < 0) return
      this.scrollX = this.scrollX - this.scrollValue
    },
    handleNextArrowClick() {
      if (this.scrollX + this.scrollValue > this.contentWidth) return
      this.scrollX = this.scrollX + this.scrollValue
    },
  },
  render(h) {
    const prevArrow =
      this.$slots.prev ||
      h(
        'div',
        {
          on: {
            click: this.handlePrevArrowClick,
          },
          class: 'slider-arrow--prev',
        },
        [
          h(
            VIcon,
            {
              props: {
                disabled: this.scrollX === 0 ? true : false,
                size: 36,
              },
            },
            [this.mdiChevronLeft]
          ),
        ]
      )

    const nextArrow =
      this.$slots.next ||
      h(
        'div',
        {
          on: { click: this.handleNextArrowClick },
          class: 'slider-arrow--next',
        },
        [
          h(
            VIcon,
            {
              props: {
                disabled:
                  this.contentWidth < this.scrollX + this.scrollValue
                    ? true
                    : false,
                size: 36,
              },
            },
            [this.mdiChevronRight]
          ),
        ]
      )

    const content = h('div', { class: 'slider-content__wrapper' }, [
      h(
        'div',
        {
          class: 'slider-content',
          style: {
            transform: `translateX(-${this.scrollX}px)`,
            columnGap: `${this.gap}px`,
          },
        },
        [this.$slots.default]
      ),
    ])
    return h(
      'div',
      {
        class: 'slider-wrapper',
        attrs: {
          'data-v-id': this._uid,
        },
      },
      [prevArrow, content, nextArrow]
    )
  },
}
</script>

<style lang="scss" scoped>
.slider-wrapper {
  display: flex;
  gap: 6px;
}
.slider-content {
  display: flex;
  padding: 4px;
  transition: transform 0.4s ease;
}
.slider-content__wrapper {
  display: flex;
  overflow: hidden;
  flex: 1;
}
.slider-card {
  flex: 0 0 auto;
}
.slider-arrow--prev,
.slider-arrow--next {
  display: grid;
  place-content: center;
  cursor: pointer;
}
.theme--light.v-icon.v-icon.v-icon--disabled {
  color: #dbdfe4 !important;
}
</style>
