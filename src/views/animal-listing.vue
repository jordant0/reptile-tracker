<script>
  import AnimalCard from '@/components/animal-card'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      AnimalCard,
    },

    data() {
      return {
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
            )
          }
        }
      },
    },

    computed: {
      ...mapGetters([
        'uuid',
      ])
    },

    methods: {
      addAnimal() {
        this.$router.push({ name: 'add-animal' });
      },
    },
  };
</script>

<template>
  <div class="animal-listing">
    <v-expansion-panels>
      <animal-card
        v-for="animal in animalsList"
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
      @click.prevent="addAnimal"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>
