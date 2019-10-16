<script>
import Loading from '@/components/loading'
import ReorderAnimals from '@/components/reorder-animals'
import ExportData from '@/components/export-data'
import { mapGetters } from 'vuex'

export default {
  components: {
    Loading,
    ExportData,
    ReorderAnimals,
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
  },
}
</script>

<template>
  <div class="container-wrapper">
    <loading v-if="loading" type="card-heading, image, actions" />
    <template v-else>
      <reorder-animals :animals-list="animalsList" />

      <export-data :animals-list="animalsList" />
    </template>
  </div>
</template>
