/* eslint-disable */
<template>
  <div class="dashboard-page">
    <div class="photos">
      <router-link to="/perfil">
        <button class="btn-perfil">Mi perfil</button>
      </router-link>
      <h1 class="title">Imagenes reportadas</h1>
      <report-collection>
      </report-collection>
      <button id="relleno"></button>
    </div>
  </div>
</template>

<script>
import ReportCollection from '@/components/MfReports.vue'
import { mapGetters } from 'vuex'

export default {
  components: { ReportCollection },
  data () {
    return {
      images: []
    }
  },
  computed: {
    ...mapGetters([
      'getUser'
    ]),
    user () {
      return this.getUser
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
    width: 70%;
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
  .btn {
    font-family: "Roboto", sans-serif;
    text-transform: uppercase;
    outline: 0;
    background: #28d;
    width: 70%;
    border: 0;
    width: 40%;
    margin-left:30%;
    margin-right:100%;
    padding: 15px;
    color: #FFFFFF;
    font-size: 14px;
    -webkit-transition: all 0.3 ease;
    transition: all 0.3 ease;
    cursor: pointer;
  }
  .photos button:hover,.photos button:active,.photos button:focus {
    background: #17c;
  }
  #relleno{
    width:100%;
    visibility: hidden;
  }
</style>
