<template>
  <div>
    <v-toolbar app color="primary">
      <v-toolbar-side-icon @click="$router.go(-1)">
        <v-icon>arrow_back</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title>プロバイダ詳細</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-and-down">
        <v-btn icon @click="edit()">
          <v-icon>edit</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-list two-line>
      <template v-for="(endpoint, index) in provider.endpoints">
        <v-list-tile :key="index">
          <v-list-tile-content>
            <v-list-tile-title>{{endpoint.name}}</v-list-tile-title>
            <v-list-tile-sub-title>{{endpoint.path}}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
    <v-snackbar v-model="snackbar">{{message}}</v-snackbar>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "provider-page",
  props: ["id"],
  data() {
    return {
      provider: null,
      snackbar: false,
      message: ""
    };
  },
  methods: {
    checkout() {
      const baseurl = this.$store.getters.baseUrl;
      axios.get(baseurl + "/services/" + this.id).then(
        res => {
          this.provider = res.data.Item;
          // eslint-disable-next-line
          console.log(this.provider);
        },
        err => {
          this.message = "プロバイダ情報の取得に失敗しました";
          this.snackbar = true;
          // eslint-disable-next-line
          console.error(err);
        }
      );
    },
    edit() {
      this.$router.push("/edit/" + this.id);
    }
  },
  created() {
    this.$store.dispatch("setAppBarState", {
      title: "プロバイダ詳細 - " + this.id,
      hasParentPage: true
    });
  },
  mounted() {
    this.checkout();
  }
};
</script>
