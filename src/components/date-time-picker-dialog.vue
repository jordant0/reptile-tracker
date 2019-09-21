<script>
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
    },

    watch: {
      open() {
        this.selectedValue = this.value;
      },
    },

    data() {
      return {
        selectedValue: this.value,
      }
    },

    methods: {
      save() {
        this.$emit('input', this.selectedValue);
        this.close();
      },

      close() {
        this.$emit('update:open', false);
      },
    },
  };
</script>

<template>
  <v-dialog
    :value="open"
    light
    content-class="date-time-picker_dialog"
    @input="$emit('update:open', $event)"
  >
    <v-card>
      <v-card-text>
        <v-date-picker
          v-if="type === 'date'"
          v-model="selectedValue"
        />
        <v-time-picker
          v-else
          ampm-in-title
          v-model="selectedValue"
        />
      </v-card-text>

      <v-card-actions>
        <v-btn
          text
          color="#999999"
          @click="$emit('update:open', close)"
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
</style>

<style>
  .date-time-picker_dialog {
    width: auto !important;
  }

  .date-time-picker_dialog .v-picker {
    box-shadow: none;
  }
</style>
