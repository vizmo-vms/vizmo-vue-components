<template>
  <q-dialog
    v-model="open"
    :persistent="persistent"
  >
    <q-card class="column fit">
      <q-card-section class="row justify-between">
        <div class="text-h5 text-weight-medium text-secondary">
          {{ props.heading }}
        </div>
        <q-btn
          flat
          label="Close"
          color="primary"
          @click="hide"
        />
      </q-card-section>
      <q-card-section class="col column">
        <v-table
          flat
          bordered
          class="col"
          :rows="props.errors"
          :columns="props.columns"
          table-header-class="secondary-7"
          :pagination="{rowsPerPage: 10}"
          :rows-per-page-options="[10, 25, 50]"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VTable from 'src/components/custom/VTable.vue';
import Papa from 'papaparse';
import { QTableColumn } from 'quasar';

interface Props {
    heading: string;
    errors: Record<string, any>[];
    columns: QTableColumn<Record<string, Papa.ParseError>>[],
    persistent?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  heading: 'Error',
  persistent: true
});

const open = ref(false);

function show() {
  open.value = true;
}

function hide() {
  open.value = false;
}

defineExpose({
  show, hide
});
</script>
