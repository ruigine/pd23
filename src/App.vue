<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6" v-if="!$store.state.user">
            Guest
          </v-list-item-title>
          <v-list-item-title class="text-h6" v-else>
            {{$store.state.user.displayName}}
          </v-list-item-title>
          <!-- <v-list-item-subtitle>
            subtext
          </v-list-item-subtitle> -->
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        dense
        nav
        v-if="!$store.state.user"
      >
        <v-list-item
          v-for="item in items0"
          :key="item.title"
          :to="item.path"
          @click="logout(item.title)"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list
        dense
        nav
        v-else-if="accessArr.includes($store.state.user.email)"
      >
        <v-list-item
          v-for="item in items2"
          :key="item.title"
          :to="item.path"
          @click="logout(item.title)"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list
        dense
        nav
        v-else
      >
        <v-list-item
          v-for="item in items1"
          :key="item.title"
          :to="item.path"
          @click="logout(item.title)"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    

    <v-app-bar app color="#fff" elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>PD23</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <!--  -->
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
  import { getAuth, signOut } from "firebase/auth";
  import { auth } from "./firebase/firebaseinit"; 

  export default {
    created() {
      auth.onAuthStateChanged(async (user) => {
        if (user != null) {
          this.$store.dispatch("authenticate");
        }
      });
    },
    data(){
      return{
        drawer : false,
        items0: [{ title: 'Login', icon: 'mdi-login', path: '/login'} ],
        items1: [
          { title: 'Database', icon: 'mdi-notebook', path: '/database'},
          { title: 'HOTO', icon: 'mdi-account-switch', path: '/hoto'},
          { title: 'Voucher Redemption', icon: 'mdi-wallet-giftcard', path: '/voucher'},
          { title: 'Prize Redemption', icon: 'mdi-controller', path: '/prize'},
          { title: 'Roadshow Giveaway', icon: 'mdi-gift', path: '/roadshowGiveaway'},
          { title: 'Logout', icon: 'mdi-logout', path: ''},
        ],
        items2: [
          { title: 'Database', icon: 'mdi-notebook', path: '/database'},
          { title: 'HOTO', icon: 'mdi-account-switch', path: '/hoto'},
          { title: 'Voucher Redemption', icon: 'mdi-wallet-giftcard', path: '/voucher'},
          { title: 'Prize Redemption', icon: 'mdi-controller', path: '/prize'},
          { title: 'Roadshow Giveaway', icon: 'mdi-gift', path: '/roadshowGiveaway'},
          { title: 'Hourly Drop', icon: 'mdi-timer-sand', path: '/hourlyDrop'},
          { title: 'Tally', icon: 'mdi-tally-mark-5', path: '/tally' },
          { title: 'Logout', icon: 'mdi-logout', path: ''},
        ],
        accessArr: [
          'pd23bigboss@gmail.com',
          'lynette.lim.2022@smu.edu.sg',
          'jkelsie.2021@smu.edu.sg',
          'ziyang.lai.2021@smu.edu.sg',
          'joanne.ng.2021@smu.edu.sg',
          'fangqi.lim.2021@smu.edu.sg',
          'prachikale.2020@smu.edu.sg',
          'shauna.teo.2022@smu.edu.sg',
          'Kelly.Neo.2019@smu.edu.sg',
          'tzelin.loo.2021@smu.edu.sg',
          'wanzhen.lim.2021@smu.edu.sg',
          'michaelong.2021@smu.edu.sg'
        ]
      }
    },
    methods: {
      logout(type) {
        if (type == "Logout") {
          const auth = getAuth();
          signOut(auth).then(() => {
            // Sign-out successful.
            this.$store.dispatch("logout");
          }).catch((error) => {
            // An error happened.
          });
        }
      }
    }
  }
</script>

<style>
  @import 'https://fonts.googleapis.com/css?family=Nunito';
  * {
    font-family: 'Nunito' !important;
  }
</style>