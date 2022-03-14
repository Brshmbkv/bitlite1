<template>
  <v-col
    cols="12"
    md="6"
  >
    <file-pond
      ref="pond"
      allow-multiple="true"
      :accepted-file-types="[
        'text/plain',
        'application/x-zip',
        'application/x-zip-compressed',
        'application/x-rar-compressed',
        '.rar',
        '.java',
        '.py',
        '.php',
        '.cpp',
      ]"
      :files="files"
      :server="myServer"
      :credits="''"
      :fileValidateTypeDetectType="detectorFunction"
      labelIdle="Перетащите файлы сюда или нажмите для выбора"
      labelFileProcessing="Загружается..."
      labelFileProcessingComplete="Загружено"
      labelFileProcessingError="Ошибка!"
      :labelFileTypeNotAllowed="'Не поддерживаемый файл!'"
      :fileValidateTypeLabelExpectedTypes="'[text, txt, zip, rar, java, py, php, cpp]'"
      labelTapToRetry="нажмите чтобы повторить загрузку"
      labelTapToCancel="нажмите чтобы прервать загрузку"
      labelTapToUndo="нажмите чтобы отменить загрузку"
      @activatefile="downloadFile"
      @processfiles="$emit('setSavable', true)"
    />
  </v-col>
</template>

<script>
import vueFilePond from 'vue-filepond';
import 'filepond/dist/filepond.min.css'
import FilePondPluginFileValidateType
  from 'filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.esm.js';
// import FilePondPluginImagePreview from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.esm.js';
import 'filepond/dist/filepond.min.css';
import { cancelToken, isCancel } from "@/settings/axios";
// import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
export default {
  name: "FileUploader",
  components: {
    FilePond: vueFilePond(FilePondPluginFileValidateType)
  },
  props: {
    files: {
      type: Array,
      default() {
        return []
      },
    },
    model_id: {
      type: Number,
    },
    uuid: {
      type: String,
    }
  },
  data() {
    return {
      source: cancelToken(),
      myServer: {
        url: 'https://app.bitlab.academy',
        process: this.processTempFile,
        revert: this.revertTempFile,
        remove: this.removeTempFile,
      },
    }
  },
  methods: {
    detectorFunction:(file, type) => new Promise((resolve, reject) => {
      let validTypes = [
        'application/x-zip-compressed',
        'application/x-rar-compressed',
        'application/x-zip',
        'text/plain',
      ]

      let ifInValidTypes = (validTypes.indexOf(type) > -1)
      let isRar = (type === "") && (file.name.endsWith('.rar'))
      let isJava = (type === '') && (file.name.endsWith('.java'))
      let isPy = (type === '') && (file.name.endsWith('.py'))
      let isCPP = (type === '') && (file.name.endsWith('.cpp'))
      let isPHP = (type === '') && (file.name.endsWith('.php'))

      if(isRar || isPy || isCPP || isPHP || isJava || ifInValidTypes)  {
        resolve(ifInValidTypes ? type : validTypes[0])
      } else {
        reject()
      }
    }),

    async downloadFile(file) {
      await this.$axios.get('/attachments/' + file.file.id + '/download', {
        responseType: 'blob'
      }).then(res => {
        if (res && res.data){
          const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', file.file.name); //any other extension
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      })
    },

    processTempFile(fieldName, file, metadata, load, error, progress, abort) {
      const formData = new FormData();
      formData.append('file', file);
      if (this.model_id) {
        formData.append('model_id', String(this.model_id))
      } else if (this.uuid) {
        formData.append('uuid', this.uuid);
      } else {
        throw new Error('No model_id or uuid provided during temp file upload!')
      }
      formData.append('model_type', 'exercise_result');
      this.$axios.post(
        '/attachments',
        formData,
        {
          cancelToken: this.source?.token,
          onUploadProgress: (e) => {
            progress(e.lengthComputable, e.loaded, e.total)
          }
        }
      )
        .then(response => {
          // console.log(response);
          load(response.data.data.id)
        })
        .catch((err) => {
          if (isCancel(err)) {
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: 'Загрузка файла отменена!',
              color: 'success'
            })
          } else {
            error();
          }
        })

      return {
        abort: () => {
          this.source?.cancel('Operation canceled by the user.');
          this.source = cancelToken()
          abort()
        }
      };
    },

    revertTempFile(fileID, load, error) {
      this.$store.dispatch('snackbar/START_SNACKBAR', {
        text: 'Загруженный файл удален!',
        color: 'success'
      })
      this.$axios.delete(
        '/attachments/' + fileID,
      ).then(response => {
        load(response.data.data.id)
      }).catch(() => {
        error();
      })

    },

    removeTempFile(src, load, error) {
      let files = this.$refs.pond.getFiles() || []
      let id = -1
      for (let i = 0; i < files.length; i++) {
        if (files[i]?.source === src) {
          id = files[i].file.id
        }
      }

      this.$axios.delete(
        '/attachments/' + id,
      )
        .then(response => {
          // console.log(response);
          this.$emit('file-remove', id)
          this.$store.dispatch('snackbar/START_SNACKBAR', {
            text: 'Файл успешно удален!',
            color: 'success'
          })
          load(response.data)
        })
        .catch(() => {
          error();
        })

    },
  }
}
</script>
