<template>
  <div id="app">
    <v-app dark>
      <v-content>
        <!--
        <v-toolbar color="primary">
          <v-toolbar-side-icon @click="onAppBarIconClicked()">
            <v-icon>{{hasParentPage ? 'arrow_back' : 'menu'}}</v-icon>
          </v-toolbar-side-icon>
          <v-toolbar-title>{{title}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items class="hidden-sm-and-down">
          <v-btn icon>
            <v-icon>account_circle</v-icon>
          </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        -->
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
      title: "title",
      hasParentPage: "hasParentPage"
    })
  },
  methods: {
    onAppBarIconClicked() {
      if (this.hasParentPage) {
        this.$router.go(-1);
        return;
      }
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
