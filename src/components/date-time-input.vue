<script>
  import DateTimePickerDialog from '@/components/date-time-picker-dialog'
  import moment from 'moment'

  export default {
    components: {
      DateTimePickerDialog
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

      includeTime: {
        type: Boolean,
        default: true,
      }
    },

    data() {
      return {
        dateModalOpen: false,
        timeModalOpen: false,
      }
    },

    computed: {
      parsedDate() {
        return moment(this.value);
      },

      dateString() {
        return this.parsedDate.format('MM/DD/YYYY');
      },

      timeString() {
        return this.parsedDate.format('LT');
      },

      dateForPicker() {
        return this.parsedDate.format('YYYY-MM-DD');
      },

      timeForPicker() {
        return this.parsedDate.format('HH:mm');
      },
    },

    methods: {
      updateDate(newDateStr) {
        let newDate = moment(newDateStr, 'YYYY-MM-DD'),
            currentDate = moment(this.value);

        this.dateModalOpen = false;

        newDate.hour(currentDate.hour());
        newDate.minute(currentDate.minute());

        this.$emit('input', newDate.toDate());
      },

      updateTime(newTimeStr) {
        let newDate = moment(newTimeStr, 'HH:mm'),
            currentDate = moment(this.value);

        this.timeModalOpen = false;

        newDate.date(currentDate.date());
        newDate.month(currentDate.month());
        newDate.year(currentDate.year());

        this.$emit('input', newDate.toDate());
      },
    },
  };
</script>

<template>
  <div>
    <v-input class="date-time-input">
      <template v-slot:label>
        <div v-if="label" class="datetime-select_label">
          {{ label }}
        </div>
        <div v-if="hint" class="v-messages theme--light">
          <div class="v-messages__message">
            {{ hint }}
          </div>
        </div>
      </template>

      <v-btn text @click.prevent="dateModalOpen = true">
        {{ dateString }}
      </v-btn>

      <v-btn
        v-if="includeTime"
        text
        @click.prevent="timeModalOpen = true"
      >
        {{ timeString }}
      </v-btn>
    </v-input>

    <date-time-picker-dialog
      :open.sync="dateModalOpen"
      :value="dateForPicker"
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

<style>
  .date-time-input {
    display: flex;
    align-items: center;
    padding-top: 12px;
    margin-top: 4px;
  }

  .date-time-input .v-messages {
    margin-top: 4px;
  }

  .date-time-input label.v-label {
    height: auto;
    margin-right: 32px;
    min-width: 200px;
  }
</style>
