<script>
import EventForm from '@/components/event-form'
import Loading from '@/components/loading'
import { mapGetters } from 'vuex'

export default {
  components: {
    EventForm,
    Loading,
  },

  data() {
    return {
      loading: true,
      animalId: this.$route.params.animal_id,
      eventId: this.$route.params.event_id,
      currentEvent: null,
    }
  },

  watch: {
    '$route': {
      immediate: true,
      handler() {
        this.animalId = this.$route.params.animal_id
        this.eventId = this.$route.params.event_id
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
        this.uuid,
        this.animalId,
        this.eventId,
      ]
    },
  },

  methods: {
    setupBinging() {
      if(!this.bindingSetup && this.uuid && this.animalId && this.eventId) {
        this.bindingSetup = true
        this.$bind(
          'currentEvent',
          this.$firebase
            .firestore()
            .collection('users')
            .doc(this.uuid)
            .collection('animals')
            .doc(this.animalId)
            .collection('events')
            .doc(this.eventId)
        ).then(() => {
          this.loading = false
        })
      }
    },
  },
}
</script>

<template>
  <div class="container-wrapper">
    <loading v-if="loading" />
    <v-card v-else class="container-card">
      <v-card-title>Edit Event</v-card-title>
      <v-card-text>
        <event-form
          :animal-id="animalId"
          :current-event="currentEvent"
        />
      </v-card-text>
    </v-card>
  </div>
</template>
