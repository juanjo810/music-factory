<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="4">
          <img
            :src="this.user.data.photoURL"
            alt="John"
            style="width: 100%; border-radius: 50%"
          />
        </v-col>
        <v-col cols="8">
          <div style="margin-top: 30px">
            <b>Administrador</b>
            <p v-if="!this.images.length">
              No hay reportes en el sistema
            </p>
          </div>
        </v-col>
      </v-row>

      <h3 v-if="this.images.length">Reportes</h3>
      <v-row>
        <v-col cols="4" v-for="(image, index) in this.images" :key="index">
          <v-card>
            <img :src="image.name" alt="John" style="width: 100%" />
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text
              @click="detallesImagen(image)"> Detalles </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      visibility1: false,
      visible1: false,
      visible2: false,
      visible3: false,
      name: '',
      surname: '',
      profilePhoto: '',
      descripcion: '',
      currentPassword: '',
      password: '',
      password2: ''
    };
  },
  name: "Profile",
  computed: {
    ...mapState([
        "user",
        'error'
      ]),
    ...mapGetters([
      'getReports'
    ]),
    images () {
      return this.getReports
    }
  },
  methods: {
    ...mapActions([
      'getImages'
      ]),
    detallesImagen (imagen) {
      this.$router.push({name: 'report', params: { id: imagen.id }})
    }
  },
  mounted () {
    this.getImages();
  },
};
</script>

<style scoped></style>
