<script>
import AnimalForm from '@/components/animal-form'
import Loading from '@/components/loading'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    AnimalForm,
    Loading,
  },

  data() {
    return {
      animalId: this.$route.params.animal_id,
    }
  },

  watch: {
    '$route': {
      immediate: true,
      handler() {
        this.animalId = this.$route.params.animal_id
      },
    },
  },

  computed: {
    ...mapState([
      'animalListLoaded',
    ]),

    ...mapGetters([
      'animalData',
    ]),

    animal() {
      return this.animalData(this.animalId)
    },
  },
}
</script>

<template>
  <div class="container-wrapper">
    <loading v-if="!animalListLoaded" type="card-heading, image, actions" />
    <v-card v-else class="container-card">
      <v-card-title>Edit Animal</v-card-title>
      <v-card-text>
        <animal-form :animal="animal" />
      </v-card-text>
    </v-card>
  </div>
</template>
