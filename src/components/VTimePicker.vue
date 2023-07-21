<template>
  <div :class="$attrs.class">
    <div v-if="attrs.label" class="q-mb-xs text-subtitle2 v-text-dark">
      <slot name="label">
        {{ attrs.label }} <span v-if="$attrs.required" class="text-red">*</span>
      </slot>
    </div>
    <!-- NOTE: model-type="format" seems be not working now. by default it's emitting an object which is what we're using-->
    <Datepicker ref="qTimePickerRef" v-bind="attrs" :model-value="props.modelValue"
      @update:model-value="onModelValueUpdate" time-picker :minutes-increment="minutesIncrement" position="right"
      :disabled="readonly" @internal-model-change="validateSelection" :start-time="startTime">
      <template #dp-input="{ value }">
        <v-input type="text" :model-value="value" :rules="rules" :readonly="readonly">
          <template #prepend>
            <q-icon name="access_time" />
          </template>
        </v-input>
      </template>
      <template #am-pm-button="{ toggle, value }">
        <q-btn-toggle :model-value="value" @update:model-value="toggle" toggle-color="primary" class="column" unelevated
          :options="[
            { label: 'AM', value: 'AM' },
            { label: 'PM', value: 'PM' }
          ]" />
      </template>
      <template #action-preview />
      <template #action-select>
        <q-btn color="primary" label="Ok" unelevated no-caps :disabled="disabled" @click="qTimePickerRef?.selectDate()" />
      </template>
      <template #clear-icon />
    </datepicker>
  </div>
</template>
  
<script lang="ts" setup>
import { computed, useAttrs, ref } from 'vue';
import VInput from 'src/components/custom/VInput.vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';


type ModelValueType = {
  hours: number | string;
  minutes: number | string;
  seconds?: number | string;
};

// defineProps only accepts interface types. so we need to convert type to an interface
interface Props {
  modelValue: ModelValueType;
  bgColor?: string;
  outlined?: boolean;
  textInput?: boolean;
  minutesIncrement?: number;
  rules?: any[];
  readonly?: boolean;
  /**
   * callback function used to validate the time selection change.
   * @returns `false` if the input is invalid
   */
  selectionValidateFn?: (input: { hours: number, minutes: number, seconds: number }) => boolean
}

interface Emits {
  (event: 'update:model-value', value: Props['modelValue']): void;
}

const props = withDefaults(defineProps<Props>(), {
  bgColor: 'grey-1',
  outlined: true,
  textInput: true,
  minutesIncrement: 5,
  rules: undefined,
  readonly: false,
  selectionValidateFn: undefined
});

const emit = defineEmits<Emits>();

const qTimePickerRef = ref<InstanceType<typeof Datepicker> | null>(null);
const disabled = ref(false);
const startTime = ref({ hours: 0, minutes: 0, seconds: 0 });

const attrs = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { class: _, required, ...others } = useAttrs();
  return others;
});

function onModelValueUpdate($event: ModelValueType) {
  emit('update:model-value', $event);
}

function validateSelection(timestamp: Date | null) {
  if (!timestamp || !props.selectionValidateFn) return;

  disabled.value = !props.selectionValidateFn({
    hours: timestamp.getHours(),
    minutes: timestamp.getMinutes(),
    seconds: timestamp.getSeconds()
  });
}
</script>
  