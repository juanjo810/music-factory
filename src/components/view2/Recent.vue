<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Publicaciones de los que sigues</h1>
        <post-collection>
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
