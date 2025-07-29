<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12 rounded-lg">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title class="text-center">로그인</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="doLogin">
              <v-text-field
                label="이메일"
                v-model="email"
                prepend-icon="mdi-email"
                type="email"
                required
              ></v-text-field>
              <v-text-field
                label="비밀번호"
                v-model="password"
                prepend-icon="mdi-lock"
                type="password"
                required
              ></v-text-field>
              <v-alert v-if="error" type="error" dense class="mt-3">{{ error }}</v-alert>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn type="submit" color="primary" :loading="loading">로그인</v-btn>
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
import { jwtDecode } from "jwt-decode";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: null,
      loading: false
    }
  },
  methods: {
    async doLogin() {
      this.loading = true;
      this.error = null;
      try {
        const loginData = { email: this.email, password: this.password };
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/user/login`, loginData);
        const token = response.data.data;
        localStorage.setItem("token", token);
        const jwtDecoded = jwtDecode(token);
        localStorage.setItem("role", jwtDecoded.role);
        localStorage.setItem("email", jwtDecoded.sub);
        this.$router.push('/');
      } catch (err) {
        this.error = "이메일 또는 비밀번호가 잘못되었습니다.";
        console.error(err);
      } finally {
        this.loading = false;
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
