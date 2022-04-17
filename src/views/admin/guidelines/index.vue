<template>
  <v-container class="guidelines" fluid>
    <div class="guidelines__header">
      <div class="guidelines__left">
        <h1 class="guidelines__title">
          Статьи /
          <router-link style="color: #4376FB" :to="{ name: 'AdminTagsIndex' }">Tэги</router-link>
        </h1>
        <div class="guidelines-search-form">
          <input
            class="guidelines-search-form__input"
            v-model="search"
            placeholder="Поиск по статьям"
          />
          <button style="background-color: #4376FB" class="guidelines-search-form__btn" @click="searchData">
            <SearchIcon />
          </button>
        </div>
        <CustomFilter
          :showFilter="showFilter"
          :filtersApplied="filtersApplied"
          @openFilter="showFilter = true"
          @closeFilter="showFilter = false"
          @clearFilters="clearFilters"
          @applyFilters="applyFilters"
        >
          <template #body>
            <div class="guidelines-filter__top">
              <span class="guidelines-filter-top__text">Тэги:</span>
              <v-icon class="guidelines-filter-top__chevron-down" size="24">{{
                mdiChevronDown
              }}</v-icon>
            </div>
            <div class="guidelines-filter__body">
              <label class="filter-body__tag" v-for="tag in tags" :key="tag.id">
                <input
                  class="filter__custom-checkbox filter__rounded-checkbox"
                  type="checkbox"
                  :value="tag.id"
                  v-model="filterTags"
                />
                <span class="filter-body__text">{{ tag.name }}</span>
              </label>
            </div>
          </template>
        </CustomFilter>
      </div>
      <div class="guidelines__right">
        <button class="guidelines-delete__btn" @click.prevent="deleteData">
          <TrashIcon />
          <span>Удалить</span>
        </button>
        <button style="background-color: #4376FB;" class="guidelines-add__btn" @click.stop="openModal()">
          <span>Добавить</span>
        </button>
      </div>
    </div>
    <GuidelinesDataTable
      :headers="headers"
      :headers-length="headers.length + 1"
      :items="data"
      :items-per-page="itemsPerPage"
      :loading="loading"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      @sortTable="sortTable"
      @openModal="openModalWithItem"
      ref="table"
    />
    <Pagination
      class="guidelines__pagination"
      v-model="page"
      :length="pageCount"
      :disabled="loading"
      :show-text="true"
      :shownItems="shownItems"
      :totalItems="totalItems"
    />
    <GuidelinesDialog
      :dialog="modal"
      :item="item"
      :tags="tags"
      @closeDialog="modal = false"
      @done="refreshData"
    />
  </v-container>
</template>

<script>
import SearchIcon from '@/assets/svg/search.svg'
import TrashIcon from '@/assets/svg/trash.svg'
import GuidelinesDialog from '@/components/Admin/guidelines/GuidelinesDialog'
import CustomFilter from '@/components/CustomFilter'
import GuidelinesDataTable from '@/components/Admin/guidelines/GuidelinesDataTable'
import Pagination from '@/components/Admin/Pagination'
import { mdiChevronDown } from '@mdi/js'
import { decodeHTML } from '@/helpers'

