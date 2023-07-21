<template>
    <div :class="$attrs.class">
      <div class="q-mb-xs text-subtitle2 v-text-dark">
        {{ attrs.label }} <span
          v-if="$attrs.required"
          class="text-red"
        >*</span>
      </div>
      <div class="row q-gutter-sm">
        <div v-if="file">
          <q-chip
            removable
            color="secondary-5"
            text-color="white"
            @remove="file=null"
          >
            <a
              :href="file?.url()"
              target="_blank"
              :style="{color: 'white', textDecoration: 'none'}"
            > {{ file?.name() }} </a>
          </q-chip>
        </div>
        <template v-else>
          <div>
            <q-file
              ref="fileRef"
              :model-value="null"
              @update:model-value="onFileSelected"
              class="hidden"
              max-file-size="1048576"
              accept="image/jpeg, image/jpg, image/png, .doc, .docx, .ppt, .pptx ,.pdf, .xlsx, .xls, .csv, .odt, .ods, .odp"
              @rejected="$q.notify({ message: 'File size must be less than 1MB', color: 'negative' })"
            />
            <q-btn
              color="primary"
              label="Upload Document"
              icon="upload"
              class="text-weight-medium"
              @click="fileRef.pickFiles()"
              dense
              outline
            />
          </div>
          <div>
            <q-btn
              color="primary"
              label="Capture Document"
              icon="photo_camera"
              class="text-weight-medium"
              @click="captureDoc"
              dense
              outline
            />
          </div>
        </template>
      </div>
      <div class="q-mt-xs text-negative text-subtitle2">
        <span v-if="error">Please select an option</span>&nbsp;
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { useFormChild, date, useQuasar } from 'quasar';
  import { computed, useAttrs, ref, watch } from 'vue';
  import PhotoCapture from 'components/PhotoCapture.vue';
  import { readAndCompressImage } from 'browser-image-resizer';
  import Parse from '@vizmo/parse/dist/parse.min';
  
  interface Props {
    modelValue?: Parse.File| null;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => null
  });
  
  const emit = defineEmits(['update:model-value']);
  
  const $q = useQuasar();
  const $attrs = useAttrs();
  
  const error = ref(false);
  const fileRef = ref();
  const file = ref(props.modelValue);
  
  const attrs = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { class: _, required, rules, id, ...others } = $attrs;
    return others;
  });
  
  watch(file, val => {
    resetValidation();
    emit('update:model-value', val);
  });
  
  function openCamera({ title = 'Take a Photo', width = 480, height = 480, mirrored = true }) {
    return new Promise<string>((resolve) => {
      $q.dialog({
        component: PhotoCapture,
        componentProps: {
          title,
          width,
          height,
          mirrored
        }
      }).onOk(dataUri => resolve(dataUri));
    });
  }
  
  async function captureDoc() {
    try {
      // Calculating preview as per A4 size ratio
      // previewHeight = Screen height - (Label Height + Buttons height) - (dialog max calculated height to prevent scroll)
      const previewHeight = window.innerHeight - 150 - 48;
      let previewWidth = previewHeight * (5 / 7);
      if (previewWidth > window.innerWidth - 32) {
        previewWidth = window.innerWidth - 32; // 32px is later added to calculate card min-width
      }
      const capturedDocPhoto = await openCamera({
        title: 'Take Document Photo',
        width: previewWidth,
        height: previewHeight,
        mirrored: false
      });
      const capturedDocFile = new Parse.File(`${$attrs.id}_photo_${date.formatDate(new Date(), 'DD-MM-YYYY')}`, { uri: capturedDocPhoto });
      file.value = capturedDocFile;
    } catch (error) {
      $q.notify({
        color: 'negative',
        message: 'Failed to take photo of the Document! Please try again.'
      });
    }
  }
  
  async function onFileSelected(doc: File) {
    let docUrl;
    if (['image/jpeg', 'image/jpg', 'image/png'].includes(doc.type)) {
      const resized = await readAndCompressImage(doc, { quality: 0.9 });
      docUrl = URL.createObjectURL(resized);
    } else {
      docUrl = URL.createObjectURL(doc);
    }
    const docName = doc.name.replace(/\s+/g, '_').replace(/\.[^/.]+$/, '').toLowerCase();
    const uploadDoc = new Parse.File(`${docName}_${date.formatDate(new Date(), 'DD-MM-YYYY')}`, { uri: docUrl });
    file.value = uploadDoc;
  }
  
  function validate() {
    if (!$attrs.required) return true;
  
    const isValid = !!file.value;
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
  