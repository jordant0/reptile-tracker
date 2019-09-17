<script>
  import Sidebar from './components/sidebar'
  import Login from './components/login'

  export default {
    components: {
      Sidebar,
      Login,
    },

    props: {
      source: String,
    },

    watch: {
      dark() {
        this.$vuetify.theme.dark = this.dark;
      },
    },

    data: () => ({
      drawerOpen: false,
      dark: false,
      showLogin: false,
      uuid: null,
    }),

    created() {
      this.$firebase.auth().onAuthStateChanged((user) => {
        if(user) {
          this.uuid = user.uid;
        } else {
          this.showLogin = true;
        }
      });
    },
  }
</script>

<template>
  <v-app>
    <login :shown="showLogin" />

    <sidebar :drawer-open.sync="drawerOpen" :dark.sync="dark" />

    <v-app-bar
      app
      color="primary"
    >
      <v-app-bar-nav-icon @click.stop="drawerOpen = !drawerOpen"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ $route.meta.title }}</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<style>
.v-navigation-drawer--mini-variant .v-navigation-drawer__append {
  opacity: 0;
}
.v-navigation-drawer__append {
  display: flex;
  justify-content: center;
}
</style>
