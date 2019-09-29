<script>
import { mapState } from 'vuex'

export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapState([
      'darkTheme',
      'user',
    ]),

    darkMode: {
      get() {
        return this.darkTheme
      },

      set(value) {
        this.$store.commit('updateDarkTheme', !!value)
      },
    },
  },

  methods: {
    logOut() {
      this.$emit('update:open', false)
      this.$firebase.auth().signOut().then(() => {
        this.$router.push({ name: 'login' })
      }, function(error) {
        console.log(error)
      })
    },
  },
}
</script>

<template>
  <v-navigation-drawer
    :value="open"
    app
    absolute
    temporary
    color="secondary"
    @input="$emit('update:open', $event)"
  >
    <v-list v-if="user.email" dense>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Currently logged in as:</v-list-item-title>
          <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click.prevent="$router.push('/')">
        <v-list-item-action>
          <v-icon>mdi-home</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="$router.push({ name: 'archive' })">
        <v-list-item-action>
          <v-icon>mdi-archive</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Archive</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="logOut">
        <v-list-item-action>
          <v-icon>mdi-exit-run</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-list class="bottom-actions" dense>
        <v-list-item>
          <v-switch
            v-model="darkMode"
            label="Dark Mode"
          />
        </v-list-item>

        <v-list-item
          class="close-action"
          @click="$emit('update:open', false)"
        >
          <v-icon>mdi-chevron-double-left</v-icon>
          Close
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
  .v-navigation-drawer {
    overflow: visible;
    position: fixed;
  }

  .v-navigation-drawer__append {
    display: flex;
    justify-content: center;
  }

  .v-list-item__subtitle {
    padding: 4px 12px;
  }

  .bottom-actions {
    width: 100%;
  }

  .bottom-actions .v-list-item {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-action .v-icon {
    margin-right: 8px;
  }
</style>
