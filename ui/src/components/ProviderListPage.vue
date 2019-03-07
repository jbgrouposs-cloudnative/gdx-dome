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
    <v-layout row wrap>
      <v-flex
        xs6
        sm3
        v-for="provider in providerList"
        :key="provider.providerId"
        transition="slide-y-transition"
      >
        <v-card>
          <v-card-title primary-title>
            <h3>{{provider.providerId}}</h3>
          </v-card-title>
          <v-card-text>{{provider.objectType}}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn icon flat @click="openDetail(provider.providerId)">
              <v-icon>info</v-icon>
            </v-btn>
            <v-btn icon flat @click="editProvider(provider.providerId)">
              <v-icon>edit</v-icon>
            </v-btn>
            <v-menu bottom left>
              <v-btn slot="activator" icon>
                <v-icon>more_vert</v-icon>
              </v-btn>
              <v-list>
                <v-list-tile @click="deleteProvider(provider.providerId)">
                  <v-list-tile-title>削除する</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
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
          this.providerList = res.data;
        })
        .catch(err => {
          // eslint-disable-next-line
          console.error(err);
          this.message = "プロバイダ情報の取得に失敗しました";
          this.snackbar = true;
        });
    },
    openDetail(providerId) {
      this.$router.push("/details/" + providerId);
    },
    openRegisterPage() {
      this.$router.push("/edit/new");
    },
    editProvider(providerId) {
      this.$router.push("/edit/" + providerId);
    },
    deleteProvider(providerId) {
      // eslint-disable-next-line
      console.log("deleteProvider: " + providerId);
      const baseurl = this.$store.getters.baseUrl;
      axios
        .delete(baseurl + "/services/" + providerId)
        .then(() => {
          this.message = providerId + "を削除しました。";
          this.snackbar = true;
          this.checkout();
        })
        .catch(err => {
          // eslint-disable-next-line
          console.error(err);
          this.message = "プロバイダの削除に失敗しました";
          this.snackbar = true;
        });
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
