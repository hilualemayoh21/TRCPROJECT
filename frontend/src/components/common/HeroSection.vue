<template>
  <section class="relative overflow-hidden" :class="containerClass">
    <!-- Full-bleed background -->
    <div class="absolute inset-0 z-0">
      <img
        v-if="backgroundImage"
        :src="backgroundImage"
        :alt="backgroundAlt"
        class="h-full w-full object-cover"
        :class="imageClass"
        loading="eager"
      />
      <!-- Overlays -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-white via-white/88 to-white/15 lg:from-white lg:via-white/75 lg:to-transparent"
        aria-hidden="true"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-[#5e35b1]/[0.06]" aria-hidden="true" />
      
      <!-- Abstract Grid Overlay -->
      <div
        class="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-[0.11]"
        style="
          background-image: linear-gradient(rgba(94, 53, 177, 0.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(94, 53, 177, 0.35) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: linear-gradient(to left, black 35%, transparent);
          -webkit-mask-image: linear-gradient(to left, black 40%, transparent);
        "
        aria-hidden="true"
      />
    </div>

    <!-- Content -->
    <div
      class="relative z-10 mx-auto flex max-w-7xl flex-col justify-center px-4 pb-36 pt-12 sm:px-6 sm:pb-40 sm:pt-16 lg:min-h-[min(92vh,52rem)] lg:pb-44 lg:pt-20"
    >
      <div class="max-w-xl lg:max-w-2xl">
        <slot name="badge"></slot>
        
        <h1 class="animate-fade-up font-black leading-[1.1] tracking-tight text-gray-900">
          <slot name="title">
            <span class="block text-4xl sm:text-5xl md:text-[3.35rem] lg:text-6xl">
              {{ title }}
              <span class="mt-3 block h-1 w-[min(11rem,55vw)] rounded-full bg-trc" />
            </span>
            <span v-if="subtitle" class="mt-4 block text-4xl text-trc sm:text-5xl md:text-[3.35rem] lg:text-6xl">
              {{ subtitle }}
            </span>
          </slot>
        </h1>

        <p
          class="animate-fade-up mt-10 max-w-xl text-base font-medium leading-relaxed text-gray-700 sm:text-lg md:text-xl"
          style="animation-delay: 0.12s"
        >
          <slot name="description">{{ description }}</slot>
        </p>

        <div class="animate-fade-up mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-5" style="animation-delay: 0.22s">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>

    <!-- Wavy Divider -->
    <div v-if="showDivider" class="relative z-20 -mt-6 sm:-mt-10 lg:-mt-14">
      <svg
        class="relative z-10 block h-[72px] w-[calc(100%+4px)] max-w-none text-[#1a0b2e] sm:h-[100px] lg:h-[120px]"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58.47,103.4,142.17,117.2,223,117.2,303.83,117.2,321.39,56.44,321.39,56.44Z"
        />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
  description?: string
  backgroundImage?: string
  backgroundAlt?: string
  containerClass?: string
  imageClass?: string
  showDivider?: boolean
}>()
</script>

<style scoped>
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(28px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up {
  animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
