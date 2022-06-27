/* eslint-disable */
<template>
  <div class="dashboard-page">
    <div class="photos">
      <router-link to="/perfil">
        <button class="btn-perfil">Mi perfil</button>
      </router-link>
      <h1 class="title">Publicaciones de {{this.name}}</h1>
      <post-collection :email="this.email" class="gallery">
      </post-collection>
    </div>
  </div>
</template>

<script>
import PostCollection from '@/components/MfPostsUser.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: { PostCollection },
  props: {
    email: String,
    name: String
  },
  data () {
    return {
      images: []
    }
  },
  computed: {
    ...mapGetters([
      'getPostsByUser',
      'getUser'
    ]),
    user () {
      return this.getUser
    }
  },
  methods: {
    ...mapActions([
    ])
  },
  created () {
    if (!this.user.loggedIn) {
      this.$router.push({name: 'login'})
    }
  },
  updated () {
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
  .error{
    color: red;
  }
</style>
