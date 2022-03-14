<template>
  <v-container class="admin-chapter-show" fluid>
    <v-alert v-if="errorText" type="error">
      {{ errorText }}
    </v-alert>
    <template v-else>
      <p class="chapter__title font-weight-bold mt-3 mb-6">
        {{ chapter_title }}
      </p>
      <v-divider style="border-color:rgba(23, 23, 41, 0.08);" />
      <v-row justify="space-between" class="my-7 mx-1">
        <h2 class="chapter__subtitle mb-0 align-self-center">Лекции</h2>
        <div>
          <v-btn
            class="chapter__btn text-capitalize"
            text
            :ripple="false"
            :to="{
              name: 'AdminLessonNew',
              params: {
                chapter_id: this.chapter_id,
              },
            }"
            ><span style="font-size: 18px;margin-right: 4px">+</span> Добавить
            урок
          </v-btn>
          <v-btn
            class="chapter__btn text-capitalize"
            text
            :ripple="false"
            :to="{
              name: 'AdminTestIndex',
              params: {
                chapter_id: chapter_id,
              },
            }"
            >Тесты
          </v-btn>
        </div>
      </v-row>
      <div>
        <v-data-table
          :headers="headers"
          :items="lessons"
          :mobile-breakpoint="0"
          :loading="loading"
          hide-default-footer
          @click:row="changeToLessonShowPage"
          class="elevation-0 mt-3 admin-users-table__v-table"
          style="border-bottom-left-radius: 0;border-bottom-right-radius: 0;"
        >
          <template v-slot:no-data>
            <CoursesEmptyPlaceholder
              :text="'Нету уроков'"
            ></CoursesEmptyPlaceholder>
          </template>
        </v-data-table>
      </div>
      <v-row align="center" justify="space-between" class="my-8">
        <v-col cols="auto">
          <h2 class="chapter__subtitle">Дополнительные материалы</h2>
        </v-col>
        <v-col cols="auto">
          <AddButton @click="add_material_visible = !add_material_visible" />
        </v-col>
        <v-col cols="12" class="py-0">
          <v-expand-transition>
            <div v-if="add_material_visible">
              <v-row>
                <v-col md="4" cols="12">
                  <v-text-field
                    v-model="material.title"
                    outlined
                    dense
                    height="40"
                    background-color="#FFFFFF"
                    label="Название"
                    hide-details
                  />
                </v-col>
                <v-col md="4" cols="12">
                  <v-text-field
                    v-model="material.link"
                    outlined
                    dense
                    height="40"
                    background-color="#FFFFFF"
                    label="Ссылка"
                    hide-details
                  />
                </v-col>
                <v-col sm="4" cols="12">
                  <v-text-field
                    v-model="material.order"
                    outlined
                    dense
                    height="40"
                    background-color="#FFFFFF"
                    label="Порядок"
                    hide-details
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="material.description"
                    dense
                    outlined
                    auto-grow
                    height="60"
                    hide-details
                    label="Описание"
                    background-color="#FFFFFF"
                  />
                </v-col>
                <v-col cols="12">
                  <div class="float-right">
                    <v-btn
                      :ripple="false"
                      elevation="0"
                      class="success text-none mr-2"
                      large
                      :loading="add_material_loading || material_loading"
                      :disabled="
                        !material.title || !material.link || !material.order
                      "
                      @click="saveMaterial"
                    >
                      {{ is_edit ? 'Изменить' : 'Добавить' }}
                    </v-btn>
                    <v-btn
                      :ripple="false"
                      elevation="0"
                      class="secondary text-none"
                      large
                      @click="clearMaterialValues"
                    >
                      Отмена
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-expand-transition>
        </v-col>
        <v-col cols="12">
          <v-data-table
            :headers="material_headers"
            :items="materials"
            :mobile-breakpoint="0"
            :loading="material_loading"
            hide-default-footer
            class="elevation-0 mt-3 admin-users-table__v-table"
            style="border-bottom-left-radius: 0;border-bottom-right-radius: 0;"
            no-data-text="Пусто"
          >
            <template v-slot:item.tools="{ item }">
              <EditDropDownButton
                @edit="editMaterial(item)"
                @delete="deleteMaterial(item.id)"
              />
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import CoursesEmptyPlaceholder from '@/components/EmptyPlaceholder'
import AddButton from '@/components/Admin/AddButton'
import EditDropDownButton from '@/components/Admin/EditDropDownButton'

