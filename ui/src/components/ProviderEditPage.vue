<template>
  <div>
    <v-toolbar app color="primary">
      <v-toolbar-side-icon @click="$router.go(-1)">
        <v-icon>arrow_back</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title>プロバイダ編集</v-toolbar-title>
    </v-toolbar>

    <v-progress-linear :indeterminate="true" v-if="isLoading"></v-progress-linear>

    <v-layout row align-center justify-center v-if="!isLoading">
      <v-flex xs12 sm8>
        <v-form ref="form" v-model="valid" lazy-validation>
          <h3>メイン</h3>
          <v-divider></v-divider>
          <v-layout row align-center>
            <v-text-field
              v-model="currentProvider.name"
              :counter="30"
              :rules="nameRules"
              label="プロバイダ名"
              outline
              required
              maxlength="30"
            ></v-text-field>
          </v-layout>
          <v-layout row align-center>
            <v-select
              :items="versionList"
              v-model="currentProvider.version"
              label="API バージョン"
              outline
              v-on:change="handleVersionChanged()"
            ></v-select>
          </v-layout>
          <!--
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
          -->
          <h3>コンテナ情報</h3>
          <v-divider></v-divider>
          <v-layout row>
            <v-text-field
              v-model="currentProvider.container_info.name"
              :counter="30"
              label="コンテナ名"
              outline
              required
              maxlength="30"
            ></v-text-field>
          </v-layout>
          <v-layout row align-center>
            <v-select
              :loading="isImageListLoading"
              :items="imageList"
              v-model="currentProvider.container_info.image"
              label="コンテナイメージ"
              outline
            ></v-select>
          </v-layout>
          <v-layout row align-center justify-space-between>
            <v-flex xs3>
              <v-text-field v-model="portModel" label="ポート" outline></v-text-field>
            </v-flex>
            <v-flex xs3>
              <v-text-field
                v-model="currentProvider.container_info.cpu"
                label="CPU"
                outline
                hint="例：500m"
              ></v-text-field>
            </v-flex>
            <v-flex xs3>
              <v-text-field
                v-model="currentProvider.container_info.memory"
                label="メモリ"
                outline
                hint="例：1Gi"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row align-center justify-space-between></v-layout>
          <h3>アプリケーションの環境変数</h3>
          <v-divider></v-divider>
          <v-btn
            icon
            block
            @click="currentProvider.container_info.environments.push({name: '', value: ''})"
          >
            <v-icon>add</v-icon>
          </v-btn>
          <v-layout
            row
            align-center
            v-for="(env, index) in currentProvider.container_info.environments"
            :key="index"
          >
            <v-flex xs5>
              <v-text-field v-model="env.name" label="変数名" required :rules="envNameRules" outline></v-text-field>
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
      nameRules: [
        v => !!v || "入力必須項目です！",
        v => (v && v.length <= 30) || "30文字以内で入力してください！"
      ],
      urlRules: [v => !!v || "入力必須項目です！"],
      envNameRules: [
        v => !!v || "入力必須項目です！",
        v => !this.isDuplicatedName(v) || "名前が重複しています！"
      ],
      envValueRules: [v => !!v || "入力必須項目です！"],
      portModel: "80",
      currentProvider: {
        name: "new-provider",
        version: 1, // name + '-v' + version = provider
        creatorId: this.$store.getters.user.userId,
        // updatorId: "",
        createdTimestamp: Date.now(),
        // updatedTimestamp: null,
        tags: ["タグ１"],
        container_info: {
          name: "",
          namespace: "wahhoi-test" + Date.now(), // TODO: const?
          image: "",
          port: 80,
          cpu: "500m",
          memory: "1Gi",
          environments: [
            {
              name: "SPRING_DATASOURCE_URL",
              value: "jdbc:mysql://mysql.wahhoi.svc.cluster.local:3306/wahhoi"
            },
            { name: "SPRING_DATASOURCE_USERNAME", value: "" },
            { name: "SPRING_DATASOURCE_PASSWORD", value: "" },
            {
              name: "SPRING_DATASOURCE_DRIVERCLASSNAME",
              value: "com.mysql.jdbc.Driver"
            }
          ]
        }
        // repositoryUrl: "https://github.com/jbgrouposs-cloudnative/gdx-dome"
      },
      versionList: [1],
      imageList: [],
      isLoading: true,
      isImageListLoading: false,
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
            ...this.currentProvider,
            provider:
              this.currentProvider.name + "-v" + this.currentProvider.version,
            object: "ENDPOINT",
            container_info: {
              ...this.currentProvider.container_info,
              port: Number(this.portModel)
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
            ...this.currentProvider,
            provider:
              this.currentProvider.name + "-v" + this.currentProvider.version,
            object: "ENDPOINT"
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
    isDuplicatedKey(name) {
      let count = 0;
      this.currentProvider.container_info.environments.forEach(env => {
        if (env.name === name) {
          count++;
        }
      });
      return count >= 2;
    },
    removeEnvByIndex(index) {
      this.currentProvider.container_info.environments.splice(index, 1);
    },
    loadProvider(id) {
      this.isLoading = true;
      const baseurl = this.$store.getters.baseUrl;
      const sepalatorIndex = id.lastIndexOf("-");
      const name = id.substring(0, sepalatorIndex);
      // this.loadImageList(name); // build image list
      const version = Number(id.substring(sepalatorIndex, id.length));
      const list = [1];
      for (let i = 2; i <= this.currentProvider.version + 1; i++) {
        list.push(i);
      }
      this.versionList = list;
      axios.get(baseurl + "/services/" + id).then(
        res => {
          this.isLoading = false;
          const item = res.data;
          this.currentProvider = {
            ...item,
            name,
            version
          };
          this.portModel = "" + item.container_info.port;
        },
        err => {
          this.isLoading = false;
          this.handleError(err, "プロバイダ情報の取得に失敗しました。");
        }
      );
    },
    loadImageList(name) {
      this.isImageListLoading = true;
      const baseurl = this.$store.getters.baseUrl;
      axios.get(baseurl + "/container-images/" + name).then(
        res => {
          this.isImageListLoading = false;
          this.imageList = res.data;
        },
        err => {
          this.isImageListLoading = false;
          this.handleError(err, "イメージ情報の取得に失敗しました。");
        }
      );
    },
    handleVersionChanged() {
      if (
        !this.currentProvider ||
        !this.currentProvider.version ||
        this.currentProvider.version <= 0
      ) {
        return;
      }
      window.setTimeout(() => {
        const providerId =
          this.currentProvider.name + "-v" + this.currentProvider.version;
        this.loadProvider(providerId);
      }, 1000);
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
    this.loadImageList("wahhoi-provider"); // TODO これほんま？
    const id = this.$route.params.id;
    this.isNew = id === "new";
    if (this.isNew) {
      this.isLoading = false;
      return;
    }
    this.loadProvider(id);
  }
};
</script>
