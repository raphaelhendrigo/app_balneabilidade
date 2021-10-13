<template>
  <q-page class="full-height q-pa-xs q-gutter-sm">
    <div class="row items-start">
      <q-form
        @submit.stop="montarGrafico"
        @reset="limparCampos"
        class="full-width"
      >
        <q-expansion-item
          group="inicio_fim"
          :label="
            inicio_fim == true
              ? 'Data Inicial e Data Final'
              : 'Clique aqui para definir o período de tempo'
          "
          class="bg-primary full-width"
          style="color:white;"
          v-model="inicio_fim"
        >
          <q-card>
            <q-card-section
              ><q-input
                class="q-pa-xs col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-3"
                v-model="inicio"
                dense
                label="Data Inicial"
                mask="##/##/####"
                :rules="[
                  val =>
                    (val.length == 10 && validaDataInicial == true) ||
                    'Digite uma data válida',
                  val =>
                    data_inicio_maior == false ||
                    'Data inicial não pode ser maior que a data final'
                ]"
                @input="validarData('input', 'inicio')"
                ref="data_inicial"
              >
                <template v-slot:append>
                  <q-icon
                    name="calendar_today"
                    class="cursor-pointer"
                    @click="popupAbrirCalendarioInicial = true"
                  >
                    <q-dialog v-model="popupAbrirCalendarioInicial">
                      <q-date
                        v-model="dataCalendarioInicio"
                        first-day-of-week="1"
                        mask="DD/MM/YYYY"
                        @input="validarData('calendario', 'inicio')"
                      />
                    </q-dialog>
                  </q-icon>
                </template>
              </q-input>
              <q-input
                class="q-pa-xs q-mt-sm col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-3"
                v-model="fim"
                dense
                label="Data Final"
                mask="##/##/####"
                :rules="[
                  val =>
                    (val.length == 10 && validaDataFinal == true) ||
                    'Digite uma data válida'
                ]"
                @input="validarData('input', 'fim')"
              >
                <template v-slot:append>
                  <q-icon
                    name="calendar_today"
                    class="cursor-pointer"
                    @click="popupAbrirCalendarioFinal = true"
                  >
                    <q-dialog v-model="popupAbrirCalendarioFinal">
                      <q-date
                        v-model="dataCalendarioFim"
                        first-day-of-week="1"
                        mask="DD/MM/YYYY"
                        @input="validarData('calendario', 'fim')"
                      />
                    </q-dialog>
                  </q-icon>
                </template> </q-input
            ></q-card-section>
          </q-card>
        </q-expansion-item>
        <q-card flat>
          <q-card-section>
            <q-select
              v-model="modelCidade"
              label="Selecione Cidade"
              :options="cidades"
              @input="carregarPraias"
              :rules="[val => val.length > 0 || 'Selecione uma cidade']"
            />

            <q-select
              v-model="modelPraia"
              label="Selecione Praia"
              :options="praias"
              class="full-width"
              @input="selecionarPraia"
              :rules="[val => val.length > 0 || 'Selecione uma praia']"
            >
            </q-select>
          </q-card-section>
        </q-card>
        <div class="flex flex-center">
          <q-btn
            class="q-mt-sm q-mr-sm"
            color="primary"
            label="Pesquisar"
            @click="montarGrafico"
            type="submit"
          ></q-btn>
          <q-btn
            class="q-mt-sm q-ml-sm"
            color="primary"
            label="Limpar Campos"
            @click="limparCampos"
            type="reset"
          ></q-btn>
        </div>
      </q-form>
    </div>
    <div class="row">
      <q-tabs v-model="nomePanel" class="estilo-tab-panel">
        <q-tab name="grafico" label="Gráfico" />
        <q-tab name="historico" label="Histórico" />
        <q-tab name="previsao" label="Previsão" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="nomePanel" class="full-width">
        <q-tab-panel name="grafico">
          <Grafico :key="renderizarComponente"></Grafico>
        </q-tab-panel>
        <q-tab-panel name="historico">
          <Historico :key="renderizarComponente"></Historico>
        </q-tab-panel>
        <q-tab-panel name="previsao">
          <Previsao :key="renderizarTabelaPrevisao"></Previsao>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>
