<template>
  <div class="q-pa-xs">
    <div class="text-center">
      <q-spinner
        color="primary"
        size="3em"
        v-if="this.$store.getters['exemplo/getCarregandoPrevisao']"
      />
      <p
        v-if="this.$store.getters['exemplo/getCarregandoPrevisao']"
        class="text-primary"
      >
        Aguarde por favor... Este processo pode levar até 15 segundos
      </p>
    </div>
    <!--<p
      v-if="!this.$store.getters['exemplo/getCarregandoPrevisao']"
      class="text-justify"
    >
      No momento, o modelo preditivo refere-se unicamente à praia "Grande" da
      cidade de "Ubatuba". Demais praias possuem números aleatórios de
      enterococos.
    </p>-->
    <div
      class="row justify-center"
      v-if="!this.$store.getters['exemplo/getCarregandoPrevisao']"
      style="margin-top:-2%;"
    >
      <span style="font-weight: bold; margin-right:8px;"
        >Previsão Próximas 5 semanas</span
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
      v-if="!this.$store.getters['exemplo/getCarregandoPrevisao']"
      style="margin-top:1%;"
    >
      <template v-slot:body="props">
        <q-tr>
          <q-td key="atual" :props="props">
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
          field: row => row.atual,
          format: val => `${val}`,
          sortable: false,
          style: "width:2%;"
        },
        {
          name: "dataMedicao",
          required: true,
          label: "Data medição",
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
      return this.$store.getters["exemplo/getCidade"];
    },
    praia: function() {
      return this.$store.getters["exemplo/getPraia"];
    },
    ip_webservice: function() {
      return this.$store.getters["exemplo/getIpWebservice"];
    },
    historico: function() {
      return this.$store.getters["exemplo/getListaHistorico"];
    }
  },
  async mounted() {
    if (this.cidade != "" && this.praia != "") {
      await this.retornaPrevisaoProximasCincoSemanas();
    }
  },
  methods: {
    async retornaPrevisaoProximasCincoSemanas() {
      /* while (this.$store.getters["exemplo/getPrevisaoCarregada"] == false) {
        this.teste = true;
      }

      this.teste = false; */

      this.previsaoProximasCincoSemanas = this.$store.getters[
        "exemplo/getListaPrevisao"
      ];

      //this.balneabilidadePrevisao = [];

      /* for (var cont = 1; cont <= 5; cont++) {
        this.balneabilidadePrevisao.push(
          this.historico[this.historico.length - cont]
        );
      } */

      this.temp[0] = this.historico[this.historico.length - 4];
      this.temp[1] = this.historico[this.historico.length - 3];
      this.temp[2] = this.historico[this.historico.length - 2];
      this.temp[3] = this.historico[this.historico.length - 1];
      this.temp[4] = this.previsaoProximasCincoSemanas[0];
      this.temp[5] = this.previsaoProximasCincoSemanas[1];
      this.temp[6] = this.previsaoProximasCincoSemanas[2];
      this.temp[7] = this.previsaoProximasCincoSemanas[3];
      this.temp[8] = this.previsaoProximasCincoSemanas[4];

      console.log(this.temp);

      console.log(this.previsaoProximasCincoSemanas);

      for (var i = 0; i < 5; i++) {
        let qtde_item_max_25 = 0;
        let qtde_item_max_50 = 0;
        let qtde_item_max_100 = 0;
        let qtde_item_min_100 = 0;
        let qtde_item_last_400 = 0;

        console.log("i", i);

        for (var cont = i; cont < i + 5; cont++) {
          if (this.temp[cont]["enterococos"] < 25) {
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
          if (
            this.temp[cont]["enterococos"] > 100 &&
            this.temp[cont]["enterococos"] <= 400
          ) {
            qtde_item_min_100++;
          }
          if (this.temp[4]["enterococos"] > 400) {
            qtde_item_last_400++;
          }
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

        console.log(this.corArray[i]);
      }

      /* for (var i = 0; i < this.previsaoProximasCincoSemanas.length; i++) {
        let qtd_item_max_25 = 0;
        let qtd_item_max_50 = 0;
        let qtd_item_max_100 = 0;
        let qtd_item_min_100 = 0;
        let qtd_item_last_400 = 0;

        console.log(this.previsaoProximasCincoSemanas[i]);

        if (this.previsaoProximasCincoSemanas[i]["enterococos"] <= 25) {
          qtd_item_max_25++;
        }
        if (
          this.previsaoProximasCincoSemanas[i]["enterococos"] > 25 &&
          this.previsaoProximasCincoSemanas[i]["enterococos"] <= 50
        ) {
          qtd_item_max_50++;
        }
        if (
          this.previsaoProximasCincoSemanas[i]["enterococos"] > 50 &&
          this.previsaoProximasCincoSemanas[i]["enterococos"] <= 100
        ) {
          qtd_item_max_100++;
        }
        if (
          this.previsaoProximasCincoSemanas[i]["enterococos"] > 100 &&
          this.previsaoProximasCincoSemanas[i]["enterococos"] <= 400
        ) {
          qtd_item_min_100++;
        }

        if (this.previsaoProximasCincoSemanas[4]["enterococos"] > 400) {
          qtd_item_last_400++;
        }

        for (
          var cont = this.historico.length - 1;
          cont > this.historico.length - 1 - i;
          cont--
        )
          console.log(this.historico[cont]);
        {
          if (this.historico[cont]["enterococos"] <= 25) {
            qtd_item_max_25++;
          } else if (
            this.historico[cont]["enterococos"] > 25 &&
            this.historico[cont]["enterococos"] <= 50
          ) {
            qtd_item_max_50++;
          } else if (
            this.historico[cont]["enterococos"] > 50 &&
            this.historico[cont]["enterococos"] <= 100
          ) {
            qtd_item_max_100++;
          }
          if (
            this.historico[cont]["enterococos"] > 100 &&
            this.historico[cont]["enterococos"] < 400
          ) {
            qtd_item_min_100++;
          }
          if (this.previsaoProximasCincoSemanas[4]["enterococos"] > 400) {
            qtd_item_last_400++;
          }
        }

        if (qtd_item_max_25 >= 4) {
          this.corArray[i] = "#0000FF";
          this.corTabela = "#0000FF";
          this.colunasTabelaPrevisao[0].style = "color:white;";
          this.colunasTabelaPrevisao[1].style = "color:white;";
        }
        if (qtd_item_max_50 >= 4) {
          this.corArray[i] = "#FFFF00";
          this.corTabela = "#FFFF00";
          this.colunasTabelaPrevisao[0].style = "color:black;";
          this.colunasTabelaPrevisao[1].style = "color:black;";
        }
        if (qtd_item_max_100 >= 4) {
          this.corArray[i] = "#007C3D";
          this.corTabela = "#007C3D";
          this.colunasTabelaPrevisao[0].style = "color:white;";
          this.colunasTabelaPrevisao[1].style = "color:white;";
        }
        if (qtd_item_min_100 >= 2) {
          this.corArray[i] = "#FF0000";
          this.corTabela = "#FF0000";
          this.colunasTabelaPrevisao[0].style = "color:white;";
          this.colunasTabelaPrevisao[1].style = "color:white;";
        } else if (qtd_item_last_400 >= 1) {
          this.corArray[i] = "#4B0082";
          this.corTabela = "#4B0082";
          this.colunasTabelaPrevisao[0].style = "color:white;";
          this.colunasTabelaPrevisao[1].style = "color:white;";
        }

        console.log("a", qtd_item_max_25);
        console.log("b", qtd_item_max_50);
        console.log("c", qtd_item_max_100);
        console.log("d", qtd_item_min_100);
        console.log("e", qtd_item_last_400);

        console.log(this.corArray[i]);
      } */

      /* if (
        this.previsaoProximasCincoSemanas[
          this.previsaoProximasCincoSemanas.length - 1
        ]["enterococos"] > 400
      ) {
        qtd_item_last_400++;
        console.log("last 100 ", qtd_item_last_400);
      } */

      /* this.colunasTabelaPrevisao[0].style +=
        "background-color:" + this.corArray[props.row.id] + "";
      this.colunasTabelaPrevisao[1].style +=
        "background-color:" + this.corArray[props.row.id] + "";
      this.colunasTabelaPrevisao[2].style +=
        "background-color:" + this.corArray[props.row.id] + ""; */

      //console.log(this.corTabela);

      //console.log(this.colunasTabelaPrevisao);

      // CHAMADA DO AXIOS DENTRO DO PRÓPRIO COMPONENTE

      /* await axios({
        method: "GET",
        url:
          "http://" +
          this.ip_webservice.concat(":5000/previsaoProximasCincoSemanas")
      }).then(
        result => {
          this.previsaoProximasCincoSemanas = result.data.map((item, key) => {
            let arr = [];
            arr["dataMedicao"] = item[0];
            arr["enterococos"] = parseFloat(item[1]).toFixed(2);
            //arr["enterococos"] = item[1];
            arr["id"] = key;
            return arr;
          });
        },
        error => {
          console.error(error);
        }
      ); */
    }
  }
};
</script>
