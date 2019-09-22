<script>
export default {
  props: {
    noun: {
      type: String,
      default: 'item'
    }
  }
}
</script>

<template>
  <v-card class="container-card special-card empty-card">
    <v-card-title>No {{ noun }} found</v-card-title>
  </v-card>
</template>
