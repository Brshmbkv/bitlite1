<template>
  <v-container class="mt-3 mb-5">
    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <div class="teacher-profile__col pa-5">
          <div>
            <input
              type="file"
              ref="avatarInput"
              name="avatar"
              accept="image/*"
              style="display: none"
              :disabled="loading"
              @change="handleAvatarChange($event)"
            />
            <v-avatar
              color="#F8F8F8"
              size="150"
              @click="$refs.avatarInput.click()"
              class="mx-auto profile__avatar"
            >
              <v-img :src="avatar || UserPlaceholderMd"/>
              <v-btn
                absolute
                fab
                small
                :ripple="false"
                elevation="0"
                style="top: 0; right: 0; border: 2px solid #FFFFFF"
                :color="'#0BC3B8'"
              >
                <v-icon color="#FFFFFF">
                  {{ mdiPencil }}
                </v-icon>
              </v-btn>
            </v-avatar>
          </div>
          <div class="mt-3">
            <h3>{{ loading ? 'Пользователь' : full_name }}</h3>
            <p v-if="nickname" class="profile__info-text text-center">@{{ nickname }}</p>
          </div>
          <div class="align-self-start mt-4">
            <p class="teacher-profile__section-text">КОНТАКТЫ</p>
            <p v-if="field_phone" class="profile__info-text">
              <v-icon size="16" class="mr-2">{{ mdiCellphone }}</v-icon>
              {{ field_phone | VMask('+#(###)###-##-##') }}
            </p>
            <p v-if="field_email" class="profile__info-text">
              <v-icon size="16" class="mr-2">{{ mdiEmail }}</v-icon>
              {{ field_email }}
            </p>
          </div>
          <div class="align-self-start mt-4" style="width: 100%" v-if="linked_in || github">
            <p class="teacher-profile__section-text">ССЫЛКИ</p>
            <div class="d-flex flex-column">
              <div class="teacher-profile__link mb-2" v-if="linked_in" @click="openLink(linked_in)">
                <v-icon class="mr-1" size="26" color="#0E76A8">{{ mdiLinkedin }}</v-icon>
                <span class="teacher-profile__link__text">{{ 'LinkedIn' }}</span>
                <v-icon color="#9FA8B3" class="teacher-profile__link__append-icon" size="20">{{ mdiOpenInNew }}</v-icon>
              </div>
              <div class="teacher-profile__link mb-2" v-if="github" @click="openLink(github)">
                <v-icon class="mr-1" size="26" color="#171515">{{ mdiGithub }}</v-icon>
                <span class="teacher-profile__link__text">{{ 'GitHub' }}</span>
                <v-icon color="#9FA8B3" class="teacher-profile__link__append-icon" size="20">{{ mdiOpenInNew }}</v-icon>
              </div>
            </div>
          </div>
          <v-divider class="align-self-stretch mt-3 mb-5"/>
          <div class="d-flex flex-column align-self-stretch mb-2">
            <v-btn
              large
              class="text-none mb-4"
              :ripple="false"
              color="success"
              elevation="0"
              :disabled="loading"
              @click="edit_dialog = true"
              style="border-radius: 5px"
            >
              <v-icon class="mr-2">
                {{ mdiPencil }}
              </v-icon>
              Редактировать
            </v-btn>
            <v-btn
              large
              class="text-none"
              :ripple="false"
              color="success"
              elevation="0"
              outlined
              :disabled="loading"
              :to="{
                name: 'TeacherProfileSettings'
              }"
              style="border-radius: 5px"
            >
              <v-icon class="mr-2">
                {{ mdiCog }}
              </v-icon>
              Настройки
            </v-btn>
          </div>
        </div>
      </v-col>
      <v-col
        cols="12"
        md="8"
        sm="6"
      >
        <div class="teacher-profile__col align-self-stretch pa-1">
          <div class="teacher-profile__courses__header">
            Я преподаю
          </div>
          <div class="teacher-profile__courses">
            <template v-if="loading">
              <div class="d-flex justify-center align-self-stretch">
                <v-progress-circular indeterminate/>
              </div>
            </template>
            <template v-else-if="courses.length">
              <div
                v-for="course in courses"
                :key="course.id"
                class="teacher-profile__courses-item"
              >
                <div class="teacher-profile__courses-item__icon-container">
                  <component
                    :is="logo(course.id)"
                    class="teacher-profile__courses-item__icon"
                  />
                </div>
                <h4 class="teacher-profile__courses-item__title text-truncate">{{ course.title }}</h4>
              </div>
            </template>
            <template v-else>
              <div class="d-flex justify-center align-self-stretch">
                <h4>Ничего</h4>
              </div>
            </template>
            <!--            <div class="teacher-profile__courses-item">-->
            <!--              <div class="teacher-profile__courses-item__icon-container">-->
            <!--                <component-->
            <!--                  :is="logo(3)"-->
            <!--                  class="teacher-profile__courses-item__icon"-->
            <!--                />-->
            <!--              </div>-->
            <!--              <h4 class="teacher-profile__courses-item__title">{{ 'Java EE' }}</h4>-->
            <!--            </div>-->
          </div>
        </div>
      </v-col>
    </v-row>

    <ProfileEditDialog
      is-teacher
      :value.sync="edit_dialog"
      :avatar="avatar || UserPlaceholderMd"
      :full_name="full_name"
      :nickname="field_nickname"
      :email="field_email"
      :last_name="field_last_name"
      :first_name="field_first_name"
      :phone="field_phone"
      :errors="error_messages"
      :github="github"
      :linked_in="linked_in"
      :loading="edit_loading"
      :mask="mask"
      @save="changeInfo"
    />

    <v-dialog
      v-model="avatarCropperModal"
      :persistent="loading"
      max-width="640"
    >
      <v-card style="overflow: hidden">
        <div v-show="!loading" class="cropper-wrapper">
          <div
            :style="{ backgroundImage: 'url(' + avatarFile + ')' }"
            class="cropper-background"
          ></div>
          <Cropper
            v-if="avatarFile"
            ref="cropper"
            :src="avatarFile"
            :stencil-component="$options.components.CircleStencil"
            :stencil-props="{
              handlers: {},
              movable: false,
              scalable: false,
              aspectRatio: 1,
            }"
            image-restriction="stencil"
          />
        </div>
        <v-card-text class="pt-3 text-center" v-if="loading">
          Загрузка изображения
          <v-progress-linear
            indeterminate
            color="#0bc4b8"
            class="mt-2"
          ></v-progress-linear>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
            color="green darken-1"
            text
            :disabled="loading"
            @click="handleAvatarCropperCancel"
          >Отмена
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            :disabled="loading"
            @click="handleAvatarCropperSave"
          >Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { CircleStencil, Cropper } from "vue-advanced-cropper";
