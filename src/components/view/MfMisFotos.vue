/* eslint-disable */
<template>
  <div class="dashboard-page">
    <div class="photos">
      <router-link to="/perfil">
        <button class="btn-perfil">Mi perfil</button>
      </router-link>
      <h1 class="title">Fotos subidas</h1>
      <image-collection>
      </image-collection>
      <button class="btn" @click="addPhoto()">Añadir foto</button>
    </div>
  </div>
</template>

<script>
import ImageCollection from '@/components/MfImages.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: { ImageCollection },
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
  methods: {
    ...mapActions([
      'addPhotoFile',
      'getCurrentUser'
    ]),
    async addPhoto () {
      const pickerOpts = {
        types: [
          {
            description: 'Images',
            accept: {
              'image/*': ['.png', '.jpeg', '.jpg']
            }
          }
        ],
        excludeAcceptAllOption: true,
        multiple: false
      }
      // open file picker
      let [fileHandle] = await window.showOpenFilePicker(pickerOpts)
      let fileData = await fileHandle.getFile()
      this.addPhotoFile({file: fileData, email: this.user.data.email, displayName: this.user.data.displayName})
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
    width: 40%;
    margin-left:30%;
    margin-right:100%;
    border: 0;
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
</style>
