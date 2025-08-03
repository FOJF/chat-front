<script>
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client'
import axios from "axios";
// import axios from 'axios';

export default {
  data() {
    return {
      messages: [],
      newMessage: "",
      stompClient: null,
      senderEmail: "",
      roomId: null
    }
  },
  async created() {
    this.senderEmail = localStorage.getItem("email");
    this.roomId = this.$route.params.roomId;
    const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/chat-rooms/${this.roomId}/messages`);

    console.log(response.data.data);

    this.messages=response.data.data;

    this.connectWebsocket();
  },
  beforeRouteLeave(to, from, next) { // 사용자가 현재 라우트에서 다른 라우트로 이동하려고 할 때 호출되는 훅함수
    this.disconnectWebsocket();
    next();
  },
  beforeUnmount() { // 화면을 완전히 껐을 때 호출되는 훅홤수
    this.disconnectWebsocket();
  },
  methods: {
    connectWebsocket() {
      if (this.stompClient && this.stompClient.connected) return; // 이미 연결되어있으면 연결수립 시도 X
      // sockjs는 websocket을 내장한 향상된 js라이브러리. http엔드포인트 사용
      const sockJS = new SockJS(`${process.env.VUE_APP_API_BASE_URL}/connect`);
      this.stompClient = Stomp.over(sockJS);

      this.token = localStorage.getItem('token');

      this.stompClient.connect({
            Authorization: `Bearer ${this.token}`
          },
          () => {
            this.stompClient.subscribe(`/topic/${this.roomId}`, (message) => {
              const parseMessage = JSON.parse(message.body);
              this.messages.push(parseMessage);
              this.scrollToBottom();
            },{Authorization: `Bearer ${this.token}`});
          }
      );
    },
    sendMessage() {
      if (this.newMessage.trim() === "") return;

      const message = {
        senderEmail: this.senderEmail,
        message: this.newMessage
      }

      const json = JSON.stringify(message);

      this.stompClient.send(`/publish/${this.roomId}`, json);
      this.newMessage = "";
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chatBox = this.$el.querySelector('.chat-box');
        chatBox.scrollTop = chatBox.scrollHeight;
      })
    },
    disconnectWebsocket() {
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.unsubscribe(`/topic/${this.roomId}`);
        this.stompClient.disconnect();
        console.log("Disconnected");
        this.stompClient = null;
      }
    }
  }
}
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card-title class="text-center text-h5">
          채팅
        </v-card-title>
        <v-card-text>
          <div class="chat-box">
            <div
                v-for="(message, index) in messages"
                :key="index"
                :class="['chat-message', message.senderEmail === this.senderEmail ? 'sent' : 'received']"
            >
              <strong>{{ message.senderEmail }} : </strong> {{ message.message }} ({{message.readCount}})
            </div>
          </div>
          <v-text-field
              v-model="newMessage"
              label="메세지 입력"
              @keyup.enter="sendMessage"
          />
          <v-btn color="primary" block @click="sendMessage">전송</v-btn>
        </v-card-text>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.chat-box {
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  margin-bottom: 10px;
}

.chat-message {
  margin-bottom: 10px;
}

.sent {
  text-align: right;
}

.received {
  text-align: left;
}
</style>