import { mapState } from "vuex";
import UserPlaceholderMd from "@/assets/user_placeholder_md.png";
import { mdiPencil, mdiCellphone, mdiEmail, mdiCog, mdiGithub, mdiLinkedin, mdiOpenInNew } from '@mdi/js'

export default {
  name: "TeacherProfile",
  components: {
    ProfileEditDialog: () => import('@/components/Profile/ProfileEditDialog'),
    CircleStencil, // eslint-disable-line vue/no-unused-components
    Cropper,
  },
  data() {
    return {
      UserPlaceholderMd,
      mdiOpenInNew,
      mdiCellphone,
      mdiLinkedin,
      mdiGithub,
      mdiPencil,
      mdiEmail,
      mdiCog,
      avatarCropperModal: false,
      avatarFile: undefined,
      avatarUploaded: false,
      error: false,
      error_messages: [],
      full_name: "",
      field_first_name: "",
      field_nickname: "",
      field_phone: "",
      field_last_name: "",
      field_email: "",
      field_role: "",
      loading: true,
      edit_loading: false,
      mask: "+#(###)###-##-##",
      edit_dialog: false,
      courses: [],
    };
  },
  computed: {
    ...mapState("user", ["phone", "avatar", "settings", "nickname", "linked_in", "github"]),
  },
  mounted() {
    // fetch store values before edit
    this.$nextTick(() => {
      this.$store.dispatch("breadcrumbs/setLinks", [
        {
          text: 'Личный кабинет',
        },
      ]);
    })
    this.getUserFromStore()
    this.fetchProfile().finally(() => this.loading = false)
    // this.store.commit("")

  },
  methods: {
    getUserFromStore() {
      this.loading = true
      this.$store.dispatch("user/getUser")
        .then(() => {
          this.field_first_name = this.$store.state.user.name;
          this.field_last_name = this.$store.state.user.surname;
          this.field_nickname = this.$store.state.user.nickname;
          this.field_phone = this.$store.state.user.phone;
          this.field_email = this.$store.state.user.email;
          this.field_role = this.$store.state.user.role;
          this.full_name = `${ this.field_first_name || '' } ${ this.field_last_name || '' }`
        }, (rej) => {
          this.loading = false;
          console.warn("User info was not updated :( ", rej);
        })
        .catch((err) => {
          this.loading = false;
          console.error("Error in 'user' dispatching: ", err);
        })
        .finally(() => {
          this.$nextTick(() => this.mask = "+#(###)###-##-##");
        });
    },

    logo(icon) {
      return {
        4: require('@/assets/svg/catalog_python.svg'),
        2: require('@/assets/svg/catalog_java.svg'),
        7: require('@/assets/svg/catalog_java.svg'),
        3: require('@/assets/svg/catalog_cpp.svg'),
        6: require('@/assets/svg/catalog_php.svg'),
        8: require('@/assets/svg/catalog_ios.svg'),
        9: require('@/assets/svg/catalog_php.svg')
      }[icon]
    },

    async fetchProfile() {
      try {
        const res = await this.$axios('profile')
        this.courses = res?.data?.courses || []
      } catch(e) {
        throw new Error(e)
      }
    },

    changeInfo(user) {
      this.edit_loading = true;
      this.error = false;
      const {
        first_name,
        last_name,
        nickname,
        email,
        phone,
        linked_in,
        github
      } = user;
      // console.log(field_first_name, field_phone, field_last_name, field_email);
      this.$store.dispatch("user/updateInfo", {
        ...(first_name && { first_name: first_name }),
        ...(phone && { phone: phone.replace(/[^0-9.]/g, "") }),
        ...(last_name && { last_name: last_name }),
        ...((nickname || nickname === '') && { nickname: nickname }),
        ...(email && { email: email }),
        ...(this.field_role && { role: this.field_role }),
        ...(linked_in && { linked_in }),
        ...(github && { github }),
      }).then(() => {
        this.getUserFromStore()
        this.edit_dialog = false
        this.$store.dispatch('snackbar/START_SNACKBAR', {
          text: 'Данные успешно изменены!',
          color: 'success'
        })
      }).catch((err) => {
        this.error = true;
        this.error_messages = err
        console.error('err', err);
        if(err.first_name || err.last_name) {
          this.$store.dispatch('snackbar/START_SNACKBAR', {
            text: 'Превышен максимум допустимых символов!',
            color: 'red'
          })
        } else {
          this.$store.dispatch('snackbar/START_SNACKBAR', {
            text: 'Произошла ошибка!',
            color: 'red'
          })
        }
      }).finally(() => {
        this.edit_loading = false;
      });
    },

    handleAvatarChange(event) {
      let input = event.target;
      if(input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = (e) => {
          // console.log(e.target.result);
          // this.imageFile = e.target.result;
          this.avatarFile = e.target.result;
          this.avatarCropperModal = true;
          this.$nextTick(() => {
            this.$refs.cropper.refresh();
          });
        };
        reader.readAsDataURL(input.files[0]);
      }
    },

    async requestAvatarChange(blob) {
      this.loading = true;
      this.error = false;
      let formData = new FormData();
      formData.append("file", blob);
      await this.$axios
        .post("/profile/upload-avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          // console.log("avatar upload: ", res);
          if(res) {
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: 'Аватар изменен!',
              color: 'success'
            })
            this.$store.dispatch("user/getUser");
          }
        })
        .catch((err) => {
          this.error = true;
          this.$store.dispatch('snackbar/START_SNACKBAR', {
            text: err,
            color: 'red'
          })
        })
        .finally(() => {
          this.loading = false;
          this.avatarCropperModal = false;
          this.avatarFile = undefined;
          this.$refs.avatarInput.value = null;
        });
    },

    handleAvatarCropperSave() {
      const { canvas } = this.$refs.cropper.getResult();
      // console.log(canvas)
      // canvas.width = 200;
      // canvas.height = 200;

      if(canvas) {
        // const form = new FormData();
        canvas.toBlob((blob) => {
          // form.append('file', blob);
          this.requestAvatarChange(blob).finally(() => {
            this.avatarCropperModal = false;
          });
          // Perhaps you should add the setting appropriate file format here
        }, 'image/jpeg', 0.9);
      }
    },

    handleAvatarCropperCancel() {
      this.avatarCropperModal = false;
      this.avatarFile = undefined;
      this.$refs.avatarInput.value = null;
    },

    openLink(url) {
      window.open(url, "_blank")
    }
  },
};
</script>
<style lang="scss">
.cropper-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 400px;
  background: black;
}

