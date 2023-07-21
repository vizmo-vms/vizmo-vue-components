<template>
    <video
      id="cameraPreview"
      :style="cameraStyle"
      :width="width"
      :height="height"
      autoplay
      playsinline
    />
  </template>
  
  <script setup lang="ts">
  
  import { ref, toRefs, onMounted, onActivated, onDeactivated, onBeforeUnmount } from 'vue';
  import CameraPhoto, { CaptureConfigOption, FACING_MODES } from 'jslib-html5-camera-photo';
  import { ValueOf } from 'type-fest';
  
  type CaptureOptions = CaptureConfigOption;
  interface Props {
    width?: number;
    height?: number;
    autoplay?: boolean;
    facingMode?: ValueOf<typeof FACING_MODES>;
    mirrored?: boolean;
    fit?: 'cover' | 'contain';
  }
  
  const props = withDefaults(defineProps<Props>(), {
    width: 640,
    height: 480,
    autoplay: true,
    facingMode: FACING_MODES.ENVIRONMENT,
    mirrored: true,
    fit: 'cover'
  });
  
  const { width, height, autoplay, facingMode, mirrored } = toRefs(props);
  
  const cameraStyle = ref({
    transform: mirrored.value ? 'rotateY(180deg)' : 'rotateY(0deg)',
    objectFit: props.fit
  });
  
  const started = ref(false);
  
  let camera: CameraPhoto;
  
  onMounted(async () => {
    const videoElement = document.getElementById('cameraPreview') as HTMLVideoElement;
    camera = new CameraPhoto(videoElement);
  
    // start the camera if autoPlay is true
    if (autoplay.value) {
      await start();
    }
  });
  
  onActivated(async () => await start());
  onDeactivated(async () => await stop());
  
  onBeforeUnmount(async () => await stop());
  
  async function start() {
    // start the camera if it's not started already
    if (!started.value) {
      await camera.startCamera(
        facingMode.value as typeof FACING_MODES.ENVIRONMENT,
        { width: width.value * 2 as MediaTrackConstraints['width'], height: height.value * 2 as MediaTrackConstraints['height'] }
      );
      started.value = true;
    }
  }
  
  async function stop() {
    if (started.value) {
      await camera.stopCamera();
    }
  }
  
  async function capture(options: CaptureOptions = {}): Promise<string> {
    return camera.getDataUri({ ...options, isImageMirror: options.isImageMirror ?? mirrored.value });
  }
  
  defineExpose({
    start,
    stop,
    capture
  });
  
  </script>
  