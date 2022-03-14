<template>
  <v-container fluid>
    <div class="guidelines-tags__header">
      <h1 class="guidelines__title"><router-link :to="{name: 'AdminGuidelinesIndex'}">Статьи</router-link> / Tэги</h1>
      <button class="guidelines-tags__add-btn" @click.stop="openModal()">Добавить</button>
    </div>
    <GuidelineTagsTable
      :headers="headers"
      :items="items"
      :itemsPerPage="itemsPerPage"
      :loading="loading"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      @sortTable="sortTable"
      @edit="openModalWithItem"
      @delete="deleteTag"
    />
    <GuidelineTagsDialog :dialog="dialog" :item="item" @closeDialog="dialog = false" @done="fetchTags"/>
  </v-container>
</template>

<script>
import GuidelineTagsTable from '@/components/Admin/guidelines/tags/GuidelineTagsTable'
import GuidelineTagsDialog from '@/components/Admin/guidelines/tags/GuidelineTagsDialog'

export default {
  components: {
    GuidelineTagsTable,
    GuidelineTagsDialog,
  },
  data() {
    return {
      headers: [
        {
          text: 'ID',
          value: 'id',
        },
        {
          text: 'Название',
          value: 'name',
        },
        {
          text: 'Цвет',
          value: 'color',
        },
        {
          text: 'Править',
          value: 'edit',
          sortable: false,
        },
      ],
      items: [],
      itemsPerPage: 10,
      loading: false,
      sortBy: 'id',
      sortDesc: true,
      item: {},
      dialog: false,
    }
  },
  watch: {
    sortBy: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.sortDesc = true
      }
    },
  },
  mounted() {
    this.fetchTags()
  },
  methods: {
    async fetchTags() {
      try {
        this.loading = true
        const res = await this.$axios.get('admin/tags', {
          paginate: this.itemsPerPage,
        })
        this.items = res.data
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    sortTable(obj) {
      this.sortBy = obj.value
      this.sortDesc = !obj.sortDesc
    },
    openModalWithItem(val) {
      this.openModal(val)
    },
    openModal(item = {}) {
      this.item = item
      this.dialog = true
    },
    async deleteTag(id) {
      await this.$axios.delete(`admin/tags/${id}`)
      this.fetchTags()
    }
  },
}
</script>

<style lang="scss">
.guidelines-tags {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__title {
    font-size: 20px;
    line-height: 40px;
    font-weight: 700;
  }
  &__add-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    padding: 10px 15px;
    border-radius: 5px;
    color: #ffffff;
    background-color: #0bc3b8;
    letter-spacing: 0.02em;
    &::before {
      content: '+';
      font-size: 20px;
      font-weight: 400;
    }
  }
}
</style>
