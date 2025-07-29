<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>
      <v-btn variant="text" :to="{path: '/'}">Chat Service</v-btn>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn variant="text" :to="{path:'/member/list'}">회원 목록</v-btn>
    <v-btn variant="text" :to="{path: '/groupchatting/list'}">채팅방 목록</v-btn>

    <v-spacer></v-spacer>

    <template v-if="isLogin">
      <v-btn variant="text" :to="{path:'/my/chat/page'}">MyChatPage</v-btn>
      <v-btn icon @click="doLogout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </template>

    <template v-else>
      <v-btn variant="text" :to="{path:'/member/create'}">
        <v-icon left>mdi-account-plus</v-icon>
        회원가입
      </v-btn>
      <v-btn variant="text" :to="{path:'/login'}">
        <v-icon left>mdi-login</v-icon>
        로그인
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      isLogin: false
    }
  },
  created() {
    const token = localStorage.getItem("token");
    if (token) this.isLogin = true;
  },
  methods: {
    doLogout() {
      localStorage.clear();
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
</style>
