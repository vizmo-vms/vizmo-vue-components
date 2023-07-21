<template>
    <q-dialog v-model="opened" :persistent="persistent">
        <q-card style="width: 100%">
            <q-card-section>
                <div class="text-h5 secondary-9 q-mb-sm">
                    {{ props.label }}
                    <q-btn dense flat icon="close" v-close-popup class="float-right" />
                </div>
                <q-img fit="contain" :src="props.url" :style="{ maxWidth: props.maxWidth, maxHeight: props.maxHeight }" />
            </q-card-section>
        </q-card>
    </q-dialog>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
import { LiteralUnion } from 'type-fest';

interface Props {
    label?: string;
    url?: string;
    maxWidth?: LiteralUnion<'auto' | '640px', string>,
    maxHeight?: LiteralUnion<'auto' | '480px', string>,
    persistent?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    label: '',
    url: undefined,
    maxWidth: '640px',
    maxHeight: '480px',
    persistent: false
});

const opened = ref(false);

function open() {
    opened.value = true;
}

defineExpose({
    open
});
</script>
  