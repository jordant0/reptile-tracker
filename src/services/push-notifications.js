import axios from '@/plugins/axios'
import store from '@/store'

export default {
  async sendFeedingReminder(animal, timestamp) {
    return axios.post('/notifications', {
      app_id: process.env.VUE_APP_ONESIGNAL,
      include_external_user_ids: [store.getters.uuid],
      headings: { 'en': 'Feeding Reminder' },
      contents: { 'en': `${animal.name} is due to be fed today` },
      url: `${window.location.href.split('/#/')}/#/${animal.id}/events`,
      send_after: timestamp,
    })
  },

  cancelNotification(notificationId) {
    axios.delete(`/notifications/${notificationId}?app_id=${process.env.VUE_APP_ONESIGNAL}`)
  },
}
