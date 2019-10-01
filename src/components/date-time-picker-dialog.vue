<script>
import { mapState } from 'vuex'

export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },

    value: {
      type: String,
      default: null,
    },

    type: {
      type: String,
      default: 'date',
    },

    allowedDates: {
      type: Function,
      default: null,
    },

    title: {
      type: String,
      default: null,
    },
  },

  watch: {
    open() {
      this.selectedValue = this.value
    },
  },

  data() {
    return {
      selectedValue: this.value,
    }
  },

  computed: {
    ...mapState([
      'darkTheme',
    ]),
  },

  methods: {
    save() {
      this.$emit('input', this.selectedValue)
      this.close()
    },

    close() {
      this.$emit('update:open', false)
    },
  },
}
</script>

<template>
  <v-dialog
    :value="open"
    light
    content-class="date-time-picker_dialog"
    @input="$emit('update:open', $event)"
  >
    <v-card>
      <v-card-title v-if="title">
        {{ title }}
      </v-card-title>

      <v-card-text>
        <v-date-picker
          v-if="type === 'date'"
          v-model="selectedValue"
          :dark="darkTheme"
          :allowed-dates="allowedDates"
          header-color="primary"
        />
        <v-time-picker
          v-else
          ampm-in-title
          v-model="selectedValue"
          :dark="darkTheme"
          header-color="primary"
        />
      </v-card-text>

      <v-card-actions>
        <v-btn
          text
          color="#b6b6b6"
          @click="$emit('update:open', false)"
        >
          Cancel
        </v-btn>

        <div class="flex-grow-1"></div>

        <v-btn
          text
          color="primary"
          @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
  .date-time-picker_dialog .v-card .v-card__text {
    padding: 0 !important;
  }

  .date-time-picker_dialog .v-card__actions {
    padding-top: 0 !important;
  }

  .date-time-picker_dialog .v-card__title {
    background-color: #8bc34a;
    color: #ffffff;
    padding: 12px 12px 0 12px;
    font-weight: 400;
  }

  .theme--dark .date-time-picker_dialog .v-card__title {
    background-color: #4caf50;
  }
</style>
