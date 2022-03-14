<template>
  <div class="add-dialog">
    <v-dialog
      v-model="dialog"
      @click:outside="closeDialog"
      max-width="800px"
    >
      <v-form @submit.prevent="addPurchase">
        <v-card
          class="px-3"
        >
          <v-card-title>
            <span class="add-dialog__header-text mt-4 mb-4">Создание заявки</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                md="6"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Имя</p>
                <v-text-field
                  v-model="purchaseUserName"
                  required
                  outlined
                  dense
                  class="add-dialog__v-text-field"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Почта</p>
                <v-text-field
                  v-model="purchaseUserEmail"
                  required
                  outlined
                  dense
                  :error-messages="
                      addPurchaseErrors.hasOwnProperty('email')
                        ? addPurchaseErrors.email
                          : ''
                    "
                  class="add-dialog__v-text-field"
                />
              </v-col>
              <v-col cols="12" sm="6" class="py-0">
                <p class="add-dialog__label-for-input">Курс</p>
                <v-select
                  :items="courses"
                  v-model="purchaseCourse"
                  item-text="title"
                  item-value="id"
                  :menu-props="{ bottom: true, offsetY: true }"
                  dense
                  class="add-dialog__v-text-field"
                  outlined
                  :disabled="!purchaseUserEmail"
                  :error-messages="
                      addPurchaseErrors.hasOwnProperty('course_id')
                        ? addPurchaseErrors.course_id
                          : ''
                    "
                  :append-icon="mdiUnfoldMoreHorizontal"
                  @change="() => {
                    if(!!this.purchaseUserEmail) {
                      this.fetchModules()
                      this.fetchGroups()
                    }
                  }"
                />
              </v-col>
              <v-col cols="12" sm="6" class="py-0">
                <p class="add-dialog__label-for-input">Группа</p>
                <v-select
                  :items="groups"
                  v-model="purchaseGroup"
                  item-text="name"
                  item-value="id"
                  :menu-props="{ bottom: true, offsetY: true }"
                  dense
                  class="add-dialog__v-text-field"
                  outlined
                  :append-icon="mdiUnfoldMoreHorizontal"
                />
              </v-col>
              <!-- <v-col
                cols="12"
                md="6"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Дата</p>
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
                      placeholder="Укажите дату"
                      class="add-dialog__v-text-field purchase-date--v-text-field"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <template v-slot:append>
                        <v-icon
                          :color="'#171729'"
                          size="20"
                        >
                          {{ mdiCalendarBlankOutline }}
                        </v-icon>
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="purchaseDate"
                    no-title
                    :first-day-of-week="1"
                    scrollable
                    locale="ru-RU"
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
              </v-col> -->
              <v-col
                cols="12"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Комментарий</p>
                <v-textarea
                  v-model="purchaseComment"
                  required
                  outlined
                  height="100"
                  no-resize
                  class="add-dialog__v-text-field"
                />
              </v-col>
              <v-col
                v-if="modules"
                cols="12"
                class="py-0"
              >
                <div
                  class="d-flex"
                >
                  <p class="add-dialog__label-for-input">Модули курса</p>
                  <p class="add-dialog__label-for-input ml-auto">Открыть доступ</p>
                </div>
                <div
                  v-for="module in modules"
                  :key="module.id"
                  class="d-flex"
                >
                  <p
                    class="add-dialog__label-for-input mr-10 mb-0 align-self-center"
                    style="font-size: 14px;width: 150px"
                  >{{module.title}}</p>
                  <v-text-field
                    v-model="module.paid"
                    required
                    outlined
                    dense
                    placeholder="Сумма"
                    class="add-dialog__v-text-field purchase-date--v-text-field align-self-center ml-auto"
                    style="max-width: 200px;min-width: 150px; height: 40px"
                  />
                  <v-radio-group
                    row
                    v-model="module.payed"
                    class="ml-auto mt-0"
                    dense
                  >
                    <v-radio
                      label="Да"
                      :ripple="false"
                      class="select-option__radio align-self-center"
                      style="color: #171729 !important;"
                      :value="true"
                    />
                    <v-radio
                      label="Нет"
                      :ripple="false"
                      :value="false"
                      class="select-option__radio align-self-center"
                      style="color: #171729 !important;"
                    />
                  </v-radio-group>
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
              :disabled="!purchaseCourse || !purchaseUserEmail || loading"
              :loading="loading"
              color="#0BC4B8"
              type="submit"
              class="text-capitalize white--text px-sm-8 py-sm-6"
            >Сохранить</v-btn>
            <v-btn
              :ripple="false"
              :elevation="0"
              color="#9FA4B1"
              class="text-capitalize white--text px-sm-8 py-sm-6 ml-5"
              @click="closeDialog"
            >Отмена</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import { mdiUnfoldMoreHorizontal, mdiCalendarBlankOutline, mdiClose } from '@mdi/js'


export default {
  name: "AddPurchaseDialog",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    courses: Array,
    // statuses: Array,
  },
  data() {
    return {
      loading: false,
      menu: false,
      addPurchaseErrors: [],
      mdiUnfoldMoreHorizontal,
      mdiClose,
      mdiCalendarBlankOutline,
      purchaseUserName: undefined,
      purchaseUserEmail: undefined,
      purchaseCourse: undefined,
      purchaseStatus: undefined,
      purchaseDate: undefined,
      purchaseComment: undefined,
      purchasePayed: undefined,
      purchaseGroup: undefined,
      modules: undefined,
      // statuses: [],
      groups: undefined
    }
  },

  methods: {
    closeDialog() {
      this.modules = undefined
      this.addPurchaseErrors = []
      this.purchaseGroup = undefined
      this.purchaseCourse = undefined
      this.purchaseUserEmail = undefined
      this.purchaseUserName = undefined
      this.purchaseComment = undefined
      this.$emit('update:dialog', false)
    },

    fetchModules() {
      this.modules = this.courses.find(course => course.id === this.purchaseCourse)?.modules
      this.modules = this.modules.map(module => {
        return {
          ...module,
          course_module_id: module.id,
          payed: false,
          paid: 0
        }
      })
    },

    async fetchGroups() {
      await this.$axios.get(`admin/purchases/courses/${this.purchaseCourse}/groups`)
        .then(res => {
          if(res && res.data) {
            this.groups = res.data
          }
        })
    },

    async saveModule(m_id, m_paid, m_payed) {
      await this.$axios.post('admin/purchases/update', {
        id: m_id,
        paid: m_paid,
        payed: m_payed,
      })
        .then(res => {
          // TODO Сделать здесь что-то
          if(res && res.data) {
            console.log(res.data)
          }
        })
    },

    async addPurchase() {
      this.loading = true
      this.addPurchaseErrors = []
      await this.$axios.post('admin/purchases/store/list', {
        first_name: this.purchaseUserName,
        email: this.purchaseUserEmail,
        course_id: this.purchaseCourse,
        stream_id: this.purchaseGroup,
        modules: this.modules
      })
        .then((res) => {
          if(res?.data?.binded_to_group) {
            console.log('check ur groups pls')
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: 'Сохранено!',
              color: 'success'
            })
          } else {
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: 'Заявка сохранена, но студент не был добавлен в группу!',
              color: 'yellow'
            })
          }
          this.$emit('update-purchases')
          this.closeDialog()
        })
        .catch(err => {
          if (err.response && err.response.data && err.response.data.errors) {
            this.addPurchaseErrors = err.response.data.errors
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss">
.payed-radio--clear {
  &::after {
    background-color: transparent !important;
  }
}

.purchase-date--v-text-field input::placeholder {
  font-size: 14px !important;
}
</style>
