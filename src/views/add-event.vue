<script>
import EventForm from '@/components/event-form'

export default {
  components: {
    EventForm,
  },

  props: {
    eventType: {
      type: String,
      default: 'Other',
    },
  },

  watch: {
    '$route': {
      immediate: true,
      handler() {
        this.animalId = this.$route.params.animal_id
      },
    },
  },

  data() {
    return {
      animalId: this.$route.params.animal_id,
    }
  },
}
</script>

<template>
  <div class="container-wrapper">
    <event-form
      :animal-id="animalId"
      :event-type="eventType"
    />
  </div>
</template>
