<template>
  <v-container class="py-0">
    <div class="footer">
      <v-breadcrumbs
        :divider="mdiCircleSmall"
        :items="[
        {
          disabled: true,
          text: '© bitlab.kz',
        },
        {
          text: 'Связаться с нами',
          to: '/i/contacts'
        },
        {
          text: 'Публичный договор-оферта',
          to: '/i/terms'
        },
      ]"
      >
        <template v-slot:divider>
          <v-icon>{{ mdiCircleSmall }}</v-icon>
        </template>
      </v-breadcrumbs>
      <div class="footer__technical-support d-flex align-center" @click="show_modal = true">
        <v-icon size="20" color="#0BC3B8">
          {{ mdiHelpCircle }}
        </v-icon>
        <span class="footer__technical-support__text">Написать в техподдержку</span>
      </div>
      <TechnicalSupportModal v-if="show_modal" @close="show_modal = false"/>
    </div>
  </v-container>
</template>

<script>
import { mdiCircleSmall, mdiHelpCircle } from '@mdi/js';
import TechnicalSupportModal from "@/components/TechnicalSupportModal";
export default {
  name: "LayoutFooter",
  components: { TechnicalSupportModal },
  data(){
    return {
      mdiCircleSmall,
      mdiHelpCircle,
      show_modal: false
    }
  },
  mounted(){
    // console.log(this.$vuetify)
  }
}
</script>

<style lang="scss">
.footer {
  position: relative;
  border-top: 1px solid rgba(23, 23, 41, 0.08);
  padding: 8px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__technical-support {
    gap: 4px;
    cursor: pointer;

    &__text {
      font-weight: bold;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.02em;
      color: #0BC3B8;
      transition: all 0.3s ease;
      border-bottom: 1px solid transparent;
    }

    &:hover {
      .footer__technical-support__text {
        border-bottom: 1px solid #0BC3B8;
      }
    }
  }
}
</style>
