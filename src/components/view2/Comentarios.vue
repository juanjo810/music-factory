<template>
<div>
  <v-row align="center" justify="center">
  <v-card
    max-width="1000" width="100%">
      <v-img
          :src="this.post.name"
      ></v-img>
      <v-divider class="mx-4"></v-divider>

      <v-card-title>Paisaje Sonoro</v-card-title>
      <v-card-text>
        <audio controls class="audioControl" style="width: 100%">
          <source :src="this.post.soundscape">
        </audio>
      </v-card-text>
      
      <v-divider class="mx-4"></v-divider>
   <v-toolbar dark color="primary">
        <v-toolbar-title>Comentarios</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-row>
        <v-col>
            <v-avatar style="margin:5px">
            <v-img :src="this.post.owner[2]"></v-img>
            </v-avatar>
            <span><b>    {{this.post.owner[1]}}    </b></span>
            <span>{{this.post.descripcion}}</span>
          </v-col>
        </v-row>
    <v-list three-line>
      <template>
        <v-divider
        ></v-divider>
        <v-list-item  v-for="(comment, index) in comments" :key="index">
        
          <v-list-item-avatar>
            <v-img :src="comment.autor[2]"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title><b>{{comment.autor[1]}}</b></v-list-item-title>
            <v-list-item-subtitle>{{comment.comentario}}</v-list-item-subtitle>
            <v-list-item-subtitle>{{comment.fecha}}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action v-if="comment.autor[0]===user.data.email">
            <v-icon
              color="grey lighten-1"
              @click="eliminarComentario(comment.id)"
            >
              mdi-delete
            </v-icon>
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-list>
    <v-card-actions>
          <v-btn
              color="green darken-1"
              text
              @click="cargarMas()"
              v-if="this.noComments"
          >
            Cargar más
          </v-btn>
    </v-card-actions>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="comentario"
              outlined
              clearable
              label="Comentario"
              type="text"
              @keyup.enter="addComentario()"
            >
              <template v-slot:append>
                <v-fade-transition leave-absolute>
                  <v-icon
                  @click="addComentario()">
                    mdi-send
                  </v-icon>
                </v-fade-transition>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
  </v-row>
      <v-dialog
        v-model="visibility"
        persistent
        max-width="600"
    >
      <v-card>
        <v-card-title class="text-h5">
          Eliminar comentario
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col
                cols="12"
            >
            <span>¿Está seguro de que desea eliminar el comentario?</span>
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
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
export default {
  props: {
    id: String
  },
  name: 'post-collection',
  data () {
    return {
      visibility: false,
      descripcion: '',
      comentario: '',
      idCom: ''
    }
  },
  computed: {
    ...mapState([
      'user',
      'comments',
      'noComments'
    ]),
    ...mapGetters([
      'getImageById'
    ]),
    post () {
      return this.getImageById(this.id)
    }
  },
  methods: {
    ...mapActions([
      'getImageComments',
      'addComment',
      'removeComment'
    ]),
    addComentario () {
      this.addComment({idImage: this.id, comment: this.comentario})
    },
    eliminarComentario (id) {
      this.visibility = true
      this.idCom = id
    },
    confirmar () {
      this.visibility = false
      this.removeComment({idImage: this.id, id:this.idCom})
      this.idCom = ''
    },
    cancelar () {
      this.visibility = false
      this.idCom = ''
    },
    cargarMas () {
      var id = this.comments[this.comments.length - 1].id
      this.getImageComments({id: this.id, start: id})
    }
  },
  mounted () {
    this.getImageComments({id: this.id, start: ''})
  }
}
</script>
