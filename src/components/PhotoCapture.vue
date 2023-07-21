<template>
    <q-dialog
      ref="dialogRef"
      @hide="onDialogHide"
      persistent
    >
      <q-card
        class="q-dialog-plugin"
        :style="cardStyle"
      >
        <q-card-section class="text-h5 text-weight-medium secondary-9">
          {{ props.title }}
        </q-card-section>
        <q-card-section>
          <v-camera
            ref="cameraRef"
            :width="props.width"
            :height="props.height"
            :mirrored="props.mirrored"
          />
        </q-card-section>
  
        <!-- buttons example -->
        <q-card-actions align="right">
          <q-btn
            flat
            color="primary"
            label="Cancel"
            class="text-weight-medium"
            @click="onDialogCancel"
          />
          <q-btn
            flat
            color="primary"
            label="Capture"
            class="bg-primary-2 text-weight-medium"
            @click="onOKClick"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </template>
  <script lang="ts">
  export default {
    inheritAttrs: false
  };
  </script>
  
  <script setup lang="ts">
  import { useDialogPluginComponent, dom } from 'quasar';
  import VCamera from 'components/custom/VCamera.vue';
  import { computed, ref } from 'vue';
  
  interface Props{
    title?: string;
    width?: number;
    height?: number;
    mirrored?: boolean;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    title: '',
    width: 480,
    height: 480,
    mirrored: true
  });
  
  defineEmits([
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits
  ]);
  
  const cameraRef = ref<InstanceType<typeof VCamera>>();
  
  const cardStyle = computed(() => {
    return {
      minWidth: `${props.width + 32}px` // 32px is the padding of the q-card-section
    };
  });
  
  const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
  // dialogRef      - Vue ref to be applied to QDialog
  // onDialogHide   - Function to be used as handler for @hide on QDialog
  // onDialogOK     - Function to call to settle dialog with "ok" outcome
  //                    example: onDialogOK() - no payload
  //                    example: onDialogOK({ /*.../* }) - with payload
  // onDialogCancel - Function to call to settle dialog with "cancel" outcome
  
  // this is part of our example (so not required)
  async function onOKClick () {
    // on OK, it is REQUIRED to
    // call onDialogOK (with optional payload)
    onDialogOK(await cameraRef.value?.capture({ imageType: 'jpg', imageCompression: 0.8 }));
    // or with payload: onDialogOK({ ... })
    // ...and it will also hide the dialog automatically
  }
  </script>
  