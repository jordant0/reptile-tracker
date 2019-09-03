<script>
  export default {
    props: {
      shown: {
        type: Boolean,
        default: false,
      }
    },
  }
</script>

<template>
  <v-overlay :dark="false" :z-index="6">
    <v-card max-width="400px">
      <v-card-title>
        <span class="headline">Login</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field label="Email*" required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field label="Password*" type="password" required></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn color="primary">Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>
