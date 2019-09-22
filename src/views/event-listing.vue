<script>
  import EventCard from '@/components/event-card'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      EventCard,
    },

    data() {
      return {
        animalId: this.$route.params.animal_id,
        animal: null,
        eventsList: [],
      }
    },

    watch: {
      '$route': {
        immediate: true,
        handler() {
          this.animalId = this.$route.params.animal_id;
        },
      },

      animalId: {
        immediate: true,
        handler() {
          this.setupBinging();
        }
      },

      uuid: {
        immediate: true,
        handler() {
          this.setupBinging();
        },
      },
    },

    computed: {
      ...mapGetters([
        'uuid',
      ]),

      animalName() {
        if(this.animal) {
          return this.animal.name;
        } else {
          return '';
        }
      },
    },

    methods: {
      setupBinging() {
        if(!this.bindingSetup && this.uuid && this.animalId) {
          this.bindingSetup = true;
          this.$bind(
            'animal',
            this.$firebase
              .firestore()
              .collection('users')
              .doc(this.uuid)
              .collection('animals')
              .doc(this.animalId)
          );

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
          );
        }
      },

      addEvent() {
        debugger;
      },
    },
  };
</script>

<template>
  <div class="event-listing">
    <div class="event-listing_header">
      Events for {{ animalName }}
    </div>

    <v-expansion-panels>
      <event-card
        v-for="currentEvent in eventsList"
        :key="currentEvent.id"
        :current-event="currentEvent"
        :animal="animal"
      />
    </v-expansion-panels>

    <v-btn
      fixed
      dark
      fab
      bottom
      right
      color="accent"
      @click.prevent="addEvent"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<style scoped>
  .event-listing {
    max-width: 100%;
  }
</style>
