<script>
import DateTimeInput from '@/components/date-time-input'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  components: {
    DateTimeInput,
  },

  props: {
    userConfig: {
      type: Object,
      default() {
        return {}
      },
    },
  },

  data() {
    return {
      submitting: false,
    }
  },

  computed: {
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
          reminderTime: moment(value).format('h:mm A')
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
      <div class="notice">
        <v-icon small>mdi-information</v-icon>
        <div>
          <strong>Note:</strong>
          Changes to push notification settings may not affect already scheduled notifications
        </div>
      </div>

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

<style scoped>
.notice {
  font-style: italic;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.notice .v-icon {
  margin-right: 6px;
}
</style>
