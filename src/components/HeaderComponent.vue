<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>
      <v-btn variant="text" :to="{path: '/'}">Chat Service</v-btn>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn variant="text" :to="{path:'/member/list'}">회원 목록</v-btn>
    <v-btn variant="text" :to="{path: '/chatroom/list'}">채팅방 목록</v-btn>

    <v-spacer></v-spacer>

    <v-btn v-if="isLogin" variant="text" :to="{path:'/my/chat/page'}">MyChatPage</v-btn>
    <v-btn v-if="isLogin" @click="doLogout">로그아웃</v-btn>

    <v-btn v-if="!isLogin" variant="text" :to="{path:'/member/create'}">회원가입</v-btn>
    <v-btn v-if="!isLogin" variant="text" :to="{path:'/login'}">로그인</v-btn>
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
      window.location.reload();
    }
  }
}
</script>

<style scoped>
</style>
