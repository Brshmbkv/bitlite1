<template>
  <v-container>
    <PassedStudentsList
      :exercise_id="Number(exercise_id)"
      :stream_id="Number(stream_id)"
      :group_id="Number(group_id)"
    />
  </v-container>
</template>

<script>
import PassedStudentsList from "@/components/Teacher/Group/PassedStudentsList";

export default {
  name: 'StreamExerciseShow',
  components: {
    PassedStudentsList,
  },
  props: ['exercise_id', 'stream_id', 'group_id'],
}
</script>
