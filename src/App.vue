<template>
  <v-app>
    <!-- Fixed Rendering -->


    <!-- Dynamic Rendering -->
    <v-main>
      <router-view />
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
  v-main{
    /* margin: 0; */
  }
</style>