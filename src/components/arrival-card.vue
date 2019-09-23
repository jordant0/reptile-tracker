<script>
import moment from 'moment'

export default {
  props: {
    animalName: {
      type: String,
      default: '',
    },

    date: {
      type: Object,
      required: true,
    },
  },

  computed: {
    dateStr() {
      if(this.date) {
        return moment(this.date.toDate()).format('MM/DD/YYYY')
      } else {
        return null
      }
    },
  },
}
</script>

<template>
  <v-expansion-panel>
    <v-expansion-panel-header hide-actions>
      <div class="event-info_wrapper">
        <v-icon
          class="event-icon"
          size="20px"
          color="#43d6d2"
        >
          mdi-home
        </v-icon>

        <div class="event-info">
          <div class="event-timestamp">
            <div class="event-timestamp--date">
              {{ dateStr }}
            </div>
          </div>

          <div class="event-details">
            {{ animalName }}'s arrival
          </div>
        </div>
      </div>
    </v-expansion-panel-header>
  </v-expansion-panel>
</template>
