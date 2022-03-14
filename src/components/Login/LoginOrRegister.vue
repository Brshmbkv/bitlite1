<template>
  <v-card class="px-8 py-8">
    <v-row >
      <v-col
        cols="12"
        class="text-center"
      >
        Курс будет доступен после регистрации <br>или <br>входа в систему
      </v-col>
      <v-col 
        class="text-center"
        cols="6"
      >
        <div 
          class="LoginOrRegister__card"
          @click="$emit('change', 'LoginRegistration')"
        >
          <v-icon 
            color="#0bc3b8"
            class="d-block"
            size="x-large"
          >{{ mdiAccountPlus }}</v-icon>
          <span>Регистрация</span>
        </div>
      </v-col>
      <v-col 
        class="text-center"
        cols="6"
      >
        <div 
          class="LoginOrRegister__card"
          @click="$emit('change', 'LoginAuth')"
        >
          <v-icon
            color="#0bc3b8"
            class="d-block"
            size="x-large"
          >{{ mdiLogin }}</v-icon>
          Войти
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import {
  mdiAccountPlus,
  mdiLogin,
} from "@mdi/js"

export default {
  name: "LoginOrRegister",
  props: ['course_id'],
  data(){
    return {
      mdiAccountPlus,
      mdiLogin,
    }
  }
}
</script>
<style lang="scss">
.LoginOrRegister__card{
  color: #0bc3b8;
  background-color: rgba(11,195,184,.07);
  padding: 16px 4px;
  cursor: pointer;
  border-radius: 5px;
  &:hover{
    background-color: rgba(11,195,184,.2);
  }
}
</style>