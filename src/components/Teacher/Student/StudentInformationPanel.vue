<template>
  <div class="student-information">
    <v-expansion-panels v-model="active" accordion flat>
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          <span class="student-information__header">
            <div class="student-information__icon-container">
              <v-icon dark size="28">
                {{ mdiAccount }}
              </v-icon>
            </div>
            <span class="student-information__header__title">Информация о студенте</span>
          </span>
          <template v-slot:actions>
            <span class="student-information__action">{{ active === 0 ? 'СКРЫТЬ' : 'ПОКАЗАТЬ' }}</span>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="student-information__content pt-4">
            <div>
              <p class="student-information__content__section-title">
                Общие сведения
              </p>
              <div>
                <span class="font-weight-medium student-information__content__section-text">
                  Возраст: <span class="student-information__content__section-text" style="color: #171729">{{ age }} лет</span>
                </span>
                <span class="font-weight-medium student-information__content__section-text ml-10">
                  Email: <span class="student-information__content__section-text" style="color: #171729">{{ email }}</span>
                </span>
              </div>
            </div>
            <v-divider class="my-4"/>
            <div>
              <p class="student-information__content__section-title">
                Дополнительная информация
              </p>
              <div>
                <v-list-item class="pl-0">
                  <v-list-item-avatar color="#D8F5F3" class="d-flex justify-center" size="48">
                    <v-icon
                      color="#169095"
                      dark
                      size="30"
                    >
                      {{ mdiPercent }}
                    </v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text="'Результат теста'" class="student-information__list-item__title"/>
                    <v-list-item-subtitle v-text="`${testScore || 0}%`" class="student-information__list-item__subtitle"/>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item class="pl-0">
                  <v-list-item-avatar color="#D8F5F3" class="d-flex justify-center" size="48">
                    <v-icon
                      color="#169095"
                      dark
                      size="30"
                    >
                      {{ mdiHeadCog }}
                    </v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text="'Опыт'" class="student-information__list-item__title"/>
                    <v-list-item-subtitle v-text="experience" class="student-information__list-item__subtitle"/>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item class="pl-0">
                  <v-list-item-avatar color="#D8F5F3" class="d-flex justify-center" size="48">
                    <v-icon
                      color="#169095"
                      dark
                      size="30"
                    >
                      {{ mdiRadar }}
                    </v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text="'Цель'" class="student-information__list-item__title"/>
                    <v-list-item-subtitle v-text="goal" class="student-information__list-item__subtitle"/>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </div>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { mdiAccount, mdiPercent, mdiHeadCog, mdiRadar } from '@mdi/js'

export default {
  name: "StudentInformationPanel",
  props: {
    testScore: [Number, String],
    experience: String,
    email: String,
    goal: String,
    age: [String, Number]
  },
  data() {
    return {
      mdiAccount,
      mdiPercent,
      mdiHeadCog,
      mdiRadar,
      active: undefined
    }
  }
}
</script>

<style lang="scss">
.student-information {
  border: 1px solid rgba(23, 23, 42, 0.08);
  margin-bottom: 32px;
  border-radius: 10px;
  margin-top: 32px;

  & .v-expansion-panel-header--active {
    background-color: #f5f6f8;
  }

  &__icon-container {
    background-color: #5E6A82;
    border-radius: 7px;
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
  }

  .v-expansion-panels {
    border-radius: 10px;
  }

  .v-expansion-panel-content {
    border-top: 1px solid rgba(23, 23, 41, 0.08);
  }

  &__header {
    color: #5A6275;
    font-size: 18px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 32px;
    transition: background-color 0.3s ease;

    &__title {
      font-weight: bold;
      font-size: 18px;
      line-height: 24px;
      letter-spacing: 0.02em;
      color: #171729;
    }
  }

  &__action {
    transition: color 0.3s ease;
    font-weight: 600;
    color: #5A6275;

    &:hover {
      color: #0BC3B8;
    }
  }

  &__content {
    &__section-title {
      font-weight: 600;
      font-size: 18px;
      line-height: 24px;
    }
    &__section-text {
      font-size: 15px;
      line-height: 24px;
      color: #505768;
    }
  }

  &__list-item {
    &__title {
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      color: #505768;
    }
    &__subtitle {
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
    }
  }
}
</style>