export default {
  name: 'AdminChapterShow',
  components: { EditDropDownButton, AddButton, CoursesEmptyPlaceholder },
  props: ['chapter_id'],
  data() {
    return {
      loading: true,
      chapter_title: undefined,
      course_title: undefined,
      course_id: undefined,
      errorText: undefined,
      lessons: undefined,
      module_title: undefined,
      module_id: undefined,
      headers: [
        {
          text: 'ID',
          align: 'start',
          value: 'id',
          sortable: true,
        },
        { text: 'Название', value: 'title', sortable: true },
        { text: 'Тип', value: 'type.name', sortable: true },
        { text: 'Порядок', value: 'order', sortable: true },
      ],
      material_headers: [
        { text: '#', align: 'start', value: 'order', sortable: true },
        { text: 'Название', value: 'title', sortable: true },
        { text: 'Ссылка', value: 'link', sortable: true },
        { text: 'Описание', value: 'description', sortable: true },
        { text: '', value: 'tools', sortable: false },
      ],
      material_loading: true,
      materials: undefined,
      add_material_loading: false,
      add_material_visible: false,
      is_edit: false,
      material: {
        title: undefined,
        link: undefined,
        order: undefined,
        description: undefined,
      },
    }
  },

  mounted() {
    this.fetchLessons().then(() => {
      this.fetchMaterials()
      this.$store.dispatch('breadcrumbs/setLinks', [
        {
          text: 'Все курсы',
          to: {
            name: 'AdminCoursesIndex',
          },
        },
        {
          text: this.course_title,
          to: {
            name: 'AdminCourseShow',
            params: {
              course_id: this.course_id,
            },
          },
        },
        {
          text: this.module_title,
          to: {
            name: 'AdminModuleShow',
            params: {
              course_id: this.course_id,
              module_id: this.module_id,
            },
          },
        },
        {
          text: this.chapter_title,
          disabled: true,
          // to: { name: 'LessonShow', params: { lesson_id: this.lesson_id }}
        },
      ])
    })
  },

  methods: {
    async fetchLessons() {
      this.loading = true
      try {
        let res = await this.$axios.get(
          'admin/chapters/' + this.chapter_id + '/lessons'
        )
        if (res?.data) {
          this.module_title = res?.data?.module?.title
          this.module_id = res?.data?.module?.id
          this.course_title = res?.data?.module?.course?.title
          this.course_id = res?.data?.module?.course?.id
          this.chapter_title = res?.data?.title
          this.lessons = res?.data?.lessons
        } else {
          throw new Error('Пришли пустые данные')
        }
      } catch (err) {
        this.errorText = err
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchMaterials() {
      this.material_loading = true
      try {
        const res = await this.$axios.get(
          `admin/chapters/${this.chapter_id}/additional`
        )
        this.materials = res?.data
        this.material.order = this.materials?.length + 1
      } catch (e) {
        throw new Error(e)
      }
      this.material_loading = false
    },

    async saveMaterial() {
      this.add_material_loading = true
      try {
        let data = {
          chapter_id: this.chapter_id,
          ...this.material,
        }
        await this.$axios.post(`admin/additional`, data)
        this.$store.dispatch('snackbar/START_SNACKBAR', {
          text: `Добавлено`,
          color: 'success',
        })
        this.fetchMaterials()
        this.clearMaterialValues()
      } catch (e) {
        throw new Error(e)
      }
      this.add_material_loading = false
    },

    editMaterial(item) {
      this.material = { ...item }
      this.is_edit = true
      this.add_material_visible = true
    },

    async deleteMaterial(id) {
      try {
        await this.$axios.delete(`admin/additional/${id}`)
        this.$store.dispatch('snackbar/START_SNACKBAR', {
          text: `Удалено`,
          color: '#5CC689',
        })
        this.fetchMaterials()
      } catch (e) {
        throw new Error(e)
      }
    },

    clearMaterialValues() {
      this.material = {
        title: undefined,
        link: undefined,
        order: this.materials?.length + 1,
        description: undefined,
      }
      this.add_material_visible = false
      this.is_edit = false
    },

    changeToLessonShowPage(item) {
      this.$router.push({
        name: 'AdminLessonShow',
        params: {
          chapter_id: this.chapter_id,
          lesson_id: item.id,
        },
      })
    },
  },
}
</script>
