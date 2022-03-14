<template>
  <v-simple-table
    class="my-table"
  >
    <thead>
      <tr>
        <th class="text-left text-no-wrap font-weight-regular grayLight--text pl-0">Имя студента</th>
        <th class="text-left text-no-wrap font-weight-regular grayLight--text">Дата входа</th>
        <th class="text-right text-no-wrap font-weight-regular grayLight--text pr-0">Присутствие на уроке</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="attendance && attendance.length > 0">
        <tr
          v-for="(attendee, akey) in attendance"
          :key="'attendee_'+attendee.id"
          :style="{
            cursor: 'default'
          }"
        >
          <td
            class="pl-0 text-no-wrap"
          >{{
              attendee.user
                ? (
                  ((attendee.user.first_name && attendee.user.first_name + ' ') || '')
                  + (attendee.user.last_name || '')
                ) : 'Нет пользователя'
          }}</td>
          <td style="width: 100%;">{{ attendee.visited_at | toRuDate }}</td>
          <td class="pr-0">
            <v-radio-group
              row
              dense
              class="my-attendence-inputs ma-0"
              :value="attendee.value"
              @change='handleAttendanceChange(attendee.id, akey)'
            >
              <!-- :error-messages="(akey === error_key) && (error_msg || 'Ошибка запроса')"
              :messages="" -->
              <v-radio
                color="primary"
                :ripple="false"
                :value="true"
                class="mr-5 mt-4"
              >
                <template v-slot:label>
                  <span>Был</span>
                </template>
              </v-radio>
              <v-radio
                color="primary"
                :ripple="false"
                :value="false"
                class="mr-0 mt-4"
              >
                <template v-slot:label>
                  <span class="text-no-wrap">Не был</span>
                </template>
              </v-radio>
            </v-radio-group>
          </td>
        </tr>
      </template>
      <p
        v-else
      >Нет данных</p>
    </tbody>
  </v-simple-table>
</template>
<script>

export default {
  name: 'EventAttendanceTable',
  filters: {
    toRuDate(d){
      if (!d){
        return ' - '
      }
      try {
        let date = new Date(Date.parse(d.replace(/ /g,"T")));
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('ru-RU', options);
      } catch(err){
        console.log(err);
        return 'Ошибка формата даты'
      }
    }
  },
  props: {
    attendance: {
      type: Array,
      default: function(){
        return [];
      }
    }
  },
  data(){
    return {
      loading: false,
      statusById: [],
      // error_msg: '',
      // error_keys: [],
      // messages: []
    }
  },
  watch: {
    attendance: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler (val) {
        this.statusById = new Array(val.length).fill(undefined)
      }
    }
  },

  methods: {
    async handleAttendanceChange(id, key){
      this.loading = true;
      this.statusById = this.statusById.map((e,i) => (i === key ? undefined : e))
      await this.$axios.post('teacher/change-attendance/', { id }).then(() => {
        // console.log(this.statusById.map((e,i) => (i === key ? true : e)))
        this.statusById = this.statusById.map((e,i) => (i === key ? true : e))
        this.$store.dispatch('snackbar/START_SNACKBAR', {
          text: 'Сохранено!',
          color: 'success'
        })
      }).catch((err) => {
        console.log(err);
        // console.log(this.statusById.map((e,i) => (i === key ? false : e)))
        this.statusById = this.statusById.map((e,i) => (i === key ? false : e))
        this.$store.dispatch('snackbar/START_SNACKBAR', {
          text: 'Ошибка!',
          color: 'red'
        })
      })
    }
  },
}
</script>

<style lang="scss">
.my-attendence-inputs{
  // .v-input__control{
  //   width: auto;
  // }
  .v-input__slot{
    justify-content: flex-end;
  }
  .v-input--radio-group__input{
    width: auto;
    flex-wrap: nowrap;
  }
}
</style>
