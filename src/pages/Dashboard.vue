<template>
  <q-page class="container" style="background: #343E59;">
    <div class="row q-col-gutter-md q-px-md q-py-md">
      <div class="col-md-6 col-sm-12 col-xs-12">
        <apex-line></apex-line>
      </div>
    </div>
  </q-page>
</template>

<script>
import ApexLine from "components/AppexLine";

export default {
  name: "PageIndex",
  components: {
    ApexLine
  },
  data() {
    return {
      colors: [
        "linear-gradient( 135deg, #ABDCFF 10%, #0396FF 100%)",
        "linear-gradient( 135deg, #2AFADF 10%, #4C83FF 100%)",
        "linear-gradient( 135deg, #FFD3A5 10%, #FD6585 100%)",
        "linear-gradient( 135deg, #EE9AE5 10%, #5961F9 100%)"
      ]
    };
  }
};
</script>
