<template>
  <div>
    <div class="s-guidelines-header__wrapper">
      <v-container class="s-guidelines__container">
        <h1 class="s-guidelines__title">Гайдлайны по порталу</h1>
      </v-container>
    </div>
    <v-container class="s-guidelines__container">
      <template v-if="loading">
        <div class="mt-10">
          <template v-for="i in 12">
            <v-skeleton-loader
              class="mt-4"
              :key="i"
              type="image"
              max-height="60"
            ></v-skeleton-loader>
            <v-divider class="my-4" :key="`${i}-divider`"></v-divider>
          </template>
        </div>
      </template>
      <template v-else-if="data && data.length === 0">
        <div class="t-guidelines-not-found">
          <v-icon size="100" color="#CED3E0">{{ mdiFileFind }}</v-icon>
          <h1>Гайдлайны не найдены</h1>
        </div>
      </template>
      <template v-else>
        <v-expansion-panels class="s-guidelines__accordion" accordion>
          <v-expansion-panel
            class="s-guidelines__panel"
            v-for="faq in data"
            :key="faq.id"
          >
            <v-expansion-panel-header class="s-guidelines__header">
              {{ faq.title }}
              <template v-slot:actions>
                <div class="s-guidelines-plus__icon">
                  <span></span>
                  <span></span>
                </div>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="s-guidelines-content__wrapper">
              <div class="s-guidelines-content__line"></div>
              <div
                class="s-guidelines__content"
                v-html="decodeHTML(faq.content)"
              ></div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <Pagination
          class="s-guidelines__pagination"
          v-model="page"
          :length="pageCount"
          :disabled="loading"
          :justify="'start'"
        />
      </template>
    </v-container>
  </div>
</template>

<script>
import Pagination from '@/components/Admin/Pagination'
import { decodeHTML } from '@/helpers/index'
import { mdiFileFind } from '@mdi/js'

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      mdiFileFind,
      data: [],
      page: 1,
      itemsPerPage: 10,
      pageCount: 0,
      totalItems: 0,
      shownItems: 0,
      loading: false,
    }
  },
  watch: {
    page: function() {
      this.fetchFaqs()
    },
  },
  mounted() {
    this.fetchFaqs()
  },
  methods: {
    decodeHTML,
    async fetchFaqs() {
      try {
        this.loading = true
        const {
          data: { data, meta },
        } = await this.$axios.get('support/faqs', {
          params: {
            paginate: this.itemsPerPage,
            page: this.page,
          },
        })
        this.data = data
        this.page = meta.current_page
        this.itemsPerPage = +meta.per_page
        this.pageCount = meta.last_page
        this.totalItems = meta.total || 0
        this.shownItems = meta.to || 0
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss">
.s-guidelines-header__wrapper {
  background-color: #f5f6f8;
}
.s-guidelines {
  &__container {
    padding-top: 0;
    padding-bottom: 0;
  }
  &__title {
    font-size: 24px;
    line-height: 32px;
    font-weight: 700;
    color: #171729;
    padding: 32px 0;
  }
  &__accordion {
    margin-top: 35px;
    border-bottom: 1px solid rgba(#000000, 0.12);
    border-radius: 0;
  }
  &__panel {
    &::before {
      content: none;
    }
  }
  &__header {
    padding: 28px 0;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
    transition: all 0.25s ease;
    text-transform: capitalize;
    &.v-expansion-panel-header--active {
      font-size: 22px;
      font-weight: 700;
      color: #0bc3b8;
      span {
        background-color: #fff;
      }
      span:nth-child(2) {
        opacity: 0;
      }
      .s-guidelines-plus__icon {
        background-color: #0bc3b8;
      }
    }
  }
  &-plus__icon {
    width: 32px;
    height: 32px;
    padding: 10px;
    border-radius: 50%;
    transition: background-color 0.3s ease;
    position: relative;
    opacity: 1;
    span {
      position: absolute;
      display: block;
      width: 18px;
      height: 3px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #0bc3b8;
      border-radius: 9999px;
      transition: transform 0.3s ease;
      &:nth-child(2) {
        transform: translate(-50%, -50%) rotate(90deg);
      }
    }
    &:hover {
      background-color: rgba(#0bc3b8, 0.12);
    }
  }
  &-content__wrapper > .v-expansion-panel-content__wrap {
    display: flex;
    padding: 0 24px 40px;
  }
  &-content__line {
    width: 3px;
    height: 100%;
    background-color: #0bc3b8;
    border-radius: 9999px;
  }
  &__content {
    padding-left: 16px;
    color: #5a6275;
    font-size: 16px;
    line-height: 24px;
    > p {
      margin: 0;
    }
  }
  &__pagination {
    margin-top: 30px;
  }
}
.s-guidelines-not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 56px 0;
  background: #f9fafb;
  border-radius: 10px;
  margin-top: 56px;
  & > h1 {
    margin-top: 8px;
    font-weight: bold;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.01em;
    color: #383d57;
  }
}
</style>
