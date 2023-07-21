<template>
    <q-tabs ref="qTabRef" v-bind="attrs" :model-value="props.modelValue" :indicator-color="props.indicatorColor"
        :active-class="props.activeClass" :content-class="props.contentClass" :active-color="props.activeColor"
        @update:model-value="emit('update:model-value', $event)" style="border: 1px solid var(--q-secondary); padding: 2px">
        <template v-for="(_, slot) of $slots" #[slot]="scope">
            <slot :name="slot" v-bind="scope ?? {}" />
        </template>
    </q-tabs>
</template>
<script lang="ts" setup>
import { QTabsProps } from 'quasar';
import { computed, useAttrs, ref } from 'vue';

type QTabs = import('quasar').QTabs;

// defineProps only accepts interface types. so we need to convert type to an interface
interface Props extends QTabsProps {
    modelValue: QTabsProps['modelValue'];
    indicatorColor?: string;
    activeClass?: string;
    contentClass?: string
    activeColor?: string
}

interface Emits {
    (event: 'update:model-value', value: Props['modelValue']): void;
}

const props = withDefaults(defineProps<Props>(), {
    indicatorColor: 'transparent',
    activeClass: 'rounded-borders bg-primary',
    contentClass: 'rounded-borders text-weight-medium',
    activeColor: 'white'
});

const emit = defineEmits<Emits>();

const attrs = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { class: _, required, ...others } = useAttrs();
    return others;
});

const qTabRef = ref<QTabs>();

// expose qSelectRef for calling exposed methods
defineExpose({});

</script>
