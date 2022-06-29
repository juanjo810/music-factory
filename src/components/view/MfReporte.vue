/* eslint-disable */
<template>
  <div class="dashboard-page">
    <div class="photos">
      <router-link to="/perfil">
        <button class="btn-perfil">Mi perfil</button>
      </router-link>
      <h1 class="title">Reporte de imagen</h1>
      <img class="imagen" :src="this.image.name"/>
      <audio controls class="audioControl">
        <source :src="this.image.soundscape">
      </audio>
      <h3>Descripción reporte</h3>
      <ul>
        <li id="reporte" v-for="(reporte,index) in this.image.reporte" :key="index">{{reporte}}</li>
      </ul>
      <div class="botones">
        <button class="btn" @click="volver()">Volver</button>
        <button class="btn" @click="validarReporte()">Validar reporte</button>
      </div>
    </div>
    <div class="cuadroModal" v-if="visibility">
      <div class="validacion">
        <h3>Validación de reporte</h3>
        <form>
          <label id="validarTexto">¿Qué acción desea realizar sobre este reporte?</label>
          <div id="botonesValidar">
            <button class="btn" @click="confirmar()">Confirmar reporte</button>
            <button class="btn" @click="rechazar()">Rechazar reporte</button>
            <button class="btn" @click="cancelar()">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    id: String
  },
  data () {
    return {
      visibility: false
    }
  },
  computed: {
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
      'confirmReport',
      'declineReport'
    ]),
    volver () {
      this.$router.push({name: 'reportes'})
    },
    validarReporte () {
      this.visibility = true
    },
    confirmar () {
      this.confirmReport(this.image.id)
      this.visibility = false
      this.$router.push({name: 'reportes'})
    },
    rechazar () {
      this.declineReport(this.image.id)
      this.visibility = false
      this.$router.push({name: 'reportes'})
    },
    cancelar () {
      this.visibility = false
    }
  },
  created () {
    if (!this.user.loggedIn) {
     // this.$router.push({name: 'login'})
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
  #reporte{
    text-align: left;
    margin-left:40%;
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
  button:hover,.form button:active,.form button:focus {
    background: #17c;
  }
  .audioControl{
    background-color: #f1f3f4;
    width: 50%;
  }
  .cuadroModal{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9000;
    width: 100%;
    height: 100%;
    background-color: #456;
    opacity: 1;
  }
  .validacion{
    margin-top: 10%;
    margin-left:25%;
    margin-right:25%;
    background: #FFFFFF;
    padding: 5%;
    text-align: center;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
  }
  #botonesValidar{
    margin-top:2%;
  }
</style>
