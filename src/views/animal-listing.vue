<script>
import Loading from '@/components/loading'
import Empty from '@/components/empty'
import AnimalCard from '@/components/animal-card'
import randomColor from '@/mixins/random-color'
import { mapState, mapGetters } from 'vuex'
import moment from 'moment'
import pushService from '@/services/push-notifications'

export default {
  mixins: [
    randomColor,
  ],

  components: {
    AnimalCard,
    Loading,
    Empty,
  },

  props: {
    archive: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      filterTag: null,
      animalsChecklist: {},
      feedingMapping: {},
      reminderCheck: false,
    }
  },

  watch: {
    userConfigLoaded() {
      if(this.userConfig && !this.userConfig.reminderTime) {
        this.$firebase
          .firestore()
          .collection('users')
          .doc(this.uuid)
          .set({
            ...this.userConfig,
            reminderTime: '9:00 AM',
          })
      }
    },

    allAnimalsReported() {
      if(!this.reminderCheck && this.allAnimalsReported) {
        setTimeout(() => {
          this.reminderCheck = true
          let tomorrow = moment().add(1, 'd').format('MM-DD-YYYY')

          if(this.feedingMapping[tomorrow] && this.feedingMapping[tomorrow].length) {
            let notificationTime = this.userConfig.reminderTime || '9:00 AM'
            let animalsToFeed = this.feedingMapping[tomorrow].map(animal => animal.name).sort().join(', ')

            if(this.userConfig.notifyDate !== tomorrow || this.userConfig.notifycontent !== animalsToFeed) {
              let timestamp = moment(`${tomorrow} ${notificationTime}`, 'MM-DD-YYYY h:mm A')

              pushService.sendFeedingReminder(timestamp, {
                title: 'Feeding Today',
                content: animalsToFeed,
              })
                .then((doc) => {
                  let notificationId = doc.data ? doc.data.id : null

                  if(this.userConfig.notificationId) {
                    pushService.cancelNotification(this.userConfig.notificationId)
                  }

                  this.$firebase
                    .firestore()
                    .collection('users')
                    .doc(this.uuid)
                    .update({
                      notificationId,
                      notifyDate: tomorrow,
                      notifycontent: animalsToFeed,
                    })
                })
            }
          } else if(this.userConfig.notifyDate === tomorrow && this.userConfig.notificationId) {
            pushService.cancelNotification(this.userConfig.notificationId)

            this.$firebase
              .firestore()
              .collection('users')
              .doc(this.uuid)
              .update({
                notificationId: null,
                notifyDate: null,
                notifycontent: null,
              })
          }
        }, 1000)
      }
    },
  },

  computed: {
    ...mapState([
      'animalList',
      'animalListLoaded',
      'userConfig',
      'userConfigLoaded',
    ]),

    ...mapGetters([
      'uuid',
    ]),

    userDocId() {
      return this.userConfig.id
    },

    filteredAnimals() {
      if(this.animalList) {
        return this.animalList
          .filter((animal) => {
            return (this.archive === !!animal.archive) &&
              (!this.filterTag || (animal.tags && animal.tags.includes(this.filterTag)))
          })
          .sort((animalA, animalB) => {
            if(!animalB.position) {
              return -1
            } else if(!animalA.position) {
              return 1
            } else {
              return animalA.position - animalB.position
            }
          })
      } else {
        return []
      }
    },

    filterTagColor() {
      if(this.filterTag) {
        return this.randomColor(this.filterTag)
      }

      return null
    },

    allAnimalsReported() {
      if(this.archive || this.filterTag || !this.filteredAnimals.length) {
        return false
      }

      return this.filteredAnimals.every(animal => this.animalsChecklist[animal.id])
    },
  },

  methods: {
    addAnimal() {
      this.$router.push({ name: 'add-animal' })
    },

    updateNextFeed(animal, nextFeed) {
      if(nextFeed) {
        let feedingDate = nextFeed.format('MM-DD-YYYY')
        this.feedingMapping[feedingDate] = this.feedingMapping[feedingDate] || []
        this.feedingMapping[feedingDate].push(animal)
      }

      this.animalsChecklist = {
        ...this.animalsChecklist,
        [animal.id]: true,
      }
    },
  },
}
</script>

<template>
  <div class="animal-listing container-wrapper">
    <loading
      v-if="!animalListLoaded"
      type="list-item-avatar-two-line, list-item-avatar-two-line, list-item-avatar-two-line"
    />
    <template v-else>
      <div v-if="filterTag" class="listing_header">
        <div class="listing_header--label">
          Animals with tag
          <v-chip
            :color="filterTagColor"
            close
            @click:close="filterTag = null"
          >
            {{ filterTag }}
          </v-chip>
        </div>
      </div>

      <empty v-if="!animalList.length" noun="animal" />
      <v-expansion-panels v-else>
        <animal-card
          v-for="animal in filteredAnimals"
          :key="animal.id"
          :animal="animal"
          @filter-tag="filterTag = $event"
          @next-feed="updateNextFeed"
        />
      </v-expansion-panels>

      <v-btn
        fixed
        dark
        fab
        bottom
        right
        color="accent"
        @click="addAnimal"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
  </div>
</template>

<style scoped>
  .listing_header--label .v-chip {
    margin-left: 4px;
  }
</style>
