<script>
  import Navbar from '@/components/navbar'
  import Sidebar from '@/components/sidebar'
  import Login from '@/components/login'
  import { mapState } from 'vuex'

  export default {
    components: {
      Navbar,
      Sidebar,
      Login,
    },

    props: {
      source: String,
    },

    watch: {
      darkTheme(value) {
        this.$vuetify.theme.dark = value;
      },
    },

    data() {
      return {
        drawerOpen: false,
        showLogin: false,
      }
    },

    created() {
      this.$firebase.auth().onAuthStateChanged((user) => {
        if(user) {
          this.$store.commit('updateUser', user);
          this.showLogin = false;
        } else {
          this.$store.commit('updateUser', {});
          this.showLogin = true;
        }
      });

      this.version = `v${VERSION}`;
    },

    computed: {
      ...mapState([
        'darkTheme',
      ])
    }
  }
</script>

<template>
  <v-app>
    <login :shown="showLogin" />

    <sidebar
      :open.sync="drawerOpen"
    />

    <navbar @toggle-drawer="drawerOpen = !drawerOpen" />

    <v-content>
      <v-container
        class="container-wrapper fill-height"
        fluid
      >
        <router-view />
      </v-container>
    </v-content>

    <v-footer class="app-footer">
      <div>{{ version }}</div>
      <div class="flex-grow-1"></div>
      <div>&copy; 2019 Jordanssson</div>
    </v-footer>
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

  .container.fill-height.container-wrapper {
    padding: 20px 12px;
    max-width: 1000px;
    align-items: flex-start;
  }

  .app-footer.v-footer {
    margin-top: 24px;
    font-size: 12px;
  }

  .container-wrapper, .container-card {
    width: 100%;
  }

  .container-card .v-card__title {
    padding: 24px 24px 32px 24px;
  }

  .container-card .v-card__text {
    padding: 0 24px 24px 24px;
  }

  .general-form {
    max-width: 800px;
    margin: auto;
  }

  .form-actions {
    display: flex;
    margin-top: 24px;
  }

  .special-card {
    display: flex;
    justify-content: center;
  }

  .special-card .v-card__title {
    padding: 100px;
    font-size: 18px;
    font-style: italic;
    color: #999999;
  }
</style>
