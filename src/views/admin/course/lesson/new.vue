<template>
  <v-container fluid>
    <p
      class="font-weight-bold"
      style="color: #171729;font-size: 24px"
    >Добавление урока</p>
    <v-row>
      <v-col
        cols="12"
        md="5"
      >
        <p class="add-dialog__label-for-input">Название лекции</p>
        <v-text-field
          v-model="lessonTitle"
          required
          outlined
          dense
          :error-messages="
            addLessonErrors.hasOwnProperty('title')
              ? addLessonErrors.title
                : ''
          "
          class="add-dialog__v-text-field"
        >
        </v-text-field>
      </v-col>
      <v-col
        cols="6"
        md="3"
      >
        <p class="add-dialog__label-for-input">Тип</p>
        <v-select
          :items="types"
          v-model="lessonType"
          item-text="name"
          item-value="id"
          :menu-props="{ bottom: true, offsetY: true }"
          dense
          class="add-dialog__v-text-field"
          outlined
          :error-messages="
            addLessonErrors.hasOwnProperty('type_id')
              ? addLessonErrors.type_id
                : ''
          "
          :append-icon="mdiChevronDown"
        ></v-select>
      </v-col>
      <v-col
        cols="6"
        md="2"
      >
        <p class="add-dialog__label-for-input">Порядок</p>
        <v-text-field
          v-model="lessonOrder"
          required
          outlined
          type="number"
          :error-messages="
            addLessonErrors.hasOwnProperty('order')
              ? addLessonErrors.order
                : ''
          "
          dense
          class="add-dialog__v-text-field"
        >
        </v-text-field>
      </v-col>
      <v-col
        v-if="lessonType !== 2"
        cols="12"
        sm="10">
        <p class="add-dialog__label-for-input" style="font-weight: 600;">Контент лекции</p>
        <LectureConstructor
          :value="currentContent"
          @save="addLessonContent"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import editor from '@tinymce/tinymce-vue'
import { mdiChevronDown } from '@mdi/js'
import LectureConstructor from "@/components/LectureConstructor/editor";

export default {
  name: "LessonCreate",
  components: {
    LectureConstructor,
    // editor,
  },
  props: ['chapter_id'],
  data() {
    return {
      mdiChevronDown,
      lessonTitle: '',
      lessonType: 0,
      lessonOrder: '',
      currentContent: [{
        type: 'text',
        value: '',
      }],
      types: undefined,
      chapter: undefined,
      addLessonErrors: [],
      init: {
        images_upload_handler: function (blobInfo, success, failure) {
          var formData;
          formData = new FormData();
          formData.append('file', blobInfo.blob(), blobInfo.filename());
          this.$axios.post('https://app.bitlab.academy/api/v1/lessons-image-upload', formData)
            .then(res => {
              if (res && res.data){
                success(res.data);
              }
            })
            .catch(err => {
              console.log(err)
              failure('HTTP Error: ' + err);
            })
        },
        file_picker_callback: function (callback, value, meta) {
          // Provide file and text for the link dialog
          if (meta.filetype == 'file') {
            console.log('File');
            // callback('mypage.html', {text: 'My text'});
          }
          // Provide image and alt text for the image dialog
          if (meta.filetype == 'image') {
            console.log('Image');
            callback('myimage.jpg', { alt: 'My alt text' });
          }
          // Provide alternative source and posted for the media dialog
          if (meta.filetype == 'media') {
            console.log('Media');
            // callback('movie.mp4', {source2: 'alt.ogg', poster: 'image.jpg'});
          }
        }
      }
    }
  },

  mounted() {
    this.fetchLessonCreate()
      .then(() => {
        this.$store.dispatch("breadcrumbs/setLinks", [
          {
            text: 'Все курсы',
            to: {
              name: "AdminCoursesIndex",
            },
          },
          {
            text: this.chapter.module.course.title,
            to: {
              name: "AdminCourseShow",
              params: {
                course_id: this.chapter.module.course.id,
              },
            },
          },
          {
            text: this.chapter.module.title,
            to: {
              name: "AdminModuleShow",
              params: {
                course_id: this.chapter.module.course.id,
                module_id: this.chapter.module.id,
              },
            },
          },
          {
            text: this.chapter.title,
            to: {
              name: "AdminChapterShow",
              params: {
                chapter_id: this.chapter_id,
              },
            },
          },
          {
            text: 'Добавление урока',
            disabled: true,
          }
        ]);
      })
  },
  methods: {
    // Достает нужную инфу:
    // Титул
    async fetchLessonCreate() {
      await this.$axios.get('admin/chapters/' + this.chapter_id + '/lessons/create')
        .then(res => {
          if (res && res.data) {
            this.chapter = res.data.chapter
            this.types = res.data.lesson_type
          }
        })
    },

    async addLessonContent(content) {
      console.log('content:', content)
      await this.$axios.post('admin/lessons', {
        title: this.lessonTitle,
        order: this.lessonOrder,
        type_id: this.lessonType,
        content: 'Lecture created by Constructor',
        content_elements: content,
        chapter_id: this.chapter_id
      })
        .then(res => {
          console.log(res)
          this.$router.push({
            name: 'AdminChapterShow',
            params: {
              chapter_id: this.chapter_id
            }
          })
        })
        .catch(err => {
          if (err.response && err.response.data && err.response.data.errors) {
            this.addLessonErrors = err.response.data.errors
          }
        })
    },
  },
}
</script>
