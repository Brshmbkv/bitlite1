<template>
  <div>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="350"
    >
      <v-card class="pa-3">
        <v-card-title style="font-weight: 700; font-size: 24px" class="pb-6">
          Оставить заявку
        </v-card-title>
        <v-card-text style="color: #171729" class="pb-2">
          <v-form
            v-model="valid"
            ref="form"
          >
            <p style="font-size: 16px; font-weight: 500" class="mb-2">ФИО</p>
            <v-text-field
              v-model="full_name"
              required
              outlined
              dense
              :rules="[rules.required]"
              class="purchase-request__input"
            ></v-text-field>
            <p style="font-size: 16px; font-weight: 500" class="mb-2">Номер телефона</p>
            <v-text-field
              v-if="user_phone"
              :value="user_phone"
              @change="user_phone = $event"
              required
              outlined
              placeholder="+7 (7XX) XXX-XX-XX"
              dense
              :rules="[rules.required, rules.phone]"
              v-mask="'+ # (###) ###-##-##'"
              class="purchase-request__input"
            ></v-text-field>
            <p style="font-size: 16px; font-weight: 500" class="mb-2">E-mail</p>
            <v-text-field
              v-model="user_email"
              required
              outlined
              dense
              placeholder="example@gmail.com"
              :rules="[rules.required, rules.email]"
              class="purchase-request__input"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-space-between mb-4 px-6">
          <v-btn
            :ripple="false"
            large
            color="#0BC3B8"
            :disabled="!valid || (!user_email || !user_phone || !full_name)"
            elevation="0"
            @click="checkForm"
            class="text-none white--text px-6"
            :loading="loading"
          >
            Отправить
          </v-btn>
          <v-btn
            :ripple="false"
            large
            color="#9FA4B1"
            elevation="0"
            class="text-none white--text px-6"
            @click="closeDialog"
          >
            Отмена
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <purchase-request-success
      :dialog.sync="success_dialog"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PurchaseRequestSuccess from "@/components/Purchase/PurchaseRequestSuccess";

export default {
  name: "PurchaseRequestDialog",
  components: { PurchaseRequestSuccess },
  props: {
    dialog: Boolean,
    stream_id: Number,
    course_id: Number,
  },
  data() {
    return {
      loading: false,
      valid: false,
      success_dialog: false,
      full_name: undefined,
      user_phone: undefined,
      user_email: undefined,
      rules: {
        required: v => !!v || 'Заполните поле!',
        phone: v => !!v && v.length === 19 || 'Неверно введен номер телефона',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Неккоректный e-mail'
        },
      }
    }
  },
  computed: {
    ...mapState('user', ['name', 'surname', 'phone', 'email'])
  },
  watch: {
    dialog: {
      immediate: true,
      handler(newVal, oldVal) {
        if(newVal !== oldVal && newVal) {
          this.full_name = `${ this.name } ${ this.surname }`
          this.user_phone = this.phone
          this.user_email = this.email
        }
      }
    }
  },
  methods: {
    async sendRequest() {
      this.loading = true
      await this.$axios.post('purchase', {
        first_name: this.full_name,
        phone: this.user_phone,
        course_id: this.course_id,
        stream_id: this.stream_id
      }).catch(() => {
        this.$store.dispatch('snackbar/START_SNACKBAR', {
          text: 'Возникла ошибка!',
          color: 'red'
        })
      })
    },

    checkForm() {
      this.$refs.form.validate()
      if(this.valid) {
        this.sendRequest()
          .then(() => {
            this.success_dialog = true
            this.$emit('update:dialog', false)
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.$store.dispatch('snackbar/START_SNACKBAR', {
          text: 'Данные заполнены неправильно!',
          color: 'red'
        })
      }
    },

    closeDialog() {
      this.user_phone = undefined
      this.user_email = undefined
      this.full_name = undefined
      this.$emit('update:dialog', false)
    }
  }
}
</script>

<style lang="scss">
.purchase-request__input:not(.v-input--is-focused, .error--text) {
  .v-input__slot {
    fieldset {
      border: 1px solid rgba(23, 23, 41, 0.15);
    }
  }
}
</style>
