import state from "./state";
import * as getters from "./getters";
import * as mutations from "./mutations";
import * as actions from "./actions";
import Vuex from "vuex";

export default {
  namespaced: true,
  getters: {
    getCidade: state => {
      return state.cidade;
    },
    getPraia: state => {
      return state.praia;
    }
  },
  mutations: {
    setCidade(state, param) {
      state.cidade = param;
    },
    setPraia(state, param) {
      state.praia = param;
    }
  },
  actions,
  state: {
    cidade: "",
    praia: ""
  }
};
