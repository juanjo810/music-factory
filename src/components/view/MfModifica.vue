/* eslint-disable */
<template>
  <div class="register-page">
    <div class="form">
      <h1>Cambiar datos personales</h1>
      <input type="text" placeholder="Nombre" v-model="name"/>
      <input type="text" placeholder="Apellidos" v-model="surname"/>
      <span class="error" v-if="error">{{ error }}</span>
      <router-link to="/perfil">
        <button id="register_button" @click="modificarInfo()" class="btn">Modificar datos</button>
      </router-link>
      <router-link to="/perfil">
        <button id="register_button" class="btn">Volver</button>
      </router-link>
    </div>
  </div>

</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  data () {
    return {
      name: '',
      surname: ''
    }
  },
  computed: {
    ...mapState([
      'fetchingUser',
      'error'
    ]),
    ...mapGetters([
      'getPostsByUser',
      'getUser'
    ]),
    user () {
      return this.getUser
    },
    posts () {
      return this.getPostsByUser(this.user.data.email)
    }
  },
  methods: {
    ...mapActions([
      'changeInfo'
    ]),
    modificarInfo () {
      var displayName = this.name + ' ' + this.surname
      debugger
      this.changeInfo({displayName: displayName, posts: this.posts})
      if (this.error === '') {
        this.$router.push({name: 'perfil'})
      }
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
    margin: 2%;
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
</style>
