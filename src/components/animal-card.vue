<script>
import DateTimePickerDialog from '@/components/date-time-picker-dialog'
import AvatarPlaceholder from '@/components/avatar-placeholder'
import thumbnailMixin from '@/mixins/thumbnail'
import randomColor from '@/mixins/random-color'
import moment from 'moment'
import { mapState, mapGetters } from 'vuex'

export default {
  mixins: [
    thumbnailMixin,
    randomColor,
  ],

  components: {
    AvatarPlaceholder,
    DateTimePickerDialog,
  },

  props: {
    animal: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      today: moment().startOf('day'),
      lastFedEvent: null,
      animalImage: null,
      dateInput: false,
      thumbnailUrl: null,
      imageLoaded: false,
    }
  },

  watch: {
    bindingProps: {
      immediate: true,
      handler() {
        this.setupBinging()
      },
    },
  },

  created() {
    if(this.animal.image && this.animal.image.length) {
      this.setupLazyLoad()

      this.$firebase.storage().ref(this.animal.image).getDownloadURL().then((url) => {
        this.animalImage = url
      })
    }
  },

  computed: {
    ...mapState([
      'confirmDialog',
      'darkTheme',
    ]),

    ...mapGetters([
      'uuid',
    ]),

    bindingProps() {
      return [
        this.animal.id,
        this.uuid,
      ]
    },

    animalSex() {
      if(this.animal.sex) {
        if(this.animal.sex === 'male') {
          return {
            icon: 'mdi-gender-male',
            color: '#468bff',
          }
        } else if(this.animal.sex === 'female') {
          return {
            icon: 'mdi-gender-female',
            color: '#f886fe',
          }
        }
      }

      return null
    },

    feedingOverride() {
      if(this.animal.feedingOverride) {
        return moment(this.animal.feedingOverride.toDate()).startOf('day')
      }

      return null
    },

    hasFeedingOverride() {
      return this.feedingOverride && this.today <= this.feedingOverride
    },

    lastFed() {
      if(!(this.lastFedEvent && this.lastFedEvent.length)) {
        return null
      }

      return moment(this.lastFedEvent[0].timestamp.toDate())
    },

    lastFedDate() {
      if(this.lastFed) {
        return this.lastFed.format('M/D h:mm a')
      } else {
        return null
      }
    },

    lastFedFromNow() {
      if(this.lastFed) {
        return this.lastFed.fromNow()
      } else {
        return null
      }
    },

    nextFeed() {
      if(this.hasFeedingOverride) {
        return this.feedingOverride
      } else if(this.lastFed && this.animal.feedingDuration) {
        return moment(this.lastFed).add(this.animal.feedingDuration, 'd').startOf('day')
      }
      return null
    },

    tomorrow() {
      return moment(this.today).add(1, 'd').format('YYYY-MM-DD')
    },

    nextFeedingFromNow() {
      if(this.nextFeed) {
        return this.nextFeed.from(this.today)
      }
      return null
    },

    nextFeedToday() {
      return this.nextFeed.year() === this.today.year() && this.nextFeed.dayOfYear() === this.today.dayOfYear()
    },

    feedingConfig() {
      if(this.nextFeedToday) {
        return { color: '#27C72F', text: 'today!' }
      } else {
        let config = {
          color: '#4CD3FE',
          text: this.nextFeedingFromNow,
        }

        if(this.nextFeedingFromNow.includes('ago')) {
          config.color = '#FF0000'
        }

        if(this.nextFeedingFromNow === 'a day ago') {
          config.text = 'yesterday'
        } else if(this.nextFeedingFromNow === 'in a day') {
          config.text = 'tomorrow'
          config.color = '#E4D125'
        }

        return config
      }
    },

    birthDate() {
      if(this.animal.birthdate) {
        return moment(this.animal.birthdate.toDate())
      } else {
        return null
      }
    },

    birthDateStr() {
      if(this.birthDate) {
        return this.birthDate.format('MM/DD/YYYY')
      } else {
        return null
      }
    },

    age() {
      if(this.birthDate) {
        let ageStr = this.today.from(this.birthDate, true)

        if(ageStr.startsWith('a')) {
          ageStr = `${1}${ageStr.slice(1)}`
        }

        return `${ageStr} old`
      } else {
        return null
      }
    },

    arrivalDate() {
      if(this.animal.arrival) {
        return moment(this.animal.arrival.toDate()).format('MM/DD/YYYY')
      } else {
        return null
      }
    },

    sex() {
      switch(this.animal.sex) {
        case 'male':
          return this.animal.sexConfirmed ? 'Confirmed male' : 'Male (unconfirmed)'
        case 'female':
          return this.animal.sexConfirmed ? 'Confirmed female' : 'Female (unconfirmed)'
        default:
          return 'Unknown'
      }
    },

    hasThumbnail() {
      return this.animal.thumbnail && this.animal.thumbnail.length
    },

    thumbnailRetriesExceeded() {
      return this.animal.thumbnailFetchAttempts && this.animal.thumbnailFetchAttempts > 5
    },

    thumbnailImage() {
      return this.animal.thumbnail || this.thumbnailUrl
    },

    animalTags() {
      if(this.animal.tags && this.animal.tags.length) {
        return this.animal.tags.map((tag) => {
          return {
            text: tag,
            color: this.randomColor(tag),
          }
        })
      }

      return []
    },
  },

  methods: {
    setupBinging() {
      if(!this.animal.archive && !this.bindingSetup && this.uuid && this.animal.id) {
        this.bindingSetup = true
        this.$bind(
          'lastFedEvent',
          this.$firebase
            .firestore()
            .collection('users')
            .doc(this.uuid)
            .collection('animals')
            .doc(this.animal.id)
            .collection('events')
            .where('type', '==', 'Feeding')
            .orderBy('timestamp', 'desc')
            .limit(1)
        )
      }
    },

    allowedDates(val) {
      return moment(val, 'YYYY-MM-DD') > this.today
    },

    goToAnimalDetails() {
      this.$router.push({
        name: 'event-listing',
        params: { animal_id: this.animal.id },
      })
    },

    newEvent() {
      this.$router.push({
        name: 'add-event',
        params: { animal_id: this.animal.id },
        query: { event_type: 'Feeding' },
      })
    },

    editAnimal() {
      this.$router.push({
        name: 'edit-animal',
        params: { animal_id: this.animal.id },
      })
    },

    deleteAnimal() {
      this.$store.commit('showConfirmDialog', {
        title: 'Are you sure you want to delete this animal?',
        body: `This action cannot be undone.${this.animal.archive ? '' : 'If you need future access to the animal\'s data, consider archiving instead.'}`,
      })

      this.confirmWatcher = this.$watch('confirmDialog.response', function(response) {
        this.confirmWatcher()
        if(response === 'confirm') {
          this.$firebase
            .firestore()
            .collection('users')
            .doc(this.uuid)
            .collection('animals')
            .doc(this.animal.id)
            .delete()
        }
      })
    },

    archiveAnimal() {
      this.$store.commit('showConfirmDialog', {
        title: 'Are you sure you want to archive this animal?',
        body: 'Archive animals and their data can still be accessed under the Archive menu.',
      })

      this.confirmWatcher = this.$watch('confirmDialog.response', function(response) {
        this.confirmWatcher()
        if(response === 'confirm') {
          this.$firebase
            .firestore()
            .collection('users')
            .doc(this.uuid)
            .collection('animals')
            .doc(this.animal.id)
            .update({ archive: true })
        }
      })
    },

    unarchive() {
      this.$firebase
        .firestore()
        .collection('users')
        .doc(this.uuid)
        .collection('animals')
        .doc(this.animal.id)
        .update({ archive: false })
    },

    updateFeedingOverride(newDateStr) {
      this.$firebase
        .firestore()
        .collection('users')
        .doc(this.uuid)
        .collection('animals')
        .doc(this.animal.id)
        .update({
          feedingOverride: newDateStr ? moment(newDateStr, 'YYYY-MM-DD').toDate() : null,
        })
    },

    clearFeedingOverride() {
      this.$store.commit('showConfirmDialog', {
        title: 'Clear next feeding override?',
        body: 'Next feeding will resume to be calculated from feeding duration and last feed event.',
      })

      this.confirmWatcher = this.$watch('confirmDialog.response', function(response) {
        this.confirmWatcher()
        if(response === 'confirm') {
          this.updateFeedingOverride(false)
        }
      })
    },

    setupLazyLoad() {
      try {
        if(!this.hasThumbnail && !this.thumbnailRetriesExceeded) {
          let thumbnail = this.getThumbnailFromImage(this.animal.image)
          let fetchAttempts = this.animal.thumbnailFetchAttempts || 0

          if(thumbnail && thumbnail.length) {
            this.$firebase.storage().ref(thumbnail).getDownloadURL()
              .then((url) => {
                this.thumbnailUrl = url

                this.$firebase
                  .firestore()
                  .collection('users')
                  .doc(this.uuid)
                  .collection('animals')
                  .doc(this.animal.id)
                  .update({ thumbnail: url })
              })
              .catch(() => {
                fetchAttempts += 1
                this.$firebase
                  .firestore()
                  .collection('users')
                  .doc(this.uuid)
                  .collection('animals')
                  .doc(this.animal.id)
                  .update({
                    thumbnailFetchAttempts: fetchAttempts,
                  })
              })
          }
        }
      } catch(e) {}
    },
  },
}
</script>

