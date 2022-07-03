/* eslint-disable */
<template>
<v-container>
  <v-row align="center" justify="center">
    <v-card max-width="1000">
      <div>
        <v-container>
          <v-row>
            <v-col cols="4">
              <img
                :src="otherUser.photoURL"
                alt="John"
                style="width: 100%; border-radius: 50%"
              />
            </v-col>
            <v-col cols="8">
              <div style="width: 100%">
                <v-btn text color="primary" style="float: right" @click="seguirUsuario()" v-if="!user.data.siguiendo.includes(otherUser.email)">
                  Seguir
                </v-btn>
                <v-btn text color="primary" style="float: right" @click="dejarDeSeguir()" v-else>
                  Dejar de seguir
                </v-btn>
              </div>
              <div style="margin-top: 30px">
                <b>{{ otherUser.displayName }}</b>
                <p>{{ otherUser.email }}</p>
                <br />
                <p>
                  {{ otherUser.descripcion }}
                </p>
              </div>
            </v-col>
          </v-row>

          <h3>Publicaciones</h3>
          <v-row>
            <v-col cols="4" v-for="(post, index) in this.posts" :key="index">
              <v-card>
                <img :src="post.name" alt="John" style="width: 100%" />
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text
                  @click="detallesImagen(post)"> Detalles </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-card>
  </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  props: {
    id: String
  },
  computed: {
    ...mapState([
      'otherUser'
    ]),
    ...mapGetters([
      'getPostsByUser',
      'getUser'
    ]),
    user () {
      return this.getUser
    },
    posts () {
      return this.getPostsByUser(this.$route.params.id)
    }
  },
  methods: {
    ...mapActions([
      'followUser',
      'stopFollow',
      'getUserById'
    ]),
    detallesImagen (imagen) {
      this.$router.push({name: 'post', params: { id: imagen.id }})
    },
    seguirUsuario () {
      this.followUser(this.otherUser.email)
    },
    dejarDeSeguir () {
      this.stopFollow(this.otherUser.email)
    }
  },
  mounted() {
    this.getUserById(this.$route.params.id)
      .then(() => {
        if (this.user.data.email === this.otherUser.email) {
          this.$router.push({name: 'profile'})
        }
      })
  }
}
</script>
