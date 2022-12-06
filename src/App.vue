<template>
  <v-app>
    <!-- Fixed Rendering -->

      <v-app-bar app>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>Application</v-toolbar-title>
      </v-app-bar>
    <!-- Dynamic Rendering -->
    <v-main>
      Hello Word
    </v-main>
  </v-app>
</template>

<script>

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