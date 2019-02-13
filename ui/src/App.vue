<template>
  <div id="app">
    <v-app>
      <v-content>
        <v-toolbar>
          <v-toolbar-title>{{title}}</v-toolbar-title>
        </v-toolbar>
        <v-container>
          <router-view></router-view>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "app",
  computed: {
    ...mapGetters({
      title: "title"
    })
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
