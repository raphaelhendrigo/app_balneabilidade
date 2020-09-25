<template>
  <apexchart
    ref="realtimeChart"
    type="line"
    height="200"
    :options="chartOptions"
    :series="series"
  />
</template>

<script>
import { date } from "quasar";
import grandeUbatuba from "../assets/grande_ubatuba.json";
export default {
  name: "ApexLine",

  data() {
    return {
      enterococos: [],
      datas: [],
      series: [
        {
          name: "Enterococos",
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

  mounted() {
    let datas = JSON.parse(JSON.stringify(grandeUbatuba)).map(item => {
      return item.data;
    });
    //console.log(datas);
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
            y2: 400,
            borderColor: "#FF0000",

            label: {
              borderColor: "#00E396",

              text: "Limite inferior 100 UFC por 100 ml"
            }
          }
        ]
      },
      title: {
        text: "UFC de Enterococos por 100 ml de água",
        align: "left"
      },
      xaxis: {
        categories: datas,
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
              meses[data.getMonth()] + "/" + data.getFullYear();
            return dataformatada; // The formatter function overrides format property
          }
        }
      },
      yaxis: {}
    };
    this.series[0].data = JSON.parse(JSON.stringify(grandeUbatuba)).map(
      item => {
        return item.Enterococcus;
      }
    );
    console.log(this.datas);
    console.log(this.series.data);
  },
  methods: {}
};
</script>
