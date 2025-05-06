/* eslint-disable */

<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-card max-width="1000" width="100%">
        <v-bottom-navigation>
          <v-btn value="recent" @click="$router.push({ name: 'recent' })">
            <span>Recent</span>
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>

          <v-btn value="search" @click="$router.push({ name: 'search' })">
            <span>Search</span>
            <v-icon>mdi-account-search</v-icon>
          </v-btn>

          <v-btn value="profile" @click="$router.push({ name: 'profile' })">
            <span>Profile</span>
            <v-icon>mdi-account</v-icon>
          </v-btn>

          <v-btn
            value="reports"
            @click="$router.push({ name: 'reports' })"
            v-if="this.user.data != NULL && this.user.data.esAdmin"
          >
            <span>Reports</span>
            <v-icon>mdi-alert</v-icon>
          </v-btn>
        </v-bottom-navigation>

        <router-view></router-view>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["user"]),
  },
};
</script>
