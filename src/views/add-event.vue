<script>
import EventForm from '@/components/event-form'

export default {
  components: {
    EventForm
  },

  props: {
    eventType: {
      type: String,
      default: 'Other'
    }
  },

  watch: {
    '$route': {
      immediate: true,
      handler () {
        this.animalId = this.$route.params.animal_id
      }
    }
  },

  data () {
    return {
      animalId: this.$route.params.animal_id
    }
  }
}
</script>

<template>
  <v-card class="container-card">
    <v-card-title>Add {{ eventType }} Event</v-card-title>
    <v-card-text>
      <event-form
        :animal-id="animalId"
        :event-type="eventType"
      />
    </v-card-text>
  </v-card>
</template>
