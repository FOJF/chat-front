<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="4" md="6">
        <v-card>
          <v-card-title class="text-h5 text-center">내 채팅방 목록
            <div class="d-flex justify-end">
              <v-btn color="secondary" @click="showCreateRoomModal = true">
                채팅방 생성
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <v-table>
              <thead>
              <tr>
                <th>방 번호</th>
                <th>방 제목</th>
                <th>읽지 않은 메세지 수</th>
                <th>채팅</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="chatRoom in chatRoomList" :key="chatRoom.id">
                <td>{{ chatRoom.id }}</td>
                <td>{{ chatRoom.roomName }}</td>
                <td>{{ chatRoom.newMessageCount }}</td>
                <td>
                  <v-btn color="primary" @click="joinChatRoom(chatRoom.id)">
                    참여하기
                  </v-btn>
                </td>
              </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="showCreateRoomModal" max-width="500">
      <v-card>
        <v-card-title class="text-h6">
          채팅방 생성
        </v-card-title>
        <v-card-text>
          <v-text-field label="방 제목" v-model="newRoomTitle"/>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey" @click="showCreateRoomModal = false">취소</v-btn>
          <v-btn color="primary" @click="createChatRoom">생성</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      chatRoomList: [],
      showCreateRoomModal: false,
      newRoomTitle: ""
    }
  }, methods: {
    joinChatRoom(roomId) {
      this.$router.push({ path: `/chatpage/${roomId}` });
    },
    createChatRoom() {

    }
  }, async created() {
    const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/chat-rooms`);
    this.chatRoomList = response.data.data;
    console.log(this.userList);
  }
}
</script>