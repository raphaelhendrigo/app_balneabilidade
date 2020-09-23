<template>
  <card-base>
    <apexchart
      ref="realtimeChart"
      type="line"
      height="200"
      :options="chartOptions"
      :series="series"
    />
  </card-base>
</template>

<script>
import CardBase from "components/CardBase";
import grandeUbatuba from "../assets/grande_ubatuba.json";
export default {
  name: "ApexLine",
  components: {
    CardBase
  },
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
        colors: ["#FCCF31", "#17ead9", "#f02fc2"],
        chart: {
          height: 350,
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
          align: "center",
          style: {
            color: "#FFF"
          }
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              colors: "#fff"
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              color: "#fff"
            }
          }
        }
      }
    };
  },

  mounted() {
    let datas = JSON.parse(JSON.stringify(grandeUbatuba)).map(item => {
      return item.data;
    });
    this.chartOptions = {
      colors: ["#FCCF31", "#17ead9", "#f02fc2"],
      chart: {
        height: 350,
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
        align: "center",
        style: {
          color: "#FFF"
        }
      },
      xaxis: {
        categories: datas,
        labels: {
          style: {
            colors: "#fff"
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            color: "#fff"
          }
        }
      }
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
