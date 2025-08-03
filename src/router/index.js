import { createRouter, createWebHashHistory } from "vue-router";
import MemberCreate from '@/views/MemberCreate.vue'
import LoginPage from '@/views/LoginPage.vue'
import MemberList from '@/views/MemberList.vue'
import SimpleWebsocket from "@/views/SimpleWebsocket.vue";
import StompChatPage from "@/views/StompChatPage.vue";
import ChatRoomList from "@/views/ChatRoomList.vue";

const routes = [
    {
        path: '/member/create',
        name: 'MemberCreate',
        component: MemberCreate
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage
    },
    {
        path: '/member/list',
        name: 'MemberList',
        component: MemberList
    },
    {
        path: '/simple/chat',
        name: 'SimpleWebsocket',
        component: SimpleWebsocket
    },
    {
        path: '/chatpage/:roomId',
        name: 'StompChatPage',
        component: StompChatPage
    },
    {
        path: '/chatroom/list',
        name: 'ChatRoomList',
        component: ChatRoomList
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;