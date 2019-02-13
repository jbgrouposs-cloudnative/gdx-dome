<template>
  <div>
    <v-card
      v-for="provider in providerList"
      :key="provider.provider"
      transition="slide-y-transition"
      :max-width="300"
    >
      <v-card-title primary-title>
        <h3>{{provider.provider}}</h3>
      </v-card-title>
      <v-card-text>{{provider.object}}</v-card-text>
      <v-card-actions>
        <v-btn flat color="primary" @click="openDetail(provider.provider)">詳細</v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar">{{message}}</v-snackbar>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "provider-list-page",
  data() {
    return {
      providerList: [],
      snackbar: false,
      message: ""
    };
  },
  methods: {
    checkout() {
      const baseurl = this.$store.getters.baseUrl;
      axios
        .get(baseurl + "/services")
        .then(res => {
          // eslint-disable-next-line
          console.log(res.data.Items);
          this.providerList = res.data.Items;
        })
        .catch(err => {
          // eslint-disable-next-line
          console.error(err);
          this.message = "プロバイダ情報の取得に失敗しました";
          this.snackbar = true;
        });
    },
    openDetail(provider) {
      this.$router.push("/details/" + provider);
    }
  },
  created() {
    this.$store.dispatch("setTitle", "プロバイダ一覧");
  },
  mounted() {
    this.checkout();
  }
};
</script>
