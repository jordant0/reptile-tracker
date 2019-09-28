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
      return this.animal && (!this.filter || !this.filter.length || this.filter === 'Other')
    },

    showEmpty() {
      return !this.eventsList.length && (!this.includeOtherCards || (!this.animal.arrival && !this.animal.birthDate))
    }
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

    getEventsList() {
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

      this.$bind(
        'eventsList',
        collection
          .orderBy('timestamp', 'desc')
      ).then(() => {
        this.loading = false
      })
    },

    refetchEvents() {
      if(!this.loading) {
        this.loading = true
        this.$unbind('eventsList')
        this.getEventsList()
      }
    },
  },
}
</script>

<template>
  <div class="event-listing container-wrapper">
    <loading v-if="loading" />
    <template v-else>
      <div class="event-listing_header">
        Events for {{ animalName }}

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
  }
</style>
