<script>
import Loading from '@/components/loading'
import Empty from '@/components/empty'
import LineChart from '@/components/line-chart'
import { mapGetters } from 'vuex'

export default {
  components: {
    Loading,
    Empty,
    LineChart,
  },

  data() {
    return {
      loading: true,
      animalId: this.$route.params.animal_id,
      eventsList: [],
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
      'animalData',
    ]),

    animal() {
      return this.animalData(this.animalId)
    },

    bindingProps() {
      return [
        this.animalId,
        this.uuid,
      ]
    },

    animalName() {
      if(this.animal) {
        return this.animal.name
      } else {
        return ''
      }
    },

    chartData() {
      let dataSet = []

      this.eventsList.forEach((weightEvent) => {
        dataSet.push({
          x: weightEvent.timestamp.toDate(),
          y: weightEvent.value,
        })
      })

      return {
        datasets: [{
          label: 'Weight',
          borderColor: '#ff8a36',
          lineTension: 0,
          fill: false,
          data: dataSet.reverse(),
        }],
      }
    },
  },

  methods: {
    setupBinging() {
      if(!this.bindingSetup && this.uuid && this.animalId) {
        this.bindingSetup = true

        let collection = this.$firebase
          .firestore()
          .collection('users')
          .doc(this.uuid)
          .collection('animals')
          .doc(this.animalId)
          .collection('events')
          .where('type', '==', 'Weight')
          .orderBy('timestamp', 'desc')
          .limit(100)

        this.$bind(
          'eventsList',
          collection,
        ).then(() => {
          this.loading = false
        })
      }
    },
  },
}
</script>

<template>
  <div class="event-listing container-wrapper">
    <loading v-if="loading" />
    <template v-else>
      <empty v-if="!eventsList.length" noun="weight event" />
      <v-card v-else class="container-card">
        <v-card-title>
          Weight History for {{ animalName }}
        </v-card-title>

        <v-card-text class="chart-container">
          <line-chart
            :chart-data="chartData"
            :styles="{ position: 'relative', height: '500px' }"
          />
        </v-card-text>
      </v-card>
    </template>
  </div>
</template>

<style scoped>
.v-card-title {
  padding: 20px;
  font-size: 18px;
  display: flex;
  justify-content: center;
}

.chart-container {
  height: 500px;
}
</style>
