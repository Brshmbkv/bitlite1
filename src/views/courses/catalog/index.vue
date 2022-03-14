<template>
  <v-container>
    <course-catalog-banner
      @click="$router.push({
        name: 'CoursesCatalogFreeIndex'
      })"
    />
    <!-- <router-link
      class="courses-catalog__free-course--block pa-8"
      tag="div"
      :to="{
        name: 'CoursesCatalogFreeIndex'
      }"
    >
      <p class="courses-catalog__free-course--text">
        Не знаете какой курс вам подойдет?<br>
        Начните обучаться бесплатно прямо сейчас!
      </p>
      <p class="courses-catalog__free-course--subtext">
        У нас имеется ряд бесплатных уроков, которые помогут вам определиться с выбором. Переходите по странице и
        начните программировать прямо сейчас!
      </p>
    </router-link> -->
    <div class="mt-14">
      <v-row v-if="loading">
        <v-col
          v-for="i in 6"
          :key="i"
          cols="12"
          sm="6"
          md="4"
        >
          <v-skeleton-loader
            height="150"
            type="image"
          />
          <v-skeleton-loader
            type="list-item-three-line"
          />
        </v-col>
      </v-row>
      <div v-else class="catalog__grid">
        <div
          v-for="course in catalog"
          :key="course.id"
        >
          <CourseCatalogCard
            v-if="course.status && course.status.code !== 3"
            :title="course.title"
            :course_id="course.id"
            :description="course.description"
            :duration="course.duration"
            :level="course.level"
            :total_finished="course.total_finished"
            :totally_bought="course.totally_bought"
            :is_coming="course.status.code === 2"
          />
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>

import CourseCatalogCard from "@/components/Courses/index/CourseCatalogCard";
import CourseCatalogBanner from '@/components/Courses/index/CourseCatalogBanner.vue';

export default {
  name: "CoursesCatalogIndex",
  components: {
    CourseCatalogCard,
    CourseCatalogBanner
  },
  data() {
    return {
      catalog: undefined,
      loading: false,
    }
  },
  mounted() {
    this.fetchCatalog()
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    async fetchCatalog() {
      this.loading = true
      await this.$axios.get('catalog/courses')
        .then(res => {
          if(res && res.data) {
            // console.log(res.data)
            this.catalog = res.data
          }
        })
    }
  }
}
</script>

<style lang="scss">
.catalog__grid {
  display: grid;
  grid-gap: 20px;
  grid-auto-rows: 1fr;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.courses-catalog__free-course--block {
  background: #F9DC93;
  position: relative;
  border: 1px solid rgba(23, 23, 41, 0.08);
  box-sizing: border-box;
  border-radius: 20px;
  margin: 32px 0;
  cursor: pointer;
  transition: all 0.5s ease;
  transform-style: preserve-3d;

  &:hover {
    transform: translateX(60px);
    z-index: 2;

    &:before {
      transform: translateX(-60px) rotate(180deg) translateZ(-1px);
    }
  }

  &:before {
    content: "Нажмите чтобы посмотреть бесплатные курсы";
    position: absolute;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    left: 0;
    bottom: 0;
    transform: rotate(180deg) translateZ(-1px);
    transition: all 0.5s ease;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    border-radius: 20px;
    border: 2px solid #F9DC93;
    background-color: rgba(249, 220, 147, 0.45);
    height: 100%;
    width: 100px;
    line-height: 120%;
    padding: 6px 12px 6px 0;
  }

  .courses-catalog__free-course--hidden-text {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    position: absolute;
    left: 0;
    top: 0;
    transform: rotate(180deg);
    transition: all .5s ease;
    z-index: -1;
  }

  .courses-catalog__free-course--text {
    font-weight: 900;
    font-size: 30px;
    line-height: 45px;
  }

  .courses-catalog__free-course--subtext {
    font-weight: 400;
    font-size: 18px;
    line-height: 27px;
    margin-bottom: 0;
  }
}
</style>

