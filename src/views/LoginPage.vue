<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="4" md="6">
        <v-card>
          <v-card-title class="text-h5 text-center">로그인</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="doLogin">
              <v-text-field label="이메일" type="email" v-model="email" requried></v-text-field>
              <v-text-field label="비밀번호" type="password" v-model="password" requried></v-text-field>
              <v-btn type="submit" color="primary">로그인</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from 'axios';
import {jwtDecode} from "jwt-decode";
// import axios from 'axios';

export default {
  data() {
    return {
      email: "",
      password: ""
    }
  }, methods: {
    async doLogin() {
      const loginData = {email: this.email, password: this.password};
      await axios.post(`${process.env.VUE_APP_API_BASE_URL}/user/login`, loginData).then(res => {
        const token = res.data.data;
        localStorage.setItem("token", token);
        const jwtDecoded = jwtDecode(token);
        localStorage.setItem("role", jwtDecoded.role);
        localStorage.setItem("email", jwtDecoded.sub);
      });

      window.location.href = '/';
    }
  }
}
</script>