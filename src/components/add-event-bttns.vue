<script>
import eventTypeData from '@/data/event-type'

export default {
  props: {
    animalId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      addMenu: false,
    }
  },

  created() {
    this.typesData = eventTypeData
  },

  methods: {
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
