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
      testNotificationSent: false,
    }
  },

  computed: {
    ...mapState([
      'userConfig',
      'pushSettings',
      'confirmDialog',
    ]),

    ...mapGetters([
      'uuid',
    ]),

    reminderTime() {
      let time = this.userConfig.reminderTime || '9:00 AM'
      return moment(time, 'h:mm A').toDate()
    },

    pushEnabled: {
      get() {
        return this.pushSettings.enabled
      },

      set(value) {
        if(value) {
          OneSignal.push(() => {
            if(this.pushSettings.permission !== 'granted') {
              OneSignal.showNativePrompt()
            }
            OneSignal.setSubscription(true)
          })
        } else {
          OneSignal.setSubscription(false)
        }
      },
    },

    pushLabel() {
      return this.pushEnabled ? 'enabled' : 'disabled'
    },

    testNotificationLabel() {
      return this.testNotificationSent ? 'Test notification sent' : 'Send test notification'
    },
  },

  methods: {
    sendNotification() {
      OneSignal.sendSelfNotification(
        'Feeding Today',
        'Animal 1, Animal 2, etc.'
      )
      this.testNotificationSent = true
    },

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
      <div>
        <v-switch
          v-model="pushEnabled"
          :true-value="true"
          inset
        >
          <template v-slot:label>
            <span class="push-toggle-label--wrapper">
              Push notification is
              <v-chip
                class="push-toggle-label"
                :color="`${pushEnabled ? 'green' : 'red'}`"
                text-color="white"
                small
              >
                {{ pushLabel }}
              </v-chip>
              for this device
            </span>
          </template>
        </v-switch>
      </div>

      <template v-if="pushEnabled">
        <date-time-input
          :value="reminderTime"
          :loading="submitting"
          exclude-date
          label="Feeding reminder time"
          hint="Time of day to send feeding reminder for the day"
          @input="updateReminderTime"
        />

        <v-btn
          color="secondary"
          :disabled="testNotificationSent"
          @click="sendNotification"
        >

          {{ testNotificationLabel }}
        </v-btn>
      </template>
    </v-card-text>
  </v-card>
</template>

<style scoped>
  .push-toggle-label {
    font-weight: 600;
    padding: 0 8px;
    margin: 0 4px;
  }
</style>
