<script>
export default {
  props: {
    email: {
      type: String,
      default: '',
    },

    password: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      submitting: false,
      showPassword: false,
      repeatPassword: '',
    }
  },

  computed: {
    userEmail: {
      get() {
        return this.email
      },

      set(value) {
        this.$emit('update:email', value)
      },
    },

    userPassword: {
      get() {
        return this.password
      },

      set(value) {
        this.$emit('update:password', value)
      },
    },
  },

  methods: {
    submit() {
      this.submitting = true
      if(this.$refs.form.validate()) {
        this.$firebase.auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(() => {
            this.submitting = false
            this.$router.push({ name: 'animals' })
          })
          .catch((error) => {
            this.$store.commit('showNotification', {
              color: 'error',
              text: error.message,
            })
            this.submitting = false
          })
      } else {
        this.submitting = false
      }
    },
  },
}
</script>

<template>
  <v-card class="container-card login-card" max-width="400px">
    <v-card-title>
      <span class="headline">Sign-up</span>
    </v-card-title>

    <div class="sub-headline">
      Sign-up to store information about your animals and manage their activities
    </div>

    <v-form
      ref="form"
      @submit.prevent="submit"
    >
      <v-card-text>
        <v-text-field
          v-model="userEmail"
          label="Email"
          :rules="[
            v => !!v || 'Email is required',
            v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
          ]"
          required
        />

        <v-text-field
          v-model="userPassword"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[
            v => !!v || 'Password is required',
            v => (v && v.length >= 8) || 'Password must be at least 8 characters',
          ]"
          counter
          required
          @click:append="showPassword = !showPassword"
        />

        <v-text-field
          v-model="repeatPassword"
          label="Retype Password"
          type="password"
          :rules="[
            v => (v === userPassword) || 'Passwords do not match',
          ]"
          counter
          required
          @click:append="showPassword = !showPassword"
        />
      </v-card-text>

      <v-card-actions>
        <div class="prompt">
          Already have an account?
          <a
            href="#"
            @click="$emit('switch', 'login')"
          >
            Login!
          </a>
        </div>

        <div class="flex-grow-1"></div>

        <v-btn
          :disabled="submitting"
          :loading="submitting"
          type="submit"
          color="primary"
        >
          Register
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
