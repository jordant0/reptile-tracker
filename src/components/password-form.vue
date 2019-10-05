<script>
export default {
  props: {
    email: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
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
  },

  methods: {
    submit() {
      this.submitting = true
      if(this.$refs.form.validate()) {
        this.$firebase.auth()
          .sendPasswordResetEmail(this.email)
          .then(() => {
            this.$store.commit('showNotification', {
              color: 'success',
              text: `A password email has been sent to ${this.email}. Check your inbox.`,
            })
            this.submitting = false
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
      <span class="headline">Reset Password</span>
    </v-card-title>

    <div class="sub-headline">
      Enter the email associated with the account to receive a password reset email
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
      </v-card-text>

      <v-card-actions>
        <div class="prompt">
          <a
            href="#"
            @click="$emit('switch', 'login')"
          >
            Back to Login
          </a>
        </div>

        <div class="flex-grow-1"></div>

        <v-btn
          :disabled="submitting"
          :loading="submitting"
          type="submit"
          color="primary"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
