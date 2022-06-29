/* eslint-disable */

<template>
  <v-card
      class="mx-auto my-12"
      max-width="374"
  >
    <template slot="progress">
      <v-progress-linear
          color="deep-purple"
          height="10"
          indeterminate
      ></v-progress-linear>
    </template>

    <v-img
        height="250"
        style="margin: 5px"
        src="/img/logo.jpg"
    ></v-img>

    <v-card-title>Login</v-card-title>

    <v-card-text>

      <v-row>
        <v-col
            cols="12"
        >
          <v-text-field
              v-model="email"
              label="Email"
              required
          ></v-text-field>
        </v-col>

        <v-col
            cols="12"
        >
          <v-text-field
            v-model="password"
            :append-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
            :type="visible ? 'text' : 'password'"
            label="Contraseña"
            counter
            @click:append="visible = !visible"
            v-on:keyup.enter="logIn"
          ></v-text-field>

          <span style="color: red" v-if="error">{{ error }}</span>
        </v-col>
      </v-row>


          <div align="center">
            <p class="message">¿No registrado? <router-link class="link" to="/register">Crear cuenta</router-link></p>
            <p class="message"><router-link class="link" to="/forgotPass">He olvidado mi clave</router-link></p>
          </div>



    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
          color="deep-purple lighten-2"
          text
          @click="irADemo()"
      >
        Demo
      </v-btn>

      <v-btn
          color="deep-purple lighten-2"
          text
          @click="logIn()"
      >
        <span v-if="fetchingUser">Iniciando sesion...</span><span v-else>Iniciar sesión</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>



<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  data () {
    return {
      email: '',
      password: '',
      visible: false
    }
  },
  computed: {
    ...mapState([
      'fetchingUser',
      'error'
    ]),
    ...mapGetters([
      'getUser'
    ]),
    user () {
      return this.getUser
    }
  },
  methods: {
    ...mapActions([
      'loginUser',
      'getCurrentUser'
    ]),
    logIn () {
      if (this.email !== '' || this.password !== '') {
        this.loginUser({ email: this.email, password: this.password })
        .then(()=>{
          console.log("OK")
          this.$router.push({name: 'dashboard'})
        })
        .catch(console.log)
      }
    },
    irADemo () {
      this.$router.push({name: 'demo'})
    }
  }
}
</script>