<template>
  <v-expansion-panel class="animal-card">
    <div class="animal-image">
      <v-img
        v-if="animalImage"
        :src="animalImage"
        :lazy-src="thumbnailImage"
        @load="imageLoaded = true"
      />
      <avatar-placeholder
        v-if="!imageLoaded"
        :seed="animal.id"
        :name="animal.name"
      />
    </div>

    <v-expansion-panel-header>
      <div class="animal-header" @click.stop="goToAnimalDetails">
        <div class="animal-header--first">
          <span class="animal-name">
            {{ animal.name }}
            <v-icon
              small
              v-if="animalSex"
              :color="animalSex.color"
            >
              {{ animalSex.icon }}
            </v-icon>
          </span>

          <span class="animal-header--species">{{ animal.species }}</span>
        </div>

        <div v-if="nextFeedingFromNow" class="animal-header--last">
          <span :style="{ color: feedingConfig.color }">
            Next feeding {{ feedingConfig.text }}
          </span>

          <v-tooltip v-if="hasFeedingOverride" top>
            <template v-slot:activator="{ on }">
              <v-icon
                size="14px"
                v-on="on"
                :color="feedingConfig.color"
              >
                mdi-star-circle
              </v-icon>
            </template>
            <span>Feeding Override</span>
          </v-tooltip>
        </div>
      </div>

      <template v-slot:actions>
        <div class="expand-action">
          <v-icon>$vuetify.icons.expand</v-icon>
        </div>
      </template>
    </v-expansion-panel-header>

    <v-expansion-panel-content>
      <ul class="info-listing animal-info">
        <li v-if="animal.species">
          Species: {{ animal.species }}
        </li>

        <li v-if="animal.morph && animal.morph.length">
          Morph: {{ animal.morph }}
        </li>

        <li v-if="age">
          {{ age }}
        </li>

        <li v-if="birthDateStr">
          Birthdate: {{ birthDateStr }}
        </li>

        <li>
          Sex: {{ sex }}
        </li>

        <li v-if="arrivalDate">
          Arrived on {{ arrivalDate }}
        </li>

        <li v-if="animal.feedingDuration">
          Feeding every {{ animal.feedingDuration }} days
        </li>

        <li v-if="lastFedDate">
          Last fed {{ lastFedDate }} ({{ lastFedFromNow }})
        </li>
      </ul>

      <div v-if="animalTags.length" class="animal-tags">
        <v-chip
          v-for="(tag, index) in animalTags"
          :key="index"
          :color="tag.color"
          @click="$emit('filter-tag', tag.text)"
        >
          {{ tag.text }}
        </v-chip>
      </div>

      <div v-if="animalImage" class="animal-expanded-image">
        <img :src="animalImage" />
      </div>

      <div class="card-actions">
        <div class="card-actions--left">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                color="#f66262"
                v-on="on"
                @click="deleteAnimal"
              >
                <v-icon>mdi-delete-forever</v-icon>
              </v-btn>
            </template>
            <span>Delete</span>
          </v-tooltip>

          <v-tooltip v-if="animal.archive" top>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                color="#71f55c"
                v-on="on"
                @click="unarchive"
              >
                <v-icon>mdi-history</v-icon>
              </v-btn>
            </template>
            <span>Unarchive</span>
          </v-tooltip>
          <v-tooltip v-else top>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                color="#d0a16c"
                v-on="on"
                @click="archiveAnimal"
              >
                <v-icon>mdi-archive</v-icon>
              </v-btn>
            </template>
            <span>Archive</span>
          </v-tooltip>
        </div>

        <div v-if="!animal.archive">
          <v-tooltip v-if="hasFeedingOverride" top>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                color="#ff8f5e"
                v-on="on"
                @click="clearFeedingOverride"
              >
                <v-icon>mdi-calendar-remove</v-icon>
              </v-btn>
            </template>
            <span>Clear Feeding Override</span>
          </v-tooltip>
          <v-tooltip v-else top>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                color="#ff8f5e"
                v-on="on"
                @click="dateInput = true"
              >
                <v-icon>mdi-calendar-edit</v-icon>
              </v-btn>
            </template>
            <span>Override Next Feeding</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                color="#46cdff"
                v-on="on"
                @click="editAnimal"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                color="primary"
                v-on="on"
                large
                @click="newEvent"
              >
                <v-icon>mdi-plus-circle</v-icon>
              </v-btn>
            </template>
            <span>New Event</span>
          </v-tooltip>
        </div>
      </div>

      <date-time-picker-dialog
        :open.sync="dateInput"
        :value="tomorrow"
        :allowed-dates="allowedDates"
        type="date"
        title="Pause feeding until:"
        @input="updateFeedingOverride"
      >
        Next Feeding Override

        <v-tooltip
          top
          max-width="300px"
          open-on-click
        >
          <template v-slot:activator="{ on }">
            <v-icon
              color="#ffffff"
              v-on="on"
            >
              mdi-information-outline
            </v-icon>
          </template>

          <div class="text-center">
            Manually set the next feeding date, overriding
            automatic next feeding calculation.
            Will reset after next feeding.
          </div>
        </v-tooltip>
      </date-time-picker-dialog>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<style scoped>
  .v-expansion-panel {
    position: relative;
  }

  .v-expansion-panel-header {
    padding: 0;
    min-height: 60px;
  }

  .animal-tags {
    margin-top: 16px;
    visibility: hidden;
  }

  .animal-tags .v-chip {
    margin: 0 4px;
  }

  .v-expansion-panel--active .animal-tags {
    visibility: visible;
  }
</style>
