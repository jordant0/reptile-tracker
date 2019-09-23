<script>
import LoginForm from '@/components/login-form'
import SignupFrom from '@/components/signup-form'
import PasswordForm from '@/components/password-form'

export default {
  components: {
    login: LoginForm,
    signup: SignupFrom,
    password: PasswordForm,
  },

  props: {
    login: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      form: this.login ? 'login' : 'signup',
      email: '',
      password: '',
      submitting: false,
    }
  },

  methods: {
    submit() {
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

  computed: {
    header() {
      return this.isLogin ? 'Login' : 'Sign-up'
    },

    subtitle() {
      if(this.isLogin) {
        return 'Login to access your animals and manage their activities'
      } else {
        return 'Sign-up to store information about your animals and manage their activities'
      }
    },
  }
}
</script>

<template>
  <div class="container-wrapper">
    <v-fade-transition mode="out-in">
      <keep-alive>
        <component
          :is="form"
          :email.sync="email"
          :password.sync="password"
          @switch="form = $event"
        />
      </keep-alive>
    </v-fade-transition>
  </div>
</template>
