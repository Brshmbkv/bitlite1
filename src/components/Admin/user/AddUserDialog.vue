<template>
  <div class="add-dialog">
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="700px">
        <v-form @submit.prevent="addUser">
          <v-card>
            <v-card-title>
              <span class="add-dialog__header-text mt-4 mb-4"
                >Новый пользователь</span
              >
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6" class="py-0">
                  <p class="add-dialog__label-for-input">Имя</p>
                  <v-text-field
                    v-model="addUserFirstName"
                    required
                    outlined
                    dense
                    :error-messages="
                      addUserErrors.hasOwnProperty('first_name')
                        ? addUserErrors.first_name
                        : ''
                    "
                    class="add-dialog__v-text-field"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" class="py-0">
                  <p class="add-dialog__label-for-input">Фамилия</p>
                  <v-text-field
                    v-model="addUserLastName"
                    required
                    outlined
                    dense
                    class="add-dialog__v-text-field"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-0">
                  <p class="add-dialog__label-for-input">Контактный телефон</p>
                  <v-text-field
                    v-model="addUserPhone"
                    v-mask="'+ 7 (###) ###-##-##'"
                    required
                    outlined
                    dense
                    :error-messages="
                      addUserErrors.hasOwnProperty('phone')
                        ? addUserErrors.phone.length > 1
                          ? addUserErrors.phone[1]
                          : addUserErrors.phone
                        : ''
                    "
                    class="add-dialog__v-text-field"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" class="py-0">
                  <p class="add-dialog__label-for-input">Почта</p>
                  <v-text-field
                    v-model="addUserEmail"
                    required
                    outlined
                    dense
                    :error-messages="
                      addUserErrors.hasOwnProperty('email')
                        ? addUserErrors.email.length > 1
                          ? addUserErrors.email[1]
                          : addUserErrors.email
                        : ''
                    "
                    class="add-dialog__v-text-field"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" class="py-0">
                  <p class="add-dialog__label-for-input">Роль</p>
                  <v-select
                    :items="roles"
                    v-model="roleID"
                    item-text="name"
                    item-value="id"
                    :menu-props="{ bottom: true, offsetY: true }"
                    dense
                    class="add-dialog__v-text-field"
                    outlined
                    :append-icon="mdiUnfoldMoreHorizontal"
                  ></v-select>
                </v-col>
                <v-col cols="12" class="py-0">
                  <p class="add-dialog__label-for-input">Пароль</p>
                  <v-text-field
                    v-model="addUserPassword"
                    required
                    outlined
                    dense
                    class="add-dialog__v-text-field__password"
                  >
                    <template v-slot:append>
                      <v-btn
                        class="text-none"
                        large
                        height="40"
                        :ripple="false"
                        elevation="0"
                        :disabled="!addUserPassword"
                      >
                        изменить
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col class="pt-0" cols="12" sm="6">
                  <v-checkbox
                    v-model="addUserIsTest"
                    dense
                    hide-details
                    :ripple="false"
                    :label="'Тестовый пользователь'"
                    class="font-weight-medium add-user-dialog__checkbox"
                  />
                </v-col>
                <v-col class="pt-0" cols="12" sm="6">
                  <v-checkbox
                    v-model="addUserIsEmailVerified"
                    dense
                    hide-details
                    :ripple="false"
                    :label="'Почта подтверждена'"
                    class="font-weight-medium add-user-dialog__checkbox"
                  />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="justify-end mr-4 pb-5">
              <v-btn
                :ripple="false"
                :elevation="0"
                :disabled="
                  !addUserEmail || !addUserFirstName || !addUserPhone || loading
                "
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
    </v-row>
  </div>
</template>

<script>
import { mdiUnfoldMoreHorizontal } from '@mdi/js'

export default {
  name: 'AddUserDialog',
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default() {
        return []
      },
    },
    currentRoleId: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      loading: false,
      addUserErrors: [],
      mdiUnfoldMoreHorizontal,
      addUserFirstName: '',
      addUserLastName: '',
      addUserPhone: '',
      addUserEmail: '',
      addUserPassword: '',
      addUserIsTest: false,
      addUserIsEmailVerified: false,
      roleID: undefined,
    }
  },

  watch: {
    currentRoleId: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.roleID = this.currentRoleId
        }
      },
      immediate: true,
    },
  },

  methods: {
    closeDialog() {
      this.$emit('close-dialog')
      this.addUserErrors = []
    },

    async addUser() {
      this.addUserErrors = []
      this.loading = true
      await this.$axios
        .post('admin/users', {
          first_name: this.addUserFirstName,
          last_name: this.addUserLastName,
          phone: this.addUserPhone.replace(/[^0-9.]/g, ''),
          role_id: this.roleID,
          email: this.addUserEmail,
          password: this.addUserPassword,
          is_test: this.addUserIsTest,
          email_verified_at: this.addUserIsEmailVerified
            ? this.addUserIsEmailVerified
            : null,
        })
        .then((res) => {
          if (res) {
            this.closeDialog()
            this.$emit('fetch-users')
          }
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.errors) {
            this.addUserErrors = err.response.data.errors
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style lang="scss">
.add-user-dialog__checkbox {
  .v-label {
    color: #171729;
  }
}
</style>
