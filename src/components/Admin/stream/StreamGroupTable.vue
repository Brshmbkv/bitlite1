<template>
  <div class="mb-8">
    <v-data-table
      :headers="headers"
      :items="groups"
      :loading="loading"
      :mobile-breakpoint="0"
      hide-default-footer
      @click:row="changeToGroupShowPage"
      hide-default-header
      class="elevation-0 mt-3 admin-users-table__v-table"
      style="border-bottom-left-radius: 0;border-bottom-right-radius: 0;"
    >
      <template v-slot:loading>
        <span>Загрузка...</span>
      </template>
      <template v-slot:header="{ props: { headers } }">
        <thead>
        <tr>
          <th
            v-for="header in headers"
            :key="header.value"
            class="text-capitalize"
            scope="col"
          >
            <span
              style="cursor:pointer; gap: 4px"
              class="d-flex align-center"
              :class="'justify-'+(header.align || 'start')"
              @click="$emit('order-users', header.value)"
            >
              <SortIcon v-if="header.sortable"/>
              <span>{{ header.text }}</span>
            </span>
          </th>
        </tr>
        </thead>
      </template>
      <template v-slot:item.lectors="{ item }">
        <template v-if="item.lectors && item.lectors.length > 0">
          <v-avatar
            size="30"
            class="mr-2"
          >
            <v-img
              :src="item.lectors[0].avatar || UserPlaceholderSm"
              alt="Avatar"
            />
          </v-avatar>
          {{ item.lectors[0].first_name }} {{ item.lectors[0].last_name }}
        </template>
        <template v-else>
          -
        </template>
      </template>
      <template v-slot:item.options="{ item }">
<!--        <v-btn-->
<!--          icon-->
<!--          :color="'#EE5252'"-->
<!--          :ripple="false"-->
<!--          class="admin-stream-modules-table__v-btn mr-3"-->
<!--          @click.stop.prevent="removeGroup(item.id)"-->
<!--        >-->
<!--          <TrashIcon></TrashIcon>-->
<!--        </v-btn>-->
        <EditDropDownButton
          class="mr-3"
          @edit="$emit('edit-group', item.id)"
          @delete="removeGroup(item.id)"
        />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png'
import { mdiCompareVertical, mdiPencilOutline, mdiCalendarBlankOutline } from '@mdi/js'
// import TrashIcon from '@/assets/svg/trash.svg'
import SortIcon from '@/assets/svg/sort-icon.svg'
import EditDropDownButton from "@/components/Admin/EditDropDownButton";

export default {
  name: "StreamGroupTable",
  components: {
    EditDropDownButton,
    // TrashIcon,
    SortIcon
  },
  props: {
    groups: {
      type: Array,
    },
    stream_id: [Number, String],
    loading: Boolean
  },

  data() {
    return {
      mdiPencilOutline,
      UserPlaceholderSm,
      mdiCalendarBlankOutline,
      mdiCompareVertical,
      headers: [
        { text: 'Название', value: 'name', sortable: true },
        { text: 'Практиканты', value: 'lectors' },
        { text: 'Кол-во студентов', value: 'students_count', align: 'center' },
        { text: 'Править', value: 'options', align: 'end', sortable: false },
      ],
    }
  },

  methods: {
    changeToGroupShowPage(item) {
      this.$router.push({
        name: 'AdminStreamGroupShow',
        params: {
          group_id: item.id,
          stream_id: this.stream_id
        }
      })
    },

    async removeGroup(id) {
      await this.$axios.delete(`admin/groups/${ id }`)
        .then(res => {
          if(res && res.data) {
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: 'Удалено!',
              color: 'success'
            })
            this.$emit('update-groups')
          }
        })
    }
  }
}
</script>
