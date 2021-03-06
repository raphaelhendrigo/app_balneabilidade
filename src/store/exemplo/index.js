import state from "./state";
import * as getters from "./getters";
import * as mutations from "./mutations";
import * as actions from "./actions";
import Vuex from "vuex";

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state

  /* getters: {
    getCidade: state => {
      return state.cidade;
    },
    getPraia: state => {
      return state.praia;
    },
    getIpWebservice: state => {
      return state.ip_webservice;
    },
    getListaHistorico: state => {
      return state.lista_historico;
    },
    getListaPrevisao: state => {
      return state.lista_previsao;
    },
    getPrevisaoCarregada: state => {
      return state.previsao_carregada;
    }, 
  }, */

  /* mutations: {
    /* setCidade(state, param) {
      state.cidade = param;
    },
    setPraia(state, param) {
      state.praia = param;
    },
    setIpWebservice(state, param) {
      state.ip_webservice = param;
    },
    setListaHistorico(state, param) {
      state.lista_historico = param;
    },
    setListaPrevisao(state, param) {
      state.lista_previsao = param;
    },
    setPrevisaoCarregada(state, param) {
      state.previsao_carregada = param;
    }, 
  }, */

  /* actions, */

  /* state: {
    cidade: "",
    praia: "",
    ip_webservice: "",
    previsao_carregada: false,
    historico_enterococos: [],
    historico_datas: [],
    historico_ids: [],
    lista_historico: [],
    lista_previsao: [],
  } */
};
