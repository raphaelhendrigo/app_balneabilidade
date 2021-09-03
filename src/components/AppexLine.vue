<template>
  <!--<div class="q-pa-md q-gutter-sm">-->
  <div>
    <!--div class="full-width">-->
    <div class="text-center">
      <q-dialog v-model="popupNenhumaMedicao">
        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6 text-center">
              Menos de 2 Medições Encontradas
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none text-justify">
            Foram encontradas 1 ou menos medições neste intervalo de tempo. Por
            favor selecione outro período
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="OK" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <div class="row justify-center">
      <span style="font-weight: bold; margin-right:8px;"
        >UFC Enterococos/100ml</span
      >
      <q-btn
        icon="help"
        color="primary"
        @click="popupCriteriosClassificacao = true"
        flat
        padding="none"
        style="margin-top: -2.5px;"
      />
    </div>
    <q-dialog v-model="popupCriteriosClassificacao">
      <q-card class="full-width">
        <q-card-section>
          <div class="text-h6 text-center">Critérios de Balneabilidade</div>
        </q-card-section>

        <q-card-section class="q-pt-none text-justify">
          Os critérios para classificação de balneabilidade imprópria das praias
          com base na quantidade de unidades formadoras de colonia (UFC/100ml)
          de enterococcos são: UFC/100ml acima de 100 em pelo menos 2 medições
          dentro de um período de 5 semanas; UFC/100ml acima de 400 na última
          medição realizada.
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <apexchart
      ref="nomeDoGrafico"
      type="line"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script>
import { date } from "quasar";
//import grandeUbatuba from "../assets/grande_ubatuba.json";
import axios from "axios";
import { mapState, mapGetters } from "vuex";

export default {
  name: "ApexLine",
  data() {
    return {
      popupNenhumaMedicao: false,
      enterococos: [],
      graficoDatas: [],
      graficoEnterococcos: [],
      teste: "teste",
      popupCriteriosClassificacao: false,
      series: [
        {
          name: "Enterococcos",
          data: []
        }
      ],
      chartOptions: {
        chart: {
          height: 280,
          type: "line",
          toolbar: {
            show: true,
            offsetX: 0,
            offsetY: 0,
            tools: {
              download: false,
              selection: false,
              zoom: false,
              zoomin: true,
              zoomout: true,
              pan: false,
              reset: true | '<img src="/static/icons/reset.png" width="20">',
              customIcons: []
            }
          }
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
        /* title: {
          text: "UFC Enterococos/100ml",
          align: "center"
        }, */
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
    },
    ip_webservice: function() {
      return this.$store.getters["exemplo/getIpWebservice"];
    },
    lista_grafico: function() {
      return this.$store.getters["exemplo/getListaGrafico"];
    }
  },

  async mounted() {
    if (this.cidade != "" && this.praia != "") {
      this.montarGrafico();
    }
  },
  methods: {
    montarGrafico() {
      let historicoDatas = [];
      let historicoEnterococos = [];

      if (this.lista_grafico.length > 1) {
        for (var i = 0; i < this.lista_grafico.length; i++) {
          historicoDatas.push(this.lista_grafico[i]["dataMedicao"]);
          historicoEnterococos.push(this.lista_grafico[i]["enterococos"]);
        }

        // CHAMADA DO AXIOS DENTRO DO PRÓPRIO COMPONENTE

        /*  await axios({
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
      ); */

        this.chartOptions = {
          chart: {
            height: 280,
            type: "line",
            toolbar: {
              show: true,
              offsetX: 0,
              offsetY: 0,
              tools: {
                download: false,
                selection: false,
                zoom: false,
                zoomin: true,
                zoomout: true,
                pan: false,
                reset: true | '<img src="/static/icons/reset.png" width="20">',
                customIcons: []
              }
            }
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

                  text: "100 UFC por 100 ml"
                }
              },
              {
                y: 400,
                y2: null,
                borderColor: "#4B0082",
                borderWidth: 2,

                label: {
                  borderColor: "#00E396",

                  text: "400 UFC por 100 ml"
                }
              }
            ]
          },
          /* title: {
          text: "UFC Enterococos/100ml",
          align: "left"
        }, */
          xaxis: {
            categories: historicoDatas,
            tickAmount: 5,
            offsetX: 9,
            labels: {
              formatter: function(value, timestamp) {
                //console.log("a ", value);

                let data = new Date(value);

                if (value != undefined) {
                  let temp = value;

                  data.setFullYear(temp.substring(0, 4));
                  data.setMonth(temp.substring(5, 7) - 1);
                  data.setDate(temp.substring(8, 10));
                }

                let meses = [
                  "Jan",
                  "Fev",
                  "Mar",
                  "Abr",
                  "Maio",
                  "Jun",
                  "Jul",
                  "Ago",
                  "Set",
                  "Out",
                  "Nov",
                  "Dez"
                ];

                let dataformatada =
                  data.getDate() +
                  " " +
                  meses[data.getMonth()] +
                  " " +
                  data.getFullYear();

                //let dataformatada = data;

                //let temp = value;
                //data.setDate = temp.substring(0, 2);
                //data.setMonth = temp.substring(3, 5);
                //data.setYear = temp.substring(6, 10);
                //data.setHours(data.getHours() + data.getTimezoneOffset() / 60);

                /* data = data.toLocaleString("pt-BR", {
                timeZone: "Europe/London"
              }); */

                //console.log(data);

                /* let dataformatada =
                data.getDate() +
                1 +
                "/" +
                meses[data.getMonth()] +
                "/" +
                data.getFullYear();
              return dataformatada; */

                // SEM DATAS FORMATADAS
                /* let dataformatada =
                ("0" + data.getDate()).slice(-2) +
                " " +
                meses[data.getMonth()] +
                " " +
                data.getFullYear(); */

                //console.log(value);
                //console.log("b ", value.substring(6, 10));

                /* let dataformatada =
                meses[data.getMonth()] + " " + data.getFullYear(); */

                return dataformatada;
              }
            }
          },
          yaxis: {}
        };
        this.series[0].data = historicoEnterococos;
      } else {
        this.popupNenhumaMedicao = true;
      }
    }
  }
};
</script>
