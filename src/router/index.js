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

      var accessArr = [
        'pd23bigboss@gmail.com',
        'lynette.lim.2022@smu.edu.sg',
        'jkelsie.2021@smu.edu.sg',
        'ziyang.lai.2021@smu.edu.sg',
        'joanne.ng.2021@smu.edu.sg',
        'fangqi.lim.2021@smu.edu.sg',
        'prachikale.2020@smu.edu.sg',
        'shauna.teo.2022@smu.edu.sg',
        'kelly.neo.2019@smu.edu.sg',
        'tzelin.loo.2021@smu.edu.sg',
        'wanzhen.lim.2021@smu.edu.sg',
        'michaelong.2021@smu.edu.sg'
      ]

      if (accessArr.includes( (user.email).toLowerCase() )) {
        if (to.name != "Roadshow Giveaway") {
          next();
        }
      } else {
        if (to.name == "HOTO" || to.name == "Voucher" || to.name == "Prize" || to.name == "Database") {
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
