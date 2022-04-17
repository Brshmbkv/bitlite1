<template>
  <div class="" style="gap: 25px">
    <template v-if="loading">
      <v-skeleton-loader
        type="image"
        width="100%"
        height="24px"
      ></v-skeleton-loader>
      <v-skeleton-loader
        class="mt-4"
        type="image"
        width="100%"
        height="24px"
      ></v-skeleton-loader>
      <v-skeleton-loader
      class="mt-4"
        type="image"
        width="100%"
        height="24px"
      ></v-skeleton-loader>
    </template>
    <template v-else>
      <div style="display: flex; flex-direction: column;">
        <TeacherCard
          v-for="teacher in teachers"
          :key="teacher.id"
          :name="(teacher.first_name || '') + ' ' + (teacher.last_name || '')"
          :avatar="teacher.avatar"
          @remove="removeUser(teacher)"
        />
      </div>
      <button style="width: 40px; height: 40px; background-color: #e4e4e4; display: grid; place-content: center; border-radius: 8px; margin-top: 8px;" @click="$emit('add')">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22 13.6663H13.6667V21.9997C13.6667 22.9163 12.9167 23.6663 12 23.6663C11.0834 23.6663 10.3334 22.9163 10.3334 21.9997V13.6663H2.00004C1.08337 13.6663 0.333374 12.9163 0.333374 11.9997C0.333374 11.083 1.08337 10.333 2.00004 10.333H10.3334V1.99967C10.3334 1.08301 11.0834 0.333008 12 0.333008C12.9167 0.333008 13.6667 1.08301 13.6667 1.99967V10.333H22C22.9167 10.333 23.6667 11.083 23.6667 11.9997C23.6667 12.9163 22.9167 13.6663 22 13.6663Z"
            fill="#0ACCDA"
          />
        </svg>
      </button>
    </template>
  </div>
</template>

<script>
import TeacherCard from '@/components/Admin/user/TeacherCard'

export default {
  name: 'TeacherCardList',
  components: { TeacherCard },
  props: {
    teachers: Array,
    loading: Boolean,
    stream_id: Number,
  },
  methods: {
    async removeUser(teacher) {
      await this.$axios
        .post('admin/removeUser', {
          user_id: teacher.id,
          group_id: this.stream_id,
        })
        .then((res) => {
          if (res && res.data) {
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: `Преподаватель ${teacher.first_name ||
                ''} ${teacher.last_name || ''} был удален.`,
              color: '#E7AE1E',
            })
            this.$emit('refresh')
          }
        })
    },
  },
}
</script>

<style lang="scss">
.add-user__card {
  background: rgba(23, 23, 41, 0.08);
  border: 1px solid rgba(23, 23, 41, 0.08);
  box-sizing: border-box;
  border-radius: 10px;
  min-height: 170px;
  width: 170px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &__btn {
    transition: all 0.5s ease;

    &:hover {
      transform: rotate(180deg);
    }
  }

  &__skeleton {
    border: 1px solid rgba(23, 23, 41, 0.08);
    background: #ffffff;
    flex-direction: column;
  }
}
</style>
