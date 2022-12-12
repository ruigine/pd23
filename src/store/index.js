import Vue from "vue";
import Vuex from "vuex";
import router from "../router"
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebaseinit";

Vue.use(Vuex);

Vue.use(Vuex);

export default new Vuex.Store({
  // global state
  state: {
    user: null,
  },
  getters: {},
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    CLEAR_USER(state) {
      state.user = null;
    },
  },
  actions: {
    // actions to commit mutations to push to state
    async authenticate({ commit }, payload) {
      // const { email, password } = details;
      if ((auth.currentUser.email).endsWith("smu.edu.sg") || auth.currentUser.email == "pd23bigboss@gmail.com") {
        commit("SET_USER", auth.currentUser);
        console.log(auth.currentUser);
      } else {
        await signOut(auth);

        commit("CLEAR_USER");
        router.push("/login");
      }
    },

    async logout({ commit }) {
      await signOut(auth);

      commit("CLEAR_USER");
      router.push("/login");
    },

    fetchUser({ commit }) {
      auth.onAuthStateChanged(async (user) => {
        if (user === null) {
          // logging out user
          commit("CLEAR_USER");
        } else {
          commit("SET_USER", user);
        }
      });
    },
  },
});
