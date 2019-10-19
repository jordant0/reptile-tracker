<script>
import Loading from '@/components/loading'
import PushSettings from '@/components/push-settings'
import ReorderAnimals from '@/components/reorder-animals'
import ExportData from '@/components/export-data'
import { mapGetters } from 'vuex'

export default {
  components: {
    Loading,
    PushSettings,
    ExportData,
    ReorderAnimals,
  },

  data() {
    return {
      userLoaded: false,
      animalsLoaded: false,
      animalsList: [],
      userConfig: {},
    }
  },

  watch: {
    uuid: {
      immediate: true,
      handler() {
        if(this.uuid) {
          this.$bind(
            'userConfig',
            this.$firebase
              .firestore()
              .collection('users')
              .doc(this.uuid)
          ).then(() => {
            this.userLoaded = true
          })

          this.$bind(
            'animalsList',
            this.$firebase
              .firestore()
              .collection('users')
              .doc(this.uuid)
              .collection('animals')
          ).then(() => {
            this.animalsLoaded = true
          })
        }
      },
    },
  },

  computed: {
    ...mapGetters([
      'uuid',
    ]),

    loading() {
      return !(this.animalsLoaded && this.userLoaded)
    },
  },
}
</script>

<template>
  <div class="container-wrapper">
    <loading v-if="loading" type="card-heading, image, actions" />
    <template v-else>
      <push-settings :user-config="userConfig" />

      <reorder-animals :animals-list="animalsList" />

      <export-data :animals-list="animalsList" />
    </template>
  </div>
</template>
