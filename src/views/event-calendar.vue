<script>
import Loading from '@/components/loading'
import Empty from '@/components/empty'
import eventTypeData from '@/data/event-type'
import AddEventBttns from '@/components/add-event-bttns'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    Loading,
    Empty,
    AddEventBttns,
  },

  data() {
    return {
      loading: true,
      animalId: this.$route.params.animal_id,
      animal: null,
      eventsList: [],
      today: new Date(),
    }
  },

  created() {
    this.typesConfig = eventTypeData.config
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
  },

  computed: {
    ...mapState([
      'darkTheme',
    ]),

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

    calendarAttrs() {
      return [
        {
          key: 'today',
          highlight: true,
          dates: this.today,
        },
        ...this.eventsList.map(event => this.getCalendarEvent(event)),
      ]
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

    getEventsList() {
      let collection = this.$firebase
        .firestore()
        .collection('users')
        .doc(this.uuid)
        .collection('animals')
        .doc(this.animalId)
        .collection('events')

      this.$bind(
        'eventsList',
        collection,
      ).then(() => {
        this.loading = false
      })
    },

    getCalendarEvent(event) {
      let label
      switch(event.type) {
        case 'Feeding':
          label = `Feeding: ${event.notes}`
          break
        case 'Handling':
          label = `Handling: ${event.value}m`
          break
        case 'Weight':
          label = `Weight: ${event.value}g`
          break
        case 'Shedding':
          label = 'Shed'
          break
        default:
          label = event.notes
      }

      return {
        dates: event.timestamp.toDate(),
        dot: this.typesConfig[event.type].calendar,
        popover: {
          label,
          placement: 'auto',
        },
      }
    },
  },
}
</script>

<template>
  <div class="event-listing container-wrapper">
    <loading v-if="loading" />
    <template v-else>
      <empty v-if="!eventsList.length" noun="event" />
      <v-card v-else class="container-card">
        <v-card-title>
          {{ animalName }}'s Events Calendar
        </v-card-title>

        <v-card-text class="chart-container">
          <v2-calendar
            :attributes="calendarAttrs"
            :is-dark="darkTheme"
            color="red"
            is-expanded
          />
        </v-card-text>
      </v-card>

      <add-event-bttns :animal-id="animalId" />
    </template>
  </div>
</template>
