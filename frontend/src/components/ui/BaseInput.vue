<template>
  <div class="flex flex-col gap-1.5">
    <!-- Label row -->
    <div v-if="label || $slots.labelRight" class="flex items-center justify-between">
      <label
        v-if="label"
        :for="inputId"
        class="text-xs font-semibold text-gray-500 tracking-wide"
      >
        {{ label }}
      </label>
      <slot name="labelRight" />
    </div>

    <!-- Input wrapper -->
    <div
      class="relative flex items-center rounded-xl border bg-gray-50 transition-all duration-200"
      :class="[
        hasError
          ? 'border-red-400 shadow-[0_0_0_3px_rgba(239,68,68,0.12)]'
          : isFocused
            ? 'border-purple-500/50 bg-white shadow-[0_0_0_3px_rgba(108,43,217,0.12)]'
            : 'border-gray-200 hover:border-gray-300'
      ]"
    >
      <!-- Left icon slot -->
      <span
        v-if="$slots.icon"
        class="pointer-events-none absolute left-3.5 flex shrink-0 text-gray-400"
        :class="{ 'text-purple-500': isFocused && !hasError }"
        aria-hidden="true"
      >
        <slot name="icon" />
      </span>

      <!-- Input element -->
      <input
        :id="inputId"
        v-bind="$attrs"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :disabled="disabled"
        :required="required"
        class="w-full bg-transparent py-3.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
        :class="[$slots.icon ? 'pl-10' : 'pl-4', $slots.action ? 'pr-11' : 'pr-4']"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />

      <!-- Right action slot (e.g. password toggle) -->
      <span v-if="$slots.action" class="absolute right-3 flex shrink-0">
        <slot name="action" />
      </span>
    </div>

    <!-- Error message -->
    <Transition name="shake">
      <p v-if="hasError" class="flex items-center gap-1 text-xs text-red-500" role="alert">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        {{ error }}
      </p>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  type?: string
  placeholder?: string
  autocomplete?: string
  disabled?: boolean
  required?: boolean
  error?: string | null
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  required: false,
})

defineEmits<{ 'update:modelValue': [value: string] }>()

const isFocused = ref(false)
const inputId = computed(() => props.id || `input-${Math.random().toString(36).slice(2, 7)}`)
const hasError = computed(() => Boolean(props.error))
</script>

<style scoped>
.shake-enter-active {
  animation: shake 0.3s ease;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
</style>
