<template>
  <router-view/>
</template>

<script>
import "@/styles/admin.scss"
import { roleGuard } from "@/helpers/router.js"

export default {
  name: "AdminRoot",
  beforeRouteEnter: roleGuard,
}
</script>