<template>
  <div class="add-dialog">
    <v-dialog
      v-model="dialog"
      @click:outside="closeDialog"
      max-width="700px"
    >
      <v-form @submit.prevent="filterPurchase">
        <v-card
          class="px-3"
        >
          <v-card-title>
            <span class="add-dialog__header-text mt-4 mb-4">Расширенный фильтр</span>
          </v-card-title>
          <v-card-text
            class="px-7"
          >
            <v-row>
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="purchaseDate"
                transition="scale-y-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="purchaseDate"
                    required
                    outlined
                    readonly
                    dense
                    placeholder="Выбрать диапазон"
                    class="filter-by-date__v-text-field purchase-date--v-text-field"
                    v-bind="attrs"
                    v-on="on"
                    style="max-width: 292px"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon
                        :color="'#171729'"
                        size="20"
                        class="mr-1"
                      >
                        {{ mdiCalendarBlankOutline }}
                      </v-icon>
                    </template>
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="purchaseDate"
                  no-title
                  scrollable
                  :first-day-of-week="1"
                  locale="ru-RU"
                  range
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="menu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menu.save(purchaseDate)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
              <v-icon
                size="40"
                right
                class="pa-1"
                @click="purchaseDate = undefined"
                style="cursor:pointer;"
              >
                {{mdiClose}}
              </v-icon>
              <v-card-text
                class="pa-0"
              >
                <v-treeview
                  v-model="courseTree"
                  :items="courseTreeItems"
                  selected-color="primary"
                  selectable
                  open-all
                  item-text="title"
                  dense
                  :expand-icon="mdiChevronDown"
                >
                </v-treeview>
              </v-card-text>
              <v-col v-if="isStream">
                <div>
                  <v-chip-group
                    v-model="selectedTypes"
                    multiple
                    column
                  >
                    <v-chip
                      v-for="type in types"
                      :key="type.value"
                      :value="type.value"
                      :ripple="false"
                      :outlined="!selectedTypes.includes(type.value)"
                      class="primary"
                      :class="[ selectedTypes.includes(type.value) ? 'white--text' : 'primary--text' ]"
                    >
                      {{ type.title }}
                    </v-chip>
                  </v-chip-group>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions
            class="justify-end mr-4 pb-5"
          >
            <v-btn
              :ripple="false"
              :elevation="0"
              :disabled="loading"
              :loading="loading"
              color="#0BC4B8"
              type="submit"
              class="text-capitalize white--text px-sm-8 py-sm-6"
            >Сохранить
            </v-btn>
            <v-btn
              :ripple="false"
              :elevation="0"
              color="#9FA4B1"
              class="text-capitalize white--text px-sm-8 py-sm-6 ml-5"
              @click="closeDialog"
            >Отмена
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import { mdiCalendarBlankOutline, mdiChevronDown, mdiClose } from '@mdi/js'

export default {
  name: "FilterPurchaseDialog",
  props: {
    dialog: Boolean,
    courses: Array,
    statuses: Array,
    isStream: Boolean
  },
  data() {
    return {
      mdiCalendarBlankOutline,
      mdiChevronDown,
      mdiClose,
      loading: false,
      menu: false,
      courseTree: undefined,
      statusTree: [],
      purchaseDate: [],
      selectedTypes: ['online', 'offline'],
      types: [
        {
          title: 'Онлайн',
          value: 'online'
        },
        {
          title: 'Оффлайн',
          value: 'offline'
        },
        {
          title: 'Лайт',
          value: 'lite'
        }
      ]
    }
  },

  computed: {
    courseTreeItems() {
      return [
        {
          id: 0,
          title: 'Сортировка по курсам',
          children: this.courses
        }
      ]
    }
  },

  methods: {
    filterPurchase() {
      if(this.purchaseDate.length === 2) {
        this.purchaseDate[0] > this.purchaseDate[1]
          ? this.purchaseDate = this.purchaseDate.reverse() : undefined
      } else if(this.purchaseDate.length === 1) {
        this.purchaseDate[1] = this.purchaseDate[0]
      }
      this.$emit('filter-purchase', this.purchaseDate && this.purchaseDate[0], this.purchaseDate && this.purchaseDate[1], this.courseTree, this.selectedTypes)
      this.closeDialog()
    },

    closeDialog() {
      this.$emit('update:dialog', false)
    }
  }
}
</script>

<style lang="scss">
.filter-by-date__v-text-field {
  & input::placeholder {
    font-size: 14px !important;
  }

  .v-input__slot {
    height: 40px;

    fieldset {
      border: 1px solid rgba(23, 23, 41, 0.08);
    }

    .v-input__append-inner {
      margin-top: 8px !important;
    }
  }
}
</style>
