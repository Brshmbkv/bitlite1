<template>
  <div>
    <div class="stream-students__table-wrapper">
      <table class="stream-students__table">
        <thead>
          <tr>
            <th class="
                stream-students-table__heading
                stream-students-table__heading--id">
              #
            </th>
            <th class="stream-students-table__heading">
              Студент
            </th>
            <th class="stream-students-table__heading">
              Email
            </th>
            <th class="stream-students-table__heading text-center">
              Успеваемость
            </th>
            <th class="stream-students-table__heading text-center">
              Посещаемость
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="students.length !== 0">
            <router-link
              v-for="(student, ekey) in students"
              :key="`student-${ekey}`"
              tag="tr"
              :to="$route.query.type === 'lite' ? {
                name: 'TeacherStreamStudentShow',
                params: {
                  stream_id: group_id,
                  student_id: student.id,
                  column: $parent.column || '',
                  page: $parent.page || '',
                  order: $parent.order || '',
                }
              } : {
                name: 'TeacherGroupStudentShow',
                params: {
                  group_id,
                  student_id: student.id,
                }
              }"
              style="cursor:pointer;"
              class="stream-students-table__data-row"
            >
              <td class="stream-students-table__data stream-students-table__data--id">
                <span>#{{ ekey + 1 }}</span>
              </td>
              <td
                class="stream-students-table__data "
              >
                <v-avatar size="24" class="mr-2">
                  <v-img :src="student.avatar || UserPlaceholderSm" alt="" />
                </v-avatar>
                {{
                  (student.first_name || "") + " " + (student.last_name || "")
                }}
              </td>
              <td
                class="
                  stream-students-table__data
                "
              >
                <span>{{ student.email }}</span>
              </td>
              <td
                class="stream-students-table__data text-center"
              >
                <template v-if="student.score">
                  {{ student.score + ((student.score >= 0) ? '%' : '') }}
                </template>
                <template v-else>
                  {{ '0%' }}
                </template>
              </td>
              <td class="stream-students-table__data text-center">
                <template v-if="student.attendances >= 0">
                <p class="ma-0 pa-0">
                  <span style="color: #0BC4B8">{{ student.attendances }}/</span>{{ total_events }}
                </p>
                </template>
              </td>
            </router-link>
          </template>
          <template v-else>
            <tr class="stream-students-table__data-row">
              <td colspan="4">
                <span>Студенты не найдены</span>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
  <!-- <v-row>
    <v-col>
      <v-simple-table class="my-table">
        <thead>
        <tr>
          <th class="text-left font-weight-regular grayLight--text pl-0">#</th>
          <th class="text-left font-weight-regular grayLight--text">Имя студента</th>
          <th class="text-left font-weight-regular grayLight--text">Номер студента</th>
          <th
            v-if="$route.query.type === 'lite'"
            class="text-center font-weight-regular grayLight--text pb-2"
            @click="$emit('order-by-column', 'score')"
          >
            <SortIcon
              class="smaller-svg"
            />
            <span
              style="cursor:pointer !important;"
            >Успеваемость</span>
          </th>
          <th
            v-else
            class="text-center font-weight-regular grayLight--text"
          >
            Успеваемость
          </th>
          <th
            v-if="$route.query.type === 'lite'"
            class="text-center font-weight-regular grayLight--text pr-0 pb-2"
            @click="$emit('order-by-column', 'chapter_results_count')"
          >
            <SortIcon
              class="smaller-svg"
            />
            <span
              style="cursor:pointer !important;"
            >Прогресс</span>
          </th>
          <th
            v-else
            class="text-center font-weight-regular grayLight--text pr-0"
          >Посещаемость
          </th>
          <th
            v-if="$route.query.type === 'lite'"
            class="text-center font-weight-regular grayLight--text pb-2"
            @click="$emit('order-by-column', 'points')"
          >
            <SortIcon
              class="smaller-svg"
            />
            <span style="cursor:pointer !important;">
              Рейтинг
            </span>
          </th>
        </tr>
        </thead>
        <tbody>
        <template v-if="students && students.length > 0">
          <router-link
            v-for="(student, ekey) in students"
            :key="`student-${ekey}`"
            tag="tr"
            :to="$route.query.type === 'lite' ? {
              name: 'TeacherStreamStudentShow',
              params: {
                stream_id: group_id,
                student_id: student.id,
                column: $parent.column || '',
                page: $parent.page || '',
                order: $parent.order || '',
              }
            } : {
              name: 'TeacherGroupStudentShow',
              params: {
                group_id,
                student_id: student.id,
              }
            }"
            style="cursor:pointer;"
          >
            <td class="pl-0">{{ '#' + ((ekey + 1) + ((current_page - 1) * 10)) }}</td>
            <td>

              <v-avatar
                size="24"
                class="mr-2"
              >
                <v-img
                  :src="student.avatar || UserPlaceholderSm"
                  alt=""
                />
              </v-avatar>
              {{
                (student.first_name || '')
                + ' ' + (student.last_name || '')
              }}
            </td>
            <td class="font-weight-medium">
              {{ student.phone || '' }}
            </td>
            <td class="text-center" style="color: #0BC4B8">
              <template v-if="student.score">
                {{ student.score + ((student.score >= 0) ? '%' : '') }}
              </template>
              <template v-else>
                {{ '0%' }}
              </template>
            </td>
            <td
              v-if="$route.query.type === 'lite'"
              class="text-center pr-0"
            >
              <p class="ma-0 pa-0"><span
                style="color: #0BC4B8">{{ student.chapter_results || 0 }}/</span>{{ chapters_count }}</p>
            </td>
            <td
              v-else
              class="text-center pr-0"
            >
              <template v-if="student.attendances >= 0">
                <p class="ma-0 pa-0"><span style="color: #0BC4B8">{{ student.attendances }}/</span>{{ total_events }}
                </p>
              </template>
            </td>
            <td
              v-if="$route.query.type === 'lite'"
              class="text-center"
            >
              <span style="color: #0BC4B8">{{ student.points }} </span>
            </td>
          </router-link>
        </template>
        <p
          v-else
        >Нет данных</p>
        </tbody>
      </v-simple-table>
    </v-col>
  </v-row> -->
