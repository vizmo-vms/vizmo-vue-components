<template>
    <div class="column">
      <div :class="props.labelClass">
        {{ props.label }}
      </div>
      <div :class="props.inputClass">
        <v-select
          v-model="_countryCode"
          outlined
          option-value="ISO2"
          :option-label="optionLabel"
          :options="props.countries"
          emit-value
          map-options
          :readonly="props.readonly"
          :hide-bottom-space="props.hideBottomSpace"
          :label="void 0"
          virtual-scroll-slice-size="60"
          virtual-scroll-slice-ratio-before="2"
          virtual-scroll-slice-ratio-after="2"
          popup-content-style="width: 300px"
        >
          <template #option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section avatar>
                <q-item-label class="text-h5">
                  {{ scope.opt.emoji }}
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label style="max-width: 260px;">
                  {{ `${scope.opt.name} (+${scope.opt.diallingCode})` }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </v-select>
        <v-input
          ref="inputRef"
          v-model="_phone"
          class="col"
          clearable
          :hide-bottom-space="props.hideBottomSpace"
          type="tel"
          :readonly="props.readonly"
          :rules="[
            (val: string) => !props.required || (props.required && isRequired(val)),
            // no need to validate if not required and value is null or undefined
            (val: string) => val && isPhone(val, _countryCode)
          ]"
          lazy-rules="ondemand"
          @update:model-value="emit('update:model-value',$event
            ? parsePhoneNumberFromString($event as string,_countryCode)?.format('E.164')
            : null
          )"
          :loading="props.loading"
        />
      </div>
      <div
        v-if="props.showBottomText"
        class="text-body2 text-center q-mt-xl"
      >
        We'll never share your phone with anyone else
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import VInput from 'src/components/custom/VInput.vue';
  import VSelect from 'src/components/custom/VSelect.vue';
  import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile';
  import { isRequired, isPhone } from 'src/util/validation-rules';
  type CountryCode = import('libphonenumber-js/types').CountryCode;
  
  interface Props {
    modelValue: string | null | undefined;
    label?: string;
    required?: boolean;
    labelClass?: Array<string | Record<string, boolean>> | Record<string, boolean>;
    inputClass?: Array<string | Record<string, boolean>> | Record<string, boolean>;
    hideBottomSpace?: boolean;
    readonly?: boolean;
    loading?: boolean;
    showBottomText?: boolean;
    countries: Country[];
    countryCode: string; // Check for location country code else use current location country code from country object and pass it to here
  }
  
  interface Emits {
    (event: 'update:model-value', data?: string | null): void
  }
  
  const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    label: 'Phone',
    required: false,
    labelClass: () => ['text-subtitle2', 'v-text-dark'],
    inputClass: () => ['row q-my-none'],
    hideBottomSpace: false,
    readonly: false,
    loading: false,
    showBottomText: false
  });
  
  const emit = defineEmits<Emits>();

  
  const inputRef = ref();
  const parsedPhone = computed(() => {
    try {
      return parsePhoneNumberFromString(props.modelValue as string, props.countryCode as CountryCode);
    } catch {
      return null;
    }
  });
  const _phone = ref<Props['modelValue']>(parsedPhone.value?.nationalNumber ?? null);
  const _countryCode = ref<CountryCode>((parsedPhone.value?.country ?? props.countryCode) as CountryCode);
  
  watch(() => props.modelValue, () => {
    _phone.value = parsedPhone.value?.nationalNumber ?? null;
  });
  
  // select filters
  const optionLabel = (opt: Country) => `+${opt?.diallingCode}`;
  
  function validate() {
    return inputRef.value.validate();
  }
  
  function getData() {
    return parsePhoneNumberFromString(_phone.value as string, _countryCode.value)?.format('E.164');
  }
  
  defineExpose({
    validate,
    getData
  });
  </script>
  