<template>
  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <!-- Search Input -->
    <div class="relative flex-1 max-w-md">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search roles by name..."
        class="w-full pl-10 pr-4 py-2.5 text-sm font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-150"
      />
    </div>

    <!-- Filter Dropdown -->
    <div class="relative">
      <button
        type="button"
        @click="toggleDropdown"
        class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-white dark:bg-black border-2 border-gray-300 dark:border-violet-500 rounded-lg text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-150"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        {{ currentFilterLabel }}
        <svg class="h-4 w-4 transition-transform duration-150" :class="{ 'rotate-180': dropdownOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Dropdown Menu -->
      <div
        v-if="dropdownOpen"
        class="absolute right-0 mt-2 w-48 bg-white dark:bg-black border-2 border-gray-300 dark:border-violet-500 rounded-lg shadow-2xl dark:shadow-violet-500/50 z-[9999]"
        @click.stop
      >
        <div class="py-1">
          <button
            v-for="option in filterOptions"
            :key="option.value"
            type="button"
            @click="selectFilter(option.value)"
            class="w-full text-left px-4 py-2 text-sm font-semibold text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-violet-600 transition-colors duration-150 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
            :class="{ 'bg-violet-100 dark:bg-violet-600 text-violet-900 dark:text-white': selectedFilter === option.value }"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { debounce } from 'lodash-es'

type FilterType = 'all' | 'system' | 'custom' | 'protected'
type RoleFilter = { search: string; type: FilterType }

interface Props {
  modelValue?: RoleFilter
}

interface Emits {
  (e: 'update:modelValue', value: RoleFilter): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({ search: '', type: 'all' })
})

const emit = defineEmits<Emits>()

// 🔥 STEP 4 - FIX DROPDOWN STATE
const searchQuery = ref(props.modelValue.search)
const selectedFilter = ref<FilterType>(props.modelValue.type)
const dropdownOpen = ref(false)

// 🔥 STEP 6 - FIX LABEL DISPLAY
const labelMap = {
  all: 'All Roles',
  system: 'System Roles', 
  protected: 'Protected Roles',
  custom: 'Custom Roles'
}

const currentFilterLabel = computed(() => {
  return labelMap[selectedFilter.value] || 'All Roles'
})

const filterOptions = [
  { value: 'all' as FilterType, label: labelMap.all },
  { value: 'system' as FilterType, label: labelMap.system },
  { value: 'custom' as FilterType, label: labelMap.custom },
  { value: 'protected' as FilterType, label: labelMap.protected }
]

// 🔥 STEP 7 - DEBUG FINAL OUTPUT
console.log("🔍 INITIAL FILTER STATE:", selectedFilter.value)
console.log("🔍 FILTER OPTIONS:", filterOptions)

const debouncedSearch = debounce((value: string) => {
  emitUpdate()
}, 300)

function emitUpdate() {
  console.log("🔍 EMITTING FILTER UPDATE:", {
    search: searchQuery.value,
    type: selectedFilter.value
  })
  emit('update:modelValue', {
    search: searchQuery.value,
    type: selectedFilter.value
  })
}

function toggleDropdown() {
  console.log("🔍 TOGGLING DROPDOWN:", !dropdownOpen.value)
  dropdownOpen.value = !dropdownOpen.value
}

function selectFilter(type: FilterType) {
  console.log("🔍 SELECTING FILTER:", type)
  selectedFilter.value = type
  dropdownOpen.value = false
  emitUpdate()
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  console.log("🔍 EXTERNAL FILTER CHANGE:", newValue)
  if (newValue.search !== searchQuery.value) {
    searchQuery.value = newValue.search
  }
  if (newValue.type !== selectedFilter.value) {
    selectedFilter.value = newValue.type
  }
}, { deep: true })

// Watch search input for debounced updates
watch(searchQuery, (newValue) => {
  debouncedSearch(newValue)
})

// Watch filter changes for debugging
watch(selectedFilter, (newValue) => {
  console.log("🔍 FILTER CHANGED TO:", newValue)
})

// Close dropdown on click outside
document.addEventListener('click', () => {
  dropdownOpen.value = false
})
</script>
