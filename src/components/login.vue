<script>
export default {
  props: {
    shown: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      email: '',
      password: '',
    }
  },

  methods: {
    login() {
      this.$firebase.auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .catch(function(error) {
          console.log(`Log in failed: ${error}`)
        })
    },
  },
}
</script>

<template>
  <v-overlay
    :value="shown"
    :dark="false"
    :z-index="6"
  >
    <v-card max-width="400px">
      <v-card-title>
        <span class="headline">Login</span>
      </v-card-title>
      <v-form @submit.prevent="login">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="email"
                  label="Email*"
                  required
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="password"
                  label="Password*"
                  type="password"
                  required
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn type="submit" color="primary">Login</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-overlay>
</template>

<style scoped>
  .v-card__actions, .v-card__title {
    padding: 20px;
  }
</style>
