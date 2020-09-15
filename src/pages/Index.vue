<template>
  <q-page class="flex flex-center">
    <div class="full-width text-center">
      Verifique aqui a Balnealidade da praia que pretende viistar:<br />
    </div>
    <div class="q-pa-md q-gutter-sm">
      <q-btn push color="teal" label="Praias" @click="refresh" />

      <q-img
        :src="url"
        spinner-color="white"
        style="height: 140px; max-width: 150px"
      />
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      url: "https://placeimg.com/1000/800/nature"
    };
  },

  methods: {
    refresh() {
      this.url = "https://placeimg.com/500/300/nature?t=" + Math.random();
    }
  }
};
</script>
