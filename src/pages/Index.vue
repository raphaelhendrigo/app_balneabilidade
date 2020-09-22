<template>
  <q-page class="flex flex-center">
    <div class="full-width text-center">
      Verifique aqui a Balnealidade da praia que pretende viistar:<br />

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
      >
      </q-select>
    </div>
  </q-page>
</template>

<script>
import cidadepraias from "../assets/praias_sp.json";
export default {
  data() {
    return {
      modelCidade: null,
      modelPraia: null,
      cidades: [],
      praias: [],
      objcidadepraias: []
    };
  },
  mounted() {
    //console.log(cidadepraias);
    this.objcidadepraias = JSON.parse(JSON.stringify(cidadepraias));
    this.cidades = Object.keys(this.objcidadepraias);
    console.log(Object.keys(this.objcidadepraias));
  },
  methods: {
    carregapraias(val) {
      console.log(this.objcidadepraias[val].praias);
      this.praias = this.objcidadepraias[val].praias;
    }
  }
};
</script>
