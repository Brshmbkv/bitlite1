<template>
  <v-dialog 
    v-model="showDialog"
    :transition="false"
    width="700"
  >
    <v-card
      elevation="0"
    >
      <v-form>
        <v-container class="pa-md-8">
          <v-row>
            <v-col cols="12">
              
              <h3 class="font-wight-bold">Редактирования пользователя</h3>
            </v-col>
            <v-col cols="12">
              <v-avatar size="96">
                <v-img 
                  :src="UserPlaceholderMd"
                  alt=""
                />
              </v-avatar>
              <v-btn
                height="44"
                class="ml-8 font-weight-light"
                elevation="0"
                color="#5CC689"
                :ripple="false"
                outlined
                :style="{
                  'text-transform': 'none',
                  'letter-spacing': 'normal',
                  'border-color': 'rgba(23, 23, 41, 0.08)',
                }"
              >{{ imgSrc ? 'Изменить аватар' : 'Добавить аватар'}}</v-btn>
            </v-col>
            <v-col 
              cols="12" 
              md="6"
            >
              <p class="">Имя</p>
              <v-text-field
                outlined
                height="48"
                v-model="name"
                type="text"
                placeholder=" "
                autocomplete="off"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <p class="">Фамилия</p>
              <v-text-field
                outlined
                height="48"
                v-model="surname"
                type="text"
                placeholder=" "
                autocomplete="off"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="py-0 text-right">
              <v-btn
                :ripple="false"
                :disabled="true"
                :elevation="0"
                color="#0BC4B8"
                class="text-capitalize white--text px-sm-8 py-sm-6"
                @click="() => {
                  this.showDialog = false
                }"
              >Сохранить
              </v-btn>
              <v-btn
                :ripple="false"
                :disabled="false"
                :elevation="0"
                color="#9FA4B1"
                class="text-capitalize white--text px-sm-8 py-sm-6 ml-5"
                @click="() => {
                  this.showDialog = false
                  this.errors = false
                }"
              >Отмена
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import UserPlaceholderMd from '@/assets/user_placeholder_md.png';
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    imgSrc: {
      type: String,
    }
  },
  data(){
    return {
      loading: false,
      UserPlaceholderMd,
      name: '',
      surname: '',
    }
  },
  computed: {
    showDialog: {
      get(){ 
        return this.value 
      },
      set(val){
        if (!this.loading){
          this.$emit('input', val);
        }
      }
    },
  },

}
</script>
