<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="modules"
      :mobile-breakpoint="0"
      hide-default-footer
      hide-default-header
      @click:row="changeToModuleShowPage"
      class="elevation-0 mt-3"
      disable-sort
    >
      <template v-slot:header="{ props: { headers } }">
        <thead class="v-data-table-header">
          <tr>
            <th
              v-for="header in headers"
              :key="header.value"
              class="text-capitalize"
              scope="col"
            >
              <span
                class="d-flex align-center"
                @click="$emit('order-users', header.value)"
              >
                <span>{{ header.text }}</span>
              </span>
            </th>
          </tr>
        </thead>
      </template>
      <template #body="{items}">
        <tbody>
          <tr
            v-for="item in items"
            :key="item.id"
            style="cursor: pointer"
            @click="changeToModuleShowPage(item)"
          >
            <td>{{ item.id }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.price }}</td>
            <td>{{ item.order }}</td>
            <td>{{ item.max_points }}</td>
            <td>
              <v-btn
                outlined
                icon
                height="30"
                width="30"
                color="#4376FB"
                :ripple="false"
                style="border: 1px solid #4376FB;"
                @click.stop.prevent="$emit('edit-module', item)"
              >
                <PenIcon></PenIcon>
              </v-btn>
              <v-btn
                outlined
                icon
                height="30"
                width="30"
                :color="'#EE5252'"
                :ripple="false"
                class="admin-stream-modules-table__v-btn ml-2"
                @click.stop.prevent="removeModuleBefore(item)"
              >
                <TrashIcon></TrashIcon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
    <ConfirmationModal
      :dialog.sync="remove_dialog"
      :title="'Удаление модуля'"
      :text="`Вы действительно хотите удалить модуль ${module_title}?`"
      :action="'Удалить'"
      :loading="remove_loading"
      @success="removeModule"
    />
  </div>
</template>

<script>
import ConfirmationModal from '@/components/Admin/ConfirmationModal'
import TrashIcon from '@/assets/svg/trash.svg'
import { mdiPencilOutline } from '@mdi/js'
import PenIcon from '@/assets/svg/pen.svg'

export default {
  name: 'CourseModulesTable',
  components: {
    ConfirmationModal,
    TrashIcon,
    PenIcon,
  },
  props: {
    course_id: Number,
    modules: Array,
  },
  data() {
    return {
      mdiPencilOutline,
      remove_dialog: false,
      remove_loading: false,
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
        { text: 'Стоимость', value: 'price', sortable: true },
        { text: 'Порядок', value: 'order' },
        { text: 'Макс. очки', value: 'max_points' },
        { text: 'Действия', value: 'options', align: 'start' },
      ],
    }
  },
  methods: {
    changeToModuleShowPage(item) {
      this.$router.push({
        name: 'AdminModuleShow',
        params: {
          course_id: this.course_id,
          module_id: item.id,
        },
      })
    },

    removeModuleBefore(item) {
      const { id, title } = item
      this.module_title = title
      this.module_id = id
      this.remove_dialog = true
    },

    async removeModule() {
      this.remove_loading = true
      await this.$axios
        .delete(`admin/modules/${this.module_id}`)
        .then((res) => {
          if (res && res.data) {
            this.$emit('refresh')
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: 'Удалено!',
              color: 'success',
            })
          }
        })
        .catch((err) => {
          if (err && err.response) {
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: 'Ошибка!',
              color: 'error',
            })
          }
        })
        .finally(() => {
          this.remove_dialog = false
          this.module_title = undefined
          this.module_id = undefined
          this.remove_loading = false
        })
    },
  },
}
</script>
