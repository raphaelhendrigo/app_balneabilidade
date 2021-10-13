<template>
  <div class="q-pa-xs">
    <div class="text-center">
      <q-spinner
        color="primary"
        size="3em"
        v-if="this.$store.getters['store_praias/getCarregandoPrevisao']"
      />
      <p
        v-if="this.$store.getters['store_praias/getCarregandoPrevisao']"
        class="text-primary"
      >
        Aguarde por favor... Este processo pode levar até 40 segundos
      </p>
    </div>
    <div
      class="row justify-center"
      v-if="!this.$store.getters['store_praias/getCarregandoPrevisao']"
    >
      <span style="font-weight: bold; margin-right:8px;"
        >Previsão Próximas 5 medições</span
      >
      <q-btn
        icon="help"
        color="primary"
        @click="popupLegendaCores = true"
        flat
        padding="none"
        style="margin-top: -2.5px;"
      />
    </div>
    <q-dialog v-model="popupLegendaCores">
      <q-card class="full-width">
        <q-card-section>
          <div class="text-h6 text-center">Legenda das Cores</div>
        </q-card-section>

        <q-card-section class="row text-justify">
          <p>Até 25 UFC/100ml em 4 de 5 semanas</p>
          <q-space />
          <div
            class="square text-right"
            style="background-color: #00ffff; height: 1%; border-radius: 50%;"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </q-card-section>

        <q-card-section class="row text-justify">
          <p>Até 50 UFC/100ml em 4 de 5 semanas</p>
          <q-space />
          <div
            style="background-color: #0000FF; height: 1%; border-radius: 50%;"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </q-card-section>

        <q-card-section class="row text-justify">
          <p>Até 100 UFC/100ml em 4 de 5 semanas</p>
          <q-space />
          <div
            style="background-color: #007C3D; height: 1%; border-radius: 50%;"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </q-card-section>

        <q-card-section class="row text-justify">
          <p>Mais de 100 UFC/100ml - 2/5 semanas</p>
          <q-space />
          <div
            style="background-color: #FF0000; height: 1%; border-radius: 50%;"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </q-card-section>

        <q-card-section class="row text-justify">
          <p>Mais de 400 UFC/100ml última semana</p>
          <q-space />
          <div
            style="background-color: #4B0082; height: 1%; border-radius: 50%;"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-table
      :data="previsaoProximasCincoSemanas"
      :columns="colunasTabelaPrevisao"
      row-key="id"
      hide-bottom
      v-if="!this.$store.getters['store_praias/getCarregandoPrevisao']"
      style="margin-top:1%;"
    >
      <template v-slot:body="props">
        <q-tr>
          <q-td key="previsao" :props="props">
            <div
              class="circulo"
              :style="{ 'background-color': corArray[props.row.id] }"
            ></div>
          </q-td>
          <q-td key="dataMedicao" :props="props">
            {{ props.row.dataMedicao }}
          </q-td>
          <q-td key="enterococos" :props="props">
            {{ props.row.enterococos }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<style>
.circulo {
  border-radius: 50%;
  height: 20px;
  width: 20px;
  margin-left: 20%;
  margin-right: 20%;
}
</style>
<script>
import axios from "axios";
export default {
  data() {
    return {
      filter: "",
      loading: false,
      popupLegendaCores: false,
      colunasTabelaPrevisao: [
        {
          name: "previsao",
          required: true,
          label: "Previsão",
          align: "left",
          field: row => row.previsao,
          format: val => `${val}`,
          sortable: false,
          style: "width:2%;"
        },
        {
          name: "dataMedicao",
          required: true,
          label: "Data Medição",
          align: "left",
          field: row => row.dataMedicao,
          format: val => `${val}`,
          sortable: false,
          style: "color:black;"
        },
        {
          name: "enterococos",
          align: "center",
          label: "UFC/100 ml",
          field: "enterococos",
          sortable: false,
          style: "color:black;"
        }
      ],
      //mensagem: "",
      previsaoProximasCincoSemanas: [],
      //cardMensagem: "",
      balneabilidadePrevisao: [],
      corArray: [],
      temp: []
    };
  },
  computed: {
    cidade: function() {
      return this.$store.getters["store_praias/getCidade"];
    },
    praia: function() {
      return this.$store.getters["store_praias/getPraia"];
    },
    ip_webservice: function() {
      return this.$store.getters["store_praias/getIpWebservice"];
    },
    historico: function() {
      return this.$store.getters["store_praias/getListaHistorico"];
    }
  },
  async mounted() {
    if (this.cidade != "" && this.praia != "") {
      await this.retornaPrevisaoProximasCincoSemanas();
    }
  },
  methods: {
    async retornaPrevisaoProximasCincoSemanas() {
      this.previsaoProximasCincoSemanas = this.$store.getters[
        "store_praias/getListaPrevisao"
      ];

      this.temp[0] = this.previsaoProximasCincoSemanas[0];
      this.temp[1] = this.previsaoProximasCincoSemanas[1];
      this.temp[2] = this.previsaoProximasCincoSemanas[2];
      this.temp[3] = this.previsaoProximasCincoSemanas[3];
      this.temp[4] = this.previsaoProximasCincoSemanas[4];
      this.temp[5] = this.historico[this.historico.length - 4];
      this.temp[6] = this.historico[this.historico.length - 3];
      this.temp[7] = this.historico[this.historico.length - 2];
      this.temp[8] = this.historico[this.historico.length - 1];

      for (var i = 0; i < 5; i++) {
        let qtde_item_max_25 = 0;
        let qtde_item_max_50 = 0;
        let qtde_item_max_100 = 0;
        let qtde_item_min_100 = 0;
        let qtde_item_last_400 = 0;

        for (var cont = i; cont < i + 5; cont++) {
          if (this.temp[cont]["enterococos"] <= 25) {
            qtde_item_max_25++;
            qtde_item_max_50++;
            qtde_item_max_100++;
          }
          if (
            this.temp[cont]["enterococos"] > 25 &&
            this.temp[cont]["enterococos"] <= 50
          ) {
            qtde_item_max_50++;
            qtde_item_max_100++;
          }
          if (
            this.temp[cont]["enterococos"] > 50 &&
            this.temp[cont]["enterococos"] <= 100
          ) {
            qtde_item_max_100++;
          }
          if (this.temp[cont]["enterococos"] > 100) {
            qtde_item_min_100++;
          }
        }

        if (this.temp[i]["enterococos"] > 400) {
          qtde_item_last_400++;
        }

        if (qtde_item_max_25 >= 4) {
          this.corArray[i] = "#00ffff";
        } else if (qtde_item_max_50 >= 4) {
          this.corArray[i] = "#0000FF";
        } else if (qtde_item_max_100 >= 4) {
          this.corArray[i] = "#007C3D";
        }
        if (qtde_item_min_100 >= 2) {
          this.corArray[i] = "#FF0000";
        }
        if (qtde_item_last_400 >= 1) {
          this.corArray[i] = "#4B0082";
        }
      }

      let ordenacaoPrevisoes = [];
      ordenacaoPrevisoes = this.previsaoProximasCincoSemanas;

      let novaOrdenacao = [];

      novaOrdenacao[0] = ordenacaoPrevisoes[4];
      novaOrdenacao[1] = ordenacaoPrevisoes[3];
      novaOrdenacao[2] = ordenacaoPrevisoes[2];
      novaOrdenacao[3] = ordenacaoPrevisoes[1];
      novaOrdenacao[4] = ordenacaoPrevisoes[0];

      this.previsaoProximasCincoSemanas = novaOrdenacao;
    }
  }
};
</script>
