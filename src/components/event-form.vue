<script>
import DateTimeInput from '@/components/date-time-input'
import { mapGetters } from 'vuex'
import eventTypeData from '@/data/event-type'
import updateLastFed from '@/mixins/update-last-fed'

export default {
  mixins: [
    updateLastFed,
  ],

  components: {
    DateTimeInput,
  },

  props: {
    animalId: {
      type: String,
      default: null,
    },

    eventType: {
      type: String,
      default: 'Other',
    },

    currentEvent: {
      type: Object,
      default() {
        return {}
      },
    },
  },

  data() {
    return {
      submitting: false,
      previousType: this.currentEvent.type,
      eventData: {
        type: this.currentEvent.type || this.eventType,
        timestamp: this.currentEvent.timestamp ? this.currentEvent.timestamp.toDate() : new Date(),
        value: this.currentEvent.value || '',
        notes: this.currentEvent.notes || '',
      },
    }
  },

  created() {
    this.filters = eventTypeData.order
    this.typesConfig = eventTypeData.config
  },

  computed: {
    ...mapGetters([
      'uuid',
      'animalData',
    ]),

    animal() {
      return this.animalData(this.animalId)
    },

    animalName() {
      if(this.animal) {
        return `for ${this.animal.name}`
      } else {
        return ''
      }
    },

    existingEvent() {
      return this.currentEvent && this.currentEvent.id
    },

    formHeader() {
      return `${this.existingEvent ? 'Edit' : 'Add'}`
    },

    valueField() {
      switch(this.eventData.type) {
        case 'Handling':
          return {
            label: 'Duration',
            hint: 'Duration of handling session (in minutes)',
          }
        case 'Weight':
          return {
            label: 'Weight',
            hint: 'Weight of the animal (in grams)',
          }
        default:
          return null
      }
    },
  },

  methods: {
    submit() {
      this.submitting = true
      if(this.$refs.form.validate() && this.uuid && this.animalId) {
        let collection = this.$firebase
          .firestore()
          .collection('users')
          .doc(this.uuid)
          .collection('animals')
          .doc(this.animalId)
          .collection('events')

        let action = this.existingEvent
          ? collection.doc(this.currentEvent.id).update(this.eventData)
          : collection.add(this.eventData)

        action.then(() => this.afterSubmit())
      } else {
        this.submitting = false
      }
    },

    afterSubmit() {
      if(this.previousType === 'Feeding' || this.eventData.type === 'Feeding') {
        this.feedingEventAfterSubmit()
      } else {
        this.submitDone()
      }
    },

    feedingEventAfterSubmit() {
      this.getLastFed(this.animalId)
        .get()
        .then((querySnapshot) => {
          let updateParams = {}
          if(querySnapshot.empty) {
            updateParams.lastFed = 'none'
          } else {
            updateParams.lastFed = querySnapshot.docs[0].data().timestamp
          }

          if(!this.existingEvent) {
            updateParams.feedingOverride = null
          }

          this.$firebase
            .firestore()
            .collection('users')
            .doc(this.uuid)
            .collection('animals')
            .doc(this.animalId)
            .update(updateParams)
            .then(() => this.submitDone())
        })
    },

    submitDone() {
      this.submitting = false
      this.$router.back()
    },
  },
}
</script>

<template>
  <v-card class="container-card">
    <v-card-title class="event-form_header">
      {{ formHeader }}

      <v-menu
        offset-y
        transition="slide-y-transition"
        bottom
      >
        <template v-slot:activator="{ on }">
          <v-btn
            class="update-type-bttn"
            v-on="on"
            text
          >
            <v-icon
              :color="typesConfig[eventData.type].color"
              size="20px"
            >
              {{ typesConfig[eventData.type].icon }}
            </v-icon>
            {{ eventData.type }}
          </v-btn>
        </template>
        <v-list class="filters-list">
          <v-list-item
            v-for="filter in filters"
            :key="filter"
            :class="{ active: filter === eventData.type }"
            @click="eventData.type = filter"
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
        </v-list>
      </v-menu>

      Event

      <div class="animal-name">
        {{ animalName }}
      </div>
    </v-card-title>

    <v-card-text>
      <v-form
        class="event-form general-form"
        ref="form"
        @submit.prevent="submit"
      >
        <date-time-input
          v-model="eventData.timestamp"
          label="Date &amp; Time"
          hint="Date and time of the event"
        />

        <v-text-field
          v-if="valueField"
          v-model="eventData.value"
          :label="valueField.label"
          :hint="valueField.hint"
          :rules="[
            v => !!v || `${valueField.label} is required`,
          ]"
          required
        />

        <v-text-field
          v-model="eventData.notes"
          label="Notes"
          hint="Other details about the event"
        />

        <div class="form-actions">
          <v-btn
            text
            color="#b6b6b6"
            @click="$router.back()"
          >
            Cancel
          </v-btn>

          <div class="flex-grow-1" />

          <v-btn
            color="primary"
            :disabled="submitting"
            :loading="submitting"
            @click="submit"
          >
            Submit
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.update-type-bttn.v-size--default {
  margin: 0 12px;
  padding: 0 8px;
  text-transform: capitalize;
  font-size: 20px;
  font-weight: 400;
  letter-spacing: normal;
  line-height: 2rem;
  border-bottom: 1px solid #b6b6b6;
  border-radius: 0;
}

.update-type-bttn.v-size--default:hover {
  border-bottom: 1px solid #333333;
}

.v-application.theme--dark .update-type-bttn.v-size--default:hover {
  border-bottom: 1px solid #ffffff;
}

.update-type-bttn .v-icon {
  margin-right: 12px;
}

.animal-name {
  margin-left: 8px;
  font-size: 1.5rem;
  line-height: 42px;
}
</style>