</template>

<script>
import UserPlaceholderSm from "@/assets/user_placeholder_sm.png";
// import SortIcon from '@/assets/svg/sort-icon.svg'

export default {
  name: "StreamStudentsTable",
  components: {
    // SortIcon
  },
  props: {
    students: {
      type: Array,
      default() {
        return [];
      },
    },
    group_id: {},
    total_events: {},
    chapters_count: [Number, String],
    current_page: [Number, String],
  },
  data() {
    return {
      UserPlaceholderSm,
    };
  },
};
</script>

<style lang="scss">
.smaller-svg {
  transform: scale(0.9) translateY(5px);
}
.stream-students {
  &__table-wrapper {
    margin: 40px 0 80px;
    overflow-x: auto;
  }
  &__table {
    min-width: 100%;
    table-layout: auto;
    border-collapse: collapse;
    border-radius: 7px 7px 0 0;
    overflow: hidden;
    thead {
      background-color: #f5f6f8;
    }
  }
  &-table__heading {
    padding: 21px 0 20px;
    text-align: left;
    font-size: 15px;
    line-height: 16px;
    font-weight: 600;
    color: #383d57;
  }
  &-table__data {
    padding: 18px 0;
    text-align: left;
    font-size: 15px;
    line-height: 16px;
    font-weight: 500;
    white-space: nowrap;
    color: #171729;
  }
  &-table__heading,
  &-table__data {
    &--id {
      padding-left: 16px;
      padding-right: 32px;
    }
    &--name {
      padding-left: 32px;
      padding-right: 32px;
    }
    &--deadline {
      padding-left: 100px;
      padding-right: 30px;
    }
    &--action {
      padding-left: 16px;
      padding-right: 16px;
    }
  }
  &-table-data__btn {
    font-size: 15px;
    line-height: 20px;
    letter-spacing: 0.01em;
    font-weight: 600;
    text-transform: lowercase;
    padding: 8px 10px;
    background-color: #0bc3b8;
    color: #ffffff;
    border-radius: 7px;
  }
  &-table__data--button {
    text-align: right;
    padding-left: 16px;
    padding-right: 16px;
  }
  &__data-avatar {
    width: 32px;
    height: 32px;
    min-width: 32px;
    border-radius: 50%;
    vertical-align: middle;
    margin-right: 9px;
    object-fit: cover;
  }
  &-table__data-row {
    border-bottom: 1px solid #dbdfea;
  }
}
</style>
