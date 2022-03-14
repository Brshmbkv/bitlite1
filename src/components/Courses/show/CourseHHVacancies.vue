<template>
  <v-row>
    <v-col cols=12>
      <h5 class="text-h6 font-weight-bold">Топ вакансий на hh.kz</h5>
    </v-col>
    <v-col 
      cols="12"
      sm="6"
      md="4"
      class="course-vacancies__item" 
      v-for="vacancy in list"
      :key="vacancy.id"
    >
      
      <span class="course-vacancies__item__title">{{vacancy.name}}</span>
      <span 
        class="course-vacancies__item__salary"
        v-if="vacancy.salary && (vacancy.salary.to || vacancy.salary.from)"
      >
        {{ 
          vacancy.salary.from 
            ? vacancy.salary.to 
              ? vacancy.salary.from 
              : ('От ' + vacancy.salary.from) 
            : '' 
        }} 
        {{ 
          vacancy.salary.to 
            ? vacancy.salary.from 
              ? (' - ' + vacancy.salary.to) 
              : ('До ' + vacancy.salary.to)
            : ''
        }}
        {{
          " "+vacancy.salary.currency
        }}
      </span>
      <span class="course-vacancies__item__company">
        {{ vacancy.employer.name }}
      </span>
      <span 
        class="course-vacancies__item__description"

      >
        {{ 
          (vacancy
          && vacancy.snippet
          && vacancy.snippet.responsibility)
          || ''
        }}
      </span>
      <span class="course-vacancies__item__date">
        {{ vacancy.published_at | withoutYear }}
      </span>
      <a 
        v-if="vacancy.alternate_url"
        class="course-vacancies__item__link"
        target="_blank"
        :href="vacancy.alternate_url"
      >Подробнее</a>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'CourseShow__HHVacancies',
  props: {
    list: {
      type: Array,
      default(){
        return [];
      }
    }
  },
}
</script>
<style lang="scss">
.course-vacancies__title-container{
  padding: 0 24px;
  background: #F8F8F8;
}
.course-vacancies__title-container__title{
  display: inline-block;
  margin: 12px 0;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  align-items: center;
  letter-spacing: 0.02em;
  color: #171729;
}
.course-vacancies__items-container{
  overflow-y: auto;
}
.course-vacancies__item__title{
  display: block;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.02em;
  color: #347DD6;
  margin-bottom: 8px;
}
.course-vacancies__item__salary{
  display: block;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.02em;
  color: #171729;
  margin-bottom: 8px;
}
.course-vacancies__item__company{
  display: block;
  font-weight: normal;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: 0.02em;
  color: #9FA4B1;
  margin-bottom: 8px;
}
.course-vacancies__item__description{
  display: block;
  font-weight: normal;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: 0.02em;
  color: #171729;
  margin-bottom: 8px;
}
.course-vacancies__item__date{
  display: block;
  font-weight: normal;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: 0.02em;
  color: #9FA4B1;
  margin-bottom: 8px;
}
.course-vacancies__item{
  a{
    &.course-vacancies__item__link{
      display: inline-block;
      text-decoration: none;
      border-radius: 100px;
      padding: 10px 20px;
      background: rgb(52, 125, 214);
      color: white;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.02em;
      &:hover{
        background: rgba(52, 125, 214, 0.7);
      }
    } 
  }
}
</style>