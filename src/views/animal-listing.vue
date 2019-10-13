<script>
import Loading from '@/components/loading'
import Empty from '@/components/empty'
import AnimalCard from '@/components/animal-card'
import { mapGetters } from 'vuex'

export default {
  components: {
    AnimalCard,
    Loading,
    Empty,
  },

  props: {
    archive: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      loading: true,
      animalsList: [],
    }
  },

  watch: {
    uuid: {
      immediate: true,
      handler() {
        if(this.uuid) {
          this.$bind(
            'animalsList',
            this.$firebase
              .firestore()
              .collection('users')
              .doc(this.uuid)
              .collection('animals')
          ).then(() => {
            this.loading = false
          })
        }
      },
    },
  },

  computed: {
    ...mapGetters([
      'uuid',
    ]),

    filteredAnimals() {
      if(this.animalsList) {
        return this.animalsList
          .filter(animal => this.archive === !!animal.archive)
          .sort((animalA, animalB) => {
            if(!animalB.position) {
              return -1
            } else if(!animalA.position) {
              return 1
            } else {
              return animalA.position - animalB.position
            }
          })
      } else {
        return []
      }
    },
  },

  methods: {
    addAnimal() {
      this.$router.push({ name: 'add-animal' })
    },
  },
}
</script>

<template>
  <div class="animal-listing container-wrapper">
    <loading v-if="loading" />
    <template v-else>
      <empty v-if="!animalsList.length" noun="animal" />
      <v-expansion-panels v-else>
        <animal-card
          v-for="animal in filteredAnimals"
          :key="animal.id"
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
        @click="addAnimal"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
  </div>
</template>
