<script>
export default {
  methods: {
    toggleDrawer() {
      this.$emit('toggle-drawer')
    },

    goBack() {
      if(this.$el.classList.contains('v-toolbar--collapsed')) {
        this.$vuetify.goTo('#app')
      } else {
        this.$router.back()
      }
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

    <div class="flex-grow-1"></div>

    <v-btn icon @click="goBack">
      <v-icon>mdi-chevron-left-circle</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<style scoped>
  .v-app-bar .mdi-chevron-left-circle {
    transition: all 0.1s ease;
  }

  .v-toolbar.v-toolbar--collapsed {
    max-width: 104px;
  }

  .v-toolbar.v-toolbar--collapsed .mdi-chevron-left-circle {
    transform: rotate(90deg);
  }
</style>
