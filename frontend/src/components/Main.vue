<script setup>
defineProps({
  quote: { type: String, default: '' },
  author: { type: String, default: '' },
  href: { type: String, default: '#' },
  isDisabled: { type: Boolean, default: false },
})
</script>

<template>
  <main
    class="mx-auto mb-0 mt-0 box-border h-[200px] w-[250px] rounded-br-xl rounded-tl-xl bg-white px-8 py-5 text-black"
  >
    <h2 class="relative text-base font-bold">{{ quote }}</h2>
    <p class="text-right font-extralight text-gray-500">
      <a :href="href" class="text-gray-500" target="_blank">{{ author }}</a>
    </p>
    <div class="flex gap-5">
      <button
        class="mx-auto mt-12 block cursor-pointer rounded-md border-none bg-[rgba(4,74,54,0.861)] px-2.5 py-2 text-base text-white"
      >
        Another!
      </button>
      <button
        class="mx-auto mt-12 block cursor-pointer rounded-md border-none bg-[rgba(4,74,54,0.861)] px-2.5 py-2 text-base text-white disabled:cursor-not-allowed disabled:bg-gray-500 disabled:opacity-60"
        :disabled="isDisabled"
      >
        Share
      </button>
    </div>
  </main>
</template>
