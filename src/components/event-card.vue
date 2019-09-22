<script>
  import eventTypeData from '@/data/event-type'
  import moment from 'moment'

  export default {
    props: {
      animal: {
        type: Object,
        default() {
          return {};
        },
      },

      currentEvent: {
        type: Object,
        required: true,
      },
    },

    created() {
      this.typesConfig = eventTypeData.config;
    },

    computed: {
      animalName() {
        if(this.animal) {
          return this.animal.name;
        } else {
          return '';
        }
      },

      eventIcon() {
        let configVal = this.typesConfig[this.currentEvent.type];

        return configVal || this.typesConfig.Other;
      },

      processedTimeStamp() {
        return moment(this.currentEvent.timestamp.toDate());
      },

      fullTimestamp() {
        return this.processedTimeStamp.format("ddd M/D/YY @ h:mm a");
      },

      timeFromNow() {
        return this.processedTimeStamp.fromNow();
      },

      dateStr() {
        return this.processedTimeStamp.format("M/D/YY");
      },

      timeStr() {
        return this.processedTimeStamp.format("h:mm a");
      },

      eventDetails() {
        switch(this.currentEvent.type) {
          case 'Feeding':
            return `Fed ${this.animalName} ${this.currentEvent.notes}`
          case 'Handling':
            return `Handled ${this.animalName} for ${this.currentEvent.value} minutes`
          case 'Weight':
            return `Weighed ${this.animalName}: ${this.currentEvent.value}g`
          case 'Shedding':
            return `${this.animalName} shed`
          case 'Maintenance':
            return `Maintenance for ${this.animalName}`
          default:
            return `${this.animalName}`
        }
      },
    },
  }
</script>

<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <div class="event-info_wrapper">
        <v-icon
          class="event-icon"
          size="20px"
          :color="eventIcon.color"
        >
          {{ eventIcon.icon }}
        </v-icon>

        <div class="event-info">
          <div class="event-timestamp">
            <div class="event-timestamp--date">
              {{ dateStr }}
            </div>

            <div class="event-timestamp--time">
              {{ timeStr }}
            </div>
          </div>

          <div class="event-details">
            {{ eventDetails }}
          </div>
        </div>
      </div>
    </v-expansion-panel-header>

    <v-expansion-panel-content>
      <ul class="animal-info">
        <li v-if="currentEvent.notes">
          {{ currentEvent.notes }}
        </li>

        <li>
          {{ fullTimestamp }} ({{ timeFromNow }})
        </li>
      </ul>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<style scoped>
  .event-info_wrapper {
    display: flex;
    align-items: center;
    max-width: calc(100% - 36px);
  }

  .event-info {
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    overflow: hidden;
  }

  .event-icon {
    margin-right: 12px;
  }

  .event-timestamp {
    display: flex;
    width: 160px;
    flex-shrink: 0;
  }

  .event-timestamp--date {
    margin-right: 8px;
    width: 58px;
    text-align: right;
  }

  .event-timestamp--time {
    width: 70px;
    text-align: left;
  }

  .event-details {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media screen and (max-width: 500px) {
    .v-expansion-panel-header {
      padding: 12px;
    }

    .event-info {
      flex-direction: column;
      align-items: flex-start;
      position: relative;
    }

    .event-details {
      margin-top: 8px;
    }
  }
</style>
