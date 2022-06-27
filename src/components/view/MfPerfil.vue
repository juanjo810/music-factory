/* eslint-disable */
<template>
  <div class="perfil-page">
    <div class="options">
      <h1>Mi perfil</h1>
      <router-link to="/misFotos">
        <button>Fotos subidas</button>
      </router-link>
      <router-link to="/reportes" v-if="this.user.data.esAdmin">
        <button>Ver reportes</button>
      </router-link>
      <router-link to="/perfil/modificaDatos">
        <button>Cambiar datos personales</button>
      </router-link>
      <router-link to="/perfil/modificaContra">
        <button>Cambiar clave</button>
      </router-link>
      <button @click="cerrarSesion()">Cerrar sesión</button>
      <button @click="confirmarBorrado()">Eliminar cuenta</button>
    </div>
    <div class="cuadroModal" v-if="visibility">
      <div class="borrarCuenta">
        <h3>Borrar cuenta</h3>
        <form>
          <label>¿Está seguro que desea eliminar su cuenta? <b>Todas las imágenes y paisajes sonoros de su cuenta serán eliminados</b>. Para confirmar debe
            introducir sus credenciales de inicio de sesión de nuevo
          </label>
          <input type="email" placeholder="Usuario" v-model="email"/>
          <input type="password" placeholder="Clave" v-model="password"/>
          <button class="btn" @click="borrarCuenta()">Confirmar</button>
          <button class="btn" @click="cancelar()">Cancelar</button>
        </form>
        <label v-if="this.error">{{this.error}}</label>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  data () {
    return {
      esAdmin: false,
      visibility: false,
      email: 'juanjo_810@usal.es',
      password: 'asdqwe'
    }
  },
  computed: {
    ...mapState([
      'user',
      'error'
    ]),
    ...mapGetters([
      'getImagesByUser'
    ]),
    images () {
      return this.getImagesByUser(this.user.data.email)
    }
  },
  methods: {
    ...mapActions([
      'signOut',
      'deleteAccount'
    ]),
    async cerrarSesion () {
      await this.signOut()
      this.$router.push({name: 'login'})
    },
    confirmarBorrado () {
      this.visibility = true
    },
    async borrarCuenta () {
      await this.deleteAccount({images: this.images, email: this.email, password: this.password})
      if (this.error === '') {
        this.visibility = false
        this.$router.push({name: 'login'})
      }
    },
    cancelar () {
      this.email = ''
      this.password = ''
      this.visibility = false
    }
  },
  created () {
    if (!this.user.loggedIn) {
      this.$router.push({name: 'login'})
    }
    this.esAdmin = this.user.esAdmin
  }
}
</script>

<style scoped>
  .perfil-page {
    width: 50%;
    padding: 8% 0 0;
    margin: auto;
  }
  .options {
    z-index: 1;
    background: #FFFFFF;
    padding: 5%;
    text-align: center;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
  }
  .options button {
    font-family: "Roboto", sans-serif;
    text-transform: uppercase;
    outline: 0;
    background: #28d;
    width: 50%;
    border: 0;
    padding: 15px;
    margin: 2%;
    color: #FFFFFF;
    font-size: 14px;
    -webkit-transition: all 0.3 ease;
    transition: all 0.3 ease;
    cursor: pointer;
  }
  .options button:hover,.form button:active,.form button:focus {
    background: #17c;
  }
  .options .message {
    margin: 15px 0 0;
    color: #b3b3b3;
    font-size: 12px;
  }
  .options .message .link{
    color: #17c;
    text-decoration: none;
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
  .borrarCuenta{
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
    color: #FFFFFF;
    font-size: 14px;
    -webkit-transition: all 0.3 ease;
    transition: all 0.3 ease;
    cursor: pointer;
  }
  .btn:hover,.btn:active,.btn:focus {
    background: #17c;
  }
  input {
    font-family: "Roboto", sans-serif;
    outline: 0;
    background: #f2f2f2;
    width: 70%;
    border: 0;
    margin-top:2%;
    margin-left:15%;
    margin-right:100%;
    margin-bottom: 2%;
    padding: 15px;
    box-sizing: border-box;
    font-size: 14px;
  }
</style>