.cropper-background {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: 50%;
  filter: blur(5px);
  opacity: 0.25;
}

.profile__avatar {
  cursor: pointer;
  overflow: visible;

  .v-image {
    border: 1px solid rgba(23, 23, 41, 0.08);
  }
}

.profile__info-text {
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  color: #5A6275;
  margin-bottom: 8px !important;

  &__name {
    font-size: 20px !important;
  }
}

.teacher-profile__col {
  background: #FFFFFF;
  box-shadow: 0 0 5px rgba(23, 23, 41, 0.12);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.teacher-profile__section-text {
  font-size: 11px;
  line-height: 16px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #5A6275;
  font-weight: 700;
  margin-bottom: 12px !important;
}

.teacher-profile__link {
  padding: 10px 8px;
  display: flex;
  align-items: center;
  border: 1px solid #DBDFEA;
  box-sizing: border-box;
  border-radius: 5px;
  align-self: stretch;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #F5F6F8;
  }

  &__text {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #505768;
  }

  &__append-icon {
    margin-left: auto;
  }
}

.teacher-profile__courses__header {
  background: #F5F6F8;
  border-radius: 7px;
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  color: #171729;
  padding: 12px 16px;
  width: 100%;
}

.teacher-profile__courses {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, minmax(150px, 1fr));
  overflow: hidden;
  overflow-x: auto;
  padding: 12px 0 8px 0;

  &::-webkit-scrollbar {
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(23, 23, 41, 0.08);
    border-radius: 100px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c2c3ce;
    border-radius: 100px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  &-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 8px 12px;
    position: relative;

    &:not(:nth-child(4)):after {
      content: "";
      position: absolute;
      width: 1px;
      height: 80%;
      right: 0;
      background-color: #DBDFEA;
    }

    &__title {
      @extend .completed-course__card__title !optional;
      color: #383D57;
      white-space: nowrap;
    }

    &__icon {
      width: 20px;
      height: 20px;

      &-container {
        min-width: 32px;
        min-height: 32px;
        border-radius: 100px;
        background-color: #171729;
        display: grid;
        place-items: center;
      }
    }
  }
}
</style>
