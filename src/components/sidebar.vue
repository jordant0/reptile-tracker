<script>
  export default {
    props: {
      email: {
        type: String,
        default: null,
      },

      dark: {
        type: Boolean,
        default: false,
      },

      open: {
        type: Boolean,
        default: false,
      }
    },

    methods: {
      goHome() {
        this.$router.push('/');
      },

      logOut() {
        this.$emit("update:open", false);
        this.$firebase.auth().signOut().then(() => {
          this.$router.push('/');
        }, function(error) {
          console.log(error);
        });
      },
    },
  }
</script>

<template>
  <v-navigation-drawer
    :value="open"
    app
    color="secondary"
    @input="$emit('update:drawer-open', $event)"
  >
    <v-list dense>
      <v-list-item v-if="email">
        <v-list-item-content>
          <v-list-item-title>Currently logged in as:</v-list-item-title>
          <v-list-item-subtitle>{{ email }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click.prevent="goHome">
        <v-list-item-action>
          <v-icon>mdi-home</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Home</v-list-item-title>
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
      <v-switch
        :value="dark"
        label="Dark Mode"
        @change="$emit('update:dark', $event)"
      />
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.v-navigation-drawer__append {
  display: flex;
  justify-content: center;
}

.v-list-item__subtitle {
  padding: 4px 12px;
}
</style>
