<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Publicaciones recientes de otros usuarios</h1>
        <post-collection>
        </post-collection>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import PostCollection from '@/components/MfImages.vue'

export default {
  components: {PostCollection},
  name: "Recent"
}
</script>
