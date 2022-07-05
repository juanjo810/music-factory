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

      <v-card-title>Restablecer contraseña</v-card-title>

      <v-card-text>

        <v-row>
          <v-col
              cols="12"
          >
            <v-text-field
                v-model="email"
                label="Email de recuperación"
                required
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
            @click="restablecerPass()"
        >
          Restablecer Contraseña
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
          Email enviado
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col
                cols="12"
            >
            <b>El email ha sido enviado correctamente.</b><br>
             Por favor, <b>restablezca la contraseña</b> haciendo click en el link que hemos enviado a su correo electrónico
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
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      email: '',
      visibility: false
    }
  },
  methods: {
    ...mapActions([
      'resetPassword'
    ]),
    restablecerPass () {
      this.resetPassword(this.email)
        .then(() => {
          this.email = ''
          this.visibility = true
        })
    },
    continuar () {
      this.visibility = false
      this.$router.push({name: 'login'})
    }
  }
}
</script>
