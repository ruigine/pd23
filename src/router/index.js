import Vue from "vue";
import VueRouter from "vue-router";
import Games from "../views/GamesView.vue";
import HOTO from "../views/HOTOView.vue";
import Login from "../views/LoginView.vue";
import Redeem from "../views/RedeemView.vue";
import Tally from "../views/TallyView.vue";

import { auth } from "../firebase/firebaseinit";

Vue.use(VueRouter);

function guardMyroute(to, from, next) {
  auth.onAuthStateChanged(async (user) => {
    if (user === null) {
      // logging out user
      next("/login");
    } else {
      console.log(user)
      if (user.email == 'pd23bigboss@gmail.com') {
        next();
      } else {
        if (to.name == "HOTO" || to.name == "Redeem" || to.name == "Games") {
          next();
        }
      }      
    }
  });
  // var isAuthenticated = auth.currentUser;

  // if (isAuthenticated) {
  //   next(); // allow to enter route
  // } else {
  //   next("/login"); // go to '/login';
  // }
}

const routes = [
  {
    path: "/games",
    name: "Games",
    component: Games,
    beforeEnter: guardMyroute,
  },
  {
    path: "/hoto",
    name: "HOTO",
    component: HOTO,
    beforeEnter: guardMyroute,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/redeem",
    name: "Redeem",
    component: Redeem,
    beforeEnter: guardMyroute,
  },
  {
    path: "/tally",
    name: "Tally",
    component: Tally,
    beforeEnter: guardMyroute,
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
