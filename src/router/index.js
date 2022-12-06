import Vue from "vue";
import VueRouter from "vue-router";
import Games from "../views/Games.vue";
import HOTO from "../views/HOTO.vue";
import Login from "../views/Login.vue";
import Redeem from "../views/Redeem.vue";
import Tally from "../views/Tally.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Games",
    component: Games,
  },
  {
    path: "/",
    name: "HOTO",
    component: HOTO,
  },
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    name: "Redeem",
    component: Redeem,
  },
  {
    path: "/",
    name: "Tally",
    component: Tally,
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
