import axios from '@/plugins/axios'
import store from '@/store'
import uuid from 'uuidv4'

export default {
  async sendFeedingReminder(timestamp, message) {
    return axios.post('/notifications', {
      app_id: process.env.VUE_APP_ONESIGNAL,
      include_external_user_ids: [store.getters.uuid],
      headings: { 'en': message.title },
      contents: { 'en': message.content },
      url: `${window.location.protocol}//${window.location.host}`,
      send_after: timestamp,
      external_id: uuid.fromString(`${timestamp}|${message.content}`),
    })
  },

  async cancelNotification(notificationId) {
    return axios.delete(`/notifications/${notificationId}?app_id=${process.env.VUE_APP_ONESIGNAL}`)
  },
}
