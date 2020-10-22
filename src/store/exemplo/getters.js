/*
export function someGetter (state) {
}
*/

export function getCidade(state) {
   return state.cidade;
}

export function getPraia(state) {
    return state.praia;
}

export function getIpWebservice(state) {
    return state.ip_webservice;
}

export function getListaHistorico(state) {
    return state.lista_historico;
}

export function getListaPrevisao(state) {
    return state.lista_previsao;
}

export function getCarregandoPrevisao(state) {
    return state.carregando_previsao;
}