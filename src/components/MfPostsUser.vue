/* eslint-disable */
<template>
  <div>
    <ul class="container">
      <li v-for="(post,index) in posts" :key="index">
        <ul class="lista">
          <li class="header">
            <label id="user">{{ post.owner[1] }}</label>
            <label id="likes">{{ post.numLikes }} likes</label>
          </li>
          <li class="imagen">
          <img class="images" :src="post.name" @dblclick="darLike()"/>
          </li>
          <li class="audio">
          <audio controls class="audioControl">
            <source :src="post.soundscape">
          </audio>
          <button class="btn" id="descarga" @click="reportarPublicacion(post.id)"><img class="reportImg" src="@/assets/wordReport.png"></button>
          </li>
        </ul>
      </li>
    </ul>
    <div class="cuadroModal" v-if="visibility">
      <div class="report">
        <h3>Descripción del reporte</h3>
        <form>
          <input type="text" placeholder="Descripción" v-model="descripcion"/><br>
          <button class="btn" @click="confirmar()">Confirmar</button>
          <button class="btn" @click="cancelar()">Cancelar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
export default {
  name: 'post-collection',
  props: {
    email: String
  },
  data () {
    return {
      visibility: false,
      meGusta: false,
      descripcion: '',
      id: ''
    }
  },
  computed: {
    ...mapState([
      'user'
    ]),
    ...mapGetters([
      'getPostsByUser'
    ]),
    posts () {
      return this.getPostsByUser(this.email)
    }
  },
  methods: {
    ...mapActions([
      'getImages',
      'reportPost'
    ]),
    reportarPublicacion (idReportar) {
      this.visibility = true
      this.id = idReportar
    },
    confirmar () {
      this.visibility = false
      this.reportPost({id: this.id, descripcion: this.descripcion})
    },
    cancelar () {
      this.visibility = false
    },
    darLike () {
      if (this.meGusta) {
        window.alert('Ha quitado el me gusta a la publicacion')
        this.meGusta = false
      } else {
        window.alert('Ha dado me gusta a la publicación')
        this.meGusta = true
      }
    }
  },
  async created () {
    await this.getImages()
  }
}
</script>

<style scoped>
  .publi{
    padding: 0;
    list-style-type: none;
  }
  .lista{
    padding: 0;
    list-style-type: none;
    display:inline;
  }
  .container{
    margin-left:22%;
    margin-right: 23%;
  }
  .header{
    display:inline;
    padding:10px;
  }
  #user{
    float: left;
  }
  #likes{
    float:right
  }
  .imagen {
    display: block;
    width:30rem;
    height:17rem;
    background-color:#f5f7f9;
    text-align: center;
    border-right: #a5a7aa solid 1px;
    border-bottom: #a5a7aa solid 1px;
  }
  .images{
    width:30rem;
    height:17rem;
    padding:0%;
  }
  .audio{
    display: inline;
  }
  .audioControl{
    background-color: #f1f3f4
  }
  #descarga{
    height: 3rem;
  }
  .descargaImg{
    height: 2rem;
    width: 2rem;
  }
  .reportImg{
    height: 2rem;
    width: 5rem;
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
  .report{
    margin-top: 10%;
    margin-left:25%;
    margin-right:25%;
    background: #FFFFFF;
    padding: 5%;
    text-align: center;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
  }
  input {
    font-family: "Roboto", sans-serif;
    outline: 0;
    background: #f2f2f2;
    width: 60%;
    border: 0;
    margin: 0 0 15px;
    padding: 15px;
    box-sizing: border-box;
    font-size: 14px;
  }
</style>
