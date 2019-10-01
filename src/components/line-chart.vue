<script>
import { Line, mixins } from 'vue-chartjs'
import { mapState } from 'vuex'

export default {
  extends: Line,

  mixins: [mixins.reactiveProp],

  props: {
    chartData: {
      type: Object,
      default() {
        return {}
      },
    },

    chartOptions: {
      type: Object,
      default() {
        return {}
      },
    },
  },

  watch: {
    darkTheme() {
      this.$data._chart.options = this.options
      this.$data._chart.update()
    },
  },

  mounted() {
    this.renderChart(this.chartData, this.options)
  },

  computed: {
    ...mapState([
      'darkTheme',
    ]),

    options() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        tooltips: {
          callbacks: {
            title(tooltipItem) {
              return `${tooltipItem[0].label} - ${tooltipItem[0].value}g`
            },
            label() {
              return null
            },
          },
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 12,
            bottom: 40,
          },
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              displayFormats: {
                day: 'M/D/YY',
                month: 'MMM \'YY',
              },
            },
            gridLines: {
              display: false,
              color: this.darkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)',
            },
            ticks: {
              fontColor: this.darkTheme ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 0.9)',
            },
          }],
          yAxes: [{
            gridLines: {
              borderDash: [3, 3],
              color: this.darkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)',
            },
            ticks: {
              fontColor: this.darkTheme ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 0.9)',
            },
          }],
        },
        ...this.chartOptions,
      }
    },
  },
}
</script>
