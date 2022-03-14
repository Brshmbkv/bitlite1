<template>
  <v-container>
    <course-catalog-banner isLite />
    <v-row v-if="loading" class="mt-14">
      <v-col v-for="i in 6" :key="i" cols="12" sm="6" md="4">
        <v-skeleton-loader height="150" type="image" />
        <v-skeleton-loader type="list-item-three-line" />
      </v-col>
    </v-row>
    <v-row v-else-if="catalog && catalog.length" class="mt-14">
      <v-col
        v-for="course in catalog"
        :key="course.id"
        class="card-with-image"
        cols="12"
        sm="6"
        md="4"
      >
        <CourseCatalogCard
          :title="course.title"
          :course_id="course.id"
          :description="course.description"
          :duration="course.duration"
          :level="course.level"
          :total_finished="course.total_finished"
          :is_coming="course.status.code === 2"
          :lite_chapters="Number(course.total_lite_chapters)"
          is_lite
        />
      </v-col>
    </v-row>
    <EmptyPlaceholder v-else :text="'Скоро появятся, ожидайте! :)'" />
  </v-container>
</template>

<script>
import CourseCatalogCard from '@/components/Courses/index/CourseCatalogCard'
import EmptyPlaceholder from '@/components/EmptyPlaceholder'
import CourseCatalogBanner from '@/components/Courses/index/CourseCatalogBanner.vue'

export default {
  name: 'CoursesCatalogFreeIndex',
  components: {
    CourseCatalogCard,
    CourseCatalogBanner,
    EmptyPlaceholder,
  },
  data() {
    return {
      catalog: undefined,
      loading: false,
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumbs/setLinks', [
      {
        text: 'Каталог курсов',
        to: {
          name: 'CoursesCatalogIndex',
        },
      },
      {
        text: 'Бесплатные мини курсы',
        disabled: true,
      },
    ])
    this.fetchCatalog().finally(() => {
      this.loading = false
    })
  },
  methods: {
    async fetchCatalog() {
      this.loading = true
      await this.$axios
        .get('catalog/courses', {
          params: {
            has_lite: true,
          },
        })
        .then((res) => {
          if (res && res.data) {
            // console.log(res.data)
            this.catalog = res.data
          }
        })
    },
  },
}
</script>
