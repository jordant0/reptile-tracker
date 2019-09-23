<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      submitting: false,
    }
  },

  methods: {
    login() {
      this.submitting = true;
      this.$firebase.auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.submitting = false;
          this.$router.push({ name: 'animals' })
        })
        .catch(function(error) {
          console.log(`Log in failed: ${error}`)
          this.submitting = false;
        })
    },
  },
}
</script>

<template>
  <div class="container-wrapper">
    <v-card class="container-card login-card" max-width="400px">
      <v-card-title>
        <span class="headline">Login</span>
      </v-card-title>

      <div class="sub-headline">
        Login to access your animals and manage their activities
      </div>

      <v-form @submit.prevent="login">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="email"
                  label="Email"
                  required
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  required
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <div class="prompt">
            Don't have an account? <a href="#">Sign-up here!</a>
          </div>

          <div class="flex-grow-1"></div>

          <v-btn
            :disabled="submitting"
            :loading="submitting"
            type="submit"
            color="primary"
          >
            Login
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<style scoped>
  .login-card {
    margin: auto;
  }

  .sub-headline {
    padding: 0 20px;
    color: #999999;
    font-size: 14px;
    text-align: center;
  }

  .v-card__actions, .v-card__title {
    padding: 20px;
  }

  .prompt {
    font-size: 14px;
    font-style: italic;
  }
</style>
