<template>
  <div class="enrol-page">
    <p
      v-if="!error" 
      style="text-align: center;"> 
    Загрузка...
    </p>
    <template v-else>
      <div style="text-align: center;">
        <h3 >Ошибка</h3>
        <p style="text-align: center;">{{ errorMsg }}</p>
        <p>Мы уже видим эту ошибку и команда разработчиков работает над ней!</p>
        <p>Вы можете просмотреть доступные курсы на странице "Каталог"</p>
        <v-btn
          :to="{
            name: 'CoursesCatalogIndex', 
          }"
          replace
        >
          Перейти
        </v-btn>
      </div>
      
    </template>
  </div>
</template>

<script>
export default {
  props: ['course_id'],
  data(){
    return {
      error: false,
      errorMsg: undefined,
    }
  },
  mounted(){
    if (!localStorage.getItem('token')){
      this.$router.push({
        name: 'Login', 
        params: {
          step: 'LoginOrRegister',
          ...this.$attrs,
        }, 
        query: {
          enrol: this.course_id
        }
      })
    } else {
      (async () => {
        try{
          await this.$axios.post(`/free-purchase/`, {
            course_id: this.course_id
          });
          this.$router.replace({
            name: "CourseShow",
            params: {
              course_id: this.course_id,
            },
          })
        } catch (err){
          this.error = true;
          this.errorMsg = err.name + ': ' + err.message;
          if (err?.response?.status === 404){
            this.errorMsg = 'Похоже что такого курса не существует :('
          } else if (err?.response?.data?.message){
            this.errorMsg = err.response.data.message
          }
          throw err;
        }
      })();
    }
  },
}
</script>
<style lang="scss">
.enrol-page{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  max-width: 100%;
}
</style>