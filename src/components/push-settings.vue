<script>
import DateTimeInput from '@/components/date-time-input'
import { mapState, mapGetters } from 'vuex'
import moment from 'moment'

export default {
  components: {
    DateTimeInput,
  },

  data() {
    return {
      submitting: false,
    }
  },

  computed: {
    ...mapState([
      'userConfig',
    ]),

    ...mapGetters([
      'uuid',
    ]),

    reminderTime() {
      let time = this.userConfig.reminderTime || '9:00 AM'
      return moment(time, 'h:mm A').toDate()
    },
  },

  methods: {
    updateReminderTime(value) {
      this.submitting = true

      this.$firebase
        .firestore()
        .collection('users')
        .doc(this.uuid)
        .update({
          reminderTime: moment(value).format('h:mm A'),
        })
        .then(() => {
          this.$store.commit('showNotification', {
            color: 'success',
            text: 'Feeding reminder push notification time updated',
          })
        })
        .catch((error) => {
          this.$store.commit('showNotification', {
            color: 'error',
            text: error.message,
          })
        })
        .finally(() => {
          this.submitting = false
        })
    },
  },
}
</script>

<template>
  <v-card class="container-card mb-5">
    <v-card-title>
      Push Notification Settings
    </v-card-title>

    <v-card-text>
      <date-time-input
        :value="reminderTime"
        :loading="submitting"
        exclude-date
        label="Feeding reminder time"
        hint="Time of day to send feeding reminder for the day"
        @input="updateReminderTime"
      />
    </v-card-text>
  </v-card>
</template>
