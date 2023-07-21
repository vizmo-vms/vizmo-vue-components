<template>
    <div :class="$attrs.class">
      <div class="q-mb-xs text-subtitle1 v-text-dark">
        {{ attrs.label }} <span
          v-if="$attrs.required"
          class="text-red"
        >*</span>
      </div>
      <q-option-group
        v-model="selected"
        v-bind="attrs"
        :options="inputOptions"
        type="radio"
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
      </q-option-group>
      <div class="q-mt-xs text-negative">
        <span v-if="error">Please select an option</span>&nbsp;
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { QOptionGroupProps, useFormChild } from 'quasar';
  import { computed, useAttrs, ref, watch } from 'vue';
  
  type Option = string | {label: string; value: unknown, [key: string]: unknown}
  
  interface Props extends Omit<QOptionGroupProps, 'options' | 'modelValue' | 'type'> {
    modelValue?: string | boolean | null;
    options: Option[];
  }
  
  const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    options: () => [] as Option[]
  });
  
  const emit = defineEmits(['update:model-value']);
  
  const $attrs = useAttrs();
  
  const selected = ref(props.modelValue);
  const error = ref(false);
  
  const inputOptions = computed(() => props.options.map(op => {
    if (typeof op === 'string') {
      return { label: op, value: op };
    }
  
    return op;
  }));
  
  const attrs = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { class: _, required, rules, ...others } = useAttrs();
    return others;
  });
  
  watch(selected, val => {
    resetValidation();
    emit('update:model-value', val);
  });
  
  function validate() {
    if (!$attrs.required) return true;
  
    const isValid = !!selected.value;
    if (!isValid) error.value = true;
    return isValid;
  }
  
  function resetValidation() {
    error.value = false;
  }
  
  useFormChild({
    validate, // Function; Can be async;
    // Should return a Boolean (or a Promise resolving to a Boolean)
    resetValidation, // Optional function which resets validation
    requiresQForm: false // should it error out if no parent QForm is found?
  });
  
  // expose q-input methods
  defineExpose({
    validate,
    resetValidation
  });
  
  </script>
  