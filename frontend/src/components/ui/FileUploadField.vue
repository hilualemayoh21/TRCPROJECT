<template>
  <div class="space-y-1.5">
    <label :for="id" class="flex items-center gap-1 text-[0.8rem] font-bold text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
      <span v-else class="text-[0.72rem] font-normal text-gray-400">(optional)</span>
    </label>

    <div
      v-if="!selectedFile"
      class="relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 transition cursor-pointer"
      :class="[isDragging ? 'border-trc bg-trc/5' : 'border-gray-200 bg-gray-50 hover:border-trc/50 hover:bg-trc/5', error ? 'border-red-300 bg-red-50' : '']"
      @dragenter.prevent="isDragging = true"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerClick"
    >
      <svg class="h-8 w-8 text-gray-300 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>
      <p class="text-[0.8rem] font-semibold text-gray-500 pointer-events-none">Click or drag file here</p>
      <p class="text-[0.72rem] text-gray-400 pointer-events-none">PDF, JPG, PNG, DOCX — max 5 MB</p>
      <input
        ref="fileInput"
        :id="id"
        type="file"
        class="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.docx"
        @change="handleFileChange"
      />
    </div>

    <div
      v-else
      class="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
    >
      <svg class="h-8 w-8 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      <div class="min-w-0 flex-1">
        <p class="truncate text-[0.82rem] font-bold text-gray-800">{{ selectedFile.name }}</p>
        <p class="text-[0.72rem] text-emerald-600 font-semibold">{{ formatSize(selectedFile.size) }}</p>
      </div>
      <button
        type="button"
        class="shrink-0 text-gray-400 hover:text-red-500 transition"
        @click.stop="clearFile"
        title="Remove file"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>

    <p v-if="hint && !error" class="text-[0.72rem] text-gray-400">{{ hint }}</p>
    <p v-if="error" class="text-[0.78rem] font-semibold text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  id: string
  label: string
  hint?: string
  required?: boolean
  error?: string
}>()

const emit = defineEmits<{
  (e: 'change', file: File | null): void
}>()

const selectedFile = ref<File | null>(null)
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] || null
  selectedFile.value = file
  emit('change', file)
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0] || null
  selectedFile.value = file
  emit('change', file)
}

function clearFile() {
  selectedFile.value = null
  emit('change', null)
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function triggerClick() {
  fileInput.value?.click()
}
</script>
