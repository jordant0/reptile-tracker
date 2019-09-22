<script>
  import DateTimeInput from '@/components/date-time-input'

  export default {
    components: {
      DateTimeInput,
    },

    props: {
      initialType: {
        type: String,
        default: 'Other',
      },

      currentEvent: {
        type: Object,
        default() {
          return {};
        },
      }
    },

    data() {
      return {
        eventType: this.currentEvent.type || this.initialType,
        timestamp: this.currentEvent.timestamp ? this.currentEvent.timestamp.toDate() : new Date(),
        value: this.currentEvent.value,
        notes: this.currentEvent.notes,
      }
    },

    computed: {
      valueField() {
        switch(this.eventType) {
          case 'Handling':
            return {
              label: 'Duration',
              hint: 'Duration of handling session (in minutes)'
            }
          case 'Weight':
            return {
              label: 'Weight',
              hint: 'Weight of the animal (in grams)'
            }
          default:
            return null
        }
      },
    },
  };
</script>

<template>
  <v-form class="event-form general-form">
    <date-time-input
      v-model="timestamp"
      label="Date &amp; Time"
      hint="Date and time of the event"
    />

    <v-text-field
      v-if="valueField"
      v-model="value"
      :label="valueField.label"
      :hint="valueField.hint"
      required
    />

    <v-text-field
      v-model="notes"
      label="Notes"
      hint="Other details about the event"
    />

    <div class="form-actions">
      <v-btn
        text
        color="#999999"
        @click.prevent="$router.back()"
      >
        Cancel
      </v-btn>

      <div class="flex-grow-1" />

      <v-btn
        color="primary"
      >
        Submit
      </v-btn>
    </div>
  </v-form>
</template>
