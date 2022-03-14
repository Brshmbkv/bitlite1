<template>
  <v-row>
    <v-col cols="12">
      <h5 class="text-h6 font-weight-bold">Менторы</h5>
    </v-col>
    <template v-if="loading">
      <v-col cols=12 md=3>
        <v-skeleton-loader type="card"/>
      </v-col>
      <v-col cols=12 md=3>
        <v-skeleton-loader type="card"/>
      </v-col>
    </template>
    <template v-else-if="mentors.length">
      <v-col 
        v-for="(mentor, key) in mentors"
        :key="key"
        cols="12"
        sm="4" 
        md="3"
      >
        <v-img 
          aspect-ratio="1"
          :src="mentor.avatar || UserPlaceholderMd"
          class="mb-4"
        >
        </v-img>
        <p class="text-body-1 font-weight-medium mb-0">{{ (mentor.first_name || '' ) + ' ' + (mentor.last_name || '')}}</p>
        <p class="text-body-2 mb-0">{{ mentor.about || '' }}</p>
      </v-col>
    </template>
    <template v-else>
      <v-col cols=12 md=3>
        <p class="text-body-2 mb-0">Нет данных</p>
      </v-col>
    </template>
  </v-row>
</template>

<script>
  
import UserPlaceholderMd from '@/assets/user_placeholder_md.png';
export default {
  props: ['module_id'],
  data(){
    return {
      UserPlaceholderMd,
      loading: true,
      mentors: []
    }
  },
  methods: {
    async fetchMentors(moduleId){
      return this.$axios.get(
        '/lectors-by-course-module/' + moduleId
      ).then((res) => {
        if (res && res.data){
          this.mentors = res.data;
        }
      })
    }
  },
  watch: {
    module_id(newVal){
      this.loading = true;
      this.fetchMentors(newVal).finally(() => {
        this.loading = false;
      });
    },
  },
  mounted(){
    this.loading = true;
    this.fetchMentors(this.module_id).finally(() => {
      this.loading = false;
    });
  },
}
</script>