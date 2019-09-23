<script>
import Loading from '@/components/loading'
import Empty from '@/components/empty'
import EventCard from '@/components/event-card'
import { mapGetters } from 'vuex'
import eventTypeData from '@/data/event-type'

export default {
  components: {
    EventCard,
    Loading,
    Empty,
  },

  data() {
    return {
      loading: true,
      animalId: this.$route.params.animal_id,
      animal: null,
      eventsList: [],
      addMenu: false,
    }
  },

  created() {
    this.typesData = eventTypeData
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

        this.$bind(
          'eventsList',
          this.$firebase
            .firestore()
            .collection('users')
            .doc(this.uuid)
            .collection('animals')
            .doc(this.animalId)
            .collection('events')
            .orderBy('timestamp', 'desc')
        ).then(() => {
          this.loading = false
        })
      }
    },

    addEvent(eventType) {
      this.$router.push({
        name: 'add-event',
        params: { animal_id: this.animalId },
        query: { event_type: eventType },
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
        Events for {{ animalName }}
      </div>

      <empty v-if="!eventsList.length" noun="event" />
      <v-expansion-panels v-else>
        <event-card
          v-for="currentEvent in eventsList"
          :key="currentEvent.id"
          :current-event="currentEvent"
          :animal="animal"
        />
      </v-expansion-panels>

      <v-speed-dial
        v-model="addMenu"
        fixed
        bottom
        right
        direction="top"
        transition="slide-y-reverse-transition"
      >
        <template v-slot:activator>
          <v-btn
            v-model="addMenu"
            color="accent"
            dark
            fab
          >
            <v-icon v-if="addMenu">mdi-close</v-icon>
            <v-icon v-else>mdi-plus</v-icon>
          </v-btn>
        </template>

        <v-tooltip
          v-for="eventType in typesData.order"
          :key="eventType"
          left
        >
          <template v-slot:activator="{ on }">
            <v-btn
              fab
              dark
              small
              :color="typesData.config[eventType].color"
              v-on="on"
              @click.prevent="addEvent(eventType)"
            >
              <v-icon>{{ typesData.config[eventType].icon }}</v-icon>
            </v-btn>
          </template>
          <span>{{ eventType }}</span>
        </v-tooltip>
      </v-speed-dial>
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
  }
</style>
