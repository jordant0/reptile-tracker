<script>
import { mapState } from 'vuex'

export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    '$route': {
      immediate: true,
      handler() {
        this.animalId = this.$route.params.animal_id
      },
    },
  },

  data() {
    return {
      animalId: this.$route.params.animal_id,
    }
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
        this.$store.commit('showNotification', {
          color: 'error',
          text: error.message,
        })
      })
    },

    goToAnimalRoute(name) {
      this.$router.push({
        name,
        params: { animal_id: this.animalId },
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

      <v-list-item @click="$router.push('/')">
        <v-list-item-action>
          <v-icon>mdi-home</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <template v-if="animalId">
        <v-list-item @click="goToAnimalRoute('event-listing')">
          <v-list-item-action>
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Events Listing</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="goToAnimalRoute('chart')">
          <v-list-item-action>
            <v-icon>mdi-chart-line</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Chart Weight</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="goToAnimalRoute('calendar')">
          <v-list-item-action>
            <v-icon>mdi-calendar-multiselect</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>View Calendar</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <template v-else>
        <v-list-item @click="$router.push({ name: 'settings' })">
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
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
      </template>

      <v-divider />

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
            inset
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
