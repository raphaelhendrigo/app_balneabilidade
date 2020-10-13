<template>
  <div class="q-pa-md">
    <q-card
      :style="{ 'background-color': cardMensagem }"
      style="color:white;"
      >{{ mensagem }}</q-card
    >
    <br />
    <q-tabs
      v-model="tab"
      dense
      color="primary"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="historico" label="Histórico" />
      <q-tab name="previsao" label="Previsão" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab">
      <q-tab-panel name="historico">
        <q-table
          title="Histórico Últimas 5 semanas"
          :data="data"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :filter="filter"
          @request="onRequest"
          binary-state-sort
        >
          <!--<q-table
          title="Histórico Últimas 5 semanas"
          :data="data"
          :columns="columns"
          row-key="id"
          :pagination.sync="pagination"
          :loading="loading"
          :filter="filter"
          @request="onRequest"
          binary-state-sort
        >
          <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>-->
        </q-table>
      </q-tab-panel>
      <q-tab-panel name="previsao">
        <p>
          Previsão referente somente à praia "Grande" da cidade de "Ubatuba"
        </p>
        <q-table
          title="Previsão Próximas 5 semanas"
          :data="previsaoProximasCincoSemanas"
          :columns="columnsDois"
          row-key="id"
          :loading="loading"
          :filter="filter"
          @request="onRequest"
          binary-state-sort
        >
        </q-table>
      </q-tab-panel>
    </q-tab-panels>
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
      columns: [
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
      columnsDois: [
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
      data: [],
      original: [],
      ultimosCinco: [],
      mensagem: "",
      previsaoProximasCincoSemanas: [],
      cardMensagem: "",
      tab: "previsao"
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
    }
  },
  async mounted() {
    this.onRequest({
      pagination: this.pagination,
      filter: undefined
    });

    if (this.cidade != "" && this.praia != "") {
      await this.carregaDados(this.cidade, this.praia);
      await this.retornaPrevisaoProximasCincoSemanas();
    }
  },
  methods: {
    async carregaDados(cidade, praia) {
      await axios({
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
            //console.log("chave: ", key);
            //console.log("item: ", item[0]);
            let arr = [];
            arr["dataMedicao"] = item[0];
            arr["enterococos"] = item[1];
            arr["id"] = key;
            return arr;
          });

          //console.log("original", this.original);

          this.ultimosCinco = [];

          for (var i = 1; i <= 5; i++) {
            this.ultimosCinco.push(this.original[this.original.length - i]);
          }

          let qtd_item_100 = 0;
          let qtd_item_400 = 0;

          //console.log(ultimosCinco.length);

          for (var i = 0; i < this.ultimosCinco.length; i++) {
            if (this.ultimosCinco[i]["enterococos"] >= 100) {
              qtd_item_100++;
              console.log(qtd_item_100);
            }
            if (this.ultimosCinco[i]["enterococos"] >= 400) {
              qtd_item_400++;
              console.log(qtd_item_400);
            }
            //console.log(ultimosCinco[i]["enterococos"]);
          }

          if (qtd_item_100 >= 2 || qtd_item_400 >= 1) {
            this.mensagem = "Situação Atual: IMPRÓPRIA";
            this.cardMensagem = "#FF0000";
          } else {
            this.mensagem = "Situação Atual: BALNEÁVEL";
            this.cardMensagem = "#007C3D";
          }

          //console.log("Valores", this.ultimosCinco);
        },

        error => {
          console.error(error);
        }
      );
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
        this.data.splice(0, this.data.length, ...returnedData);

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
        ? this.ultimosCinco.filter(row => row.name.includes(filter))
        : this.ultimosCinco.slice();

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
    },
    async retornaPrevisaoProximasCincoSemanas() {
      await axios({
        method: "GET",
        url:
          "http://" +
          this.ip_webservice.concat(":5000/previsaoProximasCincoSemanas")
      }).then(
        result => {
          /* this.previsaoProximasCincoSemanas = result.data.map(item => {
            let arr = [];
            arr["dataMedicao"] = item[0];
            arr["enterococos"] = item[1];
            arr["id"] = key;
            return arr;
            //return item;
          }); */

          this.previsaoProximasCincoSemanas = result.data.map((item, key) => {
            let arr = [];
            arr["dataMedicao"] = item[0];
            arr["enterococos"] = item[1];
            arr["id"] = key;
            return arr;
          });
        },
        error => {
          console.error(error);
        }
      );
    }
  }
};
</script>
