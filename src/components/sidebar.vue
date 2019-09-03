<script>
  export default {
    props: {
      dark: {
        type: Boolean,
        default: false,
      },

      drawerOpen: {
        type: Boolean,
        default: false,
      }
    },
  }
</script>

<template>
  <v-navigation-drawer
    :value="drawerOpen"
    app
    color="secondary"
    @input="$emit('update:drawer-open', $event)"
  >
    <v-list dense>
      <v-list-item @click="">
        <v-list-item-action>
          <v-icon>mdi-home</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item @click="">
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
</style>
