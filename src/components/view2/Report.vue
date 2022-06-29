/* eslint-disable */
<template>
  <v-container>
    <v-card>
      <v-container>
        <v-row>
          <v-col>
            <div>
              <v-card
>
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

                <v-divider class="mx-4"></v-divider>

                <v-card-title>Paisaje Sonoro</v-card-title>
                <v-card-text>
                  <audio controls class="audioControl" style="width: 100%">
                    <source :src="image.soundscape">
                  </audio>
                </v-card-text>

                <v-divider class="mx-4"></v-divider>

                <v-card-title>Reportes</v-card-title>
                <v-card-text v-for="(reporte,index) in this.image.reporte" :key="index">
                  <div style="text-align: justify">{{reporte}}</div>
                </v-card-text>

                <v-card-actions>
                  <v-btn
                      color="deep-purple lighten-2"
                      text
                      @click="validarReporte()"
                  >
                    Validar reporte
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
                    Validar reporte
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col
                          cols="12"
                      >
                      <span>¿Qué desea realizar con este reporte?</span>
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
                      Aceptar reporte
                    </v-btn>
                    
                    <v-btn
                        color="red darken-1"
                        text
                        @click="rechazar()"
                    >
                      Rechazar reporte
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
      'user'
    ]),
    ...mapGetters([
      'getImageById'
    ]),
    image () {
      return this.getImageById(this.id)
    }
  },
  methods: {
    ...mapActions([
      'confirmReport',
      'declineReport'
    ]),
    volver () {
      this.$router.push({name: 'reportes'})
    },
    validarReporte () {
      this.visibility = true
    },
    confirmar () {
      this.confirmReport(this.image.id)
      this.visibility = false
      this.$router.push({name: 'reports'})
    },
    rechazar () {
      this.declineReport(this.image.id)
      this.visibility = false
      this.$router.push({name: 'reports'})
    },
    cancelar () {
      this.visibility = false
    }
  },
  async created () {
    await this.getImages()
  }
}
</script>

