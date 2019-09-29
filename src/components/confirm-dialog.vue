<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'confirmDialog',
    ]),

    show: {
      get() {
        return this.confirmDialog.shown
      },

      set(value) {
        if(!value) {
          this.cancel()
        }
      },
    },
  },

  methods: {
    confirm() {
      this.$store.commit('confirmDialogResponse', 'confirm')
    },

    cancel() {
      this.$store.commit('confirmDialogResponse', 'cancel')
    },
  },
}
</script>

<template>
  <v-dialog
    content-class="confirm-dialog"
    v-model="show"
  >
    <v-card>
      <v-card-title v-if="confirmDialog.title">
        {{ confirmDialog.title }}
      </v-card-title>

      <v-card-text v-if="confirmDialog.body">
        {{ confirmDialog.body }}
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="#b6b6b6"
          text
          @click.prevent="cancel"
        >
          Cancel
        </v-btn>

        <div class="flex-grow-1"></div>

        <v-btn
          color="primary"
          text
          @click.prevent="confirm"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
