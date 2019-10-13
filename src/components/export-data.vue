<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    animalsList: {
      type: Array,
      default() {
        return []
      },
    },
  },

  data() {
    return {
      processing: false,
      animalsForSelection: [],
      processedAnimal: 0,
      downloadUrl: null,
    }
  },

  watch: {
    animalsList: {
      immediate: true,
      handler() {
        this.animalsForSelection = this.animalsList.map((animal) => {
          return {
            id: animal.id,
            name: animal.name,
            included: true,
          }
        })
      },
    },
  },

  computed: {
    ...mapGetters([
      'uuid',
    ]),

    selectedAnimals() {
      return this.animalsForSelection.filter(animal => animal.included)
    },

    selectedCount() {
      return this.selectedAnimals.length
    },

    percentageComplete() {
      return (this.processedAnimal / this.selectedCount) * 100
    },
  },

  methods: {
    toggleAll(value) {
      this.animalsForSelection.forEach((animal) => {
        animal.included = value
      })
    },

    exportData() {
      let json = []
      this.processing = true
      this.processedAnimal = 0

      this.selectedAnimals.forEach((animal) => {
        let animalInfo = this.animalsList.find((checkAnimal) => checkAnimal.id === animal.id) || {}
        let animalData = {
          ...animalInfo,
          arrival: animalInfo.arrival.toDate().toISOString(),
          birthdate: animalInfo.birthdate.toDate().toISOString(),
        }

        json.push(animalData)
        this.processedAnimal++
      })

      this.exportDone(json)
    },

    exportDone(json) {
      let jsonData = JSON.stringify(json)
      let file = new Blob([jsonData], { type: 'application/json' })

      if(this.downloadUrl !== null) {
        window.URL.revokeObjectURL(this.downloadUrl)
      }

      this.downloadUrl = window.URL.createObjectURL(file)
      this.processing = false
    },
  },
}
</script>

<template>
  <v-card class="container-card mt-5">
    <v-card-title>
      Export data

      <div class="flex-grow-1"></div>

      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            color="#b6b6b6"
            v-on="on"
            @click="toggleAll(false)"
          >
            <v-icon>mdi-checkbox-multiple-blank-outline</v-icon>
          </v-btn>
        </template>
        <span>Unselect all</span>
      </v-tooltip>

      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            color="#b6b6b6"
            v-on="on"
            @click="toggleAll(true)"
          >
            <v-icon>mdi-check-box-multiple-outline</v-icon>
          </v-btn>
        </template>
        <span>Select all</span>
      </v-tooltip>
    </v-card-title>

    <v-card-text v-if="!animalsList.length" class="d-flex justify-center pb-9">
      No animal found
    </v-card-text>
    <v-card-text class="animal-export-wrapper">
      <ul class="animal-export">
        <v-overlay
          class="animal-export_overlay"
          absolute
          :value="processing"
        >
          <v-progress-linear
            :value="percentageComplete"
            height="25"
          >
            Processing... {{ processedAnimal }}/{{ selectedCount }} completed
          </v-progress-linear>

          <v-progress-circular
            indeterminate
            size="64"
          />
        </v-overlay>

        <li
          v-for="animal in animalsForSelection"
          :key="animal.id"
        >
          <v-checkbox
            v-model="animal.included"
            :label="animal.name"
            hide-details
          />
        </li>
      </ul>

      <div class="form-actions">
        <v-btn
          color="info"
          :disabled="!downloadUrl || processing"
          :href="downloadUrl"
          download='herps-tracker.json'
        >
          <v-icon left>mdi-download</v-icon>
          Download
        </v-btn>

        <div class="flex-grow-1" />

        <v-btn
          color="primary"
          type="submit"
          :disabled="processing"
          :loading="processing"
          @click="exportData"
        >
          Export
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>
