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
}
</script>
