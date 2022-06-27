/* eslint-disable */
<template>
  <div>
    <ul class="container">
      <li v-for="(post,index) in posts" :key="index">
        <ul class="lista">
          <li class="header">
            <label id="user">{{ post.owner[1] }}</label>
          </li>
          <li class="imagen">
          <img class="images" :src="post.name"/>
          </li>
          <li class="audio">
          <audio controls class="audioControl">
            <source :src="post.soundscape">
          </audio>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'post-collection',
  computed: {
    ...mapGetters([
      'getFivePosts'
    ]),
    posts () {
      return this.getFivePosts
    }
  },
  methods: {
    ...mapActions([
      'getImages'
    ])
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
    background-color: #f1f3f4;
    width: 80%;
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
</style>
