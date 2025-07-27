<script>
export default {
  data() {
    return {
      ws: null,
      messages: [],
      newMessage: ""
    }
  },
  created() {
    this.connectWebsocket();
  },
  beforeUnmount() {
    this.disconnectWebsocket();
  },
  methods: {
    connectWebsocket() {
      this.ws = new WebSocket(`${process.env.VUE_APP_API_BASE_URL}/connect`)

      this.ws.onopen = () => {
        console.log("Connected");
      }

      this.ws.onmessage = (message) => {
        console.log("Received message", message);
        this.messages.push(message.data);
        this.scrollToBottom();
      }

      this.ws.onclose = () => {
        console.log("Closed");
      }
    },
    sendMessage() {
      if (this.newMessage.trim() === "") return;
      this.ws.send(this.newMessage);
      this.newMessage = "";
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chatBox = this.$el.querySelector('.chat-box');
        chatBox.scrollTop = chatBox.scrollHeight;
      })
    },
    disconnectWebsocket() {
      if (this.ws) {
        this.ws.disconnect();
        console.log("Disconnected");
        this.ws = null;
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
            >
              {{ message }}
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
</style>