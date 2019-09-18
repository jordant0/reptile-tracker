<script>
  export default {
    methods: {
      toggleDrawer() {
        this.$emit('toggle-drawer')
      },

      goToAdd() {
        this.$router.push({ name: 'add-animal' });
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

    <div class="flex-grow-1" />

    <v-btn icon @click.prevent="goToAdd">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-app-bar>
</template>
