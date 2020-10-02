<template>
  <q-page class="flex flex-center">
    <div class="full-width text-center">
      Verifique aqui a Balnealidade da praia que pretende visitar:<br />

      <q-select
        v-model="modelCidade"
        label="Selecione Cidade"
        :options="cidades"
        style="width: 250px"
        @input="carregapraias"
      />

      <q-select
        v-model="modelPraia"
        label="Selecione Praia"
        :options="praias"
        style="width: 250px"
        @input="invocarMontagemGrafico()"
      >
      </q-select>

      <q-card>
        <div class="row q-col-gutter-md q-px-md q-py-md">
          <div class="col-sx-6 col-sx-12 col-sx-6">
            <apex-line
              :cidade="this.modelCidade"
              :praia="this.modelPraia"
              :key="renderComponent"
            ></apex-line>
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import exemplo from "../store/exemplo";
import ApexLine from "components/AppexLine";
import cidadepraias from "../assets/praias_sp.json";
import grandeUbatuba from "../assets/grande_ubatuba.json";
import Vue from "vue";

export default {
  name: "PageIndex",
  computed: {
    cidade: function() {
      return this.$store.getters["exemplo/getCidade"];
    },
    praia: function() {
      return this.$store.getters["exemplo/getPraia"];
    }
  },
  components: {
    ApexLine
  },
  data() {
    return {
      modelCidade: null,
      modelPraia: null,
      cidades: [],
      praias: [],
      objcidadepraias: [],
      renderComponent: 0,
      colors: [
        "linear-gradient( 135deg, #ABDCFF 10%, #0396FF 100%)",
        "linear-gradient( 135deg, #2AFADF 10%, #4C83FF 100%)",
        "linear-gradient( 135deg, #FFD3A5 10%, #FD6585 100%)",
        "linear-gradient( 135deg, #EE9AE5 10%, #5961F9 100%)"
      ]
    };
  },
  mounted() {
    this.objcidadepraias = JSON.parse(JSON.stringify(cidadepraias));
    this.cidades = Object.keys(this.objcidadepraias);
  },
  methods: {
    carregapraias(val) {
      this.praias = this.objcidadepraias[val].praias;
    },
    async invocarMontagemGrafico() {
      this.$store.commit("exemplo/setCidade", this.modelCidade);
      this.$store.commit("exemplo/setPraia", this.modelPraia);

      this.renderComponent++;
    }
  }
};
</script>
