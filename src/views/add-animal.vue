<script>
  import AnimalForm from '@/components/animal-form'

  export default {
    components: {
      AnimalForm,
    },
  };
</script>

<template>
  <v-card class="container-card">
    <v-card-title>Add New Animal</v-card-title>
    <v-card-text>
      <animal-form />
    </v-card-text>
  </v-card>
</template>

<style>
  .container-card {
    width: 100%;
  }

  .container-card .v-card__title {
    padding: 24px 24px 32px 24px;
  }

  .container-card .v-card__text {
    padding: 0 24px 24px 24px;
  }
</style>
