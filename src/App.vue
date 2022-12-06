<template>
  <v-app>
    <!-- Fixed Rendering -->
<<<<<<< HEAD
    <Navbar />
      <v-navigation-drawer
        v-model="drawer"
        app
      >
        <!--  -->
      </v-navigation-drawer>
=======

>>>>>>> master

      <v-app-bar app>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>Application</v-toolbar-title>
      </v-app-bar>
    <!-- Dynamic Rendering -->
    <v-main>
      <router-view />
      Hello Word
    </v-main>
  </v-app>
</template>

<script>
<<<<<<< HEAD
// import { onBeforeMount } from "vue";
// import { useStore } from "vuex";
import Navbar from "./components/Navbar.vue";
=======
>>>>>>> master

export default {
  name: "App",
  components: {
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