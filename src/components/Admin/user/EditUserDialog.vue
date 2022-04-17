<template>
  <div class="add-dialog">
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        v-if="user"
        @click:outside="closeDialog"
        max-width="700px"
      >
        <v-form @submit.prevent="editUser">
          <v-card class="px-4">
            <v-card-title>
              <span class="add-dialog__header-text mt-4 mb-4"
                >Редактирование пользователя</span
              >
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6" class="py-0">
                  <p
                    class="mb-0"
                    style="font-size: 12px; line-height: 24px; letter-spacing: 0.02em; font-weight: 600;"
                  >
                    Имя
                  </p>
                  <v-text-field
                    v-model="user.first_name"
                    required
                    outlined
                    dense
                    :error-messages="
                      editUserErrors.hasOwnProperty('first_name')
                        ? editUserErrors.first_name
                        : ''
                    "
                    class="add-dialog__v-text-field"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" class="py-0">
                  <p
                    class="mb-0"
                    style="font-size: 12px; line-height: 24px; letter-spacing: 0.02em; font-weight: 600;"
                  >
                    Фамилия
                  </p>
                  <v-text-field
                    v-model="user.last_name"
                    required
                    outlined
                    dense
                    class="add-dialog__v-text-field"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-0">
                  <p
                    class="mb-0"
                    style="font-size: 12px; line-height: 24px; letter-spacing: 0.02em; font-weight: 600;"
                  >
                    Контактный телефон
                  </p>
                  <v-text-field
                    v-model="user.phone"
                    v-mask="'+ # (###) ###-##-##'"
                    required
                    outlined
                    dense
                    :error-messages="
                      editUserErrors.hasOwnProperty('phone')
                        ? editUserErrors.phone.length > 1
                          ? editUserErrors.phone[1]
                          : editUserErrors.phone
                        : ''
                    "
                    class="add-dialog__v-text-field"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" class="py-0">
                  <p
                    class="mb-0"
                    style="font-size: 12px; line-height: 24px; letter-spacing: 0.02em; font-weight: 600;"
                  >
                    Почта
                  </p>
                  <v-text-field
                    v-model="user.email"
                    required
                    outlined
                    dense
                    :error-messages="
                      editUserErrors.hasOwnProperty('email')
                        ? editUserErrors.email.length > 1
                          ? editUserErrors.email[1]
                          : editUserErrors.email
                        : ''
                    "
                    class="add-dialog__v-text-field"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" class="py-0">
                  <p
                    class="mb-0"
                    style="font-size: 12px; line-height: 24px; letter-spacing: 0.02em; font-weight: 600;"
                  >
                    Роль
                  </p>
                  <v-select
                    :items="roles"
                    v-model="user.role_id"
                    item-text="name"
                    item-value="id"
                    :menu-props="{ bottom: true, offsetY: true }"
                    dense
                    class="add-dialog__v-text-field"
                    outlined
                    :color="'#4376FB'"
                    :item-color="'asdasdf'"
                    :append-icon="mdiUnfoldMoreHorizontal"
                  ></v-select>
                </v-col>
                <v-col cols="12" class="py-0">
                  <p
                    class="mb-0"
                    style="font-size: 12px; line-height: 24px; letter-spacing: 0.02em; font-weight: 600;"
                  >
                    Пароль
                  </p>
                  <v-text-field
                    v-model="userPassword"
                    required
                    outlined
                    dense
                    class="add-dialog__v-text-field__password"
                  >
                    <template v-slot:append>
                      <v-btn
                        class="text-capitalize"
                        large
                        height="40"
                        :ripple="false"
                        elevation="0"
                        :disabled="!userPassword"
                        @click="editUser"
                      >
                        Изменить
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col class="pt-0">
                  <v-checkbox
                    v-model="user.is_test"
                    dense
                    hide-details
                    color="#4376FB"
                    :ripple="false"
                    :label="'Тестовый пользователь'"
                    class="font-weight-medium add-user-dialog__checkbox"
                  />
                </v-col>
                <v-col class="pt-0" cols="12" sm="6">
                  <v-checkbox
                    v-model="emailVerified"
                    :disabled="user.email_verified_at ? true : false"
                    dense
                    color="#4376FB"
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
                  !user.email || !user.first_name || !user.phone || loading
                "
                color="#4376FB"
                :loading="loading"
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
  name: 'EditUserDialog',
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
    user_id: [Number, String],
  },
  data() {
    return {
      editUserErrors: [],
      user: undefined,
      mdiUnfoldMoreHorizontal,
      userPassword: undefined,
      emailVerified: undefined,
      loading: false,
    }
  },

  watch: {
    dialog: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue && newValue) {
          this.fetchUser()
        }
      },
      immediate: true,
    },
  },

  methods: {
    closeDialog() {
      this.$emit('close-dialog')
      this.editUserErrors = []
      this.user = undefined
      this.userPassword = undefined
    },

    async fetchUser() {
      await this.$axios
        .get('admin/users/' + this.user_id + '/edit')
        .then((res) => {
          if (res && res.data) {
            this.user = res.data
            this.emailVerified = res.data.email_verified_at ? true : false
          }
        })
    },

    async editUser() {
      this.editUserErrors = []
      this.loading = true
      await this.$axios
        .put('admin/users/' + this.user_id, {
          first_name: this.user.first_name,
          last_name: this.user.last_name,
          phone: this.user.phone.replace(/[^0-9.]/g, ''),
          role_id: this.user.role_id,
          email: this.user.email,
          password: this.userPassword,
          is_test: this.user.is_test,
          email_verified_at: this.emailVerified ? true : null,
        })
        .then((res) => {
          if (res) {
            this.$emit('fetch-users')
            this.closeDialog()
          }
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.errors) {
            this.editUserErrors = err.response.data.errors
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
