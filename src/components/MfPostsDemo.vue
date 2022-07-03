/* eslint-disable */
<template>
  <div>
    <v-card
        class="mx-auto my-12"
        v-for="(post,index) in posts" :key="index"
    >
      <template slot="progress">
        <v-progress-linear
            color="deep-purple"
            height="10"
            indeterminate
        ></v-progress-linear>
      </template>

      <v-img
          :src="post.name"
      ></v-img>

      <v-card-title>
        <v-avatar style="margin-right: 15px">
          <img
              :src="post.owner[2]"
              alt="John"
          >
        </v-avatar>
        <span style="margin-top: 15px;">
          {{ post.owner[1] }}
        </span>
      </v-card-title>
      <v-card-text>
        <div style="text-align: justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley</div>
      </v-card-text>
      <v-divider class="mx-4"></v-divider>
      <v-card-title>Paisaje Sonoro</v-card-title>
      <v-card-text>
        <audio controls controlsList="nodownload" style="width: 100%">
          <source :src="post.soundscape">
        </audio>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
export default {
  name: 'post-collection',
  data () {
    return {
      visibility: false,
      descripcion: '',
      id: ''
    }
  },
  computed: {
    ...mapState([
      'user'
    ]),
    ...mapActions([
      'getDemo'
    ]),
    ...mapGetters([
      'getFivePosts'
    ]),
    posts () {
      return this.getFivePosts
    }
  },
  mounted () {
    this.getDemo
  }
}
</script>

