<template>
  <div
    class="auth-card overflow-hidden rounded-2xl bg-white"
    :class="shadow ? 'shadow-[0_20px_60px_rgba(0,0,0,0.12)]' : ''"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  shadow?: boolean
}
withDefaults(defineProps<Props>(), {
  shadow: true,
})
</script>
