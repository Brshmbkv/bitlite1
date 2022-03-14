<template>
  <v-container>
    <p class="font-weight-bold mb-4" style="font-size: 22px">Тест: {{ course_title || 'уроку' }}</p>
    <template v-if="loading">
      <v-skeleton-loader
        type="table-tbody"
      />
    </template>
    <template v-else>
      <v-expansion-panels
        tile
        accordion
        flat
        v-model="panel"
      >
        <v-expansion-panel
          v-for="(chapter, idx) in chapters"
          :key="chapter.id"
          active-class="course-purchase--active__expansion"
        >
          <v-expansion-panel-header
            class="font-weight-bold pl-0"
            style="font-size: 18px"
          >
            {{ `${idx+1}. ${chapter.title}` }}
            <template v-slot:actions>
              <v-icon
                color="#171729"
              >
                {{ panel === idx ? mdiMinus : mdiPlus }}
              </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="d-flex flex-wrap align-center" style="gap: 10px">
              <!--            <v-chip-->
              <!--              v-for="(test, t_idx) in chapter.tests"-->
              <!--              :key="test.id"-->
              <!--              label-->
              <!--              outlined-->
              <!--              class="success"-->
              <!--              style="font-weight: 600; font-size: 16px; color: #0BC3B8"-->
              <!--              @click="startTest(test.id)"-->
              <!--            >-->
              <!--              {{ `${t_idx+1}. ${test.title}` }}-->
              <!--            </v-chip>-->
              <v-card
                v-for="test in chapter.tests"
                :key="test.id"
                outlined
                :ripple="false"
                :to="{
                  name: 'TrainingCoursesTestShow',
                  params: {
                    test_id: test.id
                  }
                }"
                rounded
                class="pa-5"
              >
                <v-card-text
                  class="pt-0"
                  style="font-size: 16px; font-weight: 600;color: #171729"
                >
                  {{ test.title }}
                </v-card-text>
                <hr
                  style="height:3px;border-width:0;background-color:rgba(23,23,41, 0.08)"
                />
                <v-card-text
                  v-if="test.user_result"
                  class="pb-0"
                  style="font-size: 14px; font-weight: 500;color: #171729"
                >
                  <p class="d-flex align-center mb-0" style="gap: 5px">
                    <v-icon
                      color="#171729"
                      size="20"
                    >
                      {{ mdiStarOutline }}
                    </v-icon>
                    Сдал на {{ test.user_result && test.user_result.rights_percent }}%
                  </p>
                </v-card-text>
                <v-card-text
                  v-else
                  class="pb-0"
                  style="font-size: 14px; font-weight: 500;color: #171729"
                >
                  Вы еще не сдавали
                </v-card-text>
              </v-card>
            </div>
          </v-expansion-panel-content>
          <v-divider/>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
  </v-container>
</template>

<script>
import { mdiPlus, mdiMinus, mdiStarOutline } from '@mdi/js'

export default {
  name: "TrainingCoursesShow",
  props: ['course_id'],
  data() {
    return {
      mdiPlus,
      mdiMinus,
      mdiStarOutline,
      loading: false,
      panel: undefined,
      chapters: undefined,
      course_title: undefined,
    }
  },
  mounted() {
    this.fetchTests()
      .finally(() => {
        this.$store.dispatch('breadcrumbs/setLinks', [
          {
            text: 'Тесты по курсам',
            underlined: true,
            back: true,
            to: { name: 'TrainingCoursesIndex' },
          },
          {
            text: this.course_title || 'Курс',
            disabled: true,
          },
        ])
      })
  },
  methods: {
    async fetchTests() {
      this.loading = true
      await this.$axios.get(`training/courses/${this.course_id}`)
        .then(res => {
          if(res && res.data) {
            // console.log('course-tests', res.data)
            this.chapters = res.data.chapters
            this.course_title = res.data.course && res.data.course.title
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  }
}
</script>

