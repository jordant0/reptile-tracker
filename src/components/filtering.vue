<script>
import eventTypeData from '@/data/event-type'

export default {
  props: {
    animalId: {
      type: String,
      required: true,
    },

    currentFilter: {
      type: String,
      default: null,
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },

  created() {
    this.filters = eventTypeData.order
    this.typesConfig = eventTypeData.config
  },

  methods: {
    filterBy(filter) {
      this.$router.push({
        name: 'event-listing',
        params: { animal_id: this.animalId },
      })
    },
  },

  computed: {
    filterText() {
      return this.currentFilter || 'None'
    },
  },
}
</script>

<template>
  <v-menu
    offset-y
    transition="slide-y-transition"
    bottom
  >
    <template v-slot:activator="{ on }">
      <v-btn
        class="filter-bttn"
        :disabled="loading"
        text
        color="#ca9efc"
        v-on="on"
      >
        FILTER: {{ filterText }}
        <v-icon right>mdi-filter</v-icon>
      </v-btn>
    </template>
    <v-list class="filters-list">
      <v-list-item
        v-for="filter in filters"
        :key="filter"
        :class="{ active: filter === currentFilter }"
        @click="$emit('update:current-filter', filter)"
      >
        <v-list-item-icon>
          <v-icon
            :color="typesConfig[filter].color"
            size="20px"
          >
            {{ typesConfig[filter].icon }}
          </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            {{ filter }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        class="clear-filter"
        @click="$emit('update:current-filter', null)"
      >
        <v-list-item-title>
          Clear Fitler
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style scoped>
  .filter-bttn {
    text-transform: none;
  }

  .filters-list {
    padding: 0
  }

  .v-list-item {
    display: flex;
    align-items: center;
  }

  .filters-list .v-list-item__icon {
    margin: 0 12px 0 0 !important;
    align-self: center;
  }

  .v-list-item__content {
    padding: 0;
  }

  .clear-filter .v-list-item__title {
    text-align: center;
    color: #b6b6b6;
    font-style: italic;
  }
</style>
