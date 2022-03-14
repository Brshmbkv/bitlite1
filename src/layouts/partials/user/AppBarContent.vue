 <template>
  <v-container class="admin__app-bar-content py-0">
    <v-row>
      <v-col
        cols=12
        class='d-flex py-0'
      >
        <div
          class="d-flex mt-6 mb-4"
          v-if="$vuetify.breakpoint.smAndDown"
          style="cursor: pointer;"
          @click="$route.name !== 'Profile' ? $router.replace('/u/profile') : ''"
        >
          <v-avatar class="mr-4">
            <v-img
                :src="avatar || UserPlaceholderSm"
            />
          </v-avatar>
          <div>
            <span
                :class="{'d-block text-subtitle-2 active_tab' : $route.path.startsWith('/u/profile'), 'd-block text-subtitle-2' : $route.path.startsWith('')}"
            >{{ fullname || '' }}</span>
            <span
                style="line-height: 20px"
                class="d-block text-body-2 grayLight--text"
            >{{ role || '' }}</span>
          </div>
        </div>
        <v-container v-if="$vuetify.breakpoint.mdAndUp">
          <v-row>
            <router-view name="crumbs"/>
          </v-row>
        </v-container>
        <v-spacer />
        <v-app-bar-nav-icon
          class="d-block d-md-none my-auto"
          @click.stop="$emit('menu-click')"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png';
export default {
  name: 'app-bar__content',
  props: ['fullname', 'role', 'avatar'],
  data(){
    return { UserPlaceholderSm }
  },
}
</script>

<style lang="scss">
.admin__app-bar-content{
  .active_tab {
    color: #0BC4B8;
  }
}
</style>
