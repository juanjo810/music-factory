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
      this.email = ''
      this.visibility = true
    },
    continuar () {
      this.visibility = false
      this.$router.push({name: 'login'})
    }
  }
}
</script>

<style scoped>
  .forgot-page {
    width: 25%;
    padding: 8% 0 0;
    margin: auto;
  }
  .form {
    z-index: 1;
    background: #FFFFFF;
    padding: 10%;
    text-align: center;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
  }
  .form input {
    font-family: "Roboto", sans-serif;
    outline: 0;
    background: #f2f2f2;
    width: 100%;
    border: 0;
    margin: 0 0 15px;
    padding: 15px;
    box-sizing: border-box;
    font-size: 14px;
  }
  .form button {
    font-family: "Roboto", sans-serif;
    text-transform: uppercase;
    outline: 0;
    background: #28d;
    width: 100%;
    border: 0;
    padding: 15px;
    color: #FFFFFF;
    font-size: 14px;
    -webkit-transition: all 0.3 ease;
    transition: all 0.3 ease;
    cursor: pointer;
  }
  .form button:hover,.form button:active,.form button:focus {
    background: #17c;
  }
  .form .message {
    margin: 15px 0 0;
    color: #b3b3b3;
    font-size: 12px;
  }
  .form .message .link{
    color: #17c;
    text-decoration: none;
  }
  .cuadroModal{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #456;
    opacity: 1;
  }
  .restablecido{
    margin-top: 10%;
    margin-left:25%;
    margin-right:25%;
    background: #FFFFFF;
    padding:5%;
    text-align: center;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
  }
  .btn {
    font-family: "Roboto", sans-serif;
    text-transform: uppercase;
    outline: 0;
    background: #28d;
    border: 0;
    padding: 15px;
    width: 40%;
    margin-top: 2%;
    color: #FFFFFF;
    font-size: 14px;
    -webkit-transition: all 0.3 ease;
    transition: all 0.3 ease;
    cursor: pointer;
  }
  .btn:hover,.btn:active,.btn:focus {
    background: #17c;
  }
</style>
