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
    <v-layout row>
      <v-btn-toggle v-model="list_type">
        <v-btn flat>
          <v-icon>view_module</v-icon>
        </v-btn>
        <v-btn flat>
          <v-icon>view_list</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-layout>
    <v-layout row wrap v-if="list_type === 0">
      <v-flex
        xs6
        sm3
        v-for="provider in providerList"
        :key="provider.providerId"
        transition="slide-y-transition"
        class="flex-gap"
      >
        <v-card hover ripple @click="editProvider(provider.providerId)">
          <v-card-title primary-title>
            <h3>{{provider.providerId}}</h3>
          </v-card-title>
          <v-card-text>{{provider.objectType}}</v-card-text>
          <v-card-actions @click.stop>
            <v-spacer></v-spacer>
            <v-menu bottom left>
              <v-btn slot="activator" icon>
                <v-icon>more_vert</v-icon>
              </v-btn>
              <v-list>
                <v-list-tile @click.stop="openTestPage(provider.providerId)">
                  <v-list-tile-title>テストする</v-list-tile-title>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile @click.stop="deleteProvider(provider.providerId)">
                  <v-list-tile-title>削除する</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row v-if="list_type === 1" justify-center>
      <v-flex xs10 sm6>
        <v-list two-line>
          <v-list-tile
            v-for="provider in providerList"
            :key="provider.providerId"
            @click="editProvider(provider.providerId)"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{provider.providerId}}</v-list-tile-title>
              <v-list-tile-sub-title>{{provider.objectType}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon ripple @click.stop="deleteProvider(provider.providerId)">
                <v-icon>delete</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
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
      message: "",
      list_type: 0,
      endpointBaseUrl:
        "https://af9a579d31c9411e981860af6f50b455-1199545367.us-west-2.elb.amazonaws.com"
      // detailDialog: false,
      // providerDetail: ""
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
          const providerList = res.data;
          providerList.sort((provider1, provider2) => {
            return provider1.providerId > provider2.providerId
              ? 1
              : provider1.providerId < provider2.providerId
              ? -1
              : 0;
          });
          this.providerList = providerList;
        })
        .catch(err => {
          // eslint-disable-next-line
          console.error(err);
          this.message = "プロバイダ情報の取得に失敗しました";
          this.snackbar = true;
        });
    },
    openRegisterPage() {
      this.$router.push("/edit/new");
    },
    editProvider(providerId) {
      this.$router.push("/edit/" + providerId);
    },
    openTestPage(id) {
      const baseurl = this.$store.getters.baseUrl;
      axios
        .get(baseurl + "/services/" + id)
        .then(res => {
          const provider = res.data;
          const container = provider.container_info;
          window.open(
            this.endpointBaseUrl +
              "/" +
              container.namespace +
              "/" +
              container.name +
              container.testApiResource
          );
        })
        .catch(err => {
          // eslint-disable-next-line
          console.error(err);
          this.message = "プロバイダ情報の取得に失敗しました";
          this.snackbar = true;
        });
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
<style scoped>
.flex-gap {
  padding: 32px 32px 0px 0px;
}
</style>
