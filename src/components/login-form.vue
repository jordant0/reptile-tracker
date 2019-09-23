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
      showPassword: false,
      submitting: false,
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
          .signInWithEmailAndPassword(this.email, this.password)
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
      <span class="headline">Login</span>
    </v-card-title>

    <div class="sub-headline">
      Login to access your animals and manage their activities
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
          ]"
          required
          @click:append="showPassword = !showPassword"
        />
      </v-card-text>

      <v-card-actions>
        <div class="prompt">
          Don't have an account?
          <a
            href="#"
            @click.prevent="$emit('switch', 'signup')"
          >
            Sign-up here!
          </a>
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
</template>
