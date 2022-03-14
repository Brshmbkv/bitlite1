<template>
  <div>
    <v-simple-table class="students-rating__table">
      <template #default>
        <thead>
          <tr>
            <th class="students-rating__header" style="color: unset">
              🔥
            </th>
            <th class="students-rating__header">
              Рейтинг студентов
            </th>
            <th class="students-rating__header">
              <router-link
                tag="div"
                class="go-to-students"
                :to="{
                  name: 'StudentsRatingIndex',
                  params: {
                    module_id,
                  },
                }"
              >
                <span>Перейти к списку</span>
                <v-icon color="#4376FB">{{ mdiChevronRight }}</v-icon>
              </router-link>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, i) in students" :key="student.id">
            <th class="students-rating__body-cell text-greyscale">
              {{ i + 1 }}
            </th>
            <th class="students-rating__body-cell">{{ student.name }}</th>
            <th class="text-right students-rating__body-cell text-greyscale">
              {{ student.points }} баллов
            </th>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import { mdiChevronRight } from '@mdi/js'
export default {
  name: 'CourseStudentsRating',
  props: {
    module_id: [Number],
    students: Array,
    currentStudent: Object,
  },
  data() {
    return {
      mdiChevronRight,
    }
  },
  methods: {
    toRatingPage() {
      this.$router.push({})
    },
  },
}
</script>

<style lang="scss">
.students-rating__table {
  border: 1px solid #B0B7D08F;
  border-radius: 16px;
  overflow: hidden;
}
.students-rating__header {
  font-size: 16px !important;
  line-height: 24px;
  font-weight: 600 !important;
  letter-spacing: 0.01em;
  color: #000000 !important;
}
.students-rating__body-cell {
  font-size: 14px !important;
  line-height: 20px;
  font-weight: 500 !important;
  letter-spacing: 0.01em;
  color: #062343;
  &.text-greyscale {
    color: #828bab !important;
  }
}
.go-to-students {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4376fb;
  cursor: pointer;
  justify-content: flex-end;
}
</style>
