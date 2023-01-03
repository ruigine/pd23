import Vue from "vue";
import VueRouter from "vue-router";
import Prize from "../views/PrizeView.vue";
import HOTO from "../views/HOTOView.vue";
import RoadshowGiveaway from "../views/RoadshowGiveawayView.vue";
import Login from "../views/LoginView.vue";
import Voucher from "../views/VoucherView.vue";
import Tally from "../views/TallyView.vue";
import Database from "../views/DatabaseView.vue";

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
        if (to.name == "HOTO" || to.name == "Roadshow Giveaway" || to.name == "Voucher" || to.name == "Prize" || to.name == "Database") {
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
    path: "/prize",
    name: "Prize",
    component: Prize,
    beforeEnter: guardMyroute,
  },
  {
    path: "/hoto",
    name: "HOTO",
    component: HOTO,
    beforeEnter: guardMyroute,
  },
  {
    path: "/roadshowGiveaway",
    name: "Roadshow Giveaway",
    component: RoadshowGiveaway,
    beforeEnter: guardMyroute,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/voucher",
    name: "Voucher",
    component: Voucher,
    beforeEnter: guardMyroute,
  },
  {
    path: "/tally",
    name: "Tally",
    component: Tally,
    beforeEnter: guardMyroute,
  },
  {
    path: "/database",
    name: "Database",
    component: Database,
    beforeEnter: guardMyroute,
  }
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
