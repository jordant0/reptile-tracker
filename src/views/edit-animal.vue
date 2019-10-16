<script>
import AnimalForm from '@/components/animal-form'
import Loading from '@/components/loading'
import { mapGetters } from 'vuex'

export default {
  components: {
    AnimalForm,
    Loading,
  },

  data() {
    return {
      loading: true,
      animalId: this.$route.params.animal_id,
      animal: null,
    }
  },

  watch: {
    '$route': {
      immediate: true,
      handler() {
        this.animalId = this.$route.params.animal_id
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
        this.animalId,
        this.uuid,
      ]
    },
  },

  methods: {
    setupBinging() {
      if(!this.bindingSetup && this.uuid && this.animalId) {
        this.bindingSetup = true
        this.$bind(
          'animal',
          this.$firebase
            .firestore()
            .collection('users')
            .doc(this.uuid)
            .collection('animals')
            .doc(this.animalId)
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
    <loading v-if="loading" type="card-heading, image, actions" />
    <v-card v-else class="container-card">
      <v-card-title>Edit Animal</v-card-title>
      <v-card-text>
        <animal-form :animal="animal" />
      </v-card-text>
    </v-card>
  </div>
</template>
