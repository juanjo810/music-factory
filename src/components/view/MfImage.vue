/* eslint-disable */
<template>
  <div class="dashboard-page">
    <div class="photos">
      <router-link to="/perfil">
        <button class="btn-perfil">Mi perfil</button>
      </router-link>
      <h1 class="title">Imagen</h1>
      <img class="imagen" :src="this.image.name"/>
      <audio controls class="audioControl" v-if="this.image.esPublico">
        <source :src="this.image.soundscape">
      </audio>
      <div class="botones">
        <button class="btn" v-if="this.image.esPublico" @click="eliminarAudio()">Eliminar audio</button>
        <button class="btn" v-else-if="this.generatingSoundscape">Generando audio...</button>
        <button class="btn" v-else @click="generarAudio()">Generar audio</button>
        <button class="btn" @click="volver()">Volver</button>
        <button class="btn" @click="eliminarPublicacion()">Eliminar publicacion</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  components: {  },
  props: {
    id: String
  },
  data () {
    return {
      images: []
    }
  },
  computed: {
    ...mapState([
      'generatingSoundscape'
    ]),
    ...mapGetters([
      'getImageById',
      'getUser'
    ]),
    image () {
      return this.getImageById(this.id)
    },
    user () {
      return this.getUser
    }
  },
  methods: {
    ...mapActions([
      'removePost',
      'removeSoundscape',
      'generateSoundscape'
    ]),
    volver () {
      this.$router.push({name: 'misFotos'})
    },
    eliminarPublicacion () {
      this.removePost({id: this.id, esPublico: this.image.esPublico})
      this.$router.push({name: 'misFotos'})
    },
    eliminarAudio () {
      this.removeSoundscape(this.id)
    },
    generarAudio () {
      this.generateSoundscape({url: this.image.name, id: this.id})
    }
  },
  created () {
    if (!this.user.loggedIn) {
      this.$router.push({name: 'login'})
    }
  }
}
</script>

<style scoped>
  .dashboard-page {
    width: 50%;
    padding: 3% 0 0;
    margin: auto;
  }
  .photos {
    background: #FFFFFF;
    padding: 5%;
    text-align: center;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
  }
  .btn-perfil{
    font-family: "Roboto", sans-serif;
    text-transform: uppercase;
    outline: 0;
    background: #28d;
    width: 20%;
    margin-left: 60%;
    border: 0;
    padding: 15px;
    color: #FFFFFF;
    font-size: 14px;
    -webkit-transition: all 0.3 ease;
    transition: all 0.3 ease;
    cursor: pointer;
  }
  .title{
    font-family: "Roboto", sans-serif;
    text-align: center;
  }
  .imagen{
    width:60%;
    height:60%;
    margin-left: 25%;
  }
  .botones {
    display:inline;
    margin:0%;
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
  .photos button:hover,.form button:active,.form button:focus {
    background: #17c;
  }
  .audioControl{
    margin-left:23%;
    margin-right:13%;
    margin-bottom: 2%;
    width: 60%;
    background-color: #f1f3f4
  }
  .error{
    color: red;
  }
</style>
