<template>
  <v-container>
    <v-row class="mt-3" align="center">
      <v-col cols="auto">
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
      </v-col>
      <v-col cols="auto">
        <div class="d-flex flex-column">
          <template v-if="loading">
            <v-skeleton-loader type="article" width="220"/>
          </template>
          <template v-else>
            <h3 class="profile__info-text__name mb-4">{{ full_name }}</h3>
            <p v-if="field_nickname" class="profile__info-text">@{{ field_nickname }}</p>
            <p v-if="field_phone" class="profile__info-text">
              <v-icon size="16" class="mr-2">{{ mdiCellphone }}</v-icon>
              {{ field_phone | VMask('+#(###)###-##-##') }}
            </p>
            <p v-if="field_email" class="profile__info-text">
              <v-icon size="16" class="mr-2">{{ mdiEmail }}</v-icon>
              {{ field_email }}
            </p>
          </template>
        </div>
      </v-col>
      <v-col cols="12" sm="auto" class="ml-auto" align-self="start">
        <div class="d-flex flex-column">
          <v-btn
            class="text-none mb-5"
            :ripple="false"
            color="success"
            elevation="0"
            :disabled="loading"
            @click="edit_dialog = true"
          >
            <v-icon class="mr-2">
              {{ mdiPencil }}
            </v-icon>
            Редактировать
          </v-btn>
          <v-btn
            class="text-none"
            :ripple="false"
            color="success"
            elevation="0"
            outlined
            :disabled="loading"
            :to="{
              name: 'ProfileSettings'
            }"
          >
            <v-icon class="mr-2">
              {{ mdiCog }}
            </v-icon>
            Настройки
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-divider class="mt-10"/>
    <div class="profile__block">
      <h3 class="profile__block-title">Статистика</h3>
      <v-row>
        <v-col
          v-for="stat in stats"
          :key="stat.icon"
          md="3"
          sm="6"
          cols="12"
        >
          <StatisticsItem
            :title="stat.title"
            :icon="stat.icon"
            :value="stat.value"
            :value-text="stat.value_text"
            :loading="loading"
          />
        </v-col>
      </v-row>
    </div>
    <div class="profile__block">
      <h3 class="profile__block-title">Пройденные курсы</h3>
      <v-row>
        <template v-if="loading">
          <v-col
            v-for="i in 3"
            :key="i"
            cols="12"
            sm="6"
            md="3"
          >
            <CompletedCourseCard
              :loading="loading"
            />
          </v-col>
        </template>
        <template v-else-if="completed_courses && completed_courses.length === 0">
          <div class="profile__no-completed-courses">
            У Вас нету пройденных курсов
          </div>
        </template>
        <template v-else>
          <v-col
            v-for="course in completed_courses"
            :key="course.id"
            cols="12"
            sm="6"
            md="3"
          >
            <CompletedCourseCard
              :icon="Number(course.id)"
              :title="course.title"
              :date="course.group_course_module && course.group_course_module.starts_at"
              :loading="loading"
            />
          </v-col>
        </template>
      </v-row>
    </div>
    <div class="profile__block">
      <h3 class="profile__block-title">История покупок</h3>
      <PaymentHistoryTable
        :loading="loading"
        :payments="payments"
      />
    </div>

    <ProfileEditDialog
      :value.sync="edit_dialog"
      :avatar="avatar || UserPlaceholderMd"
      :full_name="full_name"
      :nickname.sync="field_nickname"
      :email.sync="field_email"
      :last_name.sync="field_last_name"
      :first_name.sync="field_first_name"
      :phone.sync="field_phone"
      :errors.sync="error_messages"
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
import { mdiPencil, mdiCellphone, mdiEmail, mdiCog } from '@mdi/js'
import StatisticsItem from "@/components/Profile/StatisticsItem";
import CompletedCourseCard from "@/components/Profile/CompletedCourseCard";
import PaymentHistoryTable from "@/components/Profile/PaymentHistoryTable";

export default {
  name: "U-PROFILE-VIEW",
  components: {
    ProfileEditDialog: () => import('@/components/Profile/ProfileEditDialog'),
    PaymentHistoryTable,
    CompletedCourseCard,
    StatisticsItem,
    CircleStencil, // eslint-disable-line vue/no-unused-components
    Cropper,
  },
  data() {
    return {
      UserPlaceholderMd,
      mdiCellphone,
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
      payments: undefined,
      edit_dialog: false,
      completed_courses: undefined,
      total_points: undefined,
      total_courses: undefined,
      total_exercises: undefined,
      rating: undefined,
    };
  },
  computed: {
    ...mapState("user", ["phone", "avatar", "settings", "nickname"]),
    stats() {
      return [
        {
          title: 'Заработано',
          icon: 'insight-icon',
          value: this.total_points,
          value_text: 'XP',
        },
        {
          title: 'В рейтинге',
          icon: 'board-icon',
          value: this.rating,
          value_text: 'место',
        },
        {
          title: 'Пройдено',
          icon: 'lamp-icon',
          value: this.total_courses || 0,
          value_text: 'курса',
        },
        {
          title: 'Решено',
          icon: 'task-icon',
          value: this.total_exercises || 0,
          value_text: 'заданий',
        },
      ]
    }
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
    // this.store.commit("")
    Promise.all([this.fetchProfile(), this.fetchPayments()])
      .finally(() => this.loading = false)
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
          this.loading = false;
          this.$nextTick(() => this.mask = "+#(###)###-##-##");
        });
    },

    async fetchPayments() {
      try {
        const res = await this.$axios('/my-purchases/')
        if(res?.data) {
          this.payments = res.data
        }
      } catch(e) {
        throw new Error(e)
      }
    },

    async fetchProfile() {
      try {
        const res = await this.$axios('profile')
        this.total_exercises = res?.data?.total_exercises || 0
        this.total_courses = res?.data?.courses?.length || 0
        this.total_points = res?.data?.total_points || 0
        this.rating = res?.data?.best_rating || 0
        this.completed_courses = res?.data?.courses || []
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
        phone
      } = user;
      // console.log(field_first_name, field_phone, field_last_name, field_email);
      this.$store.dispatch("user/updateInfo", {
        ...(first_name && { first_name: first_name }),
        ...(phone && { phone: phone.replace(/[^0-9.]/g, "") }),
        ...(last_name && { last_name: last_name }),
        ...((nickname || nickname === '') && { nickname: nickname }),
        ...(email && { email: email }),
        ...(this.field_role && { role: this.field_role }),
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

.profile__block {
  padding: 25px 0;

  &-title {
    font-weight: bold;
    font-size: 20px;
    line-height: 32px;
    margin-bottom: 25px;
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

.profile__no-completed-courses {
  display: grid;
  place-items: center;
  height: 100px;
  width: 100%;
  font-size: 14px;
  font-weight: 600;
  color: #5A6275;
}
</style>
