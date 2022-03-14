<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="users"
      :loading="table_loading"
      :items-per-page="paginateNumber"
      :mobile-breakpoint="0"
      hide-default-footer
      hide-default-header
      @click:row="changeToUserShowPage"
      class="elevation-0 mt-3 admin-users-table__v-table"
      style="border-bottom-left-radius: 0; border-bottom-right-radius: 0"
    >
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
                style="cursor: pointer; gap: 4px"
                class="d-flex align-center"
                :class="`justify-${header.align}`"
                @click="header.sortable && $emit('order-users', header.value)"
              >
                <SortIcon v-if="header.sortable" />
                <span>{{ header.text }}</span>
              </span>
            </th>
          </tr>
        </thead>
      </template>
      <template v-slot:[`item.full_name`]="{ item }">
        <v-avatar size="30" class="mr-2">
          <v-img :src="item.avatar || UserPlaceholderSm" alt="Avatar" />
        </v-avatar>
        {{ item.first_name }} {{ item.last_name }}
      </template>
      <template v-slot:[`item.email`]="{ value }">
        <div class="d-flex align-center">
          <span @click="$event.stopPropagation()" class="pr-1">
            {{ value }}
          </span>
          <v-icon size="16" color="#0BD3B8" @click.stop.prevent="copyEmail(value)">{{
            mdiContentCopy
          }}</v-icon>
        </div>
      </template>
      <template v-slot:[`item.phone`]="{ item }">
        <span>
          {{ item.phone | VMask("+# (###) ###-##-##") }}
        </span>
      </template>
      <template v-slot:loading>
        <span>Загрузка...</span>
      </template>
      <template v-slot:[`item.options`]="{ item }">
        <EditDropDownButton
          @edit="$emit('edit-user', item.id)"
          @delete="$emit('delete-user', item)"
          class="mr-3"
        />

      </template>
    </v-data-table>
    <div class="d-flex justify-start align-center mt-5 mb-5">
      <v-pagination
        class="admin-users__v-pagination"
        v-model="page"
        :length="totalPages"
        :total-visible="7"
      />
    </div>
  </div>
</template>

<script>
import UserPlaceholderSm from "@/assets/user_placeholder_sm.png";
import { mdiCompareVertical, mdiPencilOutline, mdiContentCopy } from "@mdi/js";
import SortIcon from "@/assets/svg/sort-icon.svg";
import EditDropDownButton from "@/components/Admin/EditDropDownButton";

export default {
  name: "UsersTable",
  components: {
    EditDropDownButton,
    SortIcon,
  },
  props: {
    users: Array,
    totalPages: {
      type: Number,
      default: 1,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    paginateNumber: {
      type: Number,
      default: 10,
    },
    table_loading: {
      type: Boolean,
      default: false,
    },
    userRoleType: {
      type: String,
      default: undefined,
    },
  },

  data() {
    return {
      mdiPencilOutline,
      mdiCompareVertical,
      UserPlaceholderSm,
      mdiContentCopy,
      page: undefined,
      headers: [
        {
          text: "ID",
          align: "start",
          value: "id",
          sortable: true,
        },
        { text: "Полное имя", value: "full_name", sortable: true },
        { text: "Почта", value: "email", sortable: true },
        { text: "Телефон", value: "phone", sortable: true },
        { text: "Править", value: "options", align: "end", sortable: false },
      ],
    };
  },

  watch: {
    currentPage: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue && newValue > 0) {
          this.page = this.currentPage;
        }
      },
      immediate: true,
    },

    page() {
      this.$emit("fetch-users", this.page);
    },
  },

  methods: {
    async copyEmail(text) {
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        console.log(e);
      }
    },
    changeToUserShowPage(item) {
      const routeName = {
        1: "AdminAdminShow",
        2: "AdminStudentShow",
        3: "AdminTeacherShow"
      }[item?.role?.id] || "AdminStudentShow"

      this.$router.push({
        name: routeName, 
        params: {
          user_id: item.id,
        },
      });
    },
  },
};
</script>
