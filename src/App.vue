<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      v-if="$route.name !== 'login' && $route.name !== 'register' && $route.name !== 'forgotPass'"
    >
      <div class="d-flex align-center">
        <v-img
          alt="MusicFactory Logo"
          class="shrink mr-2"
          contain
          src="/img/logo.jpg"
          transition="scale-transition"
          width="40"
          style="cursor: pointer"
          @click="$router.push({ name: 'dashboard' })"
        />
        <h1>MusicFactory</h1>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>
    <v-dialog
      v-if="error !== ''"
      v-model="error"
      max-width="400"
    >
      <v-alert
        type="error"
        v-if="error !== ''"
      >{{ error }}</v-alert>
    </v-dialog>
    <v-dialog
      v-if="soundscapeGenerated"
      v-model="soundscapeGenerated"
      max-width="400"
    >
      <v-alert
        type="info"
        v-if="soundscapeGenerated"
        style="text-align: center"
      >Paisaje sonoro generado con exito</v-alert>
    </v-dialog>
    <v-main style="background-color: #456">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'App',
  setup() {
    const store = useStore();
    const error = computed(() => store.state.error);
    const soundscapeGenerated = computed(() => store.state.soundscapeGenerated);

    return {
      error,
      soundscapeGenerated,
    };
  },
};
</script>
