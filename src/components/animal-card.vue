<script>
import moment from 'moment'
import { mapState, mapGetters } from 'vuex'

export default {
  props: {
    animal: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      lastFedEvent: null,
      randomColor: `hsl(${360 * Math.random()},${25 + 70 * Math.random()}%, ${85 + 10 * Math.random()}%)`,
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

  computed: {
    ...mapState([
      'confirmDialog',
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
      if(this.lastFed && this.animal.feedingDuration) {
        return moment(this.lastFed).add(this.animal.feedingDuration, 'd').startOf('day')
      }
      return null
    },

    today() {
      return moment().startOf('day')
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
  },

  methods: {
    setupBinging() {
      if(!this.bindingSetup && this.uuid && this.animal.id) {
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

    goToAnimalDetails() {
      this.$router.push({
        name: 'event-listing',
        params: { animal_id: this.animal.id },
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
        body: 'This action cannot be undone.',
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
  },
}
</script>

<template>
  <v-expansion-panel>
    <div
      class="animal-image"
      :style="{ backgroundColor: randomColor }"
    >
      No image
    </div>

    <v-expansion-panel-header>
      <div class="animal-header" @click.prevent.stop="goToAnimalDetails">
        <div class="animal-header--first">
          <span class="animal-name">
            {{ animal.name }}
          </span>

          <span class="animal-header--species">{{ animal.species }}</span>
        </div>

        <div v-if="nextFeedingFromNow" class="animal-header--last">
          <span :style="{ color: feedingConfig.color }">
            Next feeding {{ feedingConfig.text }}
          </span>
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

        <li v-if="age">
          {{ age }}
        </li>

        <li v-if="birthDateStr">
          Birthdate: {{ birthDateStr }}
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

      <div class="card-actions">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="#f66262"
              v-on="on"
              @click.prevent="deleteAnimal"
            >
              <v-icon>mdi-delete-forever</v-icon>
            </v-btn>
          </template>
          <span>Delete</span>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="#46cdff"
              v-on="on"
              @click.prevent="editAnimal"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>Edit</span>
        </v-tooltip>
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<style scoped>
  .v-expansion-panel {
    position: relative;
  }

  .v-expansion-panel-header {
    padding: 0;
  }

  .v-expansion-panel-content {
    margin-left: 100px;
  }
</style>
