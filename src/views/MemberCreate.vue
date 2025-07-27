<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="4" md="6">
                <v-card>
                    <v-card-title class="text-h5 text-center">회원가입</v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="userCreate">
                            <v-text-field label="이름" v-model="name" requried></v-text-field>
                            <v-text-field label="닉네임" v-model="nickname" requried></v-text-field>
                            <v-text-field label="전화번호" v-model="phone" requried></v-text-field>
                            <v-text-field label="이메일" type="email" v-model="email" requried></v-text-field>
                            <v-text-field label="비밀번호" type="password" v-model="password" requried></v-text-field>
                            <v-btn type="submit" color="primary">등록</v-btn>
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
            phone: ""
        }
    }, methods: {
        async userCreate() {
            const data = {
                name: this.name,
                email: this.email,
                password: this.password,
                nickname: this.nickname,
                phone: this.phone
            }
            await axios.post(`${process.env.VUE_APP_API_BASE_URL}/user/sign`, data);
            this.$router.push("/");
        }
    }
}
</script>