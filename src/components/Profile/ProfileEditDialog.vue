<template>
  <CustomModal
    :value="value"
    :title="'Редактировать профиль'"
    @close="closeDialog"
  >
    <div class="profile-edit__dialog">
      <v-avatar size="60">
        <v-img
          :src="avatar || UserPlaceholderSm"
        />
      </v-avatar>
      <div>
        <h4 class="profile-edit__dialog__name">
          {{ full_name }}
        </h4>
        <span v-if="email" class="profile-edit__dialog__email">{{ email }}</span>
      </div>
    </div>
    <v-form @submit.prevent="handleSave">
      <div class="profile-edit__form">
        <div>
          <p class="profile-edit__dialog__label">Имя</p>
          <v-text-field
            v-model="user.first_name"
            outlined
            dense
            height="48"
            class="profile-edit__dialog__input"
          />
        </div>
        <div>
          <p class="profile-edit__dialog__label">Фамилия</p>
          <v-text-field
            v-model="user.last_name"
            outlined
            dense
            height="48"
            class="profile-edit__dialog__input"
          />
        </div>
        <div>
          <p class="profile-edit__dialog__label">Никнейм</p>
          <v-text-field
            v-model="user.nickname"
            outlined
            dense
            height="48"
            class="profile-edit__dialog__input"
            :error-messages="errors.nickname"
          />
        </div>
        <div v-if="!email">
          <p class="profile-edit__dialog__label">Почта</p>
          <v-text-field
            v-model="user.email"
            outlined
            dense
            height="48"
            placeholder="Введите Вашу почту"
            class="profile-edit__dialog__input"
            :error-messages="errors.email"
          />
        </div>
        <div>
          <p class="profile-edit__dialog__label">Номер телефона</p>
          <v-text-field
            v-model="user.phone"
            outlined
            dense
            height="48"
            class="profile-edit__dialog__input"
            v-mask="mask_"
            :error-messages="errors.phone"
          />
        </div>
        <template v-if="isTeacher">
          <div class="mb-4">
            <p class="profile-edit__dialog__label mb-6">Ссылки</p>
            <div class="d-flex align-center mb-4">
              <v-icon class="mr-4" size="28" color="#0E76A8">{{ mdiLinkedin }}</v-icon>
              <v-text-field
                v-model="user.linked_in"
                outlined
                dense
                height="48"
                class="profile-edit__dialog__input"
                hide-details
              />
            </div>
            <div class="d-flex align-center">
              <v-icon class="mr-4" size="28" color="#171515">{{ mdiGithub }}</v-icon>
              <v-text-field
                v-model="user.github"
                outlined
                dense
                height="48"
                class="profile-edit__dialog__input"
                hide-details
              />
            </div>
          </div>
        </template>
      </div>
      <v-btn
        class="success align-self-baseline font-weight-medium text-none mt-6"
        x-large
        type="submit"
        elevation="0"
        :ripple="false"
        width="260"
        :loading="loading"
        :disabled="!user.phone || !user.first_name || !user.email"
      >
        Сохранить
      </v-btn>
    </v-form>
  </CustomModal>
</template>

<script>
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png';
import { mdiLinkedin, mdiGithub } from '@mdi/js'
import CustomModal from "@/components/CustomModal";

export default {
  name: "ProfileEditDialog",
  components: { CustomModal },
  props: {
    isTeacher: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    },
    first_name: String,
    last_name: String,
    full_name: String,
    nickname: String,
    avatar: String,
    email: String,
    phone: String,
    mask: String,
    loading: Boolean,
    linked_in: String,
    github: String,
    errors: {
      type: [Object, Array, String],
      default: () => ({})
    }
  },
  data() {
    return {
      mdiLinkedin,
      mdiGithub,
      UserPlaceholderSm,
      user: {
        first_name: undefined,
        last_name: undefined,
        linked_in: undefined,
        nickname: undefined,
        github: undefined,
        phone: undefined,
        email: undefined
      },
      mask_: undefined
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        if(newValue) {
          this.user.first_name = this.first_name
          this.user.last_name = this.last_name
          this.user.linked_in = this.linked_in
          this.user.nickname = this.nickname
          this.user.github = this.github
          this.user.email = this.email
          this.user.phone = this.phone
          this.$nextTick(() => this.mask_ = this.mask || '+#(###)###-##-##')
        }
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:value', false)
      this.$emit('update:errors', {})
      this.mask_ = undefined
      this.user = {
        first_name: undefined,
        last_name: undefined,
        linked_in: undefined,
        nickname: undefined,
        github: undefined,
        phone: undefined,
        email: undefined,
      }
    },

    handleSave() {
      this.$emit('save', this.user)
    }
  }
}
</script>
