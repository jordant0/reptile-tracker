<script>
import Navbar from '@/components/navbar'
import Sidebar from '@/components/sidebar'
import ConfirmDialog from '@/components/confirm-dialog'
import Notifier from '@/components/notification'
import { mapState } from 'vuex'

export default {
  components: {
    Navbar,
    Sidebar,
    ConfirmDialog,
    Notifier,
  },

  props: {
    source: String,
  },

  watch: {
    darkTheme(value) {
      this.$vuetify.theme.dark = value
    },
  },

  data() {
    return {
      drawerOpen: false,
    }
  },

  created() {
    this.$firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.$store.commit('updateUser', user)
      } else {
        let currentRoute = this.$router.currentRoute.name
        this.$store.commit('updateUser', {})
        if(!(currentRoute === 'login' || currentRoute === 'sign-up')) {
          this.$router.push({ name: 'login' })
        }
      }
    })

    this.version = `v${VERSION}`
    this.mailLink = `mailto:admin@herpstracker.com?subject=Herps%20Tracker%20Bug%20Report%20(v${VERSION})`
  },

  computed: {
    ...mapState([
      'darkTheme',
    ]),
  },
}
</script>

<template>
  <v-app>
    <sidebar
      :open.sync="drawerOpen"
    />

    <navbar @toggle-drawer="drawerOpen = !drawerOpen" />

    <v-content>
      <v-container
        class="container-wrapper fill-height"
        fluid
      >
        <router-view />
      </v-container>
    </v-content>

    <confirm-dialog />

    <notifier />

    <v-footer class="app-footer">
      <div>{{ version }}</div>
      <div class="flex-grow-1"></div>
      <div>
        Having issues?
        <a :href="mailLink">Contact us.</a> |
        &copy; 2019 Jordanssson
      </div>
    </v-footer>
  </v-app>
</template>

<style>
  .v-navigation-drawer--mini-variant .v-navigation-drawer__append {
    opacity: 0;
  }

  .v-navigation-drawer__append {
    display: flex;
    justify-content: center;
  }

  .container.fill-height.container-wrapper {
    padding: 20px 12px;
    max-width: 1000px;
    align-items: flex-start;
  }

  .app-footer.v-footer {
    margin-top: 24px;
    font-size: 12px;
  }

  .container-wrapper, .container-card {
    width: 100%;
  }

  .container-card .v-card__title {
    padding: 24px 24px 32px 24px;
  }

  .container-card .v-card__text {
    padding: 0 24px 24px 24px;
  }

  .general-form {
    max-width: 800px;
    margin: auto;
  }

  .form-actions {
    display: flex;
    margin-top: 24px;
  }

  .special-card {
    display: flex;
    justify-content: center;
  }

  .special-card .v-card__title {
    padding: 100px;
    font-size: 18px;
    font-style: italic;
    color: #999999;
  }

  .card-actions {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }

  .card-actions .v-btn {
    margin-left: 8px;
  }

  .confirm-dialog {
    width: 400px;
    max-width: calc(100% - 20px);
  }

  .confirm-dialog .v-card__title {
    word-break: normal;
  }

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

  @media screen and (max-width: 500px) {
    .date-time-input .v-input__slot {
      flex-direction: column;
      align-items: flex-start;
    }

    .selection-display {
      display: flex;
      width: 100%;
      justify-content: center;
      margin-top: 8px;
    }
  }

  .animal-header {
    padding: 16px 24px 16px 124px;
  }

  .animal-image {
    position: absolute;
    width: 100px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999999;
    font-style: italic;
  }

  .animal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .animal-header--first span:not(:first-child):before {
    content: '|';
    padding: 0 8px;
  }

  .animal-header--last {
    color: #999999;
  }

  .animal-header--last span:not(:last-child):after {
    content: '|';
    padding: 0 8px;
  }

  .animal-name {
    font-size: 20px;
    font-weight: 400;
  }

  .expand-action {
    margin: 12px;
    background-color: #f2f2f2;
    border-radius: 100%;
  }

  .info-listing {
    color: #999999;
  }

  .animal-info {
    column-count: 2;
  }

  @media screen and (max-width: 900px) {
    .animal-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .animal-header--last {
      margin-top: 12px;
    }
  }

  @media screen and (max-width: 750px) {
    .animal-info {
      column-count: 1;
    }
  }

  @media screen and (max-width: 600px) {
    .animal-image {
      display: none;
    }

    .animal-header {
      padding-left: 24px;
    }

    .v-expansion-panel-content {
      margin-left: 0 !important;
    }
  }

  @media screen and (max-width: 500px) {
    .animal-header--fed-date {
      display: none;
    }
  }

  @media screen and (max-width: 400px) {
    .animal-header--species {
      display: none;
    }
  }

  .date-time-picker_dialog {
    width: auto !important;
  }

  .date-time-picker_dialog .v-picker {
    box-shadow: none;
  }

  .login-card {
    margin: auto;
  }

  .login-card .sub-headline {
    padding: 0 20px;
    color: #999999;
    font-size: 14px;
    text-align: center;
    margin-bottom: 12px;
  }

  .login-card .v-card__actions, .login-card .v-card__title {
    padding: 20px;
  }

  .login-card .prompt {
    font-size: 14px;
    font-style: italic;
  }

  .login-card .v-input {
    margin-bottom: 8px;
  }

  .event-info_wrapper {
    display: flex;
    align-items: center;
    max-width: calc(100% - 36px);
  }

  .event-info {
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    overflow: hidden;
  }

  .event-icon {
    margin-right: 12px;
  }

  .event-timestamp {
    display: flex;
    width: 160px;
    flex-shrink: 0;
  }

  .event-timestamp--date {
    margin-right: 8px;
    width: 58px;
    text-align: right;
  }

  .event-timestamp--time {
    width: 70px;
    text-align: left;
  }

  .event-details {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media screen and (max-width: 500px) {
    .event-info_header.v-expansion-panel-header {
      padding: 12px;
    }

    .event-info {
      flex-direction: column;
      align-items: flex-start;
      position: relative;
    }

    .event-details {
      margin-top: 8px;
    }
  }
</style>
