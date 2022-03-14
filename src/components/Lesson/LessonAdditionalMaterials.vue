<template>
  <div class="lesson__additional-materials">
    <v-expansion-panels v-model="active" accordion flat>
      <v-expansion-panel>
        <v-expansion-panel-header style="padding: 12px;">
          <span style="display:flex; align-items: center;">
            <v-avatar color="#4376FB29" size="36" class="mr-4">
              <v-icon dark size="20" color="#4376FB">
                {{ mdiFileDocument }}
              </v-icon>
            </v-avatar>
            <span style="font-size: 16px; line-height: 24px; color: #000221A3;">Доп. материалы</span>
          </span>

        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="lesson__additional-materials__content pt-4">
            <p
              v-for="(material, index) in materials"
              :key="material.id"
              class="lesson__additional-materials__material"
            >
              <span class="gray--text mr-md-13 mr-4">{{ index + 1 }}.</span>
              <a
                :href="material.link"
                target="_blank"
                class="lesson__additional-materials__material-link"
              >
                {{ material.title || 'Материал' + (index + 1) }}
                <v-icon color="#3E77FF" size="18" class="ml-1">
                  {{ mdiOpenInNew }}
                </v-icon>
              </a>
            </p>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { mdiFileDocument, mdiOpenInNew } from '@mdi/js'

export default {
  name: 'LessonAdditionalMaterials',
  props: {
    materials: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      mdiFileDocument,
      mdiOpenInNew,
      active: undefined,
    }
  },
}
</script>

<style lang="scss">
.lesson__additional-materials {
  border: 1px solid rgba(23, 23, 42, 0.08);
  margin-bottom: 32px;
  border-radius: 10px;

  .v-expansion-panels {
    border-radius: 10px;
  }

  .v-expansion-panel-content {
    border-top: 1px solid rgba(23, 23, 41, 0.08);
  }

  &__header {
    color: #5a6275;
    font-size: 18px;
    font-weight: 500;
  }

  &__action {
    transition: color 0.3s ease;
    font-weight: 600;
    color: #5a6275;

    &:hover {
      color: #0bc3b8;
    }
  }

  &__material {
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 10px !important;

    &-link {
      text-decoration: none;
      color: #3e77ff !important;

      &:hover {
        text-decoration: underline;
      }
    }

    &:last-child {
      margin-bottom: 5px !important;
    }
  }
}
</style>
