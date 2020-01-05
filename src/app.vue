<script>
import Navbar from '@/components/navbar'
import Sidebar from '@/components/sidebar'
import ConfirmDialog from '@/components/confirm-dialog'
import Notifier from '@/components/notification'
import { get, set } from 'idb-keyval'
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
    '$route'(newRoute) {
      if(this.loginCheck && !(newRoute.meta && newRoute.meta.public) && !this.user.uid) {
        this.$router.push({ name: 'login' })
      }
    },

    darkTheme(value) {
      this.$vuetify.theme.dark = value
      set('dark-mode', value ? 'true' : 'false')
    },

    user() {
      if(this.user.uid) {
        this.$store.dispatch(
          'bindAnimalList',
          this.$firebase
            .firestore()
            .collection('users')
            .doc(this.user.uid)
            .collection('animals')
        )

        this.$store.dispatch(
          'bindUserConfig',
          this.$firebase
            .firestore()
            .collection('users')
            .doc(this.user.uid)
        )
      }
    },
  },

  data() {
    return {
      drawerOpen: false,
      loginCheck: false,
    }
  },

  created() {
    get('dark-mode').then((value) => {
      this.$store.commit('updateDarkTheme', value === 'true')
    })

    this.$firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.$store.commit('updateUser', user)

        if(window.OneSignal) {
          OneSignal.push(() => {
            OneSignal.setExternalUserId(user.uid)

            if(OneSignal.isPushNotificationsSupported()) {
              OneSignal.isPushNotificationsEnabled().then((isEnabled) => {
                this.$store.commit('updatePushSettings', {
                  supported: true,
                  enabled: isEnabled,
                })
              })

              OneSignal.getNotificationPermission().then((permission) => {
                this.$store.commit('updatePushSettings', { permission })
              })

              OneSignal.on('subscriptionChange', (enabled) => {
                this.$store.commit('updatePushSettings', { enabled })
              })
            }
          })
        }
      } else {
        let currentRoute = this.$router.currentRoute

        this.$store.commit('updateUser', {})
        if(!(currentRoute.meta && currentRoute.meta.public)) {
          this.$router.push({ name: 'login' })
        }
      }
      this.loginCheck = true
    })

    this.version = `v${VERSION}`
    this.mailLink = `mailto:admin@herpstracker.com?subject=Herps%20Tracker%20Bug%20Report%20(v${VERSION})`
  },

  computed: {
    ...mapState([
      'darkTheme',
      'user',
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
    color: #b6b6b6;
  }

  .card-actions {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }

  .card-actions .v-btn {
    margin-left: 8px;
  }

  .animal-card .card-actions {
    justify-content: space-between;
  }

  .card-actions--left .v-btn {
    margin-left: 0;
    margin-right: 8px;
  }

  .confirm-dialog {
    width: 400px;
    max-width: calc(100% - 20px);
  }

  .confirm-dialog .v-card__title {
    word-break: normal;
  }

  .special-input {
    display: flex;
    align-items: center;
    padding-top: 12px;
    margin-top: 4px;
  }

  .special-input .v-messages {
    margin-top: 4px;
  }

  .special-input > .v-input__control > .v-input__slot > label.v-label {
    height: auto;
    margin-right: 32px;
    min-width: 200px;
  }

  .selection-display {
    display: flex;
    align-items: center;
  }

  @media screen and (max-width: 500px) {
    .special-input > .v-input__control > .v-input__slot {
      flex-direction: column;
      align-items: flex-start;
    }

    .selection-display {
      width: 100%;
      justify-content: center;
      margin-top: 8px;
    }
  }

  .animal-header {
    padding: 16px 24px 16px 104px;
    transition: all 0.05s ease;
  }

  .v-expansion-panel-header--active .animal-header {
    padding-left: 24px;
  }

  .v-expansion-panel:first-child .animal-image {
    border-radius: 4px 0 0 0;
  }

  .v-expansion-panel:last-child .animal-image {
    border-radius: 0 0 0 4px;
  }

  .animal-image {
    position: absolute;
    width: 80px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: all 0.05s ease;
    overflow: hidden;
  }

  .animal-image .v-image {
    z-index: 5;
  }

  .animal-image img {
    width: 100%;
    height: auto;
  }

  .avatar-placeholder {
    position: absolute;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    font-size: 30px;
    font-weight: 300;
    letter-spacing: 2px;
  }

  .v-expansion-panel.v-expansion-panel--active .animal-image {
    display: none;
  }

  .v-expansion-panel.v-expansion-panel--active .animal-image img {
    height: 100%;
    width: auto;
  }

  .animal-expanded-image {
    width: 160px;
    height: 160px;
    margin: auto;
    margin-top: 20px;
  }

  .animal-expanded-image img {
    max-width: 100%;
    max-height: 100%;
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
    color: #b6b6b6;
    display: flex;
    align-items: flex-start;
  }

  .animal-header--last i {
    margin-left: 6px;
  }

  .animal-name {
    font-size: 20px;
    font-weight: 400;
    display: inline-flex;
    align-items: center;
  }

  .animal-name i {
    margin-left: 4px;
  }

  .expand-action {
    margin: 12px;
    background-color: #f2f2f2;
    border-radius: 100%;
  }

  .info-listing {
    color: #b6b6b6;
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

  }

  @media screen and (max-width: 500px) {
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
    color: #b6b6b6;
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

  .v-list-item.active {
    font-weight: 600;
  }

  .v-application.theme--dark .v-messages__message {
    color: rgba(255, 255, 255, 0.7);
  }

  .v-application.theme--dark .v-card__actions {
    background: #424242;
  }

  .animal-listing .theme--dark.v-expansion-panels .v-expansion-panel-header .v-expansion-panel-header__icon .v-icon {
    color: rgba(0, 0, 0, 0.54);
  }

  .image-croppper-dialog {
    max-width: 400px;
  }

  .image-croppper-dialog .v-card__text {
    padding: 0 !important;
  }

  .animal-avatar-select {
    max-width: 100%;
    width: 200px;
    height: 200px;
    margin: auto;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 32px;
  }

  .animal-avatar-select .animal-avatar-select--hover {
    display: none;
  }

  .animal-avatar-select {
    cursor: pointer;
  }

  .animal-avatar-select:hover .animal-avatar-select--hover {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-style: italic;
  }

  .animal-avatar-select:hover .animal-avatar_holder--text {
    display: none;
  }

  .animal-avatar-select img {
    width: 100%;
    height: 100%;
  }

  .animal-avatar-select .animal-avatar_holder {
    width: 100%;
    height: 100%;
    background-color: #f2f2f2;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-style: italic;
    color: #b6b6b6;
  }

  .animal-avatar-select .image-file-input {
    position: absolute;
    top: 0;
    opacity: 0;
  }

  .v-divider {
    margin: 8px 0;
  }

  .v-application {
    overflow: hidden;
  }

  .vc-weekday {
    padding: 12px 0 !important;
  }

  .vc-day-content {
    margin: 12px 0 !important;
  }

  .vc-popover-content {
    max-width: 200px !important;
  }

  .vc-day-popover-row {
    align-items: flex-start !important;
  }

  .vc-day-popover-row-indicator {
    margin-top: 6px !important;
    flex-shrink: 0;
  }

  .settings-list {
    max-width: 400px;
    margin: auto;
    position: relative;
  }

  .animal-reorder .v-list-item {
    border-radius: 4px;
    margin: 1px;
  }

  .animal-reorder .v-list-item__content {
    color: #ffffff;
  }

  .v-application .animal-export {
    position: relative;
    list-style: none;
    padding: 0 24px;
    margin-bottom: 32px;
    display: flex;
    flex-wrap: wrap;
  }

  .animal-export li {
    padding: 8px;
    box-sizing: border-box;
    width: 50%;
  }

  .animal-export .v-input  {
    margin: 0;
    padding: 0;
  }

  .animal-export .v-input--selection-controls__input {
    margin-right: 18px;
  }

  .v-progress-linear {
    position: absolute;
    top: 0;
  }

  .animal-export_overlay .v-overlay__content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media screen and (max-width: 650px) {
    .v-application .animal-export {
      padding: 0;
    }
  }

  @media screen and (max-width: 450px) {
    .v-application .animal-export li {
      width: 100%;
    }
  }

  .vue-tags-input {
    background-color: inherit !important;
    flex-grow: 1;
    max-width: none !important;
    position: relative;
  }

  .v-application.theme--dark .ti-autocomplete {
    background-color: #424242 !important;
  }

  .vue-tags-input:before {
    border-color: rgba(255, 255, 255, 0.7);
    border-style: solid;
    border-width: thin 0 0 0;
    bottom: -1px;
    content: "";
    left: 0;
    position: absolute;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    width: 100%;
  }

  .vue-tags-input:hover:before {
    border-color: #FFFFFF;
  }

  .v-application.theme--light .vue-tags-input:before {
    border-color: rgba(0, 0, 0, 0.42);
  }

  .v-application.theme--light .vue-tags-input:hover:before {
    border-color: rgba(0, 0, 0, 0.87);
  }

  .vue-tags-input:after {
    border-color: #4caf50;
    border-style: solid;
    border-width: thin 0 thin 0;
    transform: scaleX(0);
    bottom: -1px;
    content: "";
    left: 0;
    position: absolute;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    width: 100%;
  }

  .v-application.theme--light .vue-tags-input:after {
    border-color: #8bc34a;
  }

  .vue-tags-input.ti-focus:after {
    transform: scaleX(1);
  }

  .vue-tags-input .ti-input {
    border: 0 !important;
    padding: 4px 0;
  }

  .vue-tags-input .ti-input .ti-tags li {
    font-size: 14px !important;
    line-height: 24px;
  }

  .vue-tags-input .ti-input .ti-tags input {
    font-size: 14px !important;
    line-height: 24px;
  }

  .vue-tags-input .ti-input .ti-tags li.ti-tag {
    border-radius: 16px;
    padding: 4px 14px;
    font-weight: 500;
  }

  .vue-tags-input .ti-input .ti-tags li.ti-new-tag-input-wrapper {
    padding: 4px;
  }

  .vue-tags-input .ti-input .ti-tags li.ti-tag .ti-actions {
    margin-left: 4px;
    margin-right: -4px;
  }

  @media screen and (max-width: 700px) {
    .animal-tags-input .v-input__slot {
      flex-direction: column;
      align-items: flex-start;
    }

    .animal-tags-input .v-input__slot .vue-tags-input {
      margin-top: 20px;
      width: 100%;
    }
  }

  .listing_header {
    font-size: 18px;
    margin-bottom: 12px;
    font-weight: 500;
    display: flex;
    align-items: center;
  }

  .listing_header--label {
    margin-right: 8px;
  }

  .loading-skeleton .v-progress-linear {
    position: relative;
  }

  .loading-skeleton .v-skeleton-loader__image {
    height: 400px;
  }

  .loading-skeleton .v-skeleton-loader__actions {
    display: flex;
    justify-content: space-between;
    padding-bottom: 16px;
  }

  .loading-skeleton .v-skeleton-loader__list-item-avatar-two-line {
    margin-bottom: 1px;
  }
</style>
