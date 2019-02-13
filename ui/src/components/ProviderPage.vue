<template>
  <div>
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
    }
  },
  created() {
    this.$store.dispatch("setTitle", "プロバイダ詳細 - " + this.id);
  },
  mounted() {
    this.checkout();
  }
};
</script>
