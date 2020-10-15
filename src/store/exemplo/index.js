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
    getHistoricoEnterococos: state => {
      return state.lista_historico["enterococos"];
    },
    getHistoricoDatas: state => {
      return state.lista_historico["dataMedicao"];
    },
    getHistoricoIds: state => {
      return state.lista_historico["id"];
    },
    getListaHistorico: state => {
      return state.lista_historico;
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
    /* setHistoricoEnterococos(state, param) {
      state.historico_enterococos = param;
    },
    setHistoricoDatas(state, param) {
      state.historico_datas = param;
    },
    setHistoricoIds(state, param) {
      state.historico_ids = param;
    }, */
    setListaHistorico(state, param) {
      state.lista_historico = param;
    },
    setListaPrevisao(state, param) {
      state.lista_previsao = param;
    },
  },
  actions,
  state: {
    cidade: "",
    praia: "",
    ip_webservice: "",
    historico_enterococos: [],
    historico_datas: [],
    historico_ids: [],
    lista_historico: [],
    lista_previsao: [],
  }
};
