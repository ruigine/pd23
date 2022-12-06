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
    path: "/",
    name: "games",
    component: Games,
  },
  {
    path: "/",
    name: "hoto",
    component: HOTO,
  },
  {
    path: "/",
    name: "login",
    component: Login,
  },
  {
    path: "/",
    name: "redeem",
    component: Redeem,
  },
  {
    path: "/",
    name: "tally",
    component: Tally,
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
