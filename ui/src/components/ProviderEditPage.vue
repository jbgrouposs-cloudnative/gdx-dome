<template>
  <div>
    <v-toolbar app color="primary">
      <v-toolbar-side-icon @click="$router.go(-1)">
        <v-icon>arrow_back</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title>プロバイダ編集</v-toolbar-title>
    </v-toolbar>

    <v-progress-linear :indeterminate="true" v-if="isLoading"></v-progress-linear>

    <v-layout row align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-form ref="form" v-model="valid" lazy-validation>
          <h3>メイン</h3>
          <v-divider></v-divider>
          <v-text-field
            v-model="currentProvider.name"
            :counter="20"
            :rules="nameRules"
            label="プロバイダ名"
            outline
            required
            maxlength="20"
          ></v-text-field>

          <v-layout row align-center justify-space-between>
            <v-flex>
              <v-text-field
                v-model="currentProvider.repositoryUrl"
                :rules="urlRules"
                label="リポジトリURL"
                outline
                required
                hint="デプロイするアプリケーションのGitHub リポジトリを指定してください"
              ></v-text-field>
            </v-flex>
            <v-flex xs1>
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
              <v-icon color="green">check</v-icon>
              <v-icon color="error">error</v-icon>
            </v-flex>
          </v-layout>

          <h3>構成</h3>
          <v-divider></v-divider>
          <v-layout row align-center justify-space-between>
            <v-flex xs3>
              <v-text-field v-model="currentProvider.cpu" label="CPU" suffix="コア" outline></v-text-field>
            </v-flex>
            <v-flex xs3>
              <v-text-field v-model="currentProvider.memory" label="メモリ" suffix="MB" outline></v-text-field>
            </v-flex>
            <v-flex xs3>
              <v-text-field v-model="currentProvider.scale.max" label="最大" suffix="コンテナ" outline></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row align-center justify-space-between></v-layout>
          <h3>アプリケーションの環境変数</h3>
          <v-divider></v-divider>
          <v-btn icon block @click="currentProvider.environments.push({key: '', value: ''})">
            <v-icon>add</v-icon>
          </v-btn>
          <v-layout
            row
            align-center
            v-for="(env, index) in currentProvider.environments"
            :key="index"
          >
            <v-flex xs5>
              <v-text-field v-model="env.key" label="変数名" required :rules="envKeyRules" outline></v-text-field>
            </v-flex>
            <v-flex>：</v-flex>
            <v-flex xs5>
              <v-text-field v-model="env.value" label="値" required :rules="envValueRules" outline></v-text-field>
            </v-flex>
            <v-flex></v-flex>
            <v-flex>
              <v-btn icon @click="removeEnvByIndex(index)">
                <v-icon>delete</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
    <v-btn
      fab
      color="accent"
      fixed
      bottom
      right
      @click="save()"
      :disabled="!valid"
      :loading="isSaving"
    >
      <v-icon>done</v-icon>
    </v-btn>
    <v-snackbar v-model="snackbar" :color="snackbarColor">{{message}}</v-snackbar>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "provider-edit-page",
  data() {
    return {
      isNew: false,
      valid: true,
      currentId: "",
      nameRules: [
        v => !!v || "入力必須項目です！",
        v => (v && v.length <= 20) || "20文字以内で入力してください！"
      ],
      urlRules: [v => !!v || "入力必須項目です！"],
      envKeyRules: [
        v => !!v || "入力必須項目です！",
        v => !this.isDuplicatedKey(v) || "キーが重複しています！"
      ],
      envValueRules: [v => !!v || "入力必須項目です！"],
      currentProvider: {
        id: "",
        name: "テストプロバイダ",
        creatorId: "wawawahhoi",
        updatorId: "",
        createdTimestamp: new Date(),
        updatedTimestamp: null,
        tags: ["タグ１"],
        repositoryUrl: "https://github.com/jbgrouposs-cloudnative/gdx-dome",
        version: 1,
        cpu: 2,
        memory: 2048,
        scale: {
          min: 1,
          max: 200
        },
        environments: []
      },
      isLoading: false,
      isSaving: false,
      snackbar: false,
      snackbarColor: "",
      message: ""
    };
  },
  methods: {
    save() {
      this.isSaving = true;
      const baseurl = this.$store.getters.baseUrl;
      if (this.isNew) {
        axios({
          method: "post",
          url: baseurl + "/services",
          data: {
            provider: "test" + Date.now(),
            object: "ENDPOINT",
            endpoints: [],
            container_info: {
              name: "test_container",
              port: 80
            }
          }
        }).then(
          () => {
            this.isSaving = false;
            this.message = "プロバイダを登録しました";
            this.snackbarColor = "success";
            this.snackbar = true;
            window.setTimeout(() => {
              this.$router.push("/summary");
            }, 1000);
          },
          err => {
            this.isSaving = false;
            this.handleError(err, "プロバイダの登録に失敗しました。");
          }
        );
      } else {
        this.isSaving = true;
        const provider = this.currentProvider;
        axios
          .put(baseurl + "/services/" + provider.id, {
            Item: this.currentProvider
          })
          .then(
            () => {
              this.isSaving = false;
              this.message = "プロバイダを更新しました";
              this.snackbarColor = "success";
              this.snackbar = true;
              window.setTimeout(() => {
                this.$router.push("/summary");
              }, 1000);
            },
            err => {
              this.isSaving = false;
              this.handleError(err, "プロバイダの更新に失敗しました。");
            }
          );
      }
    },
    isDuplicatedKey(key) {
      let count = 0;
      this.currentProvider.environments.forEach(env => {
        if (env.key === key) {
          count++;
        }
      });
      return count >= 2;
    },
    removeEnvByIndex(index) {
      this.currentProvider.environments.splice(index, 1);
    },
    handleError(err, message) {
      this.snackbarColor = "error";
      this.message = message;
      this.snackbar = true;
      // eslint-disable-next-line
      console.error(err);
    }
  },
  created() {
    this.$store.dispatch("setAppBarState", {
      title: "プロバイダ編集",
      hasParentPage: true
    });
    const id = this.$route.params.id;
    this.isNew = id === "new";
    if (!this.isNew) {
      this.isLoading = true;
      const baseurl = this.$store.getters.baseUrl;
      axios.get(baseurl + "/services/" + id).then(
        res => {
          this.isLoading = false;
          const item = res.item;
          this.currentProvider = {
            id: item.provider,
            name: item.provider,
            objectType: item.object,
            containerInfo: item.container_info,
            endpoints: item.endpoints
          };
        },
        err => {
          this.isLoading = false;
          this.handleError(err, "プロバイダ情報の取得に失敗しました。");
        }
      );
    } else {
      /*
      this.currentProvider = {
        id: "" + Date.now(),
        name: "",
        objectType: "ENDPOINT",
        containerInfo: {
          name: "",
          port: 80
        },
        endpoints: []
      };
      */
    }
  }
};
</script>
