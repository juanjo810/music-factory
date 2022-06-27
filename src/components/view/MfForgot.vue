/* eslint-disable */
<template>
  <div class="forgot-page">
    <div class="form">
      <input type="email" placeholder="Email de recuperacion" v-model="email"/>
      <button id="button_confirmar" @click="sendEmail()">Confirmar</button>
    </div>
    <div class="cuadroModal" v-if="visibility">
      <div class="restablecido">
        <h2>Email enviado</h2>
        <label>
          <b>El email ha sido registrado correctamente.</b><br> Por favor, <b>restablezca la contraseña</b> haciendo click en el link que hemos enviado a su correo electrónico
        </label>
        <button class="btn" @click="continuar()">Continuar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      email: '',
      visibility: true
    }
  },
  methods: {
    ...mapActions([
      'resetPassword'
    ]),
    sendEmail () {
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
