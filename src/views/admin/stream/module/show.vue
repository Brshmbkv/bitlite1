<template>
  <v-container fluid>
    <h1 class="my-4" style="font-size: 24px; font-weight: 700">
      {{ module_title || 'Модуль' }}
    </h1>
    <v-divider class="my-6" />
    <div class="d-flex flex-wrap justify-space-between align-center mb-6">
      <span style="font-size: 20px; font-weight: 600"
        >Запланированные уроки</span
      >
      <div class="d-flex align-center" style="gap: 10px">
        <v-chip
          :ripple="false"
          color="#4376FB1a"
          text-color="#4376FB"
          label
          class="py-5"
          @click="repeat_dialog = true"
        >
          <v-icon class="mr-2" size="18">
            {{ mdiRefresh }}
          </v-icon>
          Повторить урок
        </v-chip>
        <v-chip
          :ripple="false"
          color="#4376FB1a"
          text-color="#4376FB"
          label
          class="py-5"
          @click="generate_dialog = true"
        >
          + Сгенерировать уроки
        </v-chip>
        <v-chip
          :ripple="false"
          color="#4376FB1a"
          text-color="#4376FB"
          label
          class="py-5"
          @click="add_dialog = true"
        >
          + Добавить урок
        </v-chip>
      </div>
    </div>

    <div>
      <div v-if="tab_loading" class="d-flex" style="gap: 12px">
        <v-skeleton-loader v-for="i in 4" :key="i" type="button" />
      </div>
      <v-tabs
        v-else
        v-model="tab"
        background-color="transparent"
        class="admin-users__v-tabs"
      >
        <v-tabs-slider :color="'#0ACCDA'"></v-tabs-slider>
        <v-tab
          v-for="group in groups"
          :ripple="false"
          active-class="active--tab"
          class="users__v-tab px-3"
          :disabled="tab_loading"
          :key="group.id"
          :href="`#${group.id}`"
          @click="handleTabClick(group.id)"
        >
          <span style="letter-spacing: 0 !important;">{{ group.name }}</span>
        </v-tab>
      </v-tabs>
    </div>

    <AddEventDialog
      :dialog.sync="add_dialog"
      :lectors="lectors"
      :group_id="Number(group_id)"
      :chapters="chapters"
      :event.sync="editable_event"
      @refresh="fetchEvents"
    />
    <ModuleLessonsTable
      :events="events"
      :loading="loading"
      :students-count="students_count"
      @refresh="fetchEvents"
      @edit-event="
        (event) => {
          editEvent(event)
        }
      "
      @open-students-dialog="
        (item) => {
          this.event_id = item.id
          this.group_students_dialog = true
        }
      "
    />
    <RepeatEventDialog
      v-if="!loading"
      :dialog.sync="repeat_dialog"
      :events="events"
      @refresh="fetchEvents"
    />
    <GenerateEventDialog
      :dialog.sync="generate_dialog"
      :lectors="lectors"
      :group_id="Number(stream_id)"
      :module_id="Number(module_id)"
      @update-events="fetchEvents"
    />
    <ModuleGroupStudentsDialog
      :dialog.sync="group_students_dialog"
      :group_id="Number(group_id)"
      :event_id="Number(event_id)"
    />
  </v-container>
</template>

<script>
import { mdiRefresh } from '@mdi/js'
import ModuleLessonsTable from '@/components/Admin/stream/module/ModuleLessonsTable'
const RepeatEventDialog = () =>
  import('@/components/Admin/stream/module/RepeatEventDialog')
const GenerateEventDialog = () =>
  import('@/components/Admin/stream/module/GenerateEventDialog')
const AddEventDialog = () =>
  import('@/components/Admin/stream/module/AddEventDialog')
const ModuleGroupStudentsDialog = () =>
  import('@/components/Admin/stream/module/ModuleGroupStudentsDialog')

export default {
  name: 'AdminStreamModuleShow',
  components: {
    ModuleGroupStudentsDialog,
    AddEventDialog,
    GenerateEventDialog,
    RepeatEventDialog,
    ModuleLessonsTable,
  },
  props: {
    stream_id: [Number, String],
    module_id: [Number, String],
  },
  data() {
    return {
      mdiRefresh,
      tab: undefined,
      tab_loading: undefined,
      loading: false,
      events: undefined,
      lectors: undefined,
      chapters: undefined,
      groups: undefined,
      module_title: undefined,
      stream_title: undefined,
      repeat_dialog: false,
      generate_dialog: false,
      group_students_dialog: false,
      add_dialog: false,
      group_id: undefined,
      event_id: undefined,
      editable_event: undefined,
      students_count: undefined,
    }
  },
  mounted() {
    this.fetchGroups().then(() => {
      this.$store.dispatch('breadcrumbs/setLinks', [
        {
          text: 'Все потоки',
          to: {
            name: 'AdminStreamIndex',
          },
        },
        {
          text: this.stream_title || 'Поток',
          to: {
            name: 'AdminStreamShow',
            params: {
              stream_id: this.stream_id,
            },
          },
        },
        {
          text: this.module_title || 'Модуль',
          disabled: true,
          // to: { name: 'LessonShow', params: { lesson_id: this.lesson_id }}
        },
      ])
      this.editable_event = undefined
    })
  },
  methods: {
    async fetchGroups() {
      this.tab_loading = true
      await this.$axios
        .get(`admin/streams/${this.stream_id}/modules/${this.module_id}`)
        .then((res) => {
          if (res?.data) {
            this.module_title = res?.data?.module?.title
            this.stream_title = res?.data?.stream?.name
            this.lectors = res?.data?.stream?.lector || []
            this.groups = res?.data?.stream?.groups || []

            if (this.groups && this.groups.length > 0) {
              this.group_id = this.groups[0]?.id
              this.fetchEvents()
            }
          }
        })
        .finally(() => {
          this.tab_loading = false
        })
    },

    async fetchEvents() {
      this.loading = true
      this.events = []
      await this.$axios
        .get(`admin/groups/${this.group_id}/modules/${this.module_id}/events`)
        .then((res) => {
          if (res && res.data) {
            this.events = res.data.events
            this.students_count = res?.data?.group?.students_count
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    handleTabClick(id) {
      this.group_id = id
      this.fetchEvents()
    },

    editEvent(item) {
      this.editable_event = item
      this.add_dialog = true
    },
  },
}
</script>

<style lang="scss"></style>
