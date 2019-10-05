<script>
import DateTimePickerDialog from '@/components/date-time-picker-dialog'
import moment from 'moment'

export default {
  components: {
    DateTimePickerDialog,
  },

  props: {
    label: {
      type: String,
      default: null,
    },

    hint: {
      type: String,
      default: null,
    },

    value: {
      type: Date,
      default: null,
    },

    excludeTime: {
      type: Boolean,
      default: false,
    },

    allowedDates: {
      type: Function,
      default: null,
    },
  },

  data() {
    return {
      dateModalOpen: false,
      timeModalOpen: false,
    }
  },

  computed: {
    parsedDate() {
      return moment(this.value)
    },

    dateString() {
      return this.parsedDate.format('MM/DD/YYYY')
    },

    timeString() {
      return this.parsedDate.format('LT')
    },

    dateForPicker() {
      return this.parsedDate.format('YYYY-MM-DD')
    },

    timeForPicker() {
      return this.parsedDate.format('HH:mm')
    },
  },

  methods: {
    updateDate(newDateStr) {
      let newDate = moment(newDateStr, 'YYYY-MM-DD')
      let currentDate = moment(this.value)

      this.dateModalOpen = false

      newDate.hour(currentDate.hour())
      newDate.minute(currentDate.minute())

      this.$emit('input', newDate.toDate())
    },

    updateTime(newTimeStr) {
      let newDate = moment(newTimeStr, 'HH:mm')
      let currentDate = moment(this.value)

      this.timeModalOpen = false

      newDate.date(currentDate.date())
      newDate.month(currentDate.month())
      newDate.year(currentDate.year())

      this.$emit('input', newDate.toDate())
    },
  },
}
</script>

<template>
  <div>
    <v-input class="special-input">
      <template v-slot:label>
        <div v-if="label" class="special-input_label">
          {{ label }}
        </div>
        <div v-if="hint" class="v-messages theme--light">
          <div class="v-messages__message">
            {{ hint }}
          </div>
        </div>
      </template>

      <div class="selection-display">
        <v-btn text @click="dateModalOpen = true">
          {{ dateString }}
        </v-btn>

        <v-btn
          v-if="!excludeTime"
          text
          @click="timeModalOpen = true"
        >
          {{ timeString }}
        </v-btn>
      </div>
    </v-input>

    <date-time-picker-dialog
      :open.sync="dateModalOpen"
      :value="dateForPicker"
      :allowed-dates="allowedDates"
      type="date"
      @input="updateDate"
    />

    <date-time-picker-dialog
      :open.sync="timeModalOpen"
      :value="timeForPicker"
      type="time"
      @input="updateTime"
    />
  </div>
</template>
