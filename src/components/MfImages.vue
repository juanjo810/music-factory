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
          @dblclick="darLike(post.likes, post.id)"
      ></v-img>

      <v-card-title>
        <v-avatar style="margin-right: 15px">
          <img
              :src="post.owner[2]"
              alt="John"
          >
        </v-avatar>
        <span style="margin-top: 15px;" @click="accederPerfil(post.owner)">
          {{ post.owner[1] }}
        </span>
        <v-btn 
        text color="primary"
        style="margin-top: 15px;"
        v-if="!user.data.siguiendo.includes(post.owner[0])"
        @click="seguirUsuario(post.owner[0])">
          Seguir
        </v-btn>
      </v-card-title>

      <v-card-text>
        <div style="text-align: justify">{{post.descripcion}}</div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title>Paisaje Sonoro</v-card-title>
      <v-card-text>
        <audio controls class="audioControl" style="width: 100%">
          <source :src="post.soundscape">
        </audio>
      </v-card-text>

      <v-card-actions>


        <v-btn
            color="deep-purple lighten-2"
            text
            @click="comentarios(post.id)"
        >
          Comentarios
        </v-btn>

        <v-btn
            color="deep-purple lighten-2"
            text
            @click="reportarPublicacion(post.id)"
        >
          Reportar
        </v-btn>

        <v-spacer></v-spacer>
        <v-btn icon
               :color="post.likes.includes(user.data.email)?'red':''"
               @click="darLike(post.likes, post.id)"
        >
          <span>{{post.likes.length}}</span>
          <v-icon>mdi-heart</v-icon>
        </v-btn>
      </v-card-actions>


    </v-card>

    <v-dialog
        v-model="visibility"
        persistent
        max-width="600"
    >
      <v-card>
        <v-card-title class="text-h5">
          Reportar Publicación
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col
                cols="12"
            >
              <v-text-field
                  v-model="descripcion"
                  label="Descripción"
                  required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color=""
              text
              @click="cancelar()"
          >
            Cancelar
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              @click="confirmar()"
          >
            Enviar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    ...mapGetters([
      'getPostsNotFollowing'
    ]),
    posts () {
      return this.getPostsNotFollowing
    }
  },
  methods: {
    ...mapActions([
      'getImages',
      'reportPost',
      'giveLike',
      'removeLike',
      'followUser'
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
    darLike (likes, id) {
      var email = this.user.data.email
      var res = likes.find(like => like === email)
      if (res === undefined) {
        this.giveLike({id: id, email: email})
      } else {
        this.removeLike({id: id, email: email})
      }
    },
    accederPerfil (owner) {
      this.$router.push({name: 'otroPerfil', params: { email: owner[0], name: owner[1], photo: owner[2] }})
    },
    seguirUsuario (email) {
      this.followUser(email)
    },
    comentarios (id) {
      this.$router.push({name: 'comments', params: { id: id }})
    }
  },
  async created () {
    await this.getImages()
  }
}
</script>

