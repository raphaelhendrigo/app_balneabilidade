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
    },
    getIpWebservice: state => {
      return state.ip_webservice;
    },
    getListaPrevisao: state => {
      return state.lista_previsao;
    },
  },
  mutations: {
    setCidade(state, param) {
      state.cidade = param;
    },
    setPraia(state, param) {
      state.praia = param;
    },
    setIpWebservice(state, param) {
      state.ip_webservice = param;
    },
    setListaPrevisao(state, param) {
      return state.lista_previsao;
    },
  },
  actions,
  state: {
    cidade: "",
    praia: "",
    ip_webservice: "",
    lista_previsao: []
  }
};
