<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-card max-width="1000" width="100%"> 
        <v-container>
          <v-row>
            <v-col>
              <h1>Últimas 5 publicaciones</h1>
              <post-collection>
              </post-collection>
            </v-col>
          </v-row>
        </v-container>  
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import PostCollection from '@/components/MfPostsDemo.vue'

export default {
  components: {PostCollection},
  name: "Demo"
}
</script>

<style scoped>

</style>