<style scoped>
.estilo-tab-panel {
  color: #007c3d;
  width: 100%;
}
</style>
<script>
import ApexCharts from "apexcharts";
import VueApexCharts from "vue-apexcharts";
import axios from "axios";
import store_praias from "../store/store_praias";
import Grafico from "components/Grafico.vue";
import Historico from "components/Historico.vue";
import Previsao from "components/Previsao.vue";
import cidadepraias from "../assets/praias_sp.json";
import ipweb from "../assets/ip_webservice.json";
import Vue from "vue";

export default {
  name: "PageIndex",
  computed: {
    cidade: function() {
      return this.$store.getters["store_praias/getCidade"];
    },
    praia: function() {
      return this.$store.getters["store_praias/getPraia"];
    },
    ip_webservice: function() {
      return this.$store.getters["store_praias/getIpWebservice"];
    }
  },
  components: {
    Grafico,
    Historico,
    Previsao
  },
  data() {
    return {
      popupCriteriosClassificacao: false,
      data_inicio_maior: false,
      inicio_fim: true,
      tipo_data: "",
      inicio: "",
      fim: "",
      dataCalendarioInicio: "",
      popupAbrirCalendarioInicial: false,
      dataCalendarioFim: "",
      popupAbrirCalendarioFinal: false,
      validaDataInicial: true,
      validaDataFinal: true,
      modelCidade: "",
      modelPraia: "",
      cidades: [],
      praias: [],
      objcidadepraias: [],
      renderizarComponente: 0,
      renderizarTabelaPrevisao: 0,
      nomePanel: "grafico",
      colors: [
        "linear-gradient( 135deg, #ABDCFF 10%, #0396FF 100%)",
        "linear-gradient( 135deg, #2AFADF 10%, #4C83FF 100%)",
        "linear-gradient( 135deg, #FFD3A5 10%, #FD6585 100%)",
        "linear-gradient( 135deg, #EE9AE5 10%, #5961F9 100%)"
      ],
      enterococosAleatorios: [
        { dataMedicao: "", enterococos: "" },
        { dataMedicao: "", enterococos: "" },
        { dataMedicao: "", enterococos: "" },
        { dataMedicao: "", enterococos: "" },
        { dataMedicao: "", enterococos: "" }
      ]
    };
  },
  mounted() {
    this.renderizarComponente++;
    this.objcidadepraias = JSON.parse(JSON.stringify(cidadepraias));
    this.cidades = Object.keys(this.objcidadepraias);

    this.modelCidade = this.$store.getters["store_praias/getCidade"];
    this.modelPraia = this.$store.getters["store_praias/getPraia"];
    this.$store.commit("store_praias/setIpWebservice", ipweb.ip + ":5000");

    this.inicio = this.atribuirData(730);
    this.dataCalendarioInicio = this.atribuirData(730);
    this.fim = this.atribuirData("atual");
    this.dataCalendarioFim = this.atribuirData("atual");

    if (this.modelCidade != null && this.modelCidade != "") {
      this.carregarPraias(this.modelCidade);
    }
  },
  methods: {
    carregarPraias() {
      this.praias = this.objcidadepraias[this.modelCidade].praias;
      this.modelPraia = "";
      this.$store.commit("store_praias/setPraia", this.modelPraia);
    },
    selecionarPraia() {
      this.$store.commit("store_praias/setPraia", this.modelPraia);
    },
    limparCampos() {
      this.inicio = this.atribuirData(730);
      this.fim = this.atribuirData("atual");
      this.modelCidade = "";
      this.modelPraia = "";
      this.dataCalendarioInicio = this.atribuirData(730);
      this.dataCalendarioFim = this.atribuirData("atual");

      this.$store.commit("store_praias/setCidade", this.modelCidade);
      this.$store.commit("store_praias/setPraia", this.modelPraia);

      this.renderizarComponente++;
      this.renderizarTabelaPrevisao++;
    },
    validarData(param, tipo) {
      this.popupAbrirCalendarioInicial = false;
      this.popupAbrirCalendarioFinal = false;

      let dia = "";
      let mes = "";
      let ano = "";
      let status = true;
      let dataTemp = "";
      if (param == "calendario") {
        if (tipo == "inicio") {
          if (this.dataCalendarioInicio == null) {
            this.dataCalendarioInicio = this.atribuirData(730);
          }
          this.inicio = this.dataCalendarioInicio;
        } else if (tipo == "fim") {
          if (this.dataCalendarioFim == null) {
            this.dataCalendarioFim = this.atribuirData("atual");
          }
          this.fim = this.dataCalendarioFim;
        }
      } else if (param == "input") {
        if (tipo == "inicio") {
          if (this.inicio != "") {
            this.dataCalendarioInicio = this.inicio;
          } else {
            this.dataCalendarioInicio = this.atribuirData(730);
          }
        } else if (tipo == "fim") {
          if (this.fim != "") {
            this.dataCalendarioFim = this.fim;
          } else {
            this.dataCalendarioFim = this.atribuirData("atual");
          }
        }
      }
      if (tipo == "inicio") {
        dataTemp = this.inicio;
      } else if (tipo == "fim") {
        dataTemp = this.fim;
      }
      if (dataTemp.length >= 2) {
        dia = dataTemp.substring(0, 2);
        dia = Number(dia);
        if (dia == 0 || dia > 31) {
          status = false;
        }
        if (dataTemp.length >= 5) {
          mes = dataTemp.substring(3, 5);
          mes = Number(mes);
          if (mes == 0 || mes > 12) {
            status = false;
          }
          if ((dia == 30 || dia == 31) && mes == 2) {
            status = false;
          }
          if (dia == 31 && (mes == 4 || mes == 6 || mes == 9 || mes == 11)) {
            status = false;
          }
        }
        if (dataTemp.length == 10) {
          ano = dataTemp.substring(6, 10);
          ano = Number(ano);
          let bissexto = false;
          if ((ano % 4 == 0 && ano % 100 != 0) || ano % 400 == 0) {
            bissexto = true;
          }
          if (dia == 29 && mes == 2 && bissexto == false) {
            status = false;
          }
          let data_hoje = new Date();
          if (ano > data_hoje.getFullYear()) {
            status = false;
          }
          let data_input = new Date(ano, mes - 1, dia);
          if (data_input > data_hoje) {
            status = false;
          }
        }
      }
      if (tipo == "inicio") {
        this.validaDataInicial = status;
        this.inicio = dataTemp;
      } else if (tipo == "fim") {
        this.validaDataFinal = status;
        this.fim = dataTemp;
      }

      let dia_temp = this.inicio.substring(0, 2);
      let mes_temp = this.inicio.substring(3, 5);
      let ano_temp = this.inicio.substring(6, 10);
      let temp_um =
        ano_temp +
        "-" +
        ("0" + mes_temp).slice(-2) +
        "-" +
        ("0" + dia_temp).slice(-2);
      dia_temp = this.fim.substring(0, 2);
      mes_temp = this.fim.substring(3, 5);
      ano_temp = this.fim.substring(6, 10);
      let temp_dois =
        ano_temp +
        "-" +
        ("0" + mes_temp).slice(-2) +
        "-" +
        ("0" + dia_temp).slice(-2);
      if (this.inicio != "" && this.fim != "" && Boolean(temp_um > temp_dois)) {
        this.data_inicio_maior = true;
        this.$refs.data_inicial.validate();
      } else {
        this.data_inicio_maior = false;
        this.$refs.data_inicial.validate();
      }
    },
    atribuirData(param) {
      if (param == "atual") {
        let temp = new Date();
        let diaTemp = temp.getDate();
        let mesTemp = temp.getMonth();
        let anoTemp = temp.getFullYear();
        return (
          ("0" + diaTemp).slice(-2) +
          "/" +
          ("0" + (mesTemp + 1)).slice(-2) +
          "/" +
          anoTemp
        );
      } else if (param == 730) {
        let temp_atual = new Date();
        let temp = new Date(temp_atual.getTime() - param * 24 * 60 * 60 * 1000);
        let diaTemp = temp.getDate();
        let mesTemp = temp.getMonth();
        let anoTemp = temp.getFullYear();
        return (
          ("0" + diaTemp).slice(-2) +
          "/" +
          ("0" + (mesTemp + 1)).slice(-2) +
          "/" +
          anoTemp
        );
      }
    },
    async montarGrafico() {
      if (
        this.modelCidade != null &&
        this.modelCidade != "" &&
        this.modelPraia != null &&
        this.modelPraia != ""
      ) {
        this.$store.commit("store_praias/setCidade", this.modelCidade);
        this.$store.commit("store_praias/setPraia", this.modelPraia);

        let dia_temp = this.inicio.substring(0, 2);
        let mes_temp = this.inicio.substring(3, 5);
        let ano_temp = this.inicio.substring(6, 10);
        let temp_um =
          ano_temp +
          "-" +
          ("0" + mes_temp).slice(-2) +
          "-" +
          ("0" + dia_temp).slice(-2);
        dia_temp = this.fim.substring(0, 2);
        mes_temp = this.fim.substring(3, 5);
        ano_temp = this.fim.substring(6, 10);
        let temp_dois =
          ano_temp +
          "-" +
          ("0" + mes_temp).slice(-2) +
          "-" +
          ("0" + dia_temp).slice(-2);

        await axios({
          method: "GET",
          url:
            "http://" +
            this.ip_webservice.concat(
              "/montarGrafico?cidade=" +
                this.cidade.toUpperCase() +
                "&praia=" +
                this.praia.toUpperCase() +
                "&inicio=" +
                temp_um +
                "&fim=" +
                temp_dois
            )
        }).then(
          result => {
            let graf = result.data.map((item, key) => {
              let arr = [];
              arr["id"] = key;
              arr["atual"] = "#FFFFFF";
              arr["dataMedicao"] = item[0];
              arr["enterococos"] = item[1];

              return arr;
            });

            this.$store.commit("store_praias/setListaGrafico", graf);
          },
          error => {
            console.error(error);
          }
        );

        this.renderizarComponente++;

        await axios({
          method: "GET",
          url:
            "http://" +
            this.ip_webservice.concat(
              "/historicoMedicoes?cidade=" +
                this.cidade.toUpperCase() +
                "&praia=" +
                this.praia.toUpperCase()
            )
        }).then(
          result => {
            let historico = result.data.map((item, key) => {
              let arr = [];
              arr["id"] = key;
              arr["atual"] = "#FFFFFF";
              arr["dataMedicao"] = item[0];
              arr["enterococos"] = item[1];

              return arr;
            });

            this.$store.commit("store_praias/setListaHistorico", historico);
          },
          error => {
            console.error(error);
          }
        );

        this.$store.commit("store_praias/setCarregandoPrevisao", true);

        await axios({
          method: "GET",
          url:
            "http://" +
            this.ip_webservice.concat(
              "/previsaoProximasMedicoes?cidade=" +
                this.cidade.toUpperCase() +
                "&praia=" +
                this.praia.toUpperCase() +
                "&numPredicoes=5"
            )
        }).then(
          result => {
            let previsao = result.data.map((item, key) => {
              let arr = [];
              arr["id"] = key;
              arr["previsao"] = "#FFFFFF";
              arr["dataMedicao"] =
                item[0].slice(-2) +
                "/" +
                item[0].slice(5, -3) +
                "/" +
                item[0].slice(0, 4);

              arr["enterococos"] = item[1];
              return arr;
            });

            let conv = [];

            conv[0] = previsao[4];
            conv[1] = previsao[3];
            conv[2] = previsao[2];
            conv[3] = previsao[1];
            conv[4] = previsao[0];

            this.$store.commit("store_praias/setListaPrevisao", conv);
          },
          error => {
            console.error(error);
          }
        );

        this.$store.commit("store_praias/setCarregandoPrevisao", false);

        this.renderizarTabelaPrevisao++;
      }
    }
  }
};
</script>
