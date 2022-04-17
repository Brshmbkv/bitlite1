<template>
  <v-data-table
    class="guidelines__table"
    :headers="headers"
    :headers-length="headersLength"
    :items="items"
    :items-per-page="itemsPerPage"
    hide-default-footer
    hide-default-header
    :loading="loading"
    :sort-by="sortBy"
    :sort-desc="sortDesc"
  > 
    <template v-slot:header="{ props: { headers } }">
      <thead>
        <tr class="guidelines-table__header">
          <th>
            <input
              class="guidelines__custom-checkbox"
              type="checkbox"
              @click="selectAll"
              v-model="isAllSelected"
            />
          </th>
          <th
            :class="`guidelines-table-header__${header.value}`"
            class="guidelines-table-header"
            v-for="header in headers"
            :key="header.value"
            @click="sortTable(header)"
          >
            <div class="guidelines-table-header__item">
              <SortIcon
                v-if="header.sortable != false"
                class="sort-arrow"
                :class="[
                  { 'sort-arrow-desc': sortDesc && sortBy === header.value },
                  { 'sort-arrow-asc': !sortDesc && sortBy === header.value },
                ]"
                style="flex-shrink: 0;"
              />
              <span
                :class="{
                  'col-sorted': sortDesc !== null && sortBy === header.value,
                }"
                >{{ header.text }}</span
              >
            </div>
          </th>
        </tr>
      </thead>
    </template>
    <template #progress>
      <v-progress-linear class="mt-4" indeterminate color="#4376FB"></v-progress-linear>
    </template>
    <template v-slot:body="{ items }">
      <tbody>
        <template v-if="items.length !== 0">
          <tr
            class="guidelines-table-body__row"
            v-for="item in items"
            :key="item.id"
          >
            <td>
              <input
                class="guidelines__custom-checkbox"
                type="checkbox"
                :value="item.id"
                v-model="selectedItems"
                @change="updateSelectAll"
              />
            </td>
            <td class="guidelines-table-body__title">{{ item.title }}</td>
            <td>
              <div class="guidelines-table-body__badge-container">
                <span
                  class="guidelines-table-body__badge"
                  :style="{color: tag.color, backgroundColor: `${tag.color}1F`}"
                  v-for="tag in item.tags"
                  :key="tag.id"
                  >{{ tag.name }}</span
                >
              </div>
            </td>
            <td class="guidelines-table-body__modify-date">
              {{ item.updated_at | shortFormat }}
            </td>
            <td>
              <div @click="$emit('openModal', item)" class="guideline-edit__icon">
                <v-icon color="#4376FB" size="20">{{ mdiPencil }}</v-icon>
              </div>
            </td>
          </tr>
        </template>
        <template v-else-if="search">
          <tr>
            <td colspan="5">
              <span
                style="display:flex; justify-content: center; font-weight: 500"
                >No matching records found!</span
              >
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="5">
              <span
                style="display:flex; justify-content: center; font-weight: 500"
                >No data aviable!</span
              >
            </td>
          </tr>
        </template>
      </tbody>
    </template>
  </v-data-table>
</template>

<script>
import SortIcon from '@/assets/svg/sort-icon.svg'
import { mdiPencil } from '@mdi/js'
export default {
  components: {
    SortIcon,
  },
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    headersLength: {
      type: Number,
    },
    items: {
      type: Array,
      default: () => [],
    },
    itemsPerPage: {
      type: Number,
      default: 10,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    search: {
      type: String,
      default: '',
    },
    sortBy: {
      type: String,
      default: 'updated_at',
    },
    sortDesc: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      mdiPencil,
      isAllSelected: false,
      selectedItems: [],
    }
  },
  methods: {
    selectAll() {
      this.isAllSelected = !this.isAllSelected
      this.selectedItems = []
      if (this.isAllSelected) {
        this.items.forEach((el) => {
          this.selectedItems.push(el.id)
        })
      }
    },
    updateSelectAll() {
      if (this.items.length === this.selectedItems.length) {
        this.isAllSelected = true
      } else {
        this.isAllSelected = false
      }
    },
    async deleteData() {
      if (this.selectedItems.length === 0) return 'exit'
      await this.$axios.post('admin/faqs/delete', {
        ids: Array.from(this.selectedItems),
      })
      this.selectedItems = []
      this.isAllSelected = false
    },
    sortTable(col) {
      if (col.sortable === false) return
      this.$emit('sortTable', {
        value: col.value,
        sortDesc: this.sortDesc,
      })
    },
  },
}
</script>

<style lang="scss">
.guidelines {
  &__table {
    margin-top: 25px;
    border-radius: 10px;
  }
  &-table__header {
    height: 56px;
  }
  &-table-header__title {
    width: 460px;
  }
}
.guidelines-table-header {
  cursor: pointer;
}

.col-sorted {
  font-weight: 600;
  color: #5A6275;
  transition: color 0.2s ease;
}
.guidelines-table-body {
  &__row {
    height: 64px;
  }
  &__badge-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding-top: 6px;
    padding-bottom: 6px;
  }
  &__title {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    color: #171729;
    word-break: break-all;
  }
  &__badge {
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    border-radius: 10px;
    padding: 4px 15px;
  }
  &__modify-date {
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    color: #171729;
    text-transform: capitalize;
  }
}
.guideline-edit__icon {
  display: inline-flex;
  padding: 10px;
  border: 1px solid rgba(#171729, 0.12);
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #4376FB1a;
  }
  &:active {
    background-color: #0bc3b8;
    .v-icon {
      color: #fff !important;
    }
  }
}
</style>
