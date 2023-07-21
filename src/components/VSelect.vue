<template>
    <div :class="$attrs.class">
      <div
        v-if="attrs.label"
        class="q-mb-xs text-subtitle2 v-text-dark"
      >
        {{ attrs.label }} <span
          v-if="$attrs.required"
          class="text-red"
        >*</span>
      </div>
      <q-select
        ref="qSelectRef"
        v-bind="attrs"
        :model-value="props.modelValue"
        :outlined="props.outlined"
        :bg-color="props.bgColor"
        :label="void 0"
        @update:model-value="emit('update:model-value', $event)"
      >
        <template
          v-for="(_, slot) of $slots"
          #[slot]="scope"
        >
          <slot
            :name="slot"
            v-bind="scope ?? {}"
          />
        </template>
      </q-select>
    </div>
  </template>
  <script lang="ts" setup>
  import { computed, useAttrs, ref } from 'vue';
  
  type QSelect = import('quasar').QSelect;
  type QSelectProps = import('quasar').QSelectProps;
  
  // defineProps only accepts interface types. so we need to convert type to an interface
  interface Props extends QSelectProps {
    modelValue: QSelectProps['modelValue'];
    bgColor?: string;
    outlined?: boolean;
  }
  
  interface Emits {
    (event: 'update:model-value', value: Props['modelValue']): void;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    bgColor: 'grey-1',
    outlined: true
  });
  
  const emit = defineEmits<Emits>();
  
  const attrs = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { class: _, required, ...others } = useAttrs();
    return others;
  });
  
  const qSelectRef = ref<QSelect>();
  
  // expose qSelectRef for calling exposed methods
  defineExpose({
    validate: (val: unknown) => qSelectRef.value?.validate(val),
    resetValidation: () => qSelectRef.value?.resetValidation(),
    focus: () => qSelectRef.value?.focus(),
    blur: () => qSelectRef.value?.blur()
  });
  
  </script>
  