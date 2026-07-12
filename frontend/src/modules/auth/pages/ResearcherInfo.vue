<template>
  <div class="min-h-screen bg-gray-50 font-sans selection:bg-trc/20 selection:text-trc">

    <!-- ╔══════════════════════════════════╗
         ║  DESKTOP ≥1024px – Split Screen  ║
         ╚══════════════════════════════════╝ -->
    <div class="hidden min-h-screen lg:flex bg-white">
      <!-- ── LEFT: Branding side ── -->
      <div
        class="relative flex flex-1 flex-col justify-between p-20 animate-fade-in overflow-hidden"
        style="animation-delay: 0.05s; background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);"
      >
        <!-- Background Pattern -->
        <div
          class="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-multiply"
          style="background-image: radial-gradient(#6c2bd9 0.5px, transparent 0.5px); background-size: 24px 24px;"
        ></div>

        <div class="relative z-10">
          <!-- Logo -->
          <div class="mb-12">
            <RouterLink to="/" class="inline-flex items-center group hover:opacity-90 transition" aria-label="TRC Home">
              <Logo theme="light" />
            </RouterLink>
          </div>

          <!-- Hero Content -->
          <div class="max-w-[520px]">
            <div class="mb-6 inline-flex items-center gap-2 rounded-full bg-trc/10 px-4 py-1.5 text-[0.8rem] font-bold text-trc">
              <span class="h-2 w-2 rounded-full bg-trc animate-pulse"></span>
              Step 2 of 2 — Researcher Profile
            </div>
            <h1 class="mb-6 text-[3.2rem] font-bold leading-[1.05] tracking-tight text-gray-900">
              Verify your<br/>
              <span class="text-trc">credentials.</span>
            </h1>
            <p class="mb-12 text-[1.05rem] leading-relaxed text-gray-600 font-medium">
              Provide your academic details and upload supporting documents so our admin team can verify you are a real researcher and grant you full access.
            </p>

            <!-- Steps -->
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-4 rounded-2xl bg-white/70 p-4 shadow-sm border border-white backdrop-blur-sm">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-trc text-white text-sm font-bold">✓</div>
                <div>
                  <div class="text-[0.9rem] font-bold text-gray-900">Account Created</div>
                  <div class="text-[0.75rem] text-gray-400">Basic information registered successfully.</div>
                </div>
              </div>
              <div class="flex items-center gap-4 rounded-2xl bg-trc p-4 shadow-lg shadow-trc/20">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-trc text-sm font-bold">2</div>
                <div>
                  <div class="text-[0.9rem] font-bold text-white">Researcher Profile + Documents</div>
                  <div class="text-[0.75rem] text-white/70">Complete your academic details now.</div>
                </div>
              </div>
              <div class="flex items-center gap-4 rounded-2xl bg-white/40 p-4 shadow-sm border border-white/60 opacity-60">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500 text-sm font-bold">3</div>
                <div>
                  <div class="text-[0.9rem] font-bold text-gray-500">Admin Review</div>
                  <div class="text-[0.75rem] text-gray-400">Await admin verification and approval.</div>
                </div>
              </div>
            </div>

            <!-- Documents info box -->
            <div class="mt-8 rounded-2xl bg-white/60 border border-white p-5 backdrop-blur-sm">
              <p class="text-[0.82rem] font-bold text-gray-700 mb-2">📎 Required Documents</p>
              <ul class="space-y-1.5 text-[0.8rem] text-gray-600">
                <li class="flex items-start gap-2"><span class="text-red-500 font-bold mt-0.5">*</span>Government or University ID (photo/scan)</li>
                <li class="flex items-start gap-2"><span class="text-red-500 font-bold mt-0.5">*</span>Affiliation letter from your institution</li>
                <li class="flex items-start gap-2"><span class="text-gray-400 font-bold mt-0.5">◦</span>CV or Resume (optional but recommended)</li>
              </ul>
              <p class="mt-3 text-[0.72rem] text-gray-400">Accepted: PDF, JPG, PNG, DOCX — Max 5 MB each</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="relative z-10 text-[0.85rem] font-medium text-gray-400">
          &copy; 2024 Tigray Resources Center. All rights reserved.
        </div>
      </div>

      <!-- ── RIGHT: Form side ── -->
      <div class="relative flex w-[620px] shrink-0 flex-col justify-center px-20 py-10 overflow-y-auto">
        <div class="animate-fade-in" style="animation-delay: 0.2s">
          <header class="mb-8">
            <h2 class="mb-1.5 text-[2rem] font-bold tracking-tight text-gray-900">Researcher Profile</h2>
            <p class="text-[0.9rem] font-medium text-gray-400">Complete all fields and upload the required documents.</p>
          </header>

          <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
            <!-- ORCID -->
            <div class="space-y-2">
              <label class="text-[0.85rem] font-bold text-gray-700">
                ORCID iD
                <span class="ml-1 text-[0.75rem] font-normal text-gray-400">(optional)</span>
              </label>
              <BaseInput
                v-model="form.orcid"
                placeholder="0000-0000-0000-0000"
                class="bg-[#F3F1FF] border-none shadow-none rounded-2xl overflow-hidden p-1"
              />
            </div>

            <!-- Research Focus -->
            <div class="space-y-2">
              <label class="text-[0.85rem] font-bold text-gray-700">Research Focus / Field <span class="text-red-500">*</span></label>
              <div class="relative">
                <select
                  v-model="form.researchFocus"
                  :class="['w-full rounded-2xl border-none bg-[#F3F1FF] py-3.5 px-4 text-[0.9rem] font-semibold outline-none appearance-none transition', form.researchFocus ? 'text-gray-700' : 'text-gray-400']"
                >
                  <option value="" disabled>Select your primary field</option>
                  <option value="history">History &amp; Cultural Heritage</option>
                  <option value="agriculture">Agriculture &amp; Food Security</option>
                  <option value="medicine">Medicine &amp; Public Health</option>
                  <option value="engineering">Engineering &amp; Infrastructure</option>
                  <option value="education">Education &amp; Pedagogy</option>
                  <option value="economics">Economics &amp; Development</option>
                  <option value="environmental">Environmental Studies</option>
                  <option value="social">Social Sciences</option>
                  <option value="other">Other</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
              <p v-if="fieldErrors.researchFocus" class="text-[0.78rem] font-semibold text-red-500">{{ fieldErrors.researchFocus }}</p>
            </div>

            <!-- Academic Title & Years Experience -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-[0.85rem] font-bold text-gray-700">Academic Title <span class="text-red-500">*</span></label>
                <div class="relative">
                  <select
                    v-model="form.academicTitle"
                    :class="['w-full rounded-2xl border-none bg-[#F3F1FF] py-3.5 px-4 text-[0.9rem] font-semibold outline-none appearance-none', form.academicTitle ? 'text-gray-700' : 'text-gray-400']"
                  >
                    <option value="" disabled>Select title</option>
                    <option value="student">Student</option>
                    <option value="researcher">Researcher</option>
                    <option value="lecturer">Lecturer</option>
                    <option value="assistant_professor">Assistant Professor</option>
                    <option value="associate_professor">Associate Professor</option>
                    <option value="professor">Professor</option>
                    <option value="independent">Independent Researcher</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>
                <p v-if="fieldErrors.academicTitle" class="text-[0.78rem] font-semibold text-red-500">{{ fieldErrors.academicTitle }}</p>
              </div>
              <div class="space-y-2">
                <label class="text-[0.85rem] font-bold text-gray-700">Years of Experience</label>
                <BaseInput
                  v-model="form.yearsExperience"
                  type="number"
                  placeholder="e.g. 5"
                  min="0"
                  max="60"
                  class="bg-[#F3F1FF] border-none shadow-none rounded-2xl overflow-hidden p-1"
                />
              </div>
            </div>

            <!-- Bio -->
            <div class="space-y-2">
              <label class="text-[0.85rem] font-bold text-gray-700">Brief Research Bio <span class="text-red-500">*</span></label>
              <textarea
                v-model="form.bio"
                rows="4"
                placeholder="Describe your research background, ongoing projects, and how you intend to use TRC resources..."
                class="w-full resize-none rounded-2xl bg-[#F3F1FF] px-4 py-3.5 text-[0.9rem] font-medium text-gray-700 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-trc/40"
              ></textarea>
              <p v-if="fieldErrors.bio" class="text-[0.78rem] font-semibold text-red-500">{{ fieldErrors.bio }}</p>
              <p class="text-[0.75rem] text-gray-400">{{ form.bio.length }}/500 characters</p>
            </div>

            <!-- LinkedIn / Website -->
            <div class="space-y-2">
              <label class="text-[0.85rem] font-bold text-gray-700">
                LinkedIn or Academic Profile URL
                <span class="ml-1 text-[0.75rem] font-normal text-gray-400">(optional)</span>
              </label>
              <BaseInput
                v-model="form.profileUrl"
                type="url"
                placeholder="https://linkedin.com/in/your-profile"
                class="bg-[#F3F1FF] border-none shadow-none rounded-2xl overflow-hidden p-1"
              />
            </div>

            <!-- ═══════════ DOCUMENT UPLOADS ═══════════ -->
            <div class="mt-1 rounded-2xl bg-amber-50 border border-amber-200 p-5 space-y-4">
              <p class="text-[0.85rem] font-black text-amber-800 flex items-center gap-2">
                <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Supporting Documents Required
              </p>

              <!-- ID Document -->
              <FileUploadField
                id="idDocument"
                label="Government / University ID"
                hint="A clear scan or photo of your national ID or university ID card."
                :required="true"
                :error="fieldErrors.idDocument"
                @change="files.idDocument = $event"
              />

              <!-- Affiliation Letter -->
              <FileUploadField
                id="affiliationDocument"
                label="Affiliation / Appointment Letter"
                hint="An official letter from your institution confirming your research affiliation."
                :required="true"
                :error="fieldErrors.affiliationDocument"
                @change="files.affiliationDocument = $event"
              />

              <!-- CV (optional) -->
              <FileUploadField
                id="cvDocument"
                label="CV / Resume"
                hint="Your academic or professional curriculum vitae."
                :required="false"
                :error="fieldErrors.cvDocument"
                @change="files.cvDocument = $event"
              />
            </div>

            <!-- API Error -->
            <Transition name="slide-down">
              <div v-if="submitError" class="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
                <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                {{ submitError }}
              </div>
            </Transition>

            <!-- Submit Button -->
            <div class="mt-2">
              <BaseButton type="submit" variant="primary" size="lg" :loading="loading" class="w-full py-4 rounded-xl text-[1rem]">
                Submit Application for Review
              </BaseButton>
              <p class="mt-3 text-center text-[0.78rem] text-gray-400">
                Your documents will be reviewed by an admin. You'll be notified by email once a decision is made.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- ╔══════════════════════════════════════════╗
         ║  MOBILE / TABLET < 1024px – Single col  ║
         ╚══════════════════════════════════════════╝ -->
    <div class="flex min-h-screen flex-col bg-white px-6 py-10 lg:hidden">
      <div class="mx-auto w-full max-w-[480px] animate-fade-up">
        <RouterLink to="/" class="inline-flex items-center mb-8 group hover:opacity-90 transition" aria-label="TRC Home">
          <Logo theme="light" />
        </RouterLink>

        <!-- Progress indicator -->
        <div class="mb-6 flex items-center gap-3">
          <div class="flex h-7 w-7 items-center justify-center rounded-full bg-trc text-white text-xs font-bold">✓</div>
          <div class="h-1 flex-1 rounded-full bg-gray-100">
            <div class="h-full w-full rounded-full bg-trc"></div>
          </div>
          <div class="flex h-7 w-7 items-center justify-center rounded-full bg-trc text-white text-xs font-bold">2</div>
          <div class="h-1 flex-1 rounded-full bg-gray-100"></div>
          <div class="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-400 text-xs font-bold">3</div>
        </div>

        <h1 class="mb-1 text-[1.8rem] font-bold text-gray-900 leading-tight">Researcher Profile</h1>
        <p class="mb-8 text-[0.9rem] text-gray-500 font-medium">Complete your details and upload required documents for admin review.</p>

        <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
          <!-- Research Focus -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase tracking-wider text-gray-500">Research Focus <span class="text-red-500">*</span></label>
            <div class="relative">
              <select
                v-model="form.researchFocus"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-4 pr-10 text-[0.9rem] font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-trc/30 appearance-none"
              >
                <option value="" disabled>Select field</option>
                <option value="history">History &amp; Cultural Heritage</option>
                <option value="agriculture">Agriculture &amp; Food Security</option>
                <option value="medicine">Medicine &amp; Public Health</option>
                <option value="engineering">Engineering &amp; Infrastructure</option>
                <option value="education">Education &amp; Pedagogy</option>
                <option value="economics">Economics &amp; Development</option>
                <option value="environmental">Environmental Studies</option>
                <option value="social">Social Sciences</option>
                <option value="other">Other</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          <!-- Academic Title -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase tracking-wider text-gray-500">Academic Title <span class="text-red-500">*</span></label>
            <div class="relative">
              <select
                v-model="form.academicTitle"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-4 pr-10 text-[0.9rem] font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-trc/30 appearance-none"
              >
                <option value="" disabled>Select title</option>
                <option value="student">Student</option>
                <option value="researcher">Researcher</option>
                <option value="lecturer">Lecturer</option>
                <option value="assistant_professor">Assistant Professor</option>
                <option value="associate_professor">Associate Professor</option>
                <option value="professor">Professor</option>
                <option value="independent">Independent Researcher</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          <!-- ORCID -->
          <BaseInput v-model="form.orcid" label="ORCID iD (optional)" placeholder="0000-0000-0000-0000" />

          <!-- Bio -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase tracking-wider text-gray-500">Brief Bio <span class="text-red-500">*</span></label>
            <textarea
              v-model="form.bio"
              rows="3"
              placeholder="Describe your research background..."
              class="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[0.9rem] text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-trc/30"
            ></textarea>
          </div>

          <!-- Documents -->
          <div class="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-4">
            <p class="text-xs font-black text-amber-800 uppercase tracking-wider">Required Documents</p>
            <FileUploadField
              id="idDocumentMobile"
              label="Government / University ID"
              hint="Photo or scan of your ID card."
              :required="true"
              :error="fieldErrors.idDocument"
              @change="files.idDocument = $event"
            />
            <FileUploadField
              id="affiliationDocumentMobile"
              label="Affiliation Letter"
              hint="Letter from your institution."
              :required="true"
              :error="fieldErrors.affiliationDocument"
              @change="files.affiliationDocument = $event"
            />
            <FileUploadField
              id="cvDocumentMobile"
              label="CV / Resume (optional)"
              hint="Your academic CV."
              :required="false"
              @change="files.cvDocument = $event"
            />
          </div>

          <!-- Error -->
          <Transition name="slide-down">
            <div v-if="submitError" class="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
              <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              {{ submitError }}
            </div>
          </Transition>

          <BaseButton type="submit" variant="primary" size="lg" :loading="loading">Submit Application for Review</BaseButton>
          <p class="text-center text-[0.75rem] text-gray-400">You'll be notified by email once a decision is made.</p>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { api } from '@/services/api'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import Logo from '@/components/ui/Logo.vue'
