<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      v-if="$route.name!='login' && $route.name!='register' && $route.name!='forgotPass'"
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
          @click="$router.push({name: 'dashboard'})"
        />
        <h1>MusicFactory</h1>
        
      </div>

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-main style="background-color: #456">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
