<script>
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client'
import axios from "axios";
// import axios from 'axios';

export default {
  data() {
    return {
      participants: [],
      onlineParticipants: [],
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

    const messagesRes = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/chat-rooms/${this.roomId}/messages`);
    this.messages = messagesRes.data.data;

    const participantsRes = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/chat-rooms/${this.roomId}/participants`);
    this.participants = participantsRes.data.data;

    console.log(this.participants);

    this.connectWebsocket();
  },
  beforeRouteLeave(to, from, next) { // 사용자가 현재 라우트에서 다른 라우트로 이동하려고 할 때 호출되는 훅함수
    this.disconnectWebsocket();
    next();
  },
  beforeUnmount() { // 화면을 완전히 껐을 때 호출되는 훅홤수
    this.disconnectWebsocket();
  },
  computed: {
    displayedMessages() {
      console.log("test");
      return this.messages.map(message => {
        let unreadCount = 0;
        this.participants.forEach(participant => {
          if (participant.lastReadMessageId < message.id) {
            unreadCount++;
          }
        });
        return { ...message, unreadCount };
      });
    }
  },
  methods: {
    connectWebsocket() {
      if (this.stompClient && this.stompClient.connected) return; // 이미 연결되어있으면 연결수립 시도 X
      // sockjs는 websocket을 내장한 향상된 js라이브러리. http엔드포인트 사용
      const sockJS = new SockJS(`${process.env.VUE_APP_API_BASE_URL}/connect`);
      this.stompClient = Stomp.over(sockJS);

      this.token = localStorage.getItem('token');

      this.stompClient.connect(
        { Authorization: `Bearer ${this.token}` },
        () => {
          this.stompClient.subscribe(`/topic/chat-rooms/${this.roomId}/chat-message`, (message) => {
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            const parseMessage = JSON.parse(message.body);
            console.log(parseMessage);
            this.messages.push(parseMessage);
          }, { Authorization: `Bearer ${this.token}` });

          this.stompClient.subscribe(`/topic/chat-rooms/${this.roomId}/chat-participants`, (message) => {
            const parseMessage = JSON.parse(message.body);
            this.participants = parseMessage;
          }, { Authorization: `Bearer ${this.token}` });

          this.stompClient.subscribe(`/topic/chat-rooms/${this.roomId}/chat-online-participants`, (message) => {
            const parseMessage = JSON.parse(message.body);
            this.onlineParticipants = parseMessage;
          }, { Authorization: `Bearer ${this.token}` });

          this.stompClient.send(`/publish/chat-rooms/${this.roomId}/online`, this.senderEmail);
        }
      );

      this.stompClient.onclose = (event) => {
        console.error("STOMP Connection Closed : ", event);
      };

      this.stompClient.onerror = (error) => {
        console.error("STOMP Error : ", error);
      };
    },
    disconnectWebsocket() {
      this.stompClient.send(`/publish/chat-rooms/${this.roomId}/offline`);

      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.unsubscribe(`/topic/chat-rooms/${this.roomId}/chat-message`);
        this.stompClient.unsubscribe(`/topic/chat-rooms/${this.roomId}/chat-participants`);
        this.stompClient.unsubscribe(`/topic/chat-rooms/${this.roomId}/chat-online-participants`);
        this.stompClient.disconnect();
        console.log("Disconnected");
        this.stompClient = null;
      }
    },
    sendMessage() {
      if (this.newMessage.trim() === "") return;

      const message = {
        senderEmail: this.senderEmail,
        message: this.newMessage
      }

      const json = JSON.stringify(message);

      this.stompClient.send(`/publish/chat-rooms/${this.roomId}/chat-message`, json);
      this.newMessage = "";
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chatBoxRef = this.$refs.chatBox;
        if (chatBoxRef) {
          const el = chatBoxRef.$el || chatBoxRef;
          el.scrollTop = el.scrollHeight;
        }
      });
    }
  },
  watch: {
    messages: {
      handler() {
        this.scrollToBottom();
      },
      deep: true
    }
  }
}
</script>

<template>
  <v-container class="fill-height">
    <v-row class="fill-height" justify="center" align="center">
      <v-col cols="12" md="8" class="d-flex flex-column chat-container">
        <v-card class="flex-grow-1 d-flex flex-column">
          <v-card-title class="text-center text-h5">
            채팅
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="flex-grow-1 overflow-y-auto pa-4" ref="chatBox">
            <div v-for="message in displayedMessages" :key="message.id"
              :class="['d-flex', 'mb-4', message.senderEmail === this.senderEmail ? 'justify-end' : 'justify-start']">
              <div :class="['message-bubble', message.senderEmail === this.senderEmail ? 'sent' : 'received']">
                <div class="font-weight-bold" v-if="message.senderEmail !== this.senderEmail">{{ message.senderEmail }}
                </div>
                <div>{{ message.message }}</div>
                <div class="text-caption text-right">{{ message.unreadCount }}</div>
              </div>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pa-4">
            <v-text-field v-model="newMessage" label="메세지 입력" @keyup.enter="sendMessage" hide-details outlined dense />
            <v-btn color="primary" class="ml-4" @click="sendMessage">전송</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.chat-container {
  height: 90vh;
}

.message-bubble {
  padding: 10px 15px;
  border-radius: 20px;
  max-width: 70%;
  word-wrap: break-word;
}

.sent {
  background-color: #1976D2;
  color: white;
  border-bottom-right-radius: 0;
}

.received {
  background-color: #f0f0f0;
  color: black;
  border-bottom-left-radius: 0;
}
</style>