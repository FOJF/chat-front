<template>
  <v-app :style="{ backgroundColor: $vuetify.theme.themes.light.background }">
    <HeaderComponent />
    <v-main>
      <v-container fluid>
        <router-view v-slot="{ Component }">
          <v-fade-transition mode="out-in">
            <component :is="Component" />
          </v-fade-transition>
        </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import HeaderComponent from './components/HeaderComponent.vue';

export default {
  name: 'App',
  components: {
    HeaderComponent
  }
};
</script>

<style scoped>
body {
  background-color: #f5f5f5;
}
</style>
