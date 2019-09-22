<script>
  export default {
    methods: {
      toggleDrawer() {
        this.$emit('toggle-drawer')
      },
    },
  }
</script>

<template>
  <v-app-bar
    app
    dense
    collapse-on-scroll
    color="primary"
  >
    <v-app-bar-nav-icon @click.stop="toggleDrawer" />

    <v-toolbar-title>{{ $route.meta.title }}</v-toolbar-title>
  </v-app-bar>
</template>

<style scoped>
  .v-toolbar.v-toolbar--collapsed {
    max-width: 80px;
  }
</style>