import FileUploadField from '@/components/ui/FileUploadField.vue'

const router = useRouter()

const loading = ref(false)
const submitError = ref('')

const form = reactive({
  orcid: '',
  researchFocus: '',
  academicTitle: '',
  yearsExperience: '',
  bio: '',
  profileUrl: '',
})

const files = reactive<{ idDocument: File | null; affiliationDocument: File | null; cvDocument: File | null }>({
  idDocument: null,
  affiliationDocument: null,
  cvDocument: null,
})

const fieldErrors = ref<Record<string, string>>({})

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

function validateFile(file: File | null, fieldName: string, required: boolean): string | null {
  if (!file) {
    return required ? 'This document is required.' : null
  }
  if (file.size > MAX_FILE_SIZE) return 'File is too large. Maximum size is 5 MB.'
  if (!ALLOWED_TYPES.includes(file.type)) return 'Invalid file type. Use PDF, JPG, PNG, or DOCX.'
  return null
}

function validate(): boolean {
  fieldErrors.value = {}
  if (!form.researchFocus) fieldErrors.value.researchFocus = 'Please select a research field.'
  if (!form.academicTitle) fieldErrors.value.academicTitle = 'Please select your academic title.'
  if (!form.bio.trim()) fieldErrors.value.bio = 'Please provide a brief research bio.'
  if (form.bio.length > 500) fieldErrors.value.bio = 'Bio must be 500 characters or less.'

  const idErr = validateFile(files.idDocument, 'idDocument', true)
  if (idErr) fieldErrors.value.idDocument = idErr

  const affErr = validateFile(files.affiliationDocument, 'affiliationDocument', true)
  if (affErr) fieldErrors.value.affiliationDocument = affErr

  const cvErr = validateFile(files.cvDocument, 'cvDocument', false)
  if (cvErr) fieldErrors.value.cvDocument = cvErr

  return Object.keys(fieldErrors.value).length === 0
}

async function handleSubmit() {
  if (!validate()) return
  loading.value = true
  submitError.value = ''
  try {
    const formData = new FormData()
    if (form.orcid) formData.append('orcid', form.orcid)
    formData.append('researchFocus', form.researchFocus)
    formData.append('academicTitle', form.academicTitle)
    if (form.yearsExperience) formData.append('yearsExperience', form.yearsExperience)
    formData.append('bio', form.bio.trim())
    if (form.profileUrl) formData.append('profileUrl', form.profileUrl)
    formData.append('idDocument', files.idDocument as File)
    formData.append('affiliationDocument', files.affiliationDocument as File)
    if (files.cvDocument) formData.append('cvDocument', files.cvDocument)

    await api.post(
      '/auth/researcher-info',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    router.push('/pending-approval')
  } catch (err: any) {
    const serverMessage = err?.response?.data?.error?.message || err?.response?.data?.message
    submitError.value = serverMessage || 'Failed to submit your application. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
.animate-fade-up { animation: fadeUp 0.6s ease-out forwards; }

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.slide-down-enter-active,
.slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from,
.slide-down-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
