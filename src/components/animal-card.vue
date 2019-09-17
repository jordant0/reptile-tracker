<script>
import moment from 'moment';

export default {
  props: {
    animal: {
      type: Object,
      required: true,
    },

    uuid: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      lastFedEvent: null,
    }
  },

  watch: {
    'animal.id': {
      immediate: true,
      handler() {
        if(this.uuid && this.animal.id) {
          this.$bind(
            'lastFedEvent',
            this.$firebase
              .firestore()
              .collection('users')
              .doc(this.uuid)
              .collection('animals')
              .doc(this.animal.id)
              .collection('events')
              .where("type", "==", "Feeding")
              .orderBy("timestamp", "desc")
              .limit(1)
          )
        }
      }
    },
  },

  computed: {
    lastFed() {
      if(!(this.lastFedEvent && this.lastFedEvent.length)) {
        return null;
      }

      return moment(this.lastFedEvent[0].timestamp.toDate());
    },

    lastFedDate() {
      if(this.lastFed) {
        return this.lastFed.format('M/D h:mm a');
      } else {
        return null;
      }
    },

    nextFeed() {
      if(this.lastFed && this.animal.feedingDuration) {
        return this.lastFed.add(this.animal.feedingDuration, 'd');
      }
      return null;
    },

    nextFeedingFromNow() {
      if(this.nextFeed) {
        return this.nextFeed.fromNow();
      }
      return null;
    },
  }
}

</script>

<template>
  <v-card
    class="animal-card"
    width="300px"
  >
    <v-card-title>{{ animal.name }}</v-card-title>
    <v-card-text>
      <v-row>{{ animal.species }}</v-row>
      <v-row v-if="animal.feedingDuration">
        Feeding every {{ animal.feedingDuration }} days
      </v-row>
      <v-row v-if="lastFedDate">
        Last fed {{ lastFedDate }}
      </v-row>
      <v-row v-if="nextFeedingFromNow">
        Next feeding {{ nextFeedingFromNow }}
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
  .animal-card {
    margin: 20px;
  }

  .row {
    margin: 0;
  }
</style>
