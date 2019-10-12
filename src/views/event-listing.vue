<script>
import Loading from '@/components/loading'
import Empty from '@/components/empty'
import EventCard from '@/components/event-card'
import ArrivalCard from '@/components/arrival-card'
import BirthdateCard from '@/components/birthdate-card'
import AddEventBttns from '@/components/add-event-bttns'
import Filtering from '@/components/filtering'
import { mapGetters } from 'vuex'

export default {
  components: {
    EventCard,
    ArrivalCard,
    BirthdateCard,
    Loading,
    Empty,
    AddEventBttns,
    Filtering,
  },

  data() {
    return {
      loading: true,
      animalId: this.$route.params.animal_id,
      animal: null,
      eventsList: [],
      filter: null,
      pagingLoad: true,
      endOfList: false,
    }
  },

  watch: {
    '$route': {
      immediate: true,
      handler() {
        this.animalId = this.$route.params.animal_id
      },
    },

    bindingProps: {
      immediate: true,
      handler() {
        this.setupBinging()
      },
    },

    filter() {
      this.refetchEvents()
    },
  },

  computed: {
    ...mapGetters([
      'uuid',
    ]),

    bindingProps() {
      return [
        this.animalId,
        this.uuid,
      ]
    },

    animalName() {
      if(this.animal) {
        return this.animal.name
      } else {
        return ''
      }
    },

    includeOtherCards() {
      return this.animal && this.endOfList && (!this.filter || !this.filter.length || this.filter === 'Other')
    },

    showEmpty() {
      return !this.eventsList.length && (!this.includeOtherCards || (!this.animal.arrival && !this.animal.birthDate))
    },
  },

  methods: {
    setupBinging() {
      if(!this.bindingSetup && this.uuid && this.animalId) {
        this.bindingSetup = true
        this.$bind(
          'animal',
          this.$firebase
            .firestore()
            .collection('users')
            .doc(this.uuid)
            .collection('animals')
            .doc(this.animalId)
        )

        this.getEventsList()
      }
    },

    getEventsList(paging = false) {
      let collection = this.$firebase
        .firestore()
        .collection('users')
        .doc(this.uuid)
        .collection('animals')
        .doc(this.animalId)
        .collection('events')

      if(this.filter && this.filter.length) {
        collection = collection.where('type', '==', this.filter)
      }

      collection = collection.orderBy('timestamp', 'desc')

      if(paging) {
        if(this.eventsList.length >= 1) {
          collection = collection.startAfter(
            this.eventsList[this.eventsList.length - 1].timestamp
          )
        }
      } else {
        this.eventsList = []
        this.endOfList = false
      }

      collection = collection.limit(50)

      collection.get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.eventsList.push({
              id: doc.id,
              ...doc.data(),
            })
          })

          this.loading = false

          if(querySnapshot.size < 100) {
            this.endOfList = true
          }

          setTimeout(() => {
            this.pagingLoad = false
          }, 1000)
        })
        .catch(() => {
          this.loading = false
          this.endOfList = false
        })
    },

    refetchEvents() {
      if(!this.loading) {
        this.loading = true
        this.getEventsList()
      }
    },

    loadMore() {
      if(!this.loading && !this.pagingLoad && this.eventsList.length) {
        console.log('Loading more events...')
        this.pagingLoad = true
        this.getEventsList(true)
      }
    },

    goToAnimalRoute(name) {
      this.$router.push({
        name,
        params: { animal_id: this.animal.id },
      })
    },
  },
}
</script>

<template>
  <div class="event-listing container-wrapper">
    <loading v-if="loading" />
    <template v-else>
      <div class="event-listing_header">
        <div class="event-listing_header--label">
          Events for {{ animalName }}
        </div>

        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="#ff8a36"
              v-on="on"
              @click="goToAnimalRoute('chart')"
            >
              <v-icon>mdi-chart-line</v-icon>
            </v-btn>
          </template>
          <span>Weight Chart</span>
        </v-tooltip>

        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="#16a4ff"
              v-on="on"
              @click="goToAnimalRoute('calendar')"
            >
              <v-icon>mdi-calendar-multiselect</v-icon>
            </v-btn>
          </template>
          <span>View Calendar</span>
        </v-tooltip>

        <div class="flex-grow-1"></div>

        <filtering
          :animal-id="animalId"
          :current-filter.sync="filter"
          :loading="loading"
        />
      </div>

      <empty v-if="showEmpty" noun="event" />
      <v-expansion-panels v-else>
        <event-card
          v-for="currentEvent in eventsList"
          :key="currentEvent.id"
          :current-event="currentEvent"
          :animal="animal"
        />

        <arrival-card
          v-if="includeOtherCards && animal.arrival"
          :date="animal.arrival"
          :animal-name="animalName"
        />

        <birthdate-card
          v-if="includeOtherCards && animal.birthdate"
          :date="animal.birthdate"
          :animal-name="animalName"
        />
      </v-expansion-panels>

      <div
        v-if="!endOfList"
        v-intersect="loadMore"
        class="events-loader"
        ref="loadMore"
      >
        Loading more events

        <v-progress-circular
          indeterminate
          size="16"
          width="2"
        />
      </div>
      <div v-else class="events-loader">
        End of events list
      </div>

      <add-event-bttns :animal-id="animalId" />
    </template>
  </div>
</template>

<style scoped>
  .event-listing {
    max-width: 100%;
  }

  .event-listing_header {
    font-size: 18px;
    margin-bottom: 12px;
    font-weight: 500;
    display: flex;
    align-items: center;
  }

  .event-listing_header--label {
    margin-right: 8px;
  }

  .events-loader {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #b6b6b6;
    font-style: italic;
    padding-top: 20px;
  }

  .events-loader .v-progress-circular {
    margin-left: 12px;
  }
</style>
