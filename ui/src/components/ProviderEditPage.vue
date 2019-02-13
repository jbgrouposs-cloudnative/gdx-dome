<template>
  <div>
    <v-toolbar app color="primary">
      <v-toolbar-side-icon @click="$router.go(-1)">
        <v-icon>arrow_back</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title>プロバイダ編集</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-and-down">
        <v-btn icon @click="save()" :disabled="!valid">
          <v-icon>save</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-form ref="form" v-model="valid" lazy-validation>
      <h3>メイン</h3>
      <v-divider></v-divider>
      <v-text-field
        v-model="currentProvider.name"
        :counter="20"
        :rules="nameRules"
        label="プロバイダ名"
        required
      ></v-text-field>

      <v-text-field
        v-model="currentProvider.repositoryUrl"
        :rules="urlRules"
        label="リポジトリURL"
        required
      ></v-text-field>

      <h3>インスタンスの構成</h3>
      <v-divider></v-divider>
      <v-layout row align-center>
        <v-flex xs2>サイズ</v-flex>
        <v-flex xs1>
          <v-text-field v-model="currentProvider.cpu" type="number" label="CPU" suffix="コア"></v-text-field>
        </v-flex>
        <v-flex xs1></v-flex>
        <v-flex xs2>
          <v-text-field v-model="currentProvider.memory" type="number" label="メモリ" suffix="MB"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row align-center>
        <v-flex xs2>スケール</v-flex>
        <v-flex xs1>
          <v-text-field v-model="currentProvider.scale.min" type="number" label="最小"></v-text-field>
        </v-flex>
        <v-flex xs1>～</v-flex>
        <v-flex xs1>
          <v-text-field v-model="currentProvider.scale.max" type="number" label="最大"></v-text-field>
        </v-flex>
        <v-flex xs2>インスタンス</v-flex>
      </v-layout>
      <h3>アプリケーションの環境変数</h3>
      <v-divider></v-divider>
      <v-btn icon block @click="currentProvider.environments.push({key: '', value: ''})">
        <v-icon>add</v-icon>
      </v-btn>
      <v-layout row align-center v-for="(env, index) in currentProvider.environments" :key="index">
        <v-flex xs5>
          <v-text-field v-model="env.key" label="キー" required :rules="envKeyRules"></v-text-field>
        </v-flex>
        <v-flex>：</v-flex>
        <v-flex xs5>
          <v-text-field v-model="env.value" label="値" required :rules="envValueRules"></v-text-field>
        </v-flex>
        <v-flex></v-flex>
        <v-flex>
          <v-btn icon @click="removeEnvByIndex(index)">
            <v-icon>delete</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </div>
</template>
<script>
export default {
  name: "provider-edit-page",
  data() {
    return {
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
      }
    };
  },
  methods: {
    save() {
      this.$router.push("/summary");
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
    }
  },
  created() {
    this.$store.dispatch("setAppBarState", {
      title: "プロバイダ編集",
      hasParentPage: true
    });
    this.currentId = this.$route.params.id;
  }
};
</script>
