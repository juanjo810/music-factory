/* eslint-disable */
<template>
  <v-container>
    <v-card>
      <v-container>
        <v-row>
          <v-col>
            <div>
              <v-card>
                <template slot="progress">
                  <v-progress-linear
                      color="deep-purple"
                      height="10"
                      indeterminate
                  ></v-progress-linear>
                </template>

                <v-img
                    :src="image.name"
                ></v-img>

                <v-card-title>
                  <v-avatar style="margin-right: 15px">
                    <img
                        :src="image.owner[2]"
                        alt="John"
                    >
                  </v-avatar>
                  <span style="margin-top: 15px;">
                    {{ image.owner[1] }}
                  </span>
                </v-card-title>

                <v-card-text>
                  <div style="text-align: justify">{{image.descripcion}}</div>
                </v-card-text>
                <v-btn
                      color="deep-purple lighten-2"
                      text
                      @click="editarDescripcion()"
                  >
                    Editar Descripción
                  </v-btn>

                <v-divider class="mx-4"></v-divider>

                <v-card-title v-if="image.esPublico">Paisaje Sonoro</v-card-title>
                <v-card-text v-if="image.esPublico">
                  <audio controls class="audioControl" style="width: 100%">
                    <source :src="image.soundscape">
                  </audio>
                </v-card-text>

                <v-card-actions>


                  <v-btn
                      color="deep-purple lighten-2"
                      text
                      @click="comentarios()"
                  >
                    Comentarios
                  </v-btn>

                  <v-btn
                      color="deep-purple lighten-2"
                      text
                      @click="eliminarAudio()"
                      v-if="image.esPublico"
                  >
                    Eliminar paisaje sonoro
                  </v-btn>
                  <v-btn
                      color="deep-purple lighten-2"
                      text
                      @click="generarAudio()"
                      v-else-if="!generatingSoundscape"
                  >
                    Generar paisaje sonoro
                  </v-btn>
                  
                  <v-btn
                      color=""
                      text
                      @click="generarAudio()"
                      @
                      v-else
                  >
                    Generando paisaje sonoro
                  </v-btn>
                  <v-btn
                      color="deep-purple lighten-2"
                      text
                      @click="eliminarPublicacion()"
                  >
                    Eliminar publicación
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn icon
                        :color="image.likes.includes(user.data.email)?'red':''"
                        @click="darLike(image.likes, image.id)"
                      v-if="image.esPublico"
                  >
                    <span v-if="image.esPublico">{{image.likes.length}}</span>
                    <v-icon>mdi-heart</v-icon>
                  </v-btn>
                </v-card-actions>
                
                <span style="color: red" v-if="error">{{ error }}</span>
              </v-card>
              <v-dialog
                v-model="visibility"
                persistent
                max-width="600"
              >
                <v-card>
                  <v-card-title class="text-h5">
                    Editar descripción
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col
                          cols="12"
                      >
                        <v-text-field
                            v-model="descripcion"
                            label="Descripción de la imagen"
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
                      Confirmar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  props: {
    id: String
  },
  data () {
    return {
      visibility: false,
      descripcion: ''
    }
  },
  computed: {
    ...mapState([
      'generatingSoundscape',
      'error'
    ]),
    ...mapGetters([
      'getImageById',
      'getUser'
    ]),
    image () {
      return this.getImageById(this.id)
    },
    user () {
      return this.getUser
    }
  },
  methods: {
    ...mapActions([
      'removePost',
      'removeSoundscape',
      'generateSoundscape',
      'editDescription'
    ]),
    volver () {
      this.$router.push({name: 'misFotos'})
    },
    eliminarPublicacion () {
      this.removePost({id: this.id, esPublico: this.image.esPublico})
      this.$router.push({name: 'profile'})
    },
    eliminarAudio () {
      this.removeSoundscape(this.id)
    },
    generarAudio () {
      this.generateSoundscape({url: this.image.name, id: this.id})
    },
    editarDescripcion () {
      this.visibility = true
    },
    confirmar () {
      this.editDescription({id: this.id, descripcion: this.descripcion})
      this.visibility = false
      this.descripcion = ''
    },
    cancelar () {
      this.visibility = false
      this.descripcion = ''
    },
    comentarios () {
      this.$router.push({name: 'comments', params: { id: this.id }})
    }
  },
  created () {
    if (!this.user.loggedIn) {
      this.$router.push({name: 'login'})
    }
  }
}
</script>
