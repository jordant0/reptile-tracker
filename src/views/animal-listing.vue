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

    notificationTrigger() {
      if(!(this.animalListLoaded && this.userConfigLoaded)) {
        return
      }

      let currentReminders = { ...this.userConfig.reminders } || {}
      let notificationTime = this.userConfig.reminderTime || '9:00 AM'
      let newReminders = {}
      let today = moment()
      let promises = []
      let feedingDates = Object.keys(this.feedingMapping)

      feedingDates.forEach((key) => {
        let date = moment(key, 'MM-DD-YYYY')
        if(today < date) {
          let animalsToFeed = this.feedingMapping[key].map(animal => animal.name).sort().join(', ')
          let currentNotification = currentReminders[key]

          if(!currentNotification || currentNotification.content !== animalsToFeed) {
            // Replace with new notification
            let timestamp = moment(`${key} ${notificationTime}`, 'MM-DD-YYYY h:mm A')
            newReminders[key] = { content: animalsToFeed }

            promises.push(
              pushService.sendFeedingReminder(timestamp.toString(), {
                title: 'Feeding Today',
                content: animalsToFeed,
              }).then((doc) => {
                let notificationId = doc.data ? doc.data.id : null

                // Clear old notifications if any
                if(currentNotification && currentNotification.notificationId) {
                  pushService.cancelNotification(currentNotification.notificationId)
                }

                newReminders[key].notificationId = notificationId
              })
            )
          } else {
            // Notification is the same
            newReminders[key] = { ...currentNotification }
          }
        }
      })

      // Update the users reminders cache
      Promise.all(promises).then(() => {
        this.$firebase
          .firestore()
          .collection('users')
          .doc(this.uuid)
          .update({
            reminders: newReminders,
          })
      })

      // Clear out any date that no longer has reminders
      Object.keys(currentReminders).forEach((key) => {
        let date = moment(key, 'MM-DD-YYYY')
        if(today < date && !feedingDates.includes(key) && currentReminders[key] && currentReminders[key].notificationId) {
          pushService.cancelNotification(currentReminders[key].notificationId)
        }
      })
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
      'animalData',
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

    animalNextFeed() {
      let nextFeedMapping = {}

      if(!this.animalListLoaded) {
        return nextFeedMapping
      } else {
        this.animalList.forEach((animal) => {
          if(!animal.archive) {
            if(animal.feedingOverride) {
              nextFeedMapping[animal.id] = moment(animal.feedingOverride.toDate()).startOf('day')
            } else if(animal.lastFed && animal.lastFed !== 'none' && animal.feedingDuration) {
              nextFeedMapping[animal.id] = moment(animal.lastFed.toDate()).add(animal.feedingDuration, 'd').startOf('day')
            }
          }
        })
      }

      return nextFeedMapping
    },

    feedingMapping() {
      let mapping = {}

      Object.keys(this.animalNextFeed).forEach((key) => {
        let feedingDate = this.animalNextFeed[key].format('MM-DD-YYYY')
        mapping[feedingDate] = mapping[feedingDate] || []
        mapping[feedingDate].push(this.animalData(key))
      })

      return mapping
    },

    notificationTrigger() {
      return [
        this.animalListLoaded,
        this.userConfigLoaded,
        this.feedingMapping,
      ]
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
          :next-feed="animalNextFeed[animal.id]"
          @filter-tag="filterTag = $event"
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
