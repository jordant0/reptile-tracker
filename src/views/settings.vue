<script>
import Loading from '@/components/loading'
import PushSettings from '@/components/push-settings'
import ReorderAnimals from '@/components/reorder-animals'
import ExportData from '@/components/export-data'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    Loading,
    PushSettings,
    ExportData,
    ReorderAnimals,
  },

  computed: {
    ...mapState([
      'animalListLoaded',
      'userConfigLoaded',
    ]),

    ...mapGetters([
      'uuid',
    ]),

    loading() {
      return !(this.animalListLoaded && this.userConfigLoaded)
    },
  },
}
</script>

<template>
  <div class="container-wrapper">
    <loading v-if="loading" type="card-heading, image, actions" />
    <template v-else>
      <push-settings />

      <reorder-animals />

      <export-data />
    </template>
  </div>
</template>
