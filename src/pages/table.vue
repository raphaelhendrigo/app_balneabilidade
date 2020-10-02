<template>
  <div class="q-pa-md">
    <q-table
      title="Praia"
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
      </template>
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
      columns: [
        {
          name: "dataMedicao",
          required: true,
          label: "Data da medição",
          align: "left",
          field: row => row.dataMedicao,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "enterococos",
          align: "center",
          label: "UFC de Enterococos por 100 ml",
          field: "enterococos",
          sortable: true
        }
      ],
      data: [],
      original: []
    };
  },
  mounted() {
    // get initial data from server (1st page)

    this.onRequest({
      pagination: this.pagination,
      filter: undefined
    });
    this.carregaDados("UBATUBA", "GRANDE");
  },
  methods: {
    async carregaDados(cidade, praia) {
      await axios({
        method: "GET",
        url:
          "http://172.23.93.116:5000/todosResultados?cidade=" +
          cidade.toUpperCase() +
          "&praia=" +
          praia.toUpperCase() +
          ""
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

          //**for ([(iMedicao = 1)]; [iMedicao <= 5]; [iMedicao++])

          console.log("original", this.original);
          let ultimoRegistro = this.original[this.original.length - 1];
          let ultimaMedicao = ultimoRegistro["enterococos"];
          let penultimoRegistro = this.original[this.original.length - 2];
          let penultimaMedicao = penultimoRegistro["enterococos"];
          let antepenultimoRegistro = this.original[this.original.length - 3];
          let antepenultimaMedicao = antepenultimoRegistro["enterococos"];
          let quartoRegistro = this.original[this.original.length - 4];
          let quartoMedicao = quartoRegistro["enterococos"];
          let quintoRegistro = this.original[this.original.length - 5];
          let quintoMedicao = quintoRegistro["enterococos"];

          console.log(ultimaMedicao);
          if (ultimaMedicao >= 400) {
            console.log("MUITO COCÔ");
          } else {
            console.log("BALNEÁVEL");
          }

          console.log(penultimaMedicao);
          if (penultimaMedicao >= 100) {
            console.log("MUITO COCÔ");
          } else {
            console.log("BALNEÁVEL");
          }

          console.log(antepenultimaMedicao);
          if (antepenultimaMedicao >= 100) {
            console.log("MUITO COCÔ");
          } else {
            console.log("BALNEÁVEL");
          }

          console.log(quartoMedicao);
          if (quartoMedicao >= 100) {
            console.log("MUITO COCÔ");
          } else {
            console.log("BALNEÁVEL");
          }

          console.log(quintoMedicao);
          if (quintoMedicao >= 100) {
            console.log("MUITO COCÔ");
          } else {
            console.log("BALNEÁVEL");
          }
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
        ? this.original.filter(row => row.name.includes(filter))
        : this.original.slice();

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
