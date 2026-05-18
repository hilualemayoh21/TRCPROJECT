<template>
  <div class="max-w-7xl mx-auto w-full font-sans text-gray-900 dark:text-gray-100 pb-16 md:pb-10 p-4 md:p-6 lg:p-8 selection:bg-purple-500/20 selection:text-purple-900 transition-colors">
    
    <!-- Cover / Banner Image -->
    <div class="w-full h-40 md:h-56 lg:h-64 rounded-3xl md:rounded-[2rem] bg-gray-900 relative overflow-hidden shadow-md">
      <img 
        src="https://images.unsplash.com/photo-1505909182942-e2f09aee3e89?q=80&w=1200&auto=format&fit=crop" 
        alt="Cover Background" 
        class="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
    </div>

    <!-- Main Responsive Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-[-50px] md:mt-[-80px] relative z-10">
      
      <!-- Left Sidebar (Identity, Completion, Stats) -->
      <div class="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
        
        <!-- Profile Identity Card -->
        <div class="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          <!-- Avatar with Badge -->
          <div class="relative mb-5 group cursor-pointer" @click="triggerAvatarUpload">
            <img 
              :src="getAvatarUrl(profileForm.avatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileForm.name)}&background=6C2BD9&color=fff`" 
              alt="Profile Picture" 
              class="w-28 h-28 md:w-32 md:h-32 rounded-[2rem] border-4 border-white dark:border-gray-800 shadow-md object-cover bg-gray-100 dark:bg-gray-800 transition-all group-hover:brightness-75"
              :class="{ 'opacity-50': uploadingAvatar }"
            />
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <LoadingOutlined v-if="uploadingAvatar" class="text-white text-2xl" />
              <CameraOutlined v-else class="text-white text-2xl" />
            </div>
            <div class="absolute bottom-[-4px] right-[-4px] h-8 w-8 bg-purple-700 rounded-xl border-2 border-white flex items-center justify-center shadow-sm">
              <CheckOutlined class="text-white text-xs font-bold" />
            </div>
            <!-- Hidden File Input -->
            <input 
              ref="fileInput"
              type="file" 
              accept="image/*" 
              class="hidden" 
              @change="handleAvatarChange"
            />
          </div>

          <!-- Name & Role -->
          <h1 class="text-2xl font-black text-gray-900 dark:text-gray-100 mb-1 tracking-tight">{{ profileForm.name }}</h1>
          <p class="text-sm font-bold text-purple-700 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-lg inline-flex mb-4 uppercase tracking-widest">{{ authStore.user?.role }}</p>

          <!-- Bio -->
          <p class="text-[0.85rem] text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-5">
            {{ profileForm.bio || 'Contributing to the preservation of Tigray\'s rich cultural and historical heritage.' }}
          </p>

          <!-- Interest Tags -->
          <div class="flex flex-wrap gap-2 justify-center lg:justify-start mb-6 w-full">
            <span class="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-[0.65rem] font-bold uppercase tracking-widest rounded-lg border border-gray-100 transition-colors cursor-pointer">#DigitalArchive</span>
            <span class="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-[0.65rem] font-bold uppercase tracking-widest rounded-lg border border-gray-100 transition-colors cursor-pointer">#Research</span>
            <span class="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-[0.65rem] font-bold uppercase tracking-widest rounded-lg border border-gray-100 transition-colors cursor-pointer">#Heritage</span>
          </div>

          <!-- Joined Date & Location -->
          <div class="flex flex-col gap-2 text-gray-400 mb-6 w-full items-center lg:items-start">
            <div class="flex items-center gap-2">
              <EnvironmentOutlined class="text-sm" />
              <span class="text-xs font-bold uppercase tracking-wider">{{ profileForm.location || 'Mekelle, Tigray' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <CalendarOutlined class="text-sm" />
              <span class="text-xs font-bold uppercase tracking-wider">Member since {{ new Date(authStore.user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="w-full flex gap-2">
             <button @click="isEditModalOpen = true" class="flex-1 bg-purple-800 hover:bg-purple-900 text-white font-bold text-sm py-3.5 rounded-xl shadow-[0_4px_15px_rgba(107,33,168,0.2)] transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
                <EditOutlined /> Edit Profile
             </button>
             <button @click="copyProfileLink" class="w-12 shrink-0 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-sm py-3.5 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center">
                <ShareAltOutlined />
             </button>
          </div>
        </div>

        <!-- Profile Completion -->
        <div class="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100">Profile Completion</h3>
            <span class="text-sm font-black text-purple-700 dark:text-purple-400">80%</span>
          </div>
          <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mb-4 overflow-hidden">
            <div class="bg-gradient-to-r from-purple-500 to-purple-800 h-full rounded-full transition-all duration-1000 ease-out w-[80%]"></div>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-4">Add your institution to reach 100%.</p>
          <button @click="isEditModalOpen = true" class="text-xs font-bold text-purple-700 dark:text-purple-400 hover:text-purple-900 transition-colors flex items-center gap-1">
            Complete your profile <ArrowRightOutlined class="text-[0.6rem]" />
          </button>
        </div>
      </div>

      <!-- Main Content Area (Tabs, Archives, Activity) -->
      <div class="lg:col-span-8 xl:col-span-9 flex flex-col gap-8 pt-6 lg:pt-0 lg:mt-[80px]">
        
        <!-- Organization Tabs -->
        <div class="flex overflow-x-auto hide-scrollbar gap-3 pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          <button 
            v-for="tab in ['Archives', 'Saved', 'Activity']" :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-6 py-3 font-bold rounded-2xl text-sm whitespace-nowrap shadow-md transition-colors flex items-center',
              activeTab === tab ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-white' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
            ]"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Activity Tab -->
        <div v-if="activeTab === 'Activity'" class="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 lg:p-10 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-gray-50 dark:border-gray-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-8">Recent Activity</h2>
          <div class="space-y-6">
            <div class="flex gap-6 group cursor-pointer">
              <div class="shrink-0 w-14 h-14 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-[1.25rem] flex items-center justify-center transition-transform group-hover:scale-105">
                <CheckOutlined class="text-xl" />
              </div>
              <div class="flex-1 flex flex-col justify-center pb-6 border-b border-gray-50 dark:border-gray-800 group-last:border-0 group-last:pb-0">
                <p class="text-[0.95rem] text-gray-700 dark:text-gray-300 font-medium mb-1">
                  Completed email verification
                </p>
                <div class="flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-widest text-gray-400">
                  <span>Account</span> <span class="text-[10px]">●</span> <span>Recent</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Placeholder for Archives/Saved -->
        <div v-else class="bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl border border-gray-100 dark:border-gray-800 py-24 flex flex-col items-center justify-center text-center">
          <FolderOpenOutlined class="text-4xl text-gray-300 mb-4" />
          <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">No {{ activeTab }} yet</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Your {{ activeTab.toLowerCase() }} will appear here once you start interacting with resources.</p>
        </div>

      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="isEditModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="isEditModalOpen = false"></div>
      
      <div class="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl p-8 animate-fade-in-up">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-xl font-black text-gray-900 dark:text-gray-100">Edit Profile</h2>
          <button @click="isEditModalOpen = false" class="text-gray-400 hover:text-gray-600"><CloseOutlined /></button>
        </div>

        <div class="space-y-6">
          <div>
            <label class="block text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
            <input v-model="profileForm.name" type="text" class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm" />
          </div>
          <div>
            <label class="block text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Location</label>
            <input v-model="profileForm.location" type="text" class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm" />
          </div>
          <div>
            <label class="block text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Bio</label>
            <textarea v-model="profileForm.bio" rows="3" class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm resize-none"></textarea>
          </div>
        </div>

        <div class="mt-8 flex gap-3">
          <button @click="isEditModalOpen = false" class="flex-1 py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl">Cancel</button>
          <button
            @click="saveProfile"
            :disabled="!hasChanges"
            class="flex-1 py-3.5 bg-purple-700 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { 
  CameraOutlined, CheckOutlined, EnvironmentOutlined, CalendarOutlined,
  EditOutlined, ShareAltOutlined, ArrowRightOutlined, FolderOpenOutlined,
  CloseOutlined, LoadingOutlined
} from '@ant-design/icons-vue'
import { useAuthStore } from '@/modules/auth/auth.store'
import { userService } from '../user.service'

const authStore = useAuthStore()
const activeTab = ref('Archives')
const isEditModalOpen = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const uploadingAvatar = ref(false)

const profileForm = ref({
  name: authStore.user?.name || '',
  location: authStore.user?.institution || '',
  bio: '',
  avatar: authStore.user?.avatarUrl || ''
})

const originalProfile = ref({
  name: authStore.user?.name || '',
  location: authStore.user?.institution || '',
  bio: ''
})

const getAvatarUrl = (url: string) => {
  if (!url) return null
  if (url.startsWith('http')) return url
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'
  const origin = apiBase.replace(/\/api$/, '')
  return `${origin}${url}`
}

const hasChanges = computed(() => {
  return (
    profileForm.value.name.trim() !== originalProfile.value.name.trim() ||
    profileForm.value.location.trim() !== originalProfile.value.location.trim()
  )
})

onMounted(async () => {
  try {
    const data = await userService.getMe()
    profileForm.value.name = data.name
    profileForm.value.location = data.institution || ''
    profileForm.value.avatar = data.avatarUrl || ''
    
    // Store original values
    originalProfile.value.name = data.name
    originalProfile.value.location = data.institution || ''
  } catch (err) {
    console.error('Failed to fetch user data', err)
  }
})

const triggerAvatarUpload = () => {
  fileInput.value?.click()
}

const handleAvatarChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  try {
    uploadingAvatar.value = true
    const res = await userService.updateAvatar(file)
    profileForm.value.avatar = res.avatarUrl
    // Update store
    if (authStore.user) {
      authStore.user.avatarUrl = res.avatarUrl
    }
    message.success('Avatar updated successfully!')
  } catch (err: any) {
    const errorMsg = err.error?.message || err.message || 'Failed to upload avatar'
    message.error(`Failed to upload avatar: ${errorMsg}`)
  } finally {
    uploadingAvatar.value = false
  }
}

const copyProfileLink = () => {
  navigator.clipboard.writeText(window.location.href)
  message.success('Profile link copied!')
}

const saveProfile = async () => {
  if (!hasChanges.value) {
    isEditModalOpen.value = false
    return
  }
  try {
    await userService.updateMe({
      name: profileForm.value.name,
      institution: profileForm.value.location,
    })
    // Update store
    if (authStore.user) {
      authStore.user.name = profileForm.value.name
      authStore.user.institution = profileForm.value.location
    }
    // Update original values
    originalProfile.value.name = profileForm.value.name
    originalProfile.value.location = profileForm.value.location

    isEditModalOpen.value = false
    message.success('Profile updated!')
  } catch (err) {
    message.error('Failed to update profile')
  }
}
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
</style>
