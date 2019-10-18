import axios from 'axios'

export default axios.create({
  baseURL: 'https://onesignal.com/api/v1/',
  timeout: 3000,
  headers: {
    'Authorization': `Basic ${process.env.VUE_APP_ONESIGNAL_API_KEY}`,
  },
})
