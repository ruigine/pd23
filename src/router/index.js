import Vue from "vue";
import VueRouter from "vue-router";
import Games from "../views/GamesView.vue";
import HOTO from "../views/HOTOView.vue";
import Login from "../views/LoginView.vue";
import Redeem from "../views/RedeemView.vue";
import Tally from "../views/TallyView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/games",
    name: "Games",
    component: Games,
  },
  {
    path: "/hoto",
    name: "HOTO",
    component: HOTO,
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
  },
  {
    path: "/tally",
    name: "Tally",
    component: Tally,
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
