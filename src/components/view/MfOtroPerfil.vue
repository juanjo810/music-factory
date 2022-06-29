/* eslint-disable */
<template>
<v-container>
    <v-card>
      <div>
        <v-container>
          <v-row>
            <v-col cols="4">
              <img
                :src="this.photo"
                alt="John"
                style="width: 100%; border-radius: 50%"
              />
            </v-col>
            <v-col cols="8">
              <div style="width: 100%">
                <v-btn text color="primary" style="float: right" @click="seguirUsuario()" v-if="!user.data.siguiendo.includes(email)">
                  Seguir
                </v-btn>
                <v-btn text color="primary" style="float: right" @click="dejarDeSeguir()" v-else>
                  Dejar de seguir
                </v-btn>
              </div>
              <div style="margin-top: 30px">
                <b>{{ this.name }}</b>
                <p>{{ this.email }}</p>
                <br />
                <p>
                  {{ this.descripcion }}
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
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    email: String,
    name: String,
    photo: String,
    descripcion: String
  },
  computed: {
    ...mapGetters([
      'getPostsByUser',
      'getUser'
    ]),
    user () {
      return this.getUser
    },
    posts () {
      return this.getPostsByUser(this.email)
    }
  },
  methods: {
    ...mapActions([
      'followUser',
      'stopFollow'
    ]),
    detallesImagen (imagen) {
      this.$router.push({name: 'post', params: { id: imagen.id }})
    },
    seguirUsuario () {
      this.followUser(this.email)
    },
    dejarDeSeguir () {
      this.stopFollow(this.email)
    }
  },
  created () {
    if (!this.user.loggedIn) {
      this.$router.push({name: 'login'})
    } else if (this.user.data.email === this.email) {
      this.$router.push({name: 'profile'})
    }
  },
  updated () {
    if (!this.user.loggedIn) {
      this.$router.push({name: 'login'})
    }
  }
}
</script>
