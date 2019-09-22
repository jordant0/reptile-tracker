<script>
import AnimalForm from '@/components/animal-form'

export default {
  components: {
    AnimalForm
  }
}
</script>

<template>
  <v-card class="container-card">
    <v-card-title>Add New Animal</v-card-title>
    <v-card-text>
      <animal-form />
    </v-card-text>
  </v-card>
</template>
