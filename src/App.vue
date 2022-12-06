<template>
  <v-app>
    <!-- Fixed Rendering -->
    <Navbar />

    <!-- Dynamic Rendering -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { onBeforeMount } from "vue";
import { useStore } from "vuex";
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
  v-main{
    /* margin: 0; */
  }
</style>