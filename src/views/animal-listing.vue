<script>
  import AnimalCard from '@/components/animal-card'

  export default {
    components: {
      AnimalCard,
    },

    props: {
      uuid: {
        type: String,
        default: ''
      },
    },

    data() {
      return {
        animalsList: [],
      }
    },

    watch: {
      uuid() {
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
      },
    },
  };
</script>

<template>
  <div class="animal-listing">
    <v-expansion-panels popout>
      <animal-card
        v-for="animal in animalsList"
        :key="animal.id"
        :animal="animal"
        :uuid="uuid"
      />
    </v-expansion-panels>
  </div>
</template>

<style scoped>
  .animal-listing {
    max-width: 1000px;
    margin: auto;
  }
</style>
