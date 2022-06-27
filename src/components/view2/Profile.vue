<template>
  <v-container>

    <v-row>
      <v-col cols="4">
          <img
              src="https://cdn.vuetifyjs.com/images/john.jpg"
              alt="John"
              style="width: 100%;border-radius: 50%;"
          >
      </v-col>
      <v-col cols="8">
        <div style="width: 100%">
          <v-btn text color="primary" style="float: right;">
            Seguir
          </v-btn>
        </div>
        <div style="margin-top: 30px">
          <b>ANDRË</b>
          <p>salesmendesandre</p>
          <br>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
          </p>
        </div>
      </v-col>
    </v-row>

    <h3>Publicaciones</h3>
    <v-row>
      <v-col cols="4" v-for="i in ['a','a','a','a','a']" :key="i">
        <v-card>
          <img
              src="https://cdn.vuetifyjs.com/images/john.jpg"
              alt="John"
              style="width: 100%;"
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text>
              Detalles + {{i}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>


    </v-row>


  </v-container>
</template>

<script>
export default {
  name: "Profile"
}
</script>

<style scoped>

</style>
