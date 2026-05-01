<template>
  <div class="login-root">

    <!-- ╔═══════════════════════════════════════════════════╗
         ║  DESKTOP  ≥1024px  –  full-viewport split layout ║
         ╚═══════════════════════════════════════════════════╝ -->
    <div class="hidden min-h-screen lg:flex bg-white">

      <!-- ── LEFT: Form panel ─────────────────────── -->
      <div
        class="relative flex w-[560px] shrink-0 flex-col justify-between pl-24 pr-12 pt-24 pb-12 animate-fade-in"
        style="animation-delay: 0.05s"
      >
        <!-- Top: logo -->
        <div>
          <RouterLink to="/" class="inline-flex items-center group hover:opacity-80 transition" aria-label="TRC Home">
            <Logo theme="light" />
          </RouterLink>
        </div>

        <!-- Middle: form -->
        <div class="my-auto mt-6 max-w-[400px]">
          <div class="animate-fade-up" style="animation-delay: 0.1s">
            <h1 class="mb-2 text-[2.1rem] font-bold leading-tight tracking-tight text-gray-900">
              Welcome back
            </h1>
            <p class="mb-6 text-[0.95rem] leading-relaxed text-gray-500 font-medium">
              Access the Tigray Resources Center digital archive and curator tools.
            </p>
          </div>

          <form class="flex flex-col gap-4 animate-fade-up" style="animation-delay: 0.18s" @submit.prevent="handleSubmit" novalidate>

            <!-- Email -->
            <div class="space-y-2">
              <label class="text-[0.9rem] font-bold text-gray-700" for="desktop-email">Email Address</label>
              <BaseInput
                id="desktop-email"
                v-model="email"
                type="email"
                placeholder="name@example.com"
                autocomplete="email"
                :error="fieldErrors.email"
                required
              >
                <template #icon>
                  <span class="text-gray-400 font-bold text-lg">@</span>
                </template>
              </BaseInput>
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-[0.9rem] font-bold text-gray-700" for="desktop-password">Password</label>
                <RouterLink
                  to="/forgot-password"
                  class="text-[0.75rem] font-bold text-trc transition hover:underline"
                >
                  Forgot password?
                </RouterLink>
              </div>
              <BaseInput
                id="desktop-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                autocomplete="current-password"
                :error="fieldErrors.password"
                required
              >
                <template #icon>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-gray-400">
                    <rect x="5" y="11" width="14" height="10" rx="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </template>
                <template #action>
                  <button
                    type="button"
                    class="flex items-center text-gray-400 transition hover:text-gray-600 focus:outline-none"
                    @click="showPassword = !showPassword"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" v-if="!showPassword"/>
                      <circle cx="12" cy="12" r="3" v-if="!showPassword"/>
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" v-else/>
                      <line x1="1" y1="1" x2="23" y2="23" v-if="showPassword"/>
                    </svg>
                  </button>
                </template>
              </BaseInput>
            </div>

            <!-- Remember me -->
            <label class="flex cursor-pointer select-none items-center gap-3 text-sm font-semibold text-gray-500">
              <input v-model="keepLoggedIn" type="checkbox" class="h-5 w-5 shrink-0 rounded border-gray-300 accent-trc shadow-sm cursor-pointer" />
              <span>Keep me logged in for 30 days</span>
            </label>

            <!-- API error -->
            <Transition name="slide-down">
              <div v-if="authError" class="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
                <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                {{ authError }}
              </div>
            </Transition>

            <!-- Submit -->
            <BaseButton type="submit" variant="primary" size="lg" :loading="loading" class="mt-2 py-4">Log In</BaseButton>

            <!-- Divider -->
            <div class="flex items-center gap-3 py-2">
              <span class="h-px flex-1 bg-gray-100"/>
              <span class="whitespace-nowrap text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gray-400">Or continue with</span>
              <span class="h-px flex-1 bg-gray-100"/>
            </div>

            <!-- Social buttons -->
            <div class="grid grid-cols-2 gap-4">
              <BaseButton variant="social" size="md" @click="onSocial('google')" class="bg-gray-50 border-none py-3">
                <template #icon>
                  <svg class="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                </template>
                Google
              </BaseButton>
              <BaseButton variant="social" size="md" @click="onSocial('linkedin')" class="bg-gray-50 border-none py-3">
                <template #icon>
                   <svg class="h-5 w-5" viewBox="0 0 24 24"><path fill="#0077b5" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </template>
                LinkedIn
              </BaseButton>
            </div>
          </form>

          <!-- Sign up -->
          <p class="mt-8 text-center text-[0.95rem] text-gray-500 animate-fade-up" style="animation-delay: 0.28s">
            Don't have an account yet?
            <RouterLink to="/register" class="font-bold text-trc hover:underline">
              Create an account
            </RouterLink>
          </p>
        </div>

        <!-- Bottom: support -->
        <div class="mt-4">
          <RouterLink to="/support" class="inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-widest text-gray-400 transition hover:text-trc">
            <div class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-1M12 8v4" stroke-linecap="round"/></svg>
            </div>
            Support Center
          </RouterLink>
        </div>
      </div>

      <!-- ── RIGHT: Photo Hero (Smaller Flush Right) ──────── -->
      <div class="relative flex flex-1 flex-col pt-10 pb-12 pl-20 pr-0">
        <div class="relative h-full w-full overflow-hidden rounded-r-[2.5rem] shadow-2xl">
          <div class="absolute inset-0 bg-cover bg-center animate-fade-in" :style="{ backgroundImage: `url(${loginBg})` }" />
          <div class="absolute inset-0 bg-gradient-to-br from-[#2a0f5c]/60 via-transparent to-[#0f0626]/40" />
          
          <!-- Testimonial card -->
          <article class="absolute bottom-12 right-12 left-12 mx-auto max-w-[480px] rounded-3xl bg-white/90 backdrop-blur-md p-8 shadow-2xl animate-fade-up" style="animation-delay: 0.35s">
            <div class="mb-4 flex gap-1">
              <span v-for="n in 5" :key="n" class="text-[1.2rem] text-[#6C2BD9]">★</span>
            </div>
            <blockquote class="text-[1.2rem] font-bold leading-tight text-gray-800 mb-6">
              "The TRC platform has redefined how we archive regional knowledge. It's not just a tool; it's a digital legacy."
            </blockquote>
            <div class="flex items-center gap-3">
              <div class="h-12 w-12 overflow-hidden rounded-full border-2 border-trc bg-gray-200">
                 <!-- Profile icon placeholder -->
                 <div class="h-full w-full bg-gradient-to-tr from-trc to-trc-accent"></div>
              </div>
              <div>
                <div class="text-[0.95rem] font-bold text-gray-900">Dr. Elias Gebre</div>
                <div class="text-[0.65rem] font-bold uppercase tracking-widest text-trc">Chief Digital Curator</div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>

    <!-- ╔══════════════════════════════════════════╗
         ║  TABLET  768–1023px  –  2-column card   ║
         ╚══════════════════════════════════════════╝ -->
    <div class="hidden min-h-screen items-center justify-center p-6 md:flex lg:hidden bg-gray-100">
      <AuthCard class="w-full max-w-[940px] animate-fade-up overflow-hidden bg-white shadow-2xl">
        <div class="grid min-h-[600px] grid-cols-[1.25fr_1fr]">

          <!-- ── LEFT: Purple brand side ── -->
          <aside class="relative flex flex-col justify-between p-8 text-white" style="background: linear-gradient(160deg, #6C2BD9 0%, #4a1a9e 60%, #3a1085 100%)">
            <div>
              <!-- Logo -->
              <div class="mb-10">
                <RouterLink to="/" class="inline-flex items-center group hover:opacity-90 transition" aria-label="TRC Home">
                  <Logo theme="dark" />
                </RouterLink>
              </div>
              <h2 class="mb-5 text-[1.7rem] font-bold leading-tight">The Digital Curator for resource excellence.</h2>
              <p class="text-[0.95rem] leading-relaxed opacity-85 font-medium">Access curated documents, strategic insights, and community resources in one authoritative platform.</p>
            </div>

            <!-- Testimonial card -->
            <div class="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
              <blockquote class="mb-4 text-[0.85rem] font-semibold italic leading-relaxed">
                "TRC has transformed how we manage regional documentation and strategic planning."
              </blockquote>
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/30 bg-teal-800 text-[0.7rem] font-bold">AG</div>
                <div>
                  <div class="text-[0.9rem] font-bold">Amanuel G.</div>
                  <div class="text-[0.75rem] font-medium opacity-70">Executive Director</div>
                </div>
              </div>
            </div>
          </aside>

          <!-- ── RIGHT: Form side ── -->
          <div class="flex flex-col justify-center px-14 py-10">
            <h1 class="mb-1 text-[1.9rem] font-bold text-gray-900 leading-tight">Welcome Back</h1>
            <p class="mb-8 text-[0.9rem] text-gray-500 font-medium">Please enter your details to sign in.</p>

            <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
              <!-- Social -->
              <div class="grid grid-cols-2 gap-3">
                <BaseButton variant="social" size="md" @click="onSocial('google')">
                  <template #icon>
                    <svg class="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  </template>
                  Google
                </BaseButton>
                <BaseButton variant="social" size="md" @click="onSocial('facebook')">
                  <template #icon>
                    <svg class="h-4 w-4" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.02 1.792-4.688 4.533-4.688 1.312 0 2.686.235 2.686.235v2.953H13.83c-1.491 0-1.955.925-1.955 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                  </template>
                  Facebook
                </BaseButton>
              </div>

              <!-- Divider -->
              <div class="flex items-center gap-4 py-1">
                <span class="h-px flex-1 bg-gray-100"></span>
                <span class="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-gray-400">OR USE EMAIL</span>
                <span class="h-px flex-1 bg-gray-100"></span>
              </div>

              <!-- Email -->
              <BaseInput id="email-tablet" v-model="email" label="Email Address" placeholder="name@example.com" :error="fieldErrors.email">
                <template #icon>
                   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16v12H4z" stroke-linejoin="round"/><path d="M4 6l8 5.5L20 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </template>
              </BaseInput>

              <!-- Password -->
              <BaseInput id="password-tablet" v-model="password" label="Password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" :error="fieldErrors.password">
                <template #icon>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                </template>
                <template #action>
                  <button type="button" @click="showPassword = !showPassword" class="text-gray-400 hover:text-gray-600 transition">
                    <svg v-if="!showPassword" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  </button>
                </template>
              </BaseInput>

              <!-- Remember + Forgot -->
              <div class="flex items-center justify-between">
                <label class="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-500">
                  <input type="checkbox" v-model="keepLoggedIn" class="h-4 w-4 accent-trc rounded shadow-sm" />
                  Remember Me
                </label>
                <RouterLink to="/forgot-password" class="text-sm font-bold text-trc hover:underline transition">Forgot Password?</RouterLink>
              </div>

              <!-- Submit -->
              <BaseButton type="submit" variant="primary" size="lg" :loading="loading">
                <div class="flex items-center gap-2">
                  <span>Log In</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </BaseButton>
            </form>

            <p class="mt-8 text-center text-[0.95rem] text-gray-500">
              Don't have an account? <RouterLink to="/register" class="font-bold text-trc hover:underline">Create Account</RouterLink>
            </p>

            <div class="mt-10 flex items-center justify-center gap-6 text-[0.65rem] font-bold text-gray-300 tracking-widest uppercase">
              <RouterLink to="/privacy" class="hover:text-trc transition">PRIVACY POLICY</RouterLink>
              <RouterLink to="/terms" class="hover:text-trc transition">TERMS OF SERVICE</RouterLink>
            </div>
          </div>
        </div>
      </AuthCard>
    </div>

    <!-- ╔══════════════════════════════════════════╗
         ║  MOBILE  <768px  –  single column       ║
         ╚══════════════════════════════════════════╝ -->
    <div class="flex min-h-screen flex-col justify-center bg-gray-50 px-5 py-10 md:hidden">
      <div class="mx-auto w-full max-w-[420px] animate-fade-up">
        <!-- Logo -->
        <div class="mb-8">
          <RouterLink to="/" class="inline-flex items-center group hover:opacity-80 transition" aria-label="TRC Home">
            <Logo theme="light" />
          </RouterLink>
        </div>

        <h1 class="mb-2 text-[1.8rem] font-bold text-gray-900 leading-tight">Welcome back</h1>
        <p class="mb-8 text-[0.9rem] leading-relaxed text-gray-500 font-medium">Access the Tigray Resources Center digital archive and curator tools.</p>

        <form class="flex flex-col gap-5" @submit.prevent="handleSubmit" novalidate>
          <BaseInput id="mobile-email" v-model="email" label="Email Address" type="email" placeholder="name@example.com" autocomplete="email" :error="fieldErrors.email" required>
            <template #icon>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16v12H4z" stroke-linejoin="round"/><path d="M4 6l8 5.5L20 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </template>
          </BaseInput>

          <BaseInput id="mobile-password" v-model="password" label="Password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" autocomplete="current-password" :error="fieldErrors.password" required>
            <template #labelRight>
              <RouterLink to="/forgot-password" class="text-xs font-semibold text-trc hover:underline">Forgot password?</RouterLink>
            </template>
            <template #icon>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </template>
            <template #action>
              <button type="button" class="flex text-gray-400 transition hover:text-gray-600" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </template>
          </BaseInput>

          <label class="flex cursor-pointer select-none items-center gap-2.5 text-sm font-medium text-gray-600">
            <input v-model="keepLoggedIn" type="checkbox" class="h-4 w-4 rounded accent-trc"/>
            <span>Keep me logged in for 30 days</span>
          </label>

          <Transition name="slide-down">
            <div v-if="authError" class="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
              {{ authError }}
            </div>
          </Transition>

          <BaseButton type="submit" variant="primary" size="lg" :loading="loading">Log In</BaseButton>

          <div class="flex items-center gap-3">
            <span class="h-px flex-1 bg-gray-200"/>
            <span class="whitespace-nowrap text-[0.65rem] font-bold uppercase tracking-widest text-gray-400">Or continue with</span>
            <span class="h-px flex-1 bg-gray-200"/>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <BaseButton variant="social" size="md" @click="onSocial('google')">
              <template #icon>
                <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              </template>
              Google
            </BaseButton>
            <BaseButton variant="social" size="md" @click="onSocial('facebook')">
              <template #icon>
                <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.02 1.792-4.688 4.533-4.688 1.312 0 2.686.235 2.686.235v2.953H13.83c-1.491 0-1.955.925-1.955 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
              </template>
              Facebook
            </BaseButton>
          </div>
        </form>

        <p class="mt-8 text-center text-[0.95rem] text-gray-500">
          Don't have an account yet? <RouterLink to="/register" class="font-bold text-trc hover:underline">Create an account</RouterLink>
        </p>

        <div class="mt-6 flex items-center justify-center gap-3 text-[0.65rem] font-bold uppercase tracking-wider text-gray-400">
          <RouterLink to="/privacy" class="transition hover:text-trc">Privacy Policy</RouterLink>
          <span aria-hidden="true">·</span>
          <RouterLink to="/terms" class="transition hover:text-trc">Terms of Service</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/modules/auth/auth.store'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AuthCard from '@/components/ui/AuthCard.vue'
import Logo from '@/components/ui/Logo.vue'
import loginBg from '@/assets/images/login_panel_bg.png'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { login, loading, error: authError } = useAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const keepLoggedIn = ref(false)

const fieldErrors = ref<{ email?: string; password?: string }>({})

function validate(): boolean {
  fieldErrors.value = {}
  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    fieldErrors.value.email = 'Please enter a valid email address.'
  }
  if (!password.value || password.value.length < 6) {
    fieldErrors.value.password = 'Password must be at least 6 characters.'
  }
  return Object.keys(fieldErrors.value).length === 0
}

const handleSubmit = async () => {
  if (!validate()) return
  try {
    await login(email.value.trim().toLowerCase(), password.value)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
    router.push(redirect || authStore.getPostLoginRoute())
  } catch {
    /* error surfaced from store */
  }
}

function onSocial(provider: string) {
  console.info(`Social login via ${provider}`)
}
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
