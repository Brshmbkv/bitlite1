<template>
  <v-container>
    <h1>Потоки</h1>
    <v-tabs
      v-model="currentTab"
      style="box-shadow: rgba(23, 23, 41, 0.08) 0px 1px 0px"
      background-color="white"
      class="mb-8"
    >
      <v-tabs-slider></v-tabs-slider>
      <v-tab class="StudentCourses__tab text-capitalize" href="#active">
        Активные
      </v-tab>
      <v-tab class="StudentCourses__tab text-capitalize" href="#finished">
        Завершенные
      </v-tab>
      <v-tab class="StudentCourses__tab text-capitalize" href="#coming">
        Предстоящие
      </v-tab>
    </v-tabs>
    <template v-if="loading">
      <template v-for="n in 2">
        <v-row :key="'i' + n">
          <v-col cols="12" :lg="6" :md="9">
            <v-skeleton-loader type="image" elevation="2" />
          </v-col>
          <v-col cols="12" :lg="3" :md="3">
            <v-skeleton-loader type="image" elevation="2" />
          </v-col>
        </v-row>
      </template>
    </template>
    <template v-else-if="streams && streams.length">
      <div class="stream-card__grid">
        <div class="stream-card" v-for="card in streams" :key="card.id">
          <h1 class="stream-card__title">{{ card.name }}</h1>
          <div class="stream-card__courses">
            <span class="mr-2 stream-card__courses-title">Курс</span>
            <p
              class="stream-card__course-name"
              v-for="course in card"
              :key="course.id"
            >
              {{ course.title }}
            </p>
          </div>
          <p class="stream-card__start-date mt-6">
            Дата начала курса: <b>{{ card.starts_at_module | shortFormat }}</b>
          </p>
          <button
            class="stream-card__btn"
            @click="
              $router.push({
                name: 'StreamShow',
                params: {
                  stream_id: card.id,
                },
                query: { type: card.type },
              })
            "
          >
            Подробнее
          </button>
        </div>
      </div>
    </template>
    <NoCoursesCard
      v-else-if="error"
      :text="`Ошибка при запросе ${word()} потоков`"
    />
    <NoCoursesCard v-else :text="`У вас нет ${word()} потоков`" />
  </v-container>
</template>
<script>
import NoCoursesCard from '@/components/Courses/index/NoCoursesCard.vue'

export default {
  name: 'TeacherStreamIndex',
  components: {
    NoCoursesCard
  },
  data() {
    return {
      currentTab: 'active',
      loading: true,
      streams: undefined,
      error: false,
      is_page_loading: false,
      current_page: undefined,
      last_page: undefined,
    }
  },

  watch: {
    currentTab() {
      this.fetchStreams()
    },
  },

  mounted() {
    this.fetchStreams().finally(() => {
      this.loading = false
    })
    this.$store.dispatch('breadcrumbs/setLinks', [
      {
        text: 'Потоки',
        disabled: true,
      },
    ])
  },

  methods: {
    async fetchStreams(page) {
      this.is_page_loading = page && true
      this.loading = !page
      try {
        let res = await this.$axios.get('teacher/streams/v2', {
          params: {
            type: this.currentTab,
            ...(page && { page }),
          },
        })
        if (res?.data?.data?.length > 0) {
          if (res?.data?.meta?.current_page > 1) {
            this.streams = [...this.streams, ...res?.data?.data]
          } else {
            this.streams = res.data.data
          }
          this.current_page = res?.data?.meta?.current_page
          this.last_page = res?.data?.meta?.last_page
        } else {
          this.streams = []
        }
      } catch (err) {
        this.error = true
        console.log(err)
      }
      this.loading = false
      this.is_page_loading = false
    },

    word() {
      return {
        active: 'активных',
        finished: 'завершенных',
        coming: 'предстоящих',
      }[this.currentTab]
    },
  },
}
</script>

<style lang="scss">
.stream-card {
  border: 1px solid #b0b7d08f;
  padding: 16px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }
  &__title {
    font-size: 20px;
    line-height: 24px;
    font-weight: 700;
    text-transform: capitalize;
  }
  &__courses-title {
    font-size: 14px;
    color: #5a6275;
  }
  &__course-name {
    color: #000221a3;
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    margin-bottom: 0 !important;
  }
  &__start-date {
    font-size: 16px;
    line-height: 20px;
    color: #828bab;
  }
  &__btn {
    margin-top: auto;
    border: 2px solid #4376fb;
    padding: 6px 24px;
    border-radius: 4px;
    color: #4376fb;
  }
}
</style>
