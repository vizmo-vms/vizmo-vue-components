<template>
  <q-page class="row justify-evenly align-center">
    <v-input v-model="input" class="col-12" color="primary" label="Confirm" />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VInput from 'src/components/VInput.vue';

const input = ref();

</script>
