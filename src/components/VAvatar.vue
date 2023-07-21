<template>
    <q-avatar :size="props.size" round :rounded="props.square" :text-color="props.textColor" :style="style"
        class="text-center">
        <q-img :src="props.src ?? 'no-logo'" :height="props.size">
            <template #error>
                <q-icon v-if="props.icon" :size="props.size" name="person" class="secondary-7 bg-secondary-2" />
                <span v-else :style="{ 'line-height': props.size }">
                    {{ getInitials(props.name ?? '') }}
                </span>
            </template>
        </q-img>
    </q-avatar>
</template>
<script lang="ts" setup>
import { colors } from 'quasar';
import { getInitials } from 'src/util';
import { computed } from 'vue';

interface Props {
    /**
     * Initials will be displayed if src is not set or if image load fails only if icon is not set
     */
    name?: string | null;
    textColor?: string;
    color?: string | null;
    size?: string;
    /**
     * If the src is provided, then it'll loaded first.
     */
    src?: string | null;
    /**
     * If the icon is provided, then it'll be displayed instead of initials. src is given priority.
     */
    icon?: string | null;
    square?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    name: null,
    textColor: 'white',
    color: null,
    size: '48px',
    src: null,
    icon: null,
    square: false
});

const style = computed(() => {
    return {
        backgroundColor: props.color ? colors.getPaletteColor(props.color) : getAvatarColor(props.name ?? 'V')
    };
});

function getAvatarColor(letter: string): string {
    const materialColorPalette = [
        '#E91E63',
        '#9C27B0',
        '#673AB7',
        '#3F51B5',
        '#2196F3',
        '#03A9F4',
        '#00BCD4',
        '#4CAF50',
        '#8BC34A',
        '#CDDC39',
        '#FFC107',
        '#795548',
        '#607D8B',
        '#C2185B',
        '#7B1FA2',
        '#512DA8',
        '#303F9F',
        '#1976D2',
        '#0288D1',
        '#0097A7',
        '#388E3C',
        '#689F38',
        '#AFB42B',
        '#FFA000',
        '#5D4037',
        '#455A64'
    ];

    const paletteIndex = letter.toUpperCase().charCodeAt(0) - 65;

    return materialColorPalette[paletteIndex];
}
</script>
  