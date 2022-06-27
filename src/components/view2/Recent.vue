<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Publicaciones recientes</h1>
        <post-collection class="gallery">
        </post-collection>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import PostCollection from '@/components/MfPosts.vue'

export default {
  components: {PostCollection},
  name: "Recent"
}
</script>

<style scoped>

</style>
