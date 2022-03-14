<template>
  <v-data-table
    class="guidelines-tags__table"
    :headers="headers"
    :items="items"
    :items-per-page="itemsPerPage"
    :loading="loading"
    :sort-by="sortBy"
    :sort-desc="sortDesc"
    hide-default-footer
    hide-default-header
  >
    <template v-slot:header="{ props: { headers } }">
      <thead>
        <tr class="guidelines-tags-table__header">
          <th
            v-for="header in headers"
            :key="header.text"
            @click="sortTable(header)"
          >
            <div class="guidelines-tags-table__th">
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
                class="guidelines-tags__header-text"
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
    <template v-slot:body="{ items }">
      <tbody>
        <tr
          class="guidelines-tags-table__row"
          v-for="item in items"
          :key="item.id"
        >
          <td>
            <span class="guidelines-tags-table__id">{{ item.id }}</span>
          </td>
          <td>
            <span class="guidelines-tags-table__title">{{ item.name }}</span>
          </td>
          <td>
            <div class="guidelines-tags__color-wrapper">
              <div
                class="guidelines-tags__color"
                :style="{ backgroundColor: item.color }"
              ></div>
              <span class="guidelines-tags__color-text">{{ item.color }}</span>
            </div>
          </td>
          <td>
            <EditDropDownButton 
              @edit="$emit('edit', item)"
              @delete="$emit('delete', item.id)"
            />
          </td>
        </tr>
      </tbody>
    </template>
  </v-data-table>
</template>

<script>
import SortIcon from '@/assets/svg/sort-icon.svg'
import EditDropDownButton from '@/components/Admin/EditDropDownButton'

export default {
  components: {
    SortIcon,
    EditDropDownButton
  },
  props: {
    headers: {
      type: Array,
      default: () => [],
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
    sortBy: {
      type: String,
      default: 'id',
    },
    sortDesc: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
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
.guidelines-tags {
  &__table {
    margin-top: 25px;
    border-radius: 5px;
  }
  &-table__header {
    height: 56px;
  }
  &-table__row {
    height: 64px;
  }
  &-table__th {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  &-table__id,
  &-table__title {
    font-size: 14px;
    line-height: 24px;
    font-weight: 600;
  }
  &__header-text {
    font-size: 14px;
    line-height: 16px;
    font-weight: 500;
    color: #171729;
  }
  &__color-wrapper {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  &__color {
    height: 24px;
    width: 24px;
    border-radius: 50%;
  }
  &__color-text {
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
  }
  &__actions {
    display: flex;
    gap: 10px
  }
  &__edit,
  &__delete {
    display: inline-flex;
  }
}
.col-sorted {
  font-weight: 600;
  color: #5a6275;
  transition: color 0.2s ease;
}
</style>
