<script>
import DateTimeInput from '@/components/date-time-input'
import { mapGetters } from 'vuex'

export default {
  components: {
    DateTimeInput,
  },

  props: {
    animal: {
      type: Object,
      default() {
        return {}
      },
    },
  },

  data() {
    return {
      submitting: false,
      animalData: {
        name: this.animal.name || '',
        species: this.animal.species || '',
        feedingDuration: this.animal.feedingDuration || null,
        birthdate: this.animal.birthdate ? this.animal.birthdate.toDate() : new Date(),
        arrival: this.animal.arrival ? this.animal.arrival.toDate() : new Date(),
      },
    }
  },

  computed: {
    ...mapGetters([
      'uuid',
    ]),
  },

  methods: {
    submit() {
      this.submitting = true
      if(this.$refs.form.validate() && this.uuid) {
        this.$firebase
          .firestore()
          .collection('users')
          .doc(this.uuid)
          .collection('animals')
          .add(this.animalData)
          .then(() => {
            this.submitting = false
            this.$router.back()
          })
      } else {
        this.submitting = false
      }
    },
  },
}
</script>

<template>
  <v-form
    class="animal-form general-form"
    ref="form"
    @sbmit.prevent="submit"
  >
    <v-text-field
      v-model="animalData.name"
      label="Name"
      hint="Name of the animal"
      :rules="[
        v => !!v || 'Name is required',
        v => (v && v.length <= 30) || 'Name must be less than 30 characters',
      ]"
      counter="30"
      required
    />

    <v-text-field
      v-model="animalData.species"
      label="Species"
      hint="The animal's species"
      :rules="[
        v => !!v || 'Species is required',
        v => (v && v.length <= 50) || 'Name must be less than 50 characters',
      ]"
      counter="50"
      required
    />

    <v-text-field
      v-model="animalData.feedingDuration"
      type="number"
      min="1"
      label="Feeding Duration"
      hint="How often the animal should be fed (optional)"
      :rules="[
        v => (!v || v >= 1) || 'Feeding duration must be at least 1'
      ]"
    />

    <date-time-input
      v-model="animalData.birthdate"
      exclude-time
      label="Birthdate"
      hint="Date the animal was born/hatched"
    />

    <date-time-input
      v-model="animalData.arrival"
      exclude-time
      label="Arrival Date"
      hint="Date the animal was obtained"
    />

    <div class="form-actions">
      <v-btn
        text
        color="#999999"
        @click.prevent="$router.back()"
      >
        Cancel
      </v-btn>

      <div class="flex-grow-1" />

      <v-btn
        color="primary"
        type="submit"
        :disabled="submitting"
        :loading="submitting"
        @click.prevent="submit"
      >
        Submit
      </v-btn>
    </div>
  </v-form>
</template>
