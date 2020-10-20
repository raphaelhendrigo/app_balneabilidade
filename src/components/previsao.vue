<template>
  <div class="q-pa-md">
    <q-spinner
      color="primary"
      size="3em"
      v-if="!this.$store.getters['exemplo/getPrevisaoCarregada']"
    />
    <p
      v-if="!this.$store.getters['exemplo/getPrevisaoCarregada']"
      class="text-primary"
    >
      Aguarde por favor... Este processo leva cerca de 20 segundos
    </p>
    <p
      v-if="this.$store.getters['exemplo/getPrevisaoCarregada']"
      class="text-justify"
    >
      Obs: No momento, o modelo preditivo refere-se unicamente à praia "Grande"
      da cidade de "Ubatuba". Demais praias possuem números aleatórios de
      enterococos.
    </p>
    <q-table
      title="Previsão Próximas 5 semanas"
      :data="previsaoProximasCincoSemanas"
      :columns="colunasTabelaPrevisao"
      row-key="id"
      v-if="this.$store.getters['exemplo/getPrevisaoCarregada']"
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
      colunasTabelaPrevisao: [
        {
          name: "dataMedicao",
          required: true,
          label: "Data medição",
          align: "left",
          field: row => row.dataMedicao,
          format: val => `${val}`,
          sortable: false
        },
        {
          name: "enterococos",
          align: "center",
          label: "UFC/100 ml",
          field: "enterococos",
          sortable: false
        }
      ],
      mensagem: "",
      previsaoProximasCincoSemanas: [],
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
