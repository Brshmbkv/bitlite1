<template>
  <div>
    <div style="background: #FAFAFA;">
      <v-container class="py-0">
        <template
          v-if="modules_loading"
        >
          <v-col cols=12>
            <v-skeleton-loader class="d-inline-block mr-3" type="button"/>
            <v-skeleton-loader class="d-inline-block mr-3" type="button"/>
            <v-skeleton-loader class="d-inline-block mr-3" type="button"/>
          </v-col>
        </template>
        <v-row
          justify="space-between"
          v-else-if="stream_modules && stream_modules.length > 0"
        >
          <v-col
            cols="12"
            md="auto"
            class="d-flex py-0"
            style="overflow-x: auto;"
          >
            <div
              v-for="(tab) in stream_modules"
              :key="'course_tabs_'+ tab.id"
              class="CourseIndex__tab CourseIndex__tab--text-black"
              :class="{
                'CourseIndex__tab--disabled': lectures_loading,
                'CourseIndex__tab--active CourseIndex__tab--active--text-green': parseInt(module_active_id) === tab.id,
              }"
              @click="handleTabClick(tab.id)"
            >
                <!-- :style="{ color: (parseInt(module_active_id) === tab.id) ? '#0BC4B8' : 'black'}" -->
              <span>{{ tab.title }}</span>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-container>
      <v-row>
        <template
          v-if="lectures_loading"
        >
          <v-col cols=12>
            <v-skeleton-loader type="table"/>
          </v-col>
        </template>
        <v-col v-else>
          <v-simple-table class="my-table">
            <thead>
            <tr>
              <th class="text-left font-weight-regular grayLight--text pl-0">#</th>
              <th class="text-left font-weight-regular grayLight--text">Дата</th>
              <th class="text-left font-weight-regular grayLight--text">Название</th>
            </tr>
            </thead>
            <tbody>
            <template v-if="lectures && lectures.length > 0">
              <router-link
                tag="tr"
                :to="{
                name: 'StreamLectureShow',
                params: {
                  event_id: lecture.id
                }
              }"
                v-for="(lecture, ekey) in lectures"
                :key="'lecture_'+lecture.id"
                :style="{
                  cursor: 'pointer'
                }"
              >
                <td class="pl-0" style="font-size: 14px">{{ '#' + (ekey + 1) }}</td>
                <td class="text-capitalize text-no-wrap" style="font-size: 14px">
                  {{ lecture.starts_at | longFormat }}
                </td>
                <td style="font-weight: 600;font-size: 15px">
                  {{ (lecture.chapter && lecture.chapter.title) || '' }}
                </td>
              </router-link>
            </template>
            <p
              v-else
            >Нет данных</p>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
//


export default {
  name: 'TeacherLecturesShow',
  props: ['stream_id', 'module_id'],
  data() {
    return {
      group_id: 1,
      loading: true,
      lectures: undefined,
      lectures_loading: true,
      module_active_id: undefined,
      modules_loading: true,
      stream_name: undefined,
      is_lector: true,
      show_practices_link: true,
      stream_modules: undefined,
    }
  },

  watch: {
    module_active_id(){
      this.fetchModuleLectures()
    }
  },
  mounted() {
    this.fetchStreamModules().then(() => {
      this.$store.dispatch('breadcrumbs/setLinks', [
        {
          text: 'Потоки',
          to: {
            name: "Streams"
          }
        },
        {
          text: this.stream_name || 'Без названия',
          to: {
            name: 'StreamShow',
            params: {
              stream_id: this.stream_id
            }
          }
        },
        {
          text: 'Лекции',
          disabled: true,
          // to: { name: 'LessonShow', params: { lesson_id: this.lesson_id }}
        },
      ])
    })
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    async fetchStreamModules(){
      this.modules_loading = true
      await this.$axios.get(`teacher/streams/${this.stream_id}/modules`).then(({ data }) => {
        if (data){
          let active_module = data.modules.find((el) => el.active);
          // console.log('StreamModules ', data);
          this.stream_name = (data && data.stream) ? data.stream.name : undefined;
          this.stream_modules = data ? data.modules : [];
          this.module_active_id = active_module ? active_module.id : 0;
        }
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        this.modules_loading = false;
      })
    },

    async fetchModuleLectures() {
      this.lectures_loading = true;
      await this.$axios.get(`teacher/streams/${this.stream_id}/modules/${this.module_active_id}/lectures`).then(({ data } ) => {
        if (data) {
          this.lectures = data.lectures;
        }
      }).finally(() => {
        this.lectures_loading = false;
      })
    },

    handleTabClick(module_id){
      if (!this.lectures_loading){
        this.module_active_id = module_id;
      }
    },
  },
}
</script>
