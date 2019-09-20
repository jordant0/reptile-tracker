<script>
  import DateTimeInput from '@/components/date-time-input'

  export default {
    components: {
      DateTimeInput,
    },

    props: {
      animal: {
        type: Object,
        default() {
          return {};
        },
      }
    },

    data() {
      return {
        name: this.animal.name,
        species: this.animal.species,
        feedingDuration: this.animal.feedingDuration,
        birthdate: this.animal.birthdate ? this.animal.birthdate.toDate() : new Date(),
        arrivalDate: this.animal.arrivalDate ? this.animal.arrivalDate.toDate() : new Date(),
      }
    },
  };
</script>

<template>
  <v-form class="animal-form">
    <v-text-field
      v-model="name"
      label="Name"
      hint="Name of the animal"
      required
    />

    <v-text-field
      v-model="species"
      label="Species"
      hint="The animal's species"
      required
    />

    <v-text-field
      v-model="feedingDuration"
      type="number"
      min="1"
      label="Feeding Duration"
      hint="How often the animal should be fed"
    />

    <date-time-input
      v-model="birthdate"
      label="Birthdate"
      hint="Date the animal was born/hatched"
    />

    <date-time-input
      v-model="arrivalDate"
      label="Arrival Date"
      hint="Date the animal was obtained"
    />

    <div class="form-actions">
      <v-btn
        text
        color="#999999"
      >
        Cancel
      </v-btn>


      <div class="flex-grow-1" />

      <v-btn
        color="primary"
      >
        Submit
      </v-btn>
    </div>
  </v-form>
</template>

<style scoped>
  .animal-form {
    max-width: 800px;
    margin: auto;
  }

  .form-actions {
    display: flex;
    margin-top: 24px;
  }
</style>
