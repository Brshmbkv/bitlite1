<template>
  <v-col
      class="mb-6"
      cols=12
      :xl=" active ? 6 : 3"
      :lg=" active ? 9 : 3"
      :md=" active ? 9 : 3"
  >
    <div
        class="CourseCard__folder-tag"
        :class="{
        'CourseCard__folder-tag--black': active,
      }"
    >
      <div class="folder-tag__tag-left"/>
      <div class="folder-tag__tag-center"/>
      <div class="folder-tag__tag-right"/>
    </div>
    <router-link
        v-if="stream_id"
        :to="{
          name: 'StreamShow',
          params: { stream_id },
          query: {type: stream_type}
        }"
        tag="div"
        class="CourseCard__folder"
        :class="{
        'CourseCard__folder--black': active,
      }"
        style="min-height: 160px; cursor: pointer;"
    >

      <v-row class="mx-0 my-0 CourseCard__row">
        <v-col
            cols=12
            md="4"
        >
          <!-- :md=" active || live ? 4 : 12" -->
          <div class="CourseCard__col pa-3">
            <div v-if="stream_title" class="mb-6">
              <p
                  class="CourseCard__title mb-2"
                  :class="{
                  'CourseCard__title--dark': active,
                }"
              >Название</p>
              <p
                  style="line-height: 20px"
                  class="CourseCard__name mb-0"
                  :class="{ 'CourseCard__name--dark': active }"
              >
                {{ stream_title }}
              </p>
            </div>
            <div>
              <template v-if="date">
                <p
                    class="CourseCard__description mb-0"
                    :class="{ 'CourseCard__text--secondary': active}"
                >
                  {{ date | toRuDate }}
                </p>
                <p
                    class="CourseCard__description mb-0"
                    :class="{ 'CourseCard__text--gray': active }"
                >Дата
                </p>
              </template>
            </div>
          </div>
        </v-col>
        <v-row class="mx-0 px-0">
          <v-col sm="1" class="d-none d-md-block">
            <v-divider vertical dark></v-divider>
          </v-col>
          <v-col
              v-if="active"
              cols="11"
              md="8"
          >
            <div class="CourseCard__col pa-3">
              <div class="mr-sm-0 mb-4">
                <p
                    v-if="course_title"
                    class="CourseCard__title CourseCard__text--gray mb-2">
                  <!-- {{ 'Следующий урок #' + (next_event_order + 1) }} -->
                  {{ 'Курс' }}
                </p>
                <p v-if="course_title"
                   class="CourseCard__name CourseCard__text--white mb-6">
                  {{ course_title }}
                  <!-- {{ next_subject }} -->
                </p>
              </div>
              <div>
                <v-btn
                    v-if="lectures_id"
                    :to="{
                  name: 'TeacherLecturesIndex',
                  params: { lectures_id },
                }"
                >Лекции
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-row>
    </router-link>
  </v-col>
</template>

<script>
export default {
  name: "StreamCard",
  filters: {
    toRuDate(d) {
      try {
        let date = new Date(Date.parse(d.replace(/ /g,"T")));
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('ru-RU', options);
      } catch (err) {
        console.log(err);
        return 'Нет даты'
      }
    }
  },
  // mixins: [dateFiltersMixin],
  props: {
    active: {
      default: false,
      type: Boolean,
    },
    stream_title: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      default: ''
    },
    course_title: {
      type: String,
      default: ''
    },
    lectures_id: {
      type: Number,
    },
    stream_id: {
      type: Number,
    },
    stream_type: {
      type: String
    }
    // course_id: Number,
    // course_title: String,
    // module_title: String,
    // main_title: String,
    // complete: Boolean,
    // ends_at: String,
    // lessons_total: Number,
    // lessons_passed: Number,
    // next_event_order: Number,
    // next_event_title: String,
    // next_event_starts_at: String,
    // order: Number,
    // score: Number,
  },
  data() {
    return {
      // mdiCircle,
      // mdiCheckCircle,
      // now: new Date(Date.now()),
    }
  },
}
</script>