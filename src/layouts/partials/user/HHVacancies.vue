<template>
  <div class="sb-vacancies">
    <div class="sb-vacancies__title-container">
      <h3 class="sb-vacancies__title-container__title">Топ вакансий на hh.kz</h3>
    </div>
    <div class="sb-vacancies__items-container">
      <div
        class="sb-vacancies__item"
        v-for="vacancie in list"
        :key="vacancie.id"
        @click="openURL(vacancie.alternate_url)"
      >
        <span class="sb-vacancies__item__title">{{ vacancie.name }}</span>
        <span
          class="sb-vacancies__item__salary"
          v-if="vacancie.salary && (vacancie.salary.to || vacancie.salary.from)"
        >
          {{
            vacancie.salary.from
              ? vacancie.salary.to
              ? vacancie.salary.from
              : ('От ' + vacancie.salary.from)
              : ''
          }}
          {{
            vacancie.salary.to
              ? vacancie.salary.from
              ? (' - ' + vacancie.salary.to)
              : ('До ' + vacancie.salary.to)
              : ''
          }}
          {{
            " " + vacancie.salary.currency
          }}
        </span>
        <span class="sb-vacancies__item__company">
          {{ vacancie.employer.name }}
        </span>
        <span
          class="sb-vacancies__item__description"

        >
          {{
            (vacancie
              && vacancie.snippet
              && vacancie.snippet.responsibility)
            || ''
          }}
        </span>
        <span class="sb-vacancies__item__date">
          {{ vacancie.published_at | withoutYear }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from "axios";

export default {
  name: 'Navbar__HHVacancies',
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      loading: true,
    }
  },
  // mounted() {
  //   console.log(this.list)
  // },
  methods: {
    openURL(url) {
      window.open(url, '_blank')
    },
    // async getVacancies(){
    //   // https://api.hh.ru/vacancies?area=40
    // }
    filterSallary() {
      // Дописать
    }
  }
}
</script>
<style lang="scss">
.sb-vacancies {
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  transition: max-height 0.7s ease;
  position: absolute;
  bottom: 0;
  width: 100%;
  max-height: calc(100vh - 370px);

  &:hover {
    max-height: calc(100% - 96px);
  }
}

.sb-vacancies__title-container {
  padding: 0 24px;
  background: #F8F8F8;
  border-top: 1px solid rgba(23, 23, 41, 0.08);
  border-bottom: 1px solid rgba(23, 23, 41, 0.08);
}

.sb-vacancies__title-container__title {
  display: inline-block;
  margin: 12px 0;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  align-items: center;
  letter-spacing: 0.02em;
  color: #171729;
}
.sb-vacancies__items-container {
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(23, 23, 41, 0.08);
    border-radius: 100px;
  }

  &::-webkit-scrollbar-thumb {
    background: #9FA4B1;
    border-radius: 100px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
}

.sb-vacancies__item {
  padding: 24px;
  border-bottom: 1px solid rgba(23, 23, 41, 0.08);
  cursor: pointer;
  background-color: #FFFFFF;

  &:hover {
    background-color: #F8F8F8;
  }
}

.sb-vacancies__item__title {
  display: block;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.02em;
  color: #347DD6;
  margin-bottom: 8px;
}

.sb-vacancies__item__salary {
  display: block;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.02em;
  color: #171729;
  margin-bottom: 8px;
}

.sb-vacancies__item__company {
  display: block;
  font-weight: normal;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: 0.02em;
  color: #9FA4B1;
  margin-bottom: 8px;
}

.sb-vacancies__item__description {
  display: block;
  font-weight: normal;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: 0.02em;
  color: #171729;
  margin-bottom: 8px;
  word-break: break-word;
}

.sb-vacancies__item__date {
  display: block;
  font-weight: normal;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: 0.02em;
  color: #9FA4B1;
}

.sb-vacancies {
  a {
    &.sb-vacancies__item__link {
      display: inline-block;
      text-decoration: none;
      border-radius: 100px;
      padding: 10px 20px;
      background: rgb(52, 125, 214);
      color: white;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.02em;

      &:hover {
        background: rgba(52, 125, 214, 0.7);
      }
    }
  }
}
</style>
