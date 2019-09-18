<script>
  import moment from 'moment'
  import { mapGetters } from 'vuex'

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
      ...mapGetters([
        'uuid',
      ]),

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
    },

    methods: {
      goToAnimalDetails() {
        debugger;
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

          <span>{{ animal.species }}</span>
        </div>

        <div class="animal-header--last">
          <span v-if="lastFedDate">
            Last fed {{ lastFedDate }}
          </span>

          <span v-if="nextFeedingFromNow">
            Next feeding {{ nextFeedingFromNow }}
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
      <v-row v-if="animal.feedingDuration">
        Feeding every {{ animal.feedingDuration }} days
      </v-row>
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

  .animal-header {
    padding: 16px 24px 16px 124px;
  }

  .v-expansion-panel-content {
    margin-left: 100px;
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

  .row {
    margin: 0;
  }
</style>
