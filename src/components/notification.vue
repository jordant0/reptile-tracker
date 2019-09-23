<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'notification',
    ]),

    show: {
      get() {
        return this.notification.shown
      },

      set(value) {
        this.$store.commit('setNotificationShown', value)
      },
    },
  },
}
</script>

<template>
  <v-snackbar
    v-model="show"
    bottom
    multi-line
    :color="notification.color"
    :timeout="3000"
  >
    {{ notification.text }}

    <v-btn
      dark
      text
      @click="show = false"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>
