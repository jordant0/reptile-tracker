<script>
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  props: {
    animal: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      lastFedEvent: null,
      randomColor: `hsl(${360 * Math.random()},${25 + 70 * Math.random()}%, ${85 + 10 * Math.random()}%)`
    }
  },

  watch: {
    'animal.id': {
      immediate: true,
      handler () {
        this.setupBinging()
      }
    },

    uuid: {
      immediate: true,
      handler () {
        this.setupBinging()
      }
    }
  },

  computed: {
    ...mapGetters([
      'uuid'
    ]),

    lastFed () {
      if (!(this.lastFedEvent && this.lastFedEvent.length)) {
        return null
      }

      return moment(this.lastFedEvent[0].timestamp.toDate())
    },

    lastFedDate () {
      if (this.lastFed) {
        return this.lastFed.format('M/D h:mm a')
      } else {
        return null
      }
    },

    lastFedFromNow () {
      if (this.lastFed) {
        return this.lastFed.fromNow()
      } else {
        return null
      }
    },

    nextFeed () {
      if (this.lastFed && this.animal.feedingDuration) {
        return moment(this.lastFed).add(this.animal.feedingDuration, 'd').startOf('day')
      }
      return null
    },

    today () {
      return moment().startOf('day')
    },

    nextFeedingFromNow () {
      if (this.nextFeed) {
        return this.nextFeed.from(this.today)
      }
      return null
    },

    nextFeedToday () {
      return this.nextFeed.year() === this.today.year() && this.nextFeed.dayOfYear() === this.today.dayOfYear()
    },

    feedingConfig () {
      if (this.nextFeedToday) {
        return { color: '#27C72F', text: 'today!' }
      } else {
        let config = {
          color: '#4CD3FE',
          text: this.nextFeedingFromNow
        }

        if (this.nextFeedingFromNow.includes('ago')) {
          config.color = '#FF0000'
        }

        if (this.nextFeedingFromNow === 'a day ago') {
          config.text = 'yesterday'
        } else if (this.nextFeedingFromNow === 'in a day') {
          config.text = 'tomorrow'
          config.color = '#E4D125'
        }

        return config
      }
    },

    birthDate () {
      if (this.animal.birthdate) {
        return moment(this.animal.birthdate.toDate()).format('MM/DD/YYYY')
      } else {
        return null
      }
    },

    arrivalDate () {
      if (this.animal.arrival) {
        return moment(this.animal.arrival.toDate()).format('MM/DD/YYYY')
      } else {
        return null
      }
    }
  },

  methods: {
    setupBinging () {
      if (!this.bindingSetup && this.uuid && this.animal.id) {
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

    goToAnimalDetails () {
      this.$router.push({
        name: 'event-listing',
        params: { animal_id: this.animal.id }
      })
    }
  }
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
      <ul class="animal-info">
        <li v-if="animal.species">
          Species: {{ animal.species }}
        </li>

        <li v-if="birthDate">
          Birthdate: {{ birthDate }}
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

<style>
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

  .animal-info {
    color: #999999;
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
      margin-left: 0;
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
</style>
