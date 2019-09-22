<script>
import DateTimeInput from '@/components/date-time-input'
import { mapGetters } from 'vuex'

export default {
  components: {
    DateTimeInput,
  },

  props: {
    animalId: {
      type: String,
      default: null,
    },

    eventType: {
      type: String,
      default: 'Other',
    },

    currentEvent: {
      type: Object,
      default() {
        return {}
      },
    },
  },

  data() {
    return {
      submitting: false,
      eventData: {
        type: this.currentEvent.type || this.eventType,
        timestamp: this.currentEvent.timestamp ? this.currentEvent.timestamp.toDate() : new Date(),
        value: this.currentEvent.value || '',
        notes: this.currentEvent.notes || '',
      },
    }
  },

  computed: {
    ...mapGetters([
      'uuid',
    ]),

    valueField() {
      switch (this.eventData.type) {
        case 'Handling':
          return {
            label: 'Duration',
            hint: 'Duration of handling session (in minutes)',
          }
        case 'Weight':
          return {
            label: 'Weight',
            hint: 'Weight of the animal (in grams)',
          }
        default:
          return null
      }
    },
  },

  methods: {
    submit() {
      this.submitting = true
      if(this.$refs.form.validate() && this.uuid && this.animalId) {
        this.$firebase
          .firestore()
          .collection('users')
          .doc(this.uuid)
          .collection('animals')
          .doc(this.animalId)
          .collection('events')
          .add(this.eventData)
          .then(() => {
            this.submitting = false
            this.$router.back()
          })
      } else {
        this.submitting = false
      }
    },
  },
}
</script>

<template>
  <v-form
    class="event-form general-form"
    ref="form"
    @sbmit.prevent="submit"
  >
    <date-time-input
      v-model="eventData.timestamp"
      label="Date &amp; Time"
      hint="Date and time of the event"
    />

    <v-text-field
      v-if="valueField"
      v-model="eventData.value"
      :label="valueField.label"
      :hint="valueField.hint"
      :rules="[
        v => !!v || `${valueField.label} is required`,
      ]"
      required
    />

    <v-text-field
      v-model="eventData.notes"
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
        :disabled="submitting"
        :loading="submitting"
        @click.prevent="submit"
      >
        Submit
      </v-btn>
    </div>
  </v-form>
</template>
