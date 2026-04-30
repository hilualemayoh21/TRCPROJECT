<template>
  <div class="min-h-screen bg-gray-50 font-sans selection:bg-trc/20 selection:text-trc">
    
    <!-- ╔═══════════════════════════════════════════════════╗
         ║  DESKTOP  ≥1024px  –  Split Screen (Image 2)     ║
         ╚═══════════════════════════════════════════════════╝ -->
    <div class="hidden min-h-screen lg:flex bg-white">
      <!-- ── LEFT: Branding side (matching Image 2) ── -->
      <div 
        class="relative flex flex-1 flex-col justify-between p-20 animate-fade-in overflow-hidden"
        style="animation-delay: 0.05s; background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);"
      >
        <!-- Background Pattern Layer -->
        <div class="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-multiply" 
             style="background-image: radial-gradient(#6c2bd9 0.5px, transparent 0.5px); background-size: 24px 24px;"></div>
        
        <div class="relative z-10">
          <!-- Logo -->
          <div class="mb-12">
            <RouterLink to="/" class="inline-flex items-center group hover:opacity-90 transition" aria-label="TRC Home">
              <Logo theme="light" />
            </RouterLink>
          </div>

          <!-- Hero Content -->
          <div class="max-w-[580px]">
          <h1 class="mb-6 text-[3.8rem] font-bold leading-[1.05] tracking-tight text-gray-900">
            Preserving knowledge,<br/>
            <span class="text-trc">empowering futures.</span>
          </h1>
          <p class="mb-12 text-[1.1rem] leading-relaxed text-gray-600 font-medium">
            Join the Digital Curator community. Access a comprehensive repository of resources, research papers, and institutional data dedicated to Tigray's reconstruction and heritage.
          </p>

          <!-- Benefit Cards -->
          <div class="flex gap-6 mt-16 animate-fade-up" style="animation-delay: 0.3s">
            <div class="flex-1 rounded-2xl bg-white p-6 shadow-xl shadow-trc/5 border border-white">
               <div class="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-trc text-white">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                   <polyline points="20 6 9 17 4 12"/>
                 </svg>
               </div>
               <h3 class="text-[1.05rem] font-bold text-gray-900">Verified Assets</h3>
               <p class="text-[0.8rem] leading-relaxed text-gray-500 mt-1">Access peer-reviewed institutional resources.</p>
            </div>
            <div class="flex-1 rounded-2xl bg-white p-6 shadow-xl shadow-trc/5 border border-white">
               <div class="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-trc text-white">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                   <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                 </svg>
               </div>
               <h3 class="text-[1.05rem] font-bold text-gray-900">Secure Access</h3>
               <p class="text-[0.8rem] leading-relaxed text-gray-500 mt-1">Granular permission controls for contributors.</p>
            </div>
          </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="relative z-10 text-[0.85rem] font-medium text-gray-400">
          &copy; 2024 Tigray Resources Center. All rights reserved.
        </div>
      </div>

      <!-- ── RIGHT: Form side (matching Image 2) ── -->
      <div class="relative flex w-[580px] shrink-0 flex-col justify-center px-20 py-12">
        <div class="animate-fade-in" style="animation-delay: 0.2s">
          <header class="mb-10">
            <h2 class="mb-1.5 text-[2.4rem] font-bold tracking-tight text-gray-900">Create an account</h2>
            <p class="text-[0.95rem] font-medium text-gray-400">Enter your details to join the TRC platform.</p>
          </header>

          <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
            <!-- Full Name -->
            <div class="space-y-2">
              <label class="text-[0.9rem] font-bold text-gray-700">Full Name</label>
              <BaseInput v-model="form.name" placeholder="Dr. Alula Tesfay" :error="fieldErrors.name" class="bg-[#F3F1FF] border-none shadow-none rounded-2xl overflow-hidden p-1" />
            </div>

            <!-- Email -->
            <div class="space-y-2">
              <label class="text-[0.9rem] font-bold text-gray-700">Email Address</label>
              <BaseInput v-model="form.email" type="email" placeholder="alula@institution.edu" :error="fieldErrors.email" class="bg-[#F3F1FF] border-none shadow-none rounded-2xl overflow-hidden p-1" />
            </div>

            <!-- Institution & Role Grid -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-[0.9rem] font-bold text-gray-700">Institution</label>
                <BaseInput v-model="form.institution" placeholder="Mekelle University" class="bg-[#F3F1FF] border-none shadow-none rounded-2xl overflow-hidden p-1" />
              </div>
              <div class="space-y-2 relative">
                <label class="text-[0.9rem] font-bold text-gray-700">Role</label>
                <div class="relative">
                  <select v-model="form.role" class="w-full rounded-2xl border-none bg-[#F3F1FF] py-3.5 px-4 text-[0.95rem] font-semibold text-gray-600 outline-none appearance-none">
                    <option value="" disabled>Select your role</option>
                    <option value="researcher">Researcher</option>
                    <option value="public_user">Public User</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-[0.9rem] font-bold text-gray-700">Password</label>
                <div class="flex h-5 w-5 items-center justify-center rounded-full bg-trc text-white text-[10px] cursor-help">i</div>
              </div>
              <BaseInput v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••••••" :error="fieldErrors.password" class="bg-[#F3F1FF] border-none shadow-none rounded-2xl overflow-hidden p-1">
                <template #action>
                  <button type="button" class="text-gray-400 hover:text-trc outline-none" @click="showPassword = !showPassword">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" v-if="!showPassword"/><circle cx="12" cy="12" r="3" v-if="!showPassword"/>
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" v-else/><line x1="1" y1="1" x2="23" y2="23" v-if="showPassword"/>
                    </svg>
                  </button>
                </template>
              </BaseInput>
            </div>

            <!-- Terms -->
            <label class="flex cursor-pointer select-none items-start gap-3 mt-1">
              <input v-model="form.agree" type="checkbox" class="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-trc focus:ring-trc" />
              <span class="text-[0.78rem] font-medium leading-[1.3] text-gray-500">
                I agree to the <span class="font-bold text-trc">Terms of Service</span> and <span class="font-bold text-trc">Privacy Policy</span> regarding data handling and resource contribution.
              </span>
            </label>

            <!-- API Error -->
            <Transition name="slide-down">
              <div v-if="authError" class="mb-2 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
                <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                {{ authError }}
              </div>
            </Transition>

            <!-- Buttons -->
            <div class="mt-4 flex flex-col gap-6">
              <BaseButton type="submit" variant="primary" size="lg" :loading="loading" class="py-4 rounded-xl text-[1.1rem]">
                Get Started
              </BaseButton>

              <div class="flex items-center gap-3">
                <span class="h-px flex-1 bg-gray-100 uppercase"></span>
                <span class="text-[0.65rem] font-bold text-gray-300 uppercase tracking-widest">OR</span>
                <span class="h-px flex-1 bg-gray-100 uppercase"></span>
              </div>

              <BaseButton type="button" @click="router.push('/login')" variant="social" size="lg" class="py-4 bg-[#F3F1FF] border-none rounded-xl text-trc font-bold hover:bg-[#ebe7ff]">
                Login
              </BaseButton>
            </div>
          </form>

          <!-- Help footer -->
          <footer class="mt-12">
            <div class="flex items-center justify-center rounded-xl bg-gray-50 py-3.5 text-[0.85rem] font-medium text-gray-400">
               Need assistance?&nbsp;<RouterLink to="/support" class="font-bold text-trc hover:underline">Contact Support</RouterLink>
            </div>
          </footer>
        </div>

        <!-- Floating help icon -->
        <button class="absolute bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-white text-trc shadow-2xl transition hover:scale-110">
          <span class="text-2xl font-bold">?</span>
        </button>
      </div>
    </div>

    <!-- ╔═══════════════════════════════════════════════════╗
         ║  TABLET  768px - 1023px  –  Card View (Image 1)  ║
         ╚═══════════════════════════════════════════════════╝ -->
    <div class="hidden min-h-screen items-center justify-center p-8 md:flex lg:hidden bg-gray-100">
      <AuthCard class="grid max-w-[960px] grid-cols-[1.25fr,1fr] overflow-hidden shadow-2xl">
        <!-- ── LEFT: Brand Side ── -->
        <aside class="relative flex flex-col justify-between p-12 text-white overflow-hidden" style="background: linear-gradient(160deg, #6C2BD9 0%, #4a1a9e 60%, #3a1085 100%)">
          <!-- Top section: Logo and Header -->
          <div>
            <!-- Logo -->
            <div class="relative z-10 mb-12">
              <RouterLink to="/" class="inline-flex items-center group hover:opacity-90 transition" aria-label="TRC Home">
                <Logo theme="dark" />
              </RouterLink>
            </div>

            <!-- Header Text -->
            <div class="relative z-10 space-y-4">
              <h2 class="text-[2.6rem] font-bold leading-[1.1] tracking-tight">Join the global archive of <span class="opacity-70">Tigrayan heritage.</span></h2>
              <p class="text-[0.95rem] leading-relaxed opacity-90 font-medium">Access a curated digital collection of resources, academic research, and historical documentation.</p>
            </div>
          </div>

          <!-- Bottom section: Floating Testimonial -->
          <div class="relative z-10 mt-12 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
            <div class="flex items-center gap-3 mb-4">
              <div class="h-12 w-12 overflow-hidden rounded-full border-2 border-white/50 bg-gray-200">
                 <div class="h-full w-full bg-gradient-to-tr from-trc-dark to-trc"></div>
              </div>
              <div>
                 <div class="text-[0.95rem] font-bold">Dr. Tesfay Kahsay</div>
                 <div class="text-[0.7rem] font-bold uppercase tracking-widest opacity-70">Senior Research Fellow</div>
              </div>
            </div>
            <blockquote class="text-[0.88rem] font-medium leading-relaxed opacity-90">
              "The TRC platform has revolutionized how we preserve and share critical cultural data with the international community."
            </blockquote>
          </div>
        </aside>

        <!-- ── RIGHT: Form Side ── -->
        <div class="flex flex-col justify-center bg-white px-12 py-10">
          <h1 class="mb-1 text-[2rem] font-bold text-gray-900 leading-tight">Create your account</h1>
          <p class="mb-8 text-[0.9rem] text-gray-400 font-medium">Fill in your professional details to get started.</p>

          <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
            <!-- Full Name -->
            <div class="space-y-1">
              <label class="text-[0.7rem] font-bold uppercase tracking-wider text-gray-400">Full Name</label>
              <BaseInput v-model="form.name" placeholder="Abeba Haile" :error="fieldErrors.name">
                <template #icon>
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-gray-300"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </template>
              </BaseInput>
            </div>

            <!-- Email Address -->
            <div class="space-y-1">
              <label class="text-[0.7rem] font-bold uppercase tracking-wider text-gray-400">Email Address</label>
              <BaseInput v-model="form.email" type="email" placeholder="abeba@institution.edu" :error="fieldErrors.email">
                <template #icon>
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-gray-300"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
                </template>
              </BaseInput>
            </div>

            <!-- Institution & Role Grid -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-[0.7rem] font-bold uppercase tracking-wider text-gray-400">Institution</label>
                <select v-model="form.institution" class="w-full rounded-xl border-none bg-gray-50 py-3 pl-4 pr-10 text-[0.85rem] font-semibold text-gray-600 outline-none ring-1 ring-inset ring-gray-100 focus:ring-2 focus:ring-trc appearance-none">
                  <option value="" disabled>Select Institution</option>
                  <option value="MU">Mekelle University</option>
                  <option value="AU">Adigrat University</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-[0.7rem] font-bold uppercase tracking-wider text-gray-400">Primary Role</label>
                <select v-model="form.role" class="w-full rounded-xl border-none bg-gray-50 py-3 pl-4 pr-10 text-[0.85rem] font-semibold text-gray-600 outline-none ring-1 ring-inset ring-gray-100 focus:ring-2 focus:ring-trc appearance-none">
                  <option value="" disabled>Select Role</option>
                  <option value="researcher">Researcher</option>
                  <option value="public_user">Public User</option>
                </select>
              </div>
            </div>

            <!-- Password & Confirm Grid -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-[0.7rem] font-bold uppercase tracking-wider text-gray-400">Password</label>
                <BaseInput v-model="form.password" type="password" placeholder="••••••••" :error="fieldErrors.password">
                  <template #icon>
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-gray-300"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  </template>
                </BaseInput>
              </div>
              <div class="space-y-1">
                <label class="text-[0.7rem] font-bold uppercase tracking-wider text-gray-400">Confirm</label>
                <BaseInput v-model="form.confirm" type="password" placeholder="••••••••" :error="fieldErrors.confirm">
                  <template #icon>
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-gray-300"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3L15.5 7.5z"/></svg>
                  </template>
                </BaseInput>
              </div>
            </div>

            <!-- Terms -->
            <label class="flex cursor-pointer select-none items-center gap-2.5 text-[0.7rem] font-medium text-gray-400 leading-tight mt-2">
              <input v-model="form.agree" type="checkbox" class="h-4 w-4 rounded border-gray-300 accent-trc" />
              <span>I agree to the <span class="font-bold text-trc">Terms of Service</span> and <span class="font-bold text-trc">Privacy Policy</span> regarding data archiving.</span>
            </label>

            <!-- API Error -->
            <Transition name="slide-down">
              <div v-if="authError" class="mt-2 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[0.8rem] text-red-600 font-medium" role="alert">
                <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                {{ authError }}
              </div>
            </Transition>

            <!-- Submit -->
            <BaseButton type="submit" variant="primary" size="lg" :loading="loading" class="mt-4 py-4 rounded-xl shadow-lg ring ring-trc/5">
              Create Account
            </BaseButton>

            <!-- Back to Login -->
            <p class="mt-4 text-center text-xs font-semibold text-gray-400">
               Already have an account? <RouterLink to="/login" class="text-trc hover:underline">Login here</RouterLink>
            </p>
          </form>
        </div>
      </AuthCard>
    </div>

    <!-- ╔═════════════════════════════════════════╗
         ║  MOBILE  <768px  –  Single Column       ║
         ╚═════════════════════════════════════════╝ -->
    <div class="flex min-h-screen flex-col bg-white px-6 py-10 md:hidden">
       <!-- Content same as desktop form side but centered -->
       <div class="mx-auto w-full max-w-[420px] animate-fade-up">
          <RouterLink to="/" class="inline-flex items-center mb-8 group hover:opacity-90 transition" aria-label="TRC Home">
            <Logo theme="light" />
          </RouterLink>

          <h1 class="mb-1 text-[1.8rem] font-bold text-gray-900 leading-tight">Create your account</h1>
          <p class="mb-8 text-[0.9rem] text-gray-500 font-medium">Join the Tigray Resources Center digital archive.</p>

          <!-- Simplified Mobile Form -->
          <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
             <BaseInput v-model="form.name" label="Full Name" placeholder="Abeba Haile" />
             <BaseInput v-model="form.email" label="Email Address" type="email" placeholder="abeba@institution.edu" />
             
             <!-- Institution & Role Grid -->
             <div class="grid grid-cols-2 gap-4">
               <BaseInput v-model="form.institution" label="Institution" placeholder="MU" />
               
               <div class="flex flex-col gap-1.5">
                 <label class="text-xs font-semibold text-gray-500 tracking-wide">Role</label>
                 <div class="relative flex items-center rounded-xl border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 focus-within:border-purple-500/50 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(108,43,217,0.12)]">
                   <select v-model="form.role" class="w-full bg-transparent py-3.5 pl-4 pr-11 text-sm text-gray-900 outline-none appearance-none">
                     <option value="" disabled>Select Role</option>
                     <option value="researcher">Researcher</option>
                     <option value="public_user">Public User</option>
                   </select>
                   <div class="pointer-events-none absolute right-3.5 flex shrink-0 text-gray-400">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
                   </div>
                 </div>
               </div>
             </div>

             <BaseInput v-model="form.password" label="Password" type="password" placeholder="••••••••" />
             
             <Transition name="slide-down">
               <div v-if="authError" class="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
                 <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                 {{ authError }}
               </div>
             </Transition>

             <BaseButton type="submit" variant="primary" size="lg" :loading="loading">Get Started</BaseButton>
          </form>

          <p class="mt-8 text-center text-sm font-medium text-gray-500">
            Already have an account? <RouterLink to="/login" class="font-bold text-trc hover:underline">Login</RouterLink>
          </p>
       </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/modules/auth/auth.store'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AuthCard from '@/components/ui/AuthCard.vue'
import Logo from '@/components/ui/Logo.vue'

const router = useRouter()
const authStore = useAuthStore()
const { register, loading, error: authError } = useAuth()

const showPassword = ref(false)
const form = reactive({
  name: '',
  email: '',
  institution: '',
  role: '',
  password: '',
  confirm: '',
  agree: false
})

const fieldErrors = ref<Record<string, string>>({})

function validate(): boolean {
  fieldErrors.value = {}
  if (!form.name) fieldErrors.value.name = 'Please enter your full name.'
  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    fieldErrors.value.email = 'Please enter a valid email address.'
  }
  if (!form.password || form.password.length < 6) {
    fieldErrors.value.password = 'Password must be at least 6 characters.'
  }
  return Object.keys(fieldErrors.value).length === 0
}

const handleSubmit = async () => {
  if (!validate()) return
  try {
    await register(
      form.name.trim(),
      form.email.trim().toLowerCase(),
      form.password,
      form.role,
      form.institution?.trim()
    )
    router.push(authStore.getPostLoginRoute())
  } catch (err) {
    console.error('Registration failed', err)
  }
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
.animate-fade-up { animation: fadeUp 0.6s ease-out forwards; }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
