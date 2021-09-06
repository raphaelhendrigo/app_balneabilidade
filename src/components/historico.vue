<template>
  <q-page class="q-pa-xs">
    <q-card
      :style="{ 'background-color': cardMensagem, color: corMensagem }"
      class="text-center"
      >{{ mensagem }}
      <q-btn
        icon="help"
        :color="corMensagem"
        @click="popupLegendaCores = true"
        flat
        padding="none"
        style="margin-top: -2.5px;"
      />
    </q-card>
    <!--<div class="row justify-center">
      <span style="font-weight: bold; margin-right:8px;"
        >Histórico Últimas 5 medições</span
      >
      <q-btn
        icon="help"
        color="primary"
        @click="popupLegendaCores = true"
        flat
        padding="none"
        style="margin-top: -2.5px;"
      />
    </div>-->
    <q-dialog v-model="popupLegendaCores">
      <q-card class="full-width">
        <q-card-section>
          <div class="text-h6 text-center">Legenda das Cores</div>
        </q-card-section>

        <q-card-section class="row text-justify">
          <p>Até 25 UFC/100ml - 4 de 5 medições</p>
          <q-space />
          <div
            class="square text-right"
            style="background-color: #00ffff; height: 1%; border-radius: 50%;"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </q-card-section>

        <q-card-section class="row text-justify">
          <p>Até 50 UFC/100ml - 4 de 5 medições</p>
          <q-space />
          <div
            style="background-color: #0000FF; height: 1%; border-radius: 50%;"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </q-card-section>

        <q-card-section class="row text-justify">
          <p>Até 100 UFC/100ml - 4 de 5 medições</p>
          <q-space />
          <div
            style="background-color: #007C3D; height: 1%; border-radius: 50%;"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </q-card-section>

        <q-card-section class="row text-justify">
          <p>Mais de 100 UFC/100ml - 2/5 medições</p>
          <q-space />
          <div
            style="background-color: #FF0000; height: 1%; border-radius: 50%;"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </q-card-section>

        <q-card-section class="row text-justify">
          <p>Mais de 400 UFC/100ml última medição</p>
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
      :data="historicoCincoSemanas"
      :columns="colunasTabelaHistorico"
      row-key="id"
      :loading="loading"
      :filter="filter"
      @request="onRequest"
      binary-state-sort
      hide-bottom
      style="text-align:center; margin-top:1%;"
    >
      <template v-slot:body="props">
        <q-tr>
          <q-td key="atual" :props="props">
            <div
              class="circulo"
              :style="{
                'background-color': corArray[props.row.id]
              }"
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
  </q-page>
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
      pagination: {
        sortBy: "dataMedicao",
        descending: true,
        page: 1,
        rowsPerPage: 5
        /*rowsNumber: 1*/
      },
      colunasTabelaHistorico: [
        {
          name: "atual",
          required: true,
          align: "left",
          label: "Atual",
          field: "atual",
          field: row => row.atual,
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
          sortable: true,
          style: "width:1%;"
        },
        {
          name: "enterococos",
          align: "center",
          label: "UFC/100 ml",
          field: "enterococos",
          sortable: true
        }
      ],
      original: [],
      historicoCincoSemanas: [],
      mensagem: "SITUAÇÃO ATUAL: ",
      cardMensagem: "",
      corMensagem: "",
      temp: [],
      corArray: [],
      popupLegendaCores: false
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
    lista_historico: function() {
      return this.$store.getters["exemplo/getListaHistorico"];
    }
  },
  mounted() {
    this.onRequest({
      pagination: this.pagination,
      filter: undefined
    });

    if (this.cidade != "" && this.praia != "") {
      this.carregarHistorico(this.cidade, this.praia);
    }
  },
  methods: {
    async carregarHistorico(cidade, praia) {
      // CHAMADA DO AXIOS DENTRO DO PRÓPRIO COMPONENTE

      /* await axios({
        method: "GET",
        url:
          "http://" +
          this.ip_webservice.concat(
            ":5000/resultadosUltimosDoisAnos?cidade=" +
              this.cidade.toUpperCase() +
              "&praia=" +
              this.praia.toUpperCase()
          )
      }).then(
        result => {
          this.original = result.data.map((item, key) => {
            console.log("chave: ", key);
            console.log("item: ", item[0]);
            let arr = [];
            arr["dataMedicao"] = item[0];
            arr["enterococos"] = item[1];
            arr["id"] = key;
            return arr;
          });

          console.log("original", this.original);

          this.historicoCincoSemanas = [];

          for (var i = 1; i <= 5; i++) {
            this.historicoCincoSemanas.push(
              this.original[this.original.length - i]
            );
          }

          let qtd_item_100 = 0;
          let qtd_item_400 = 0;

          for (var i = 0; i < this.historicoCincoSemanas.length; i++) {
            if (this.historicoCincoSemanas[i]["enterococos"] >= 100) {
              qtd_item_100++;
              console.log(qtd_item_100);
            }
            if (this.historicoCincoSemanas[i]["enterococos"] >= 400) {
              qtd_item_400++;
              console.log(qtd_item_400);
            }
          }

          if (qtd_item_100 >= 2 || qtd_item_400 >= 1) {
            this.mensagem = "Situação Atual: IMPRÓPRIA";
            this.cardMensagem = "#FF0000";
          } else {
            this.mensagem = "Situação Atual: BALNEÁVEL";
            this.cardMensagem = "#007C3D";
          }
        },

        error => {
          console.error(error);
        }
      ); */

      /* this.original = [];

      for (i = 0; i < this.historico_ids.length; i++) {
        this.original[i] = [];
        this.original[i]["dataMedicao"] = this.historico_datas[i];
        this.original[i]["enterococos"] = this.historico_enterococos[i];
        this.original[i]["id"] = this.historico_ids[i];
      } */

      this.historicoCincoSemanas = [];

      for (var i = 1; i <= 5; i++) {
        let formatacaoData =
          this.lista_historico[this.lista_historico.length - i][
            "dataMedicao"
          ].slice(8, 10) +
          "/" +
          this.lista_historico[this.lista_historico.length - i][
            "dataMedicao"
          ].slice(5, 7) +
          "/" +
          this.lista_historico[this.lista_historico.length - i][
            "dataMedicao"
          ].slice(0, 4);

        let arrayTemp = [];
        arrayTemp["id"] = this.lista_historico[this.lista_historico.length - i][
          "id"
        ];
        /*arrayTemp["atual"] = this.lista_historico[
          this.lista_historico.length - i
        ]["atual"];*/

        // SEM DATAS FORMATADAS
        //arrayTemp["dataMedicao"] = formatacaoData;

        arrayTemp["dataMedicao"] = formatacaoData;
        arrayTemp["enterococos"] = this.lista_historico[
          this.lista_historico.length - i
        ]["enterococos"];

        //console.log(formatacaoData);

        this.historicoCincoSemanas.push(arrayTemp);
      }

      this.temp[0] = this.lista_historico[this.lista_historico.length - 1];
      this.temp[1] = this.lista_historico[this.lista_historico.length - 2];
      this.temp[2] = this.lista_historico[this.lista_historico.length - 3];
      this.temp[3] = this.lista_historico[this.lista_historico.length - 4];
      this.temp[4] = this.lista_historico[this.lista_historico.length - 5];
      this.temp[5] = this.lista_historico[this.lista_historico.length - 6];
      this.temp[6] = this.lista_historico[this.lista_historico.length - 7];
      this.temp[7] = this.lista_historico[this.lista_historico.length - 8];
      this.temp[8] = this.lista_historico[this.lista_historico.length - 9];
      this.temp[9] = this.lista_historico[this.lista_historico.length - 10];

      //console.log(this.temp);

      for (
        var i = this.lista_historico.length - 1;
        i > this.lista_historico.length - 6;
        i--
      ) {
        //console.log("i", i);
        let qtde_item_max_25 = 0;
        let qtde_item_max_50 = 0;
        let qtde_item_max_100 = 0;
        let qtde_item_min_100 = 0;
        let qtde_item_last_400 = 0;

        for (var cont = i; cont > i - 5; cont--) {
          if (this.lista_historico[cont]["enterococos"] <= 25) {
            qtde_item_max_25++;
            qtde_item_max_50++;
            qtde_item_max_100++;
          }
          if (
            this.lista_historico[cont]["enterococos"] > 25 &&
            this.lista_historico[cont]["enterococos"] <= 50
          ) {
            qtde_item_max_50++;
            qtde_item_max_100++;
          }
          if (
            this.lista_historico[cont]["enterococos"] > 50 &&
            this.lista_historico[cont]["enterococos"] <= 100
          ) {
            qtde_item_max_100++;
          }
          if (this.lista_historico[cont]["enterococos"] > 100) {
            qtde_item_min_100++;
          }
        }

        if (this.lista_historico[i]["enterococos"] > 400) {
          qtde_item_last_400++;
        }

        if (qtde_item_max_25 >= 4) {
          this.lista_historico[i]["atual"] = "#00ffff";
          this.corArray[i] = "#00ffff";
        } else if (qtde_item_max_50 >= 4) {
          this.lista_historico[i]["atual"] = "#0000FF";
          this.corArray[i] = "#0000FF";
        } else if (qtde_item_max_100 >= 4) {
          this.lista_historico[i]["atual"] = "#007C3D";
          this.corArray[i] = "#007C3D";
        }
        if (qtde_item_min_100 >= 2) {
          this.lista_historico[i]["atual"] = "#FF0000";
          this.corArray[i] = "#FF0000";
        }
        if (qtde_item_last_400 >= 1) {
          this.lista_historico[i]["atual"] = "#4B0082";
          this.corArray[i] = "#4B0082";
        }

        //console.log(this.corArray[i]);
      }

      let ultimaPosicao = this.corArray.length - 1;
      this.cardMensagem = this.corArray[ultimaPosicao];

      //console.log(this.corArray[ultimaPosicao]);

      if (this.corArray[ultimaPosicao] == "#00ffff") {
        this.mensagem += "EXCELENTE";
        this.corMensagem = "black";
      } else if (this.corArray[ultimaPosicao] == "#0000FF") {
        this.mensagem += "MUITO BOA";
        this.corMensagem = "white";
      } else if (this.corArray[ultimaPosicao] == "#007C3D") {
        this.mensagem += "SATISFATÓRIA";
        this.corMensagem = "white";
      } else if (this.corArray[ultimaPosicao] == "#FF0000") {
        this.mensagem += "IMPRÓPRIA";
        this.corMensagem = "white";
      } else if (this.corArray[ultimaPosicao] == "#4B0082") {
        this.mensagem += "IMPRÓPRIA";
        this.corMensagem = "white";
      }

      //if(this.corArray[i] == #00ffff)
      /* let qtd_item_100 = 0;
      let qtd_item_400 = 0;

      for (var i = 0; i < this.historicoCincoSemanas.length; i++) {
        if (this.historicoCincoSemanas[i]["enterococos"] > 100) {
          qtd_item_100++;
        }
        if (
          this.historicoCincoSemanas[this.historicoCincoSemanas.length - 1][
            "enterococos"
          ] > 400
        ) {
          qtd_item_400++;
        }
      }

      if (qtd_item_100 >= 2 || qtd_item_400 >= 1) {
        this.mensagem = "Situação Atual: IMPRÓPRIA";
        this.cardMensagem = "#FF0000";
      } else {
        this.mensagem = "Situação Atual: BALNEÁVEL";
        this.cardMensagem = "#007C3D";
      } */
    },
    onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;

      this.loading = true;

      // emulate server
      setTimeout(() => {
        // update rowsCount with appropriate value
        this.pagination.rowsNumber = this.getRowsNumberCount(filter);

        // get all rows if "All" (0) is selected
        const fetchCount =
          rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;

        // calculate starting row of data
        const startRow = (page - 1) * rowsPerPage;

        // fetch data from "server"
        const returnedData = this.fetchFromServer(
          startRow,
          fetchCount,
          filter,
          sortBy,
          descending
        );

        // clear out existing data and add new
        //this.data.splice(0, this.data.length, ...returnedData);

        // don't forget to update local pagination object
        this.pagination.page = page;
        this.pagination.rowsPerPage = rowsPerPage;
        this.pagination.sortBy = sortBy;
        this.pagination.descending = descending;

        // ...and turn of loading indicator
        this.loading = false;
      }, 1500);
    },

    // emulate ajax call
    // SELECT * FROM ... WHERE...LIMIT...
    fetchFromServer(startRow, count, filter, sortBy, descending) {
      const data = filter
        ? this.historicoCincoSemanas.filter(row => row.name.includes(filter))
        : this.historicoCincoSemanas.slice();

      // handle sortBy
      if (sortBy) {
        const sortFn =
          sortBy === "desc"
            ? descending
              ? (a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0)
              : (a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
            : descending
            ? (a, b) => parseFloat(b[sortBy]) - parseFloat(a[sortBy])
            : (a, b) => parseFloat(a[sortBy]) - parseFloat(b[sortBy]);
        data.sort(sortFn);
      }

      return data.slice(startRow, startRow + count);
    },

    // emulate 'SELECT count(*) FROM ...WHERE...'
    getRowsNumberCount(filter) {
      if (!filter) {
        return this.original.length;
      }
      let count = 0;
      this.original.forEach(treat => {
        if (treat.name.includes(filter)) {
          ++count;
        }
      });
      return count;
    }
  }
};
</script>