export default {
  components: {
    CustomFilter,
    SearchIcon,
    TrashIcon,
    GuidelinesDialog,
    GuidelinesDataTable,
    Pagination,
  },
  data() {
    return {
      mdiChevronDown,
      headers: [
        { text: 'Заголовок', value: 'title' },
        { text: 'Тэги', value: 'tags' },
        { text: 'Дата модификации', value: 'updated_at' },
        { text: 'Править', value: 'edit', sortable: false },
      ],
      search: '',
      sortBy: 'updated_at',
      sortDesc: true,
      data: [],
      fetchedData: [],
      tags: [],
      loading: false,

      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      totalItems: 0,
      shownItems: 0,

      modal: false,
      item: {},

      showFilter: false,
      filtersApplied: false,
      filterTags: [],
    }
  },
  watch: {
    page: function() {
      this.isAllSelected = false
      this.selectedItems = []
      this.fetchData()
    },
    data: function(newVal) {
      if (newVal.length === 0) {
        this.page = 1
      }
    },
    sortBy: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.sortDesc = true
      }
    },
    search: async function(newVal) {
      if (newVal === '') {
        await this.fetchData()
      }
    },
  },
  mounted() {
    this.fetchData()
    this.fetchTags()
  },
  methods: {
    async fetchData() {
      try {
        this.loading = true
        const {
          data: { data, meta },
        } = await this.$axios.get('admin/faqs', {
          params: {
            paginate: this.itemsPerPage,
            page: this.page,
            search: this.search,
          },
        })
        this.data = data
        this.fetchedData = data
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
    async fetchTags() {
      const { data } = await this.$axios.get('admin/tags')
      this.tags = data
    },
    sortTable(obj) {
      this.sortBy = obj.value
      this.sortDesc = !obj.sortDesc
    },
    async deleteData() {
      if ((await this.$refs.table.deleteData()) === 'exit') return
      this.fetchData()
    },
    closeModal() {
      this.modal = false
    },
    openModal(item = {}) {
      this.item = item
      this.modal = true
    },
    openModalWithItem(val) {
      this.openModal({ ...val, content: decodeHTML(val.content) })
    },
    async refreshData() {
      await this.fetchData()
      if (this.filtersApplied) this.applyFilters()
    },
    clearFilters() {
      this.filterTags = []
      this.filtersApplied = false
      this.sortBy = 'updated_at'
    },
    async applyFilters() {
      if (this.filterTags.length === 0) {
        this.data = this.fetchedData
        return
      }
      this.data = this.fetchedData
      this.data = this.data.filter((i) => {
        return i.tags.some((el) => this.filterTags.includes(el.id))
      })
      this.data.sort((a, b) => {
        return a.tags[0].name.localeCompare(b.tags[0].name)
      })
      this.filtersApplied = true
      this.sortBy = null
      this.sortDesc = null
    },
    async searchData() {
      if (this.search === '') return
      await this.fetchData()
    },
  },
}
</script>

<style lang="scss">
.guidelines {
  &__pagination {
    margin-top: 20px;
  }
  &__header {
    display: flex;
    flex-wrap: wrap;
    row-gap: 12px;
    justify-content: space-between;
    align-items: center;
  }
  &__left {
    display: flex;
    align-items: center;
  }
  &__right {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  &__title {
    font-size: 20px;
    font-weight: 700;
    line-height: 40px;
    color: #000000;
  }
  &-delete__btn,
  &-add__btn {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    outline: none;
    border-radius: 5px;
    padding: 10px 15px;
    line-height: 20px;
    height: 40px;
  }
  &-add__btn {
    gap: 10px;
    &::before {
      content: '+';
      font-weight: 400;
      font-size: 20px;
    }
  }
  &-delete__btn {
    color: #5a6275;
    border: 1px solid #9fa4b1;
    transition-property: color, background-color, fill, stroke;
    transition-timing-function: ease;
    transition-duration: 0.3s;
    & > span {
      margin-left: 10px;
    }
    & > svg > path {
      fill: currentColor;
    }
    &:hover {
      background-color: #5a6275;
      color: #ffffff;
    }
  }
  &-add__btn {
    color: #ffffff;
    background-color: #0bc3b8;
  }
  &-table-header__item {
    display: flex;
    align-items: center;
    column-gap: 8px;
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    color: #171729;
  }
}
.guidelines-search-form {
  position: relative;
  width: 280px;
  height: 40px;
  max-width: 280px;
  min-height: 40px;
  margin-left: 30px;
  margin-right: 15px;
  display: flex;
  border: 1px solid #ededee;
  background-color: #ffffff;
  border-radius: 5px;
  overflow: hidden;
  &__input {
    width: 100%;
    outline: none;
    font-size: 14px;
    line-height: 17px;
    padding: 11.5px 0 11.5px 15px;
  }
  &__btn {
    position: absolute;
    right: 0;
    width: 40px;
    height: 40px;
    background-color: #0bc3b8;
    display: flex;
    align-items: center;
    justify-content: center;
    & > svg > path {
      fill: white;
    }
  }
}
.guidelines {
  &-filter__top {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  &-filter-top__text {
    color: #000;
    font-size: 15px;
    line-height: 20px;
    font-weight: 600;
  }
  &-filter-top__chevron-down > svg {
    fill: #000;
  }
  &-filter__body {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    gap: 10px;
  }
}
.filter__btn--active {
  background-color: rgba(#0bc3b8, 1);
  color: #ffffff;
  & > svg > path {
    fill: #ffffff;
  }
}
</style>
