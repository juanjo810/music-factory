<template>
  <div>
    <v-container >
      <v-row>
        <v-col cols="4">
          <img
            :src="this.user.data.photoURL"
            alt="Profile_Image"
            class="rounded-circle"
            style="width: 100%; border-radius: 50%"
          />
        </v-col>
        <v-col cols="8">
          <div style="width: 100%">
            <v-btn text color="primary" style="float: right" @click="abrirMod()">
              Opciones del perfil
            </v-btn>
            <v-btn text color="primary" style="float: right" @click="abrirFoto()">
              Añadir foto
            </v-btn>
          </div>
          <div style="margin-top: 30px">
            <b>{{ this.user.data.displayName }}</b>
            <p>{{ this.user.data.email }}</p>
            <br />
            <p>
              {{this.user.data.descripcion}}
            </p>
          </div>
        </v-col>
      </v-row>

      <v-card-title>Publicaciones</v-card-title>
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
      <v-btn
        color="green darken-1"
        text
        @click="cargarMas()"
        v-if="this.noImages"
        width="100%"
      >
        Cargar más
      </v-btn>
      <v-card-text></v-card-text>
    </v-container>
    <v-row justify="center">
      <v-dialog
        v-model="visibility1"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        >
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="visibility1 = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Opciones del perfil</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list three-line subheader>
            <v-subheader>Cambio de información personal</v-subheader>
            <v-list-item>
              <v-list-item-content>
                <v-row>
                  <v-col cols="4">
                    <v-text-field
                    v-model="name"
                    label="Nombre"
                    required
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-text-field
                    v-model="surname"
                    label="Apellidos"
                    required
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-file-input
                    v-model="profilePhoto"
                    label="Foto de perfil"
                    accept="image/jpeg"
                    ></v-file-input>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-text-field
                    v-model="descripcion"
                    label="Descripcion de perfil"
                    required
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-btn
                        color="deep-purple lighten-2"
                        text
                        @click="modificarInfo()"
                    >
                      Modificar datos personales
                      <!--<span v-if="fetchingUser">Registrando...</span><span v-else>Iniciar sesión</span>-->
                    </v-btn>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list three-line subheader>
            <v-subheader>Cambio de contraseña</v-subheader>
            <v-list-item>
              <v-list-item-content>
                <v-row>
                  <v-col cols="4">
                    <v-text-field
                      v-model="currentPassword"
                      :append-icon="visible3 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="visible3 ? 'text' : 'password'"
                      label="Contraseña actual"
                      counter
                      @click:append="visible3 = !visible3"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-text-field
                      v-model="password"
                      :append-icon="visible1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="visible1 ? 'text' : 'password'"
                      label="Contraseña nueva"
                      counter
                      @click:append="visible1 = !visible1"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-text-field
                      v-model="password2"
                      :append-icon="visible2 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="visible2 ? 'text' : 'password'"
                      label="Repetir Contraseña nueva"
                      counter
                      @click:append="visible2 = !visible2"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-btn
                      color="deep-purple lighten-2"
                      text
                      @click="modificaContra()"
                    >
                      Modificar contraseña
                    </v-btn>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list three-line subheader>
            <v-list-item>
              <v-list-item-content>
                <v-row>
                  <v-col cols="4">
                    <v-btn
                      color="deep-purple lighten-2"
                      text
                      @click="cerrarSesion()"
                    >
                      Cerrar sesión
                    </v-btn>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list three-line subheader>
            <v-list-item>
              <v-list-item-content>
                <v-row>
                  <v-col cols="4">
                    <v-btn
                      color="deep-purple lighten-2"
                      text
                      @click="confirmarBorrado()"
                    >
                      Borrar cuenta
                    </v-btn>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center">
      <v-dialog
        v-model="visibility2"
        persistent
        max-width="600"
    >
      <v-card>
        <v-card-title class="text-h5">
          Eliminar cuenta
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col
                cols="12"
            >
              <v-text-field
                  v-model="email"
                  label="Email"
                  :rules="rulesEmail"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
                cols="12"
            >
              <v-text-field
                  v-model="password3"
                  :append-icon="visible5 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="visible5 ? 'text' : 'password'"
                  label="Contraseña"
                  counter
                  @click:append="visible5 = !visible5"
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
              v-if="!this.deletingAccount"
              @click="borrarCuenta()"
          >
            Aceptar
          </v-btn>

          <v-btn
            color=""
            text
            v-else
          >
            Borrando cuenta
          </v-btn>
        </v-card-actions>
      </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center">
      <v-dialog
        v-model="visibility3"
        persistent
        max-width="600"
    >
      <v-card>
        <v-card-title class="text-h5">
          Añadir foto
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col
                cols="12"
            >
              <v-text-field
                  v-model="descFoto"
                  label="Descripcion"
                  required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
                cols="12"
            >
              <v-file-input
              v-model="foto"
              label="Foto"
              accept="image/jpeg"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color=""
              text
              @click="cancelarFoto()"
          >
            Cancelar
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              @click="addFoto()"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      visibility1: false,
      visibility2: false,
      visibility3: false,
      visible1: false,
      visible2: false,
      visible3: false,
      visible5: false,
      name: '',
      surname: '',
      profilePhoto: '',
      descripcion: '',
      currentPassword: '',
      password: '',
      password2: '',
      email: '',
      password3: '' ,
      foto: '',
      descFoto: '',
      rulesEmail: [
        value => !!value || 'Required.',
        value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      ],
      rules: [
        value => !!value || 'Required.'
      ]
    };
  },
  name: "Profile",
  computed: {
    ...mapState([
        "user",
        'error',
        'noImages',
        'deletingAccount'
      ]),
    ...mapGetters([
      'getImagesByUser'
    ]),
    images() {
      return this.getImagesByUser(this.user.data.email);
    },
  },
  methods: {
    ...mapActions([
      'getImagesUser',
      'changeInfo',
      'changePassword',
      'signOut',
      'deleteAccount',
      'addPhotoFile'
      ]),
    abrirMod() {
      this.visibility1 = true;
      this.descripcion = this.user.data.descripcion
    },
    abrirFoto() {
      this.visibility3 = true;
      this.descripcion = this.user.data.descripcion
    },
    addFoto () {
      if (this.foto !== '') {
        this.addPhotoFile({file: this.foto, descripcion: this.descFoto})
        this.visibility3 = false
        this.foto = ''
        this.descFoto = ''
      }
    },
    cancelarFoto () {
      this.visibility3 = false;
    },
    modificarInfo () {
      var displayName = this.name + ' ' + this.surname
      this.changeInfo({displayName: displayName, profilePhoto: this.profilePhoto, descripcion: this.descripcion})
      if (this.error === '') {
        this.visibility1 = false
      }
    },
    modificaContra () {
      if (this.currentPassword !== '' && this.password !== '' && this.password2 !== '') {
        this.changePassword({email: this.user.data.email, currentPassword: this.currentPassword, newPassword: this.password, repeatedPassword: this.password2})
        if (this.error === '') {
          this.visibility1 = false
        }
      }
    },
    detallesImagen (imagen) {
      this.$router.push({name: 'image', params: { id: imagen.id }})
    },
    cargarMas () {
      var id = this.images[this.images.length - 1].id
      this.getImagesUser({id: this.user.data.id, start: id})
    },
    async cerrarSesion () {
       this.signOut()
      .then(
          ()=>{
           this.$router.push({name: 'login'})
          }
      )

    },
    confirmarBorrado () {
      this.visibility2 = true
    },
    async borrarCuenta () {
      if (this.email !== '' && this.password3 !== '') {
        while (this.noImages) {
          var id = this.images[this.images.length - 1].id
          console.log(id)
          await this.getImagesUser({id: this.user.data.id, start: id})
        }
        this.deleteAccount({images: this.images, email: this.email, password: this.password3})
        .then(() => {
          this.visibility1 = false
          this.visibility2 = false
          this.$router.push({name: 'login'})
        })
      }
    },
    cancelar () {
      this.email = ''
      this.password = ''
      this.visibility2 = false
    }
  },
  mounted () {
    this.getImagesUser({id: this.user.data.id, start: ''});
  },
};
</script>
