<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

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
      downloadFileName: 'herps-tracker.json',
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
            archive: animal.archive,
            included: !animal.archive,
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
          events: [],
        }

        this.$firebase
          .firestore()
          .collection('users')
          .doc(this.uuid)
          .collection('animals')
          .doc(animal.id)
          .collection('events')
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              animalData.events.push({
                ...doc.data(),
                timestamp: doc.data().timestamp.toDate().toISOString(),
              })
            })
          })
          .finally(() => {
            this.processedAnimal++

            json.push(animalData)

            if(this.processedAnimal >= this.selectedCount) {
              this.exportDone(json)
            }
          })
      })
    },

    exportDone(json) {
      let jsonData = JSON.stringify(json)
      let file = new Blob([jsonData], { type: 'application/json' })

      if(this.downloadUrl !== null) {
        window.URL.revokeObjectURL(this.downloadUrl)
      }

      this.downloadUrl = window.URL.createObjectURL(file)
      this.downloadFileName = `herps-tracker-${moment().format('YYYYMMDDkkmmss')}.json`
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
            hide-details
          >
            <template v-slot:label>
              <span :class="{ 'animal-label--archived': animal.archive}">
                {{ animal.name }}
                <v-icon
                  v-if="animal.archive"
                  color="#b6b6b6"
                  small
                >
                  mdi-archive
                </v-icon>
              </span>
            </template>
          </v-checkbox>
        </li>
      </ul>

      <div class="form-actions">
        <v-btn
          color="info"
          :disabled="!downloadUrl || processing"
          :href="downloadUrl"
          :download="downloadFileName"
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

<style scoped>
.animal-label--archived {
  font-style: italic;
}

.animal-label--archived .v-icon {
  vertical-align: top;
  margin-left: 4px;
}
</style>
