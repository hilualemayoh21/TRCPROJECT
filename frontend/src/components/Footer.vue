<script setup>
import { ref } from 'vue'

const year = ref('2006')
</script>

<template>
  <footer class="absolute bottom-0 w-full">
    <p class="p-[13px] text-center text-white">Created by Hlina &copy;{{ year }}</p>
  </footer>
</template>
