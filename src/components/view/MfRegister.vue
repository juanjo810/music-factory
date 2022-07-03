/* eslint-disable */
/* eslint-disable */

<template>
  <div>
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

      <v-card-title>Registro</v-card-title>

      <v-card-text>

        <v-row>
          <v-col
              cols="12"
          >
            <v-text-field
                v-model="name"
                label="Nombre"
                required
            ></v-text-field>
          </v-col>

          <v-col
              cols="12"
          >
            <v-text-field
                v-model="surname"
                label="Apellidos"
                required
            ></v-text-field>
          </v-col>

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
            <v-file-input
                v-model="profilePhoto"
                label="Foto de perfil"
                required
            ></v-file-input>
          </v-col>

          <v-col
              cols="12"
          >
            <v-text-field
              v-model="password"
              :append-icon="visible1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="visible1 ? 'text' : 'password'"
              label="Contraseña"
              counter
              @click:append="visible1 = !visible1"
            ></v-text-field>
          </v-col>
          <v-col
              cols="12"
          >
            <v-text-field
                v-model="password2"
              :append-icon="visible2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="visible2 ? 'text' : 'password'"
              label="Repetir contraseña"
              counter
              @click:append="visible2 = !visible2"
            ></v-text-field>

            <span style="color: red" v-if="error">{{ error }}</span>
          </v-col>
        </v-row>



      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="deep-purple lighten-2"
            text
            @click="register()"
        >
          Registrarse
          <!--<span v-if="fetchingUser">Registrando...</span><span v-else>Iniciar sesión</span>-->
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog
        v-model="this.visibility"
        persistent
        max-width="600"
    >
      <v-card>
        <v-card-title class="text-h5">
          Registro completado
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col
                cols="12"
            >
            <b>Ha sido registrado correctamente.</b><br>
            Por favor, <b>verifique su cuenta</b> haciendo click en el link que hemos enviado a su correo electrónico
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="green darken-1"
              text
              @click="continuar()"
          >
            Continuar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
      name: '',
      surname: '',
      email: '',
      profilePhoto: '',
      password: '',
      password2: '',
      visible1: false,
      visible2: false,
      visibility: false
    }
  },
  computed: {
    ...mapState([
      'fetchingUser',
      'error'
    ])
  },
  methods: {
    ...mapActions([
      'registerUser'
    ]),
    async register () {
      await this.registerUser({ email: this.email, password: this.password, name: this.name, surname: this.surname, password2: this.password2, profilePhoto: this.profilePhoto })
      if (this.error === '') {
        this.name = ''
        this.surname = ''
        this.email = ''
        this.profilePhoto = ''
        this.password = ''
        this.password2 = ''
        this.visibility = true
      }
    },
    continuar () {
      this.visibility = false
      this.$router.push({name: 'login'})
    }
  }
}
</script>
