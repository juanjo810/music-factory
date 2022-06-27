/* eslint-disable */
<template>
  <div class="register-page">
    <div class="form">
      <h1>Registro</h1>
      <input type="text" placeholder="Nombre" v-model="name"/>
      <input type="text" placeholder="Apellidos" v-model="surname"/>
      <input type="email" placeholder="Email" v-model="email"/>
      <input type="password" placeholder="Clave" v-model="password"/>
      <input type="password" placeholder="Repetir clave" v-model="password2"/>
      <span class="error" v-if="error">{{ error }}</span>
      <button id="register_button" @click="register()">Registrarse<router-link class="btn" v-if="!error" to="/"></router-link></button>
    </div>
    <div class="cuadroModal" v-if="visibility">
      <div class="registrado">
        <h2>Usuario registrado</h2>
        <label>
          <b>Ha sido registrado correctamente.</b><br> Por favor, <b>verifique su cuenta</b> haciendo click en el link que hemos enviado a su correo electrónico
        </label>
        <button class="btn" @click="continuar()">Continuar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
      name: 'Juanjo',
      surname: 'Navarro',
      email: 'juanjo_810@usal.es',
      password: 'asdqwe',
      password2: 'asdqwe',
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
    register () {
      this.registerUser({ email: this.email, password: this.password, name: this.name, surname: this.surname, password2: this.password2 })
      if (this.error === '') {
        this.name = ''
        this.surname = ''
        this.email = ''
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

<style scoped>
  .register-page {
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
  .error{
    color: red;
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
  .registrado{
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
