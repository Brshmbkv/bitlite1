<template>
  <v-dialog
    v-model="value"
    scrollable
    content-class="white"
    @click:outside="closeDialog"
  >
    <v-card
      elevation="0"
    >
      <v-form
        v-if="student"
        class="pa-8"
      >
        <p class="mb-5 font-weight-bold mb-4" style="font-size: 22px">Студент:
          {{
            `${ student.first_name || '' } ${ student.last_name || '' }`
          }}</p>
        <template v-if="content">
          <p class="my-practicants-modal__title">Задание</p>
          <div
            class="my-practicants-modal__content"
            v-html="decodeHTML(content)">
          </div>
        </template>
        <template
          v-if="showCode"
        >
          <p class="my-practicants-modal__title mt-6">Ответ</p>
          <highlight
            autodetect
            :code="student.result && student.result.value"
          />
        </template>
        <template
          v-else-if="student.answer_type === 'file' && student.result"
        >
          <p class="my-practicants-modal__title mt-6">Прикрепленные файлы</p>
          <div
            class="row ma-1"
            v-for="(file) in student.result && student.result.attachments"
            :key="file.id"
          >
            <v-chip
              color="primary"
              label
              :ripple="false"
              @click="$emit('download-file', file.id, file.name)"
            >
              <v-icon left small>
                {{ mdiPaperclip }}
              </v-icon>
              {{ file.name }}
            </v-chip>
          </div>
        </template>
        <p class="my-practicants-modal__title mt-6">Комментарий</p>
        <v-textarea
          outlined
          placeholder="Напишите комментарий"
          :value="comment"
          @change="$emit('update:comment', $event)"
          autocomplete="off"
        ></v-textarea>
        <div
          class="mb-4"
        >
          <span class="my-practicants-modal__title mr-3">Оценка</span>
          <v-chip
            outlined
            :color="student.result && student.result.overdue ? '#EE5252' : '#5CC689'"
            class="pl-2"
            style="font-size: 12px"
            small
          >
            <v-icon
              small
              class="mr-1"
            >
              {{
                student.result && student.result.overdue ? mdiAlertCircleOutline : mdiCheck
              }}
            </v-icon>
            {{
              student.result && student.result.overdue ? 'Сдан не в срок' : 'Сдан в срок'
            }}
          </v-chip>
        </div>
        <div class="d-flex">
          <v-text-field
            outlined
            height="48"
            :value="score"
            type="number"
            placeholder=" "
            autocomplete="off"
            @wheel="$event.target.blur()"
            @input="$emit('update:score', $event)"
            :rules="scoreRules"
            :error-messages="errors ? 'Введенное число не должно превышать 100' : ''"
          ></v-text-field>
          <div
            v-if="student.result && student.result.overdue"
            style="border: 1px solid #9FA4B1; height: 56px;border-radius: 4px"
            class="d-flex justify-space-between align-items-center ml-2 pl-4 pr-2"
          >
            <p class="mb-0 align-self-center" style="font-weight: 600; color: #5A6275">Занизить оценку</p>
            <v-switch
              :value="underestimate"
              inset
              class="beautiful__switch align-self-center ml-10"
              :ripple="false"
              @change="$emit('update:underestimate', $event)"
            />
          </div>
        </div>
        <div class="d-flex">
          <v-btn
            :ripple="false"
            :disabled="loading"
            :elevation="0"
            color="#F16635"
            outlined
            class="text-capitalize px-sm-8 py-sm-6 mr-auto"
            style="font-weight: 600"
            @click="$emit('change-score', true)"
          >На доработку
          </v-btn>
          <v-btn
            :ripple="false"
            :disabled="loading"
            :elevation="0"
            color="#0BC4B8"
            class="text-capitalize white--text px-sm-8 py-sm-6"
            @click="$emit('change-score', false)"
          >Оценить
          </v-btn>
          <v-btn
            :ripple="false"
            :disabled="loading"
            :elevation="0"
            color="#9FA4B1"
            class="text-capitalize white--text px-sm-8 py-sm-6 ml-5"
            @click="closeDialog"
          >Отмена
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { decodeHTML } from "@/helpers";
import highlight from "@/components/highlight.vue"
import { mdiPaperclip, mdiAlertCircleOutline, mdiCheck } from '@mdi/js'

export default {
  name: "RateStudentDialog",
  components: { highlight },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    student: {
      type: Object,
      default: () => ({})
    },
    underestimate: {
      type: Boolean,
      default: false
    },
    score: [Number, String],
    content: String,
    comment: String,
    errors: [String, Object, Array, Boolean]
  },
  data() {
    return {
      mdiCheck,
      mdiPaperclip,
      mdiAlertCircleOutline,
      scoreRules: [
        v => (v >= 0) || "Введенное значение не должно быть меньше 0",
        v => (v <= 100) || "Введенное значение не должно превышать 100",
      ],
    }
  },
  computed: {
    showCode() {
      return ['text', 'compiler', 'compiler_noj'].includes(this.student.answer_type)
    }
  },
  methods: {
    decodeHTML,
    closeDialog() {
      this.$emit('update:value', false)
      document.getElementsByClassName('v-dialog v-dialog--active')[0].scrollTop = 0
    }
  }
}
</script>

<style lang="scss">
.my-practicants-modal__title {
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.02em;
}

.my-practicants-modal__content {
  padding: 12px 16px;
  max-height: 200px;
  border: 1px solid #171729;
  overflow-y: auto;
}
</style>

