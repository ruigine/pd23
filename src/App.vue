<template>
  <v-app>
    <!-- Fixed Rendering -->
    <Navbar />
      <v-navigation-drawer
        v-model="drawer"
        app
      >
        <!--  -->
      </v-navigation-drawer>

      <v-app-bar app>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>Application</v-toolbar-title>
      </v-app-bar>
    <!-- Dynamic Rendering -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
// import { onBeforeMount } from "vue";
// import { useStore } from "vuex";
import Navbar from "./components/Navbar.vue";

export default {
  name: "App",
  components: {
    Navbar,
  },
  data() {
    return {
      navigation: null,
    };
  },
};
</script>
<style>

</style>