<template>
  <div>
    <v-card class="mx-auto my-12" max-width="374">
      <template #progress>
        <v-progress-linear color="deep-purple" height="10" indeterminate></v-progress-linear>
      </template>

      <v-img height="250" style="margin: 5px" src="/img/logo.jpg"></v-img>

      <v-card-title>Login</v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="email" label="Email" required></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="password"
              :append-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
              :type="visible ? 'text' : 'password'"
              label="Contraseña"
              counter
              @click:append="visible = !visible"
              @keyup.enter="logIn"
            ></v-text-field>
          </v-col>
        </v-row>

        <div align="center">
          <p class="message">
            ¿No registrado?
            <router-link class="link" to="/register">Crear cuenta</router-link>
          </p>
          <p class="message">
            <router-link class="link" to="/forgotPass">He olvidado mi clave</router-link>
          </p>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="deep-purple lighten-2" text @click="irADemo">Demo</v-btn>

        <v-btn color="deep-purple lighten-2" text @click="logIn">
          <span v-if="fetchingUser">Iniciando sesion...</span>
          <span v-else>Iniciar sesión</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const visible = ref(false);
    const store = useStore();
    const router = useRouter();

    const fetchingUser = computed(() => store.state.fetchingUser);
    const getUser = computed(() => store.getters.getUser);

    const logIn = () => {
      if (email.value !== '' || password.value !== '') {
        store.dispatch('loginUser', { email: email.value, password: password.value })
          .then(() => {
            console.log('OK');
            router.push({ name: 'dashboard' });
          })
          .catch(console.log);
      }
    };

    const irADemo = () => {
      router.push({ name: 'demo' });
    };

    return {
      email,
      password,
      visible,
      fetchingUser,
      getUser,
      logIn,
      irADemo,
    };
  },
};
</script>
