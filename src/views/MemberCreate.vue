<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12 rounded-lg">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title class="text-center">회원가입</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" @submit.prevent="userCreate">
              <v-text-field
                label="이름"
                v-model="name"
                prepend-icon="mdi-account"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
                label="닉네임"
                v-model="nickname"
                prepend-icon="mdi-account-circle"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
                label="전화번호"
                v-model="phone"
                prepend-icon="mdi-phone"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
                label="이메일"
                v-model="email"
                prepend-icon="mdi-email"
                type="email"
                :rules="[rules.required, rules.email]"
                required
              ></v-text-field>
              <v-text-field
                label="비밀번호"
                v-model="password"
                prepend-icon="mdi-lock"
                type="password"
                :rules="[rules.required, rules.min]"
                required
              ></v-text-field>
              <v-alert v-if="error" type="error" dense class="mt-3">{{ error }}</v-alert>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn type="submit" color="primary" :loading="loading">등록</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      nickname: "",
      phone: "",
      error: null,
      loading: false,
      rules: {
        required: value => !!value || '필수 항목입니다.',
        min: v => v.length >= 8 || '비밀번호는 8자 이상이어야 합니다.',
        email: v => /.+@.+\..+/.test(v) || '유효한 이메일을 입력해주세요.',
      }
    }
  },
  methods: {
    async userCreate() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.error = null;
        try {
          const data = {
            name: this.name,
            email: this.email,
            password: this.password,
            nickname: this.nickname,
            phone: this.phone
          };
          await axios.post(`${process.env.VUE_APP_API_BASE_URL}/user/sign`, data);
          this.$router.push("/login");
        } catch (err) {
          this.error = "회원가입에 실패했습니다. 입력 정보를 확인해주세요.";
          console.error(err);
        } finally {
          this.loading = false;
        }
      }
    }
  }
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
