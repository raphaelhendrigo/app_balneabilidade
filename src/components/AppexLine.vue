<template>
  <apexchart
    ref="nomeDoGrafico"
    type="line"
    height="200"
    :options="chartOptions"
    :series="series"
  />
</template>

<script>
import { date } from "quasar";
import grandeUbatuba from "../assets/grande_ubatuba.json";
import axios from "axios";
import { mapState, mapGetters } from "vuex";

export default {
  name: "ApexLine",
  data() {
    return {
      enterococos: [],
      graficoDatas: [],
      graficoEnterococcos: [],
      teste: "teste",
      series: [
        {
          name: "Enterococcos",
          data: []
        }
      ],
      chartOptions: {
        chart: {
          height: 500,
          type: "line"
        },
        grid: {
          show: true,
          strokeDashArray: 0,
          xaxis: {
            lines: {
              show: true
            }
          }
        },
        stroke: {
          curve: "smooth"
        },
        dropShadow: {
          enabled: true,
          opacity: 0.3,
          blur: 5,
          left: -7,
          top: 22
        },
        dataLabels: {
          enabled: false
        },
        title: {
          text: "UFC de Enterococos por 100 ml de água",
          align: "center"
        },
        xaxis: {
          categories: [],
          labels: {}
        },
        yaxis: {
          labels: {}
        }
      }
    };
  },
  computed: {
    cidade: function() {
      return this.$store.getters["exemplo/getCidade"];
    },
    praia: function() {
      return this.$store.getters["exemplo/getPraia"];
    }
  },

  async mounted() {
    if (this.cidade != "" && this.praia != "") {
      await this.montarGrafico();
    }
  },
  methods: {
    async montarGrafico() {
      await axios({
        method: "GET",
        url:
          "http://172.23.93.116:5000/todosResultados?cidade=" +
          this.cidade.toUpperCase() +
          "&praia=" +
          this.praia.toUpperCase() +
          ""
      }).then(
        result => {
          this.graficoDatas = result.data.map(item => {
            return item[0];
          });

          this.graficoEnterococcos = result.data.map(item => {
            return item[1];
          });
        },
        error => {
          console.error(error);
        }
      );

      this.chartOptions = {
        chart: {
          height: 400,
          width: 1400,
          type: "line"
        },
        responsive: [
          {
            breakpoint: 1000,
            options: {}
          }
        ],
        grid: {
          show: true,
          strokeDashArray: 0,
          xaxis: {
            lines: {
              show: true
            }
          }
        },
        stroke: {
          curve: "smooth",
          width: 1
        },
        dropShadow: {
          enabled: true,
          opacity: 0.3,
          blur: 5,
          left: -7,
          top: 22
        },
        dataLabels: {
          enabled: false
        },

        annotations: {
          yaxis: [
            {
              y: 100,
              y2: null,
              borderColor: "#FF0000",
              borderWidth: 2,

              label: {
                borderColor: "#00E396",

                text: "Limite inferior 100 UFC por 100 ml"
              }
            },
            {
              y: 400,
              y2: null,
              borderColor: "#4B0082",
              borderWidth: 2,

              label: {
                borderColor: "#00E396",

                text: "Limite inferior 400 UFC por 100 ml"
              }
            }
          ]
        },
        title: {
          text: "UFC de Enterococos por 100 ml de água",
          align: "left"
        },
        xaxis: {
          categories: this.graficoDatas,
          labels: {
            formatter: function(value, timestamp) {
              let data = new Date(value);
              let meses = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
              ];
              let dataformatada =
                data.getDate() +
                1 +
                "/" +
                meses[data.getMonth()] +
                "/" +
                data.getFullYear();
              return dataformatada;
            }
          }
        },
        yaxis: {}
      };

      this.series[0].data = this.graficoEnterococcos;

      console.log(this.series[0].data);
    }
  }
};
</script>
