/* eslint-disable */

<template>
  <v-container>
    <v-card>
      <v-bottom-navigation v-model="value">
        <v-btn value="recent" @click="$router.push({name:'recent'})">
          <span>Recent</span>
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-btn>

        <v-btn value="search" @click="$router.push({name:'search'})">
          <span>Search</span>
          <v-icon>mdi-account-search</v-icon>
        </v-btn>

        <v-btn value="profile" @click="$router.push({name:'profile'})">
          <span>Profile</span>
          <v-icon>mdi-account</v-icon>
        </v-btn>

        <v-btn value="reports" @click="$router.push({name:'reports'})" v-if="this.user.data.esAdmin">
          <span>Reports</span>
          <v-icon>mdi-alert</v-icon>
        </v-btn>
      </v-bottom-navigation>

      <router-view></router-view>
    </v-card>

  </v-container>

</template>



<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'user'
    ])
  }
}
</script>
