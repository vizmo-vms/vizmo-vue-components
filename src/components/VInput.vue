<template>
    <div :class="$attrs.class">
      <div
        v-if="attrs.label"
        class="q-mb-xs text-subtitle2 v-text-dark"
      >
        <slot name="label">
          {{ attrs.label }} <span
            v-if="$attrs.required"
            class="text-red"
          >*</span>
        </slot>
      </div>
      <q-input
        ref="qInputRef"
        v-bind="attrs"
        :model-value="props.modelValue"
        @update:model-value="onModelValueUpdate"
        :outlined="props.outlined"
        :bg-color="props.bgColor"
        :label="void 0"
      >
        <template
          v-for="(_, slot) of slots"
          #[slot]="scope"
        >
          <slot
            :name="slot"
            v-bind="scope ?? {}"
          />
        </template>
      </q-input>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { computed, useAttrs, ref, useSlots } from 'vue';
  
  type QInput = import('quasar').QInput;
  type QInputProps = import('quasar').QInputProps;
  
  // defineProps only accepts interface types. so we need to convert type to an interface
  interface Props extends QInputProps {
    modelValue: QInputProps['modelValue'];
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
  
  const qInputRef = ref<QInput|null>(null);
  
  const attrs = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { class: _, required, ...others } = useAttrs();
    return others;
  });
  
  const slots = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { label: _, ...others } = useSlots();
    return others;
  });
  
  function onModelValueUpdate($event: string | null) {
    let value = null;
  
    if ($event) {
      value = attrs.value?.type === 'number' ? parseInt($event) : $event;
    }
  
    emit('update:model-value', value);
  }
  
  // expose q-input methods
  defineExpose({
    validate: (val?: unknown) => qInputRef.value?.validate(val),
    resetValidation: () => qInputRef.value?.resetValidation(),
    focus: () => qInputRef.value?.focus(),
    blur: () => qInputRef.value?.blur(),
    select: () => qInputRef.value?.select(),
    getNativeElement: () => qInputRef.value?.getNativeElement()
  });
  
  </script>
  