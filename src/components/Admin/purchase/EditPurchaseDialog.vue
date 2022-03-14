<template>
  <v-dialog
    v-if="editUser"
    v-model="dialog"
    @click:outside="closeDialog"
    max-width="800px"
  >
    <v-form @submit.prevent="editPurchase">
      <v-card
        class="px-3"
      >
        <v-card-title>
          <span class="add-dialog__header-text mt-4 mb-4">Редактирование заявки</span>
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
                v-model="editUser.first_name"
                required
                outlined
                dense
                :disabled="true"
                class="add-dialog__v-text-field"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="6"
              class="py-0"
            >
              <p class="add-dialog__label-for-input">Почта</p>
              <v-text-field
                v-model="editUser.email"
                required
                outlined
                readonly
                :disabled="true"
                dense
                class="add-dialog__v-text-field"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" class="py-0">
              <p class="add-dialog__label-for-input">Курс</p>
              <v-select
                :items="courses"
                v-model="currentCourse.id"
                item-text="title"
                item-value="id"
                :menu-props="{ bottom: true, offsetY: true }"
                dense
                class="add-dialog__v-text-field"
                outlined
                :append-icon="mdiUnfoldMoreHorizontal"
                :disabled="true"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" class="py-0">
              <p class="add-dialog__label-for-input">Группа</p>
              <v-select
                :items="groups"
                v-model="currentGroup"
                item-text="name"
                item-value="id"
                :menu-props="{ bottom: true, offsetY: true }"
                dense
                class="add-dialog__v-text-field"
                outlined
                :append-icon="mdiUnfoldMoreHorizontal"
              >
              </v-select>
            </v-col>
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
              >
              </v-textarea>
            </v-col>
            <v-col cols="12">
              <p class="add-dialog__label-for-input">Оплата</p>
              <v-text-field
                v-model="purchasePaymentLink"
                placeholder="Ссылка не сгенерирована"
                outlined
                readonly
                :error-messages="errorPaymentLink"
              >
                <template
                  v-if="purchasePaymentLink"
                  v-slot:append
                >
                  <v-tooltip
                    bottom
                  >
                    <template
                      v-slot:activator="{ on }"
                    >
                      <v-btn
                        v-on="on"
                        text
                        icon
                        @click="handleCopyClick"
                      >
                        <v-icon>{{ mdiContentCopy }}</v-icon>
                      </v-btn>
                    </template>
                    Копировать
                  </v-tooltip>
                </template>
                <template v-slot:append-outer>
                  <v-btn
                    @click="generatePaymentLink"
                    :ripple="false"
                    :disabled="loadingPaymentLink"
                  >
                    Сгенерить
                  </v-btn>
                </template>
              </v-text-field>
              <!-- :error-messages="" -->
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
                >{{ module.module.title }}</p>
                <v-text-field
                  v-model="module.paid"
                  required
                  outlined
                  dense
                  placeholder="Сумма"
                  class="add-dialog__v-text-field purchase-date--v-text-field align-self-center ml-auto"
                  style="max-width: 200px;min-width: 150px; height: 40px"
                ></v-text-field>
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
                  ></v-radio>
                  <v-radio
                    label="Нет"
                    :ripple="false"
                    :value="false"
                    class="select-option__radio align-self-center"
                    style="color: #171729 !important;"
                  ></v-radio>
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
</template>

<script>
import {
  mdiUnfoldMoreHorizontal,
  mdiCalendarBlankOutline,
  mdiClose,
  mdiContentCopy,
} from '@mdi/js';

export default {
  name: "EditPurchaseDialog",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    purchase_id: [Number, String],
    user: Object,
    courses: Array,
    currentCourse: Object,
  },
  data() {
    return {
      mdiUnfoldMoreHorizontal,
      mdiCalendarBlankOutline,
      mdiClose,
      mdiContentCopy,
      errorPaymentLink: undefined,
      loading: false,
      loadingPaymentLink: false,
      menu: false,
      addPurchaseErrors: [],
      purchaseStatus: undefined,
      purchaseDate: undefined,
      purchaseComment: undefined,
      purchasePayed: undefined,
      purchasePaymentLink: undefined,
      statuses: [],
      modules: undefined,
      groups: undefined,
      currentGroup: undefined,
      editUser: undefined,
    }
  },

  watch: {
    dialog: {
      handler(newValue, oldValue) {
        if(newValue !== oldValue && newValue) {
          this.errorPaymentLink = undefined;
          this.purchasePaymentLink = undefined;
          this.loadingPaymentLink = undefined;
          this.editUser = { ...this.user }
          this.editCourse = { ...this.currentCourse }
          this.fetchPurchase()
          this.fetchGroups()
        }
      },
      immediate: true
    }
  },

  methods: {
    closeDialog() {
      this.$emit('update:dialog', false)
      this.editUser = undefined
      this.modules = undefined
    },

    async fetchPurchase() {
      await this.$axios.get('admin/purchases/' + this.purchase_id + '/edit')
        .then(res => {
          if(res && res.data) {
            this.modules = res?.data?.sort(function (a, b) {
              if (a.module?.order > b.module?.order ) {
                return 1;
              }
              if (a.module?.order  < b.module?.order ) {
                return -1;
              }
              return 0;
            }) || undefined;
            this.currentGroup = res.data && res.data[0] && res.data[0].group_id
          }
        })
    },

    async fetchGroups() {
      await this.$axios.get(`admin/purchases/courses/${this.currentCourse.id}/groups`)
        .then(res => {
          if(res && res.data) {
            this.groups = res.data
          }
        })
    },

    async editPurchase() {
      this.loading = true
      this.addPurchaseErrors = []
      await this.$axios.post('admin/purchases/store/list', {
        first_name: this.editUser.first_name,
        email: this.editUser.email,
        course_id: this.currentCourse.id,
        stream_id: this.currentGroup,
        modules: this.modules
      })
        .then(() => {
          this.$store.dispatch('snackbar/START_SNACKBAR', {
            text: 'Сохранено!',
            color: 'success'
          })
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
    },

    generatePaymentLink() {
      this.loadingPaymentLink = true;
      this.$axios.post('/init-purchase', {
        purchase_id: this.purchase_id
      }).then((res) => {
        if(res?.data?.url) {
          this.purchasePaymentLink = res.data.url;
        } else {
          throw Error("В ответе нет URL :(")
        }
      }).catch((err) => {
        this.errorPaymentLink = err.message;
      }).finally(() => {
        this.loadingPaymentLink = false;
      })
    },
    // Not working (yet)
    handleCopyClick(event) {
      console.log(event);
      var copyText = document.getElementById("myInput");
      copyText.select();
      copyText.setSelectionRange(0, 99999); /* For mobile devices */
      document.execCommand("copy");
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
