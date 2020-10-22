<template>
  <div class="q-pa-md">
    <q-card
      :style="{ 'background-color': cardMensagem }"
      style="color:white;"
      >{{ mensagem }}</q-card
    >
    <q-table
      title="Histórico Últimas 5 semanas"
      :data="historicoCincoSemanas"
      :columns="colunasTabelaHistorico"
      row-key="id"
      :loading="loading"
      :filter="filter"
      @request="onRequest"
      binary-state-sort
    >
    </q-table>
  </div>
</template>
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
          name: "dataMedicao",
          required: true,
          label: "Data medição",
          align: "left",
          field: row => row.dataMedicao,
          format: val => `${val}`,
          sortable: true
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
      mensagem: "",
      cardMensagem: ""
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
    /* historico_enterococos: function() {
      return this.$store.getters["exemplo/getHistoricoEnterococos"];
    },
    historico_datas: function() {
      return this.$store.getters["exemplo/getHistoricoDatas"];
    }, */
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
        this.historicoCincoSemanas.push(
          this.lista_historico[this.lista_historico.length - i]
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
