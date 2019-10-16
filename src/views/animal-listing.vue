<script>
import Loading from '@/components/loading'
import Empty from '@/components/empty'
import AnimalCard from '@/components/animal-card'
import randomColor from '@/mixins/random-color'
import { mapGetters } from 'vuex'

export default {
  mixins: [
    randomColor,
  ],

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
      filterTag: null,
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
          .filter((animal) => {
            return (this.archive === !!animal.archive) &&
              (!this.filterTag || (animal.tags && animal.tags.includes(this.filterTag)))
          })
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

    filterTagColor() {
      if(this.filterTag) {
        return this.randomColor(this.filterTag)
      }

      return null
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
      <div v-if="filterTag" class="listing_header">
        <div class="listing_header--label">
          Animals with tag
          <v-chip
            :color="filterTagColor"
            close
            @click:close="filterTag = null"
          >
            {{ filterTag }}
          </v-chip>
        </div>
      </div>

      <empty v-if="!animalsList.length" noun="animal" />
      <v-expansion-panels v-else>
        <animal-card
          v-for="animal in filteredAnimals"
          :key="animal.id"
          :animal="animal"
          @filter-tag="filterTag = $event"
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

<style scoped>
  .listing_header--label .v-chip {
    margin-left: 4px;
  }
</style>
