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
