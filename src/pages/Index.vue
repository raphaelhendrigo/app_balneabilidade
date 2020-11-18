<template>
  <!--<q-page class="flex flex-center">-->
  <q-page class="full-height q-pa-xs q-gutter-sm">
    <!--<div class="full-width text-center">-->
    <div class="row items-start">
      <q-select
        v-model="modelCidade"
        label="Selecione Cidade"
        :options="cidades"
        class="full-width"
        @input="carregarPraias"
      />

      <q-select
        v-model="modelPraia"
        label="Selecione Praia"
        :options="praias"
        class="full-width"
        @input="atualizarEstadosAxios()"
      >
      </q-select>
    </div>
    <!--<div class="q-pa-md q-gutter-sm">
        <q-btn
          icon="help"
          color="primary"
          @click="popupCriteriosClassificacao = true"
          flat
        />
        <q-dialog v-model="popupCriteriosClassificacao">
          <q-card style="width: 300px">
            <q-card-section>
              <div class="text-h6">Critérios de Balneabilidade</div>
            </q-card-section>

            <q-card-section class="q-pt-none text-justify">
              Os critérios para classificação da balneabilidade das praias com
              base na quantidade de unidades formadoras de colonia (UFC/100ml)
              de enterococcos são: UFC/100ml acima de 100 em pelo menos 2
              medições dentro de um período de 5 semanas; UFC/100ml acima de 400
              na última medição realizada
            </q-card-section>

            <q-card-actions align="right" class="bg-white text-teal">
              <q-btn flat label="OK" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>-->

    <!--<q-card>-->
    <!--<div class="row q-col-gutter-md q-px-md q-py-md">
          <div class="col-sx-6 col-sx-12 col-sx-6">-->
    <div class="row">
      <q-tabs v-model="nomePanel" class="estilo-tab-panel">
        <q-tab name="grafico" label="Gráfico" />
        <q-tab name="historico" label="Histórico" />
        <q-tab name="previsao" label="Previsão" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="nomePanel" class="full-width">
        <q-tab-panel name="grafico">
          <apex-line :key="renderizarComponente"></apex-line>
        </q-tab-panel>
        <q-tab-panel name="historico">
          <Historico :key="renderizarComponente"></Historico>
        </q-tab-panel>
        <q-tab-panel name="previsao">
          <Previsao :key="renderizarTabelaPrevisao"></Previsao>
        </q-tab-panel>
      </q-tab-panels>
      <!--</q-card>-->
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
import Vue from "vue";
import axios from "axios";
import exemplo from "../store/exemplo";
import ApexLine from "components/AppexLine";
import Historico from "components/historico.vue";
import Previsao from "components/previsao.vue";
import cidadepraias from "../assets/praias_sp.json";
//import grandeUbatuba from "../assets/grande_ubatuba.json";

export default {
  name: "PageIndex",
  computed: {
    cidade: function() {
      return this.$store.getters["exemplo/getCidade"];
    },
    praia: function() {
      return this.$store.getters["exemplo/getPraia"];
    },
    ip_webservice: function() {
      return this.$store.getters["exemplo/getIpWebservice"];
    }
  },
  components: {
    ApexLine,
    Historico,
    Previsao
  },
  data() {
    return {
      popupCriteriosClassificacao: false,
      modelCidade: null,
      modelPraia: null,
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
    this.objcidadepraias = JSON.parse(JSON.stringify(cidadepraias));
    this.cidades = Object.keys(this.objcidadepraias);
    this.modelCidade = this.$store.getters["exemplo/getCidade"];
    this.modelPraia = this.$store.getters["exemplo/getPraia"];
    //this.$store.commit("exemplo/setIpWebservice", "172.23.93.116");
    this.$store.commit("exemplo/setIpWebservice", "127.0.0.1");
    this.carregarPraias(this.modelCidade);
  },
  methods: {
    carregarPraias() {
      this.praias = this.objcidadepraias[this.modelCidade].praias;
    },
    async atualizarEstadosAxios() {
      this.$store.commit("exemplo/setCidade", this.modelCidade);
      this.$store.commit("exemplo/setPraia", this.modelPraia);

      await axios({
        method: "GET",
        url:
          "http://" +
          this.ip_webservice.concat(
            "/resultadosUltimosDoisAnos?cidade=" +
              this.cidade.toUpperCase() +
              "&praia=" +
              this.praia.toUpperCase()
          )
      }).then(
        result => {
          let historico = result.data.map((item, key) => {
            let arr = [];

            arr["dataMedicao"] = item[0];

            /* arr["dataMedicao"] =
              item[0].slice(-2) +
              "/" +
              item[0].slice(5, -3) +
              "/" +
              item[0].slice(0, 4); */
            arr["enterococos"] = item[1];
            arr["id"] = key;
            return arr;
          });

          this.$store.commit("exemplo/setListaHistorico", historico);
        },
        error => {
          console.error(error);
        }
      );

      this.renderizarComponente++;

      /* if (
        this.cidade.toUpperCase() == "UBATUBA" &&
        this.praia.toUpperCase() == "GRANDE"
      ) {
        this.$store.commit("exemplo/setCarregandoPrevisao", true);

        await axios({
          method: "GET",
          url:
            "http://" +
            this.ip_webservice.concat(":5000/previsaoProximasCincoSemanas")
        }).then(
          result => {
            let previsao = result.data.map((item, key) => {
              let arr = [];
              arr["id"] = key;
              arr["dataMedicao"] =
                item[0].slice(-2) +
                "/" +
                item[0].slice(5, -3) +
                "/" +
                item[0].slice(0, 4);
              arr["enterococos"] = parseFloat(item[1]).toFixed(1);
              return arr;
            });
          },
          error => {
            console.error(error);
          }
        );
      } else {
          for (var cont = 0; cont < 5; cont++) {
          if (cont == 0) {
            var conversaoDataMedicao = new Date();
          }

          conversaoDataMedicao.setDate(
            conversaoDataMedicao.getDate() +
              ((0 - conversaoDataMedicao.getDay() + 7) % 7) +
              1
          );

          this.enterococosAleatorios[cont]["id"] = cont;

          this.enterococosAleatorios[cont]["dataMedicao"] =
            ("0" + conversaoDataMedicao.getDate()).slice(-2) +
            "/" +
            ("0" + (conversaoDataMedicao.getMonth() + 1)).slice(-2) +
            "/" +
            conversaoDataMedicao.getFullYear();
          this.enterococosAleatorios[cont]["enterococos"] =
            Math.floor(Math.random() * (500 - 5 + 1)) + 5;
        }

        this.$store.commit(
          "exemplo/setListaPrevisao",
          this.enterococosAleatorios
        ); */

      this.$store.commit("exemplo/setCarregandoPrevisao", true);

      await axios({
        method: "GET",
        url:
          "http://" +
          this.ip_webservice.concat(
            "/previsaoProximasSemanas?cidade=" +
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
            //arr["dataMedicao"] = "16/11/2020";
            arr["enterococos"] = item[1];
            return arr;
          });
          this.$store.commit("exemplo/setListaPrevisao", previsao);
        },
        error => {
          console.error(error);
        }
      );

      this.$store.commit("exemplo/setCarregandoPrevisao", false);

      this.renderizarTabelaPrevisao++;
    }
  }
};
</script>
