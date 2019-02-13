<template>
  <div>
    <v-toolbar app color="primary">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>プロバイダ一覧</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-and-down">
        <v-btn icon>
          <v-icon>account_circle</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
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
    <v-fab-transition>
      <v-btn fab fixed right bottom color="accent" @click="openRegisterPage()">
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
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
    },
    openRegisterPage() {
      this.$router.push("/edit/new");
    }
  },
  created() {
    this.$store.dispatch("setAppBarState", {
      title: "プロバイダ一覧",
      hasParentPage: false
    });
  },
  mounted() {
    this.checkout();
  }
};
</script>
