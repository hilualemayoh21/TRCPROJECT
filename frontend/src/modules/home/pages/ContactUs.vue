<template>
  <div class="bg-gray-50 min-h-screen py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h1 class="text-4xl font-extrabold text-[#0d1138] sm:text-5xl">Contact Us</h1>
        <p class="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
          Have a question, feedback, or want to collaborate? We'd love to hear from you.
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2">

          <!-- Contact Info -->
          <div class="bg-[#5222b0] p-10 text-white flex flex-col justify-between">
            <div>
              <h3 class="text-2xl font-bold mb-6">Get in touch</h3>
              <p class="text-[#cbb6f8] mb-8 leading-relaxed">
                Whether you're looking to contribute to the archive, report an issue, or simply want to learn more about our mission, our team is ready to assist you.
              </p>

              <div class="space-y-6">
                <div class="flex items-center gap-4">
                  <div class="bg-[#3c1f62] p-3 rounded-full">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </div>
                  <div>
                    <p class="text-sm text-[#cbb6f8]">Email us at</p>
                    <p class="font-medium">contact@tigrayresourcecenter.org</p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div class="bg-[#3c1f62] p-3 rounded-full">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </div>
                  <div>
                    <p class="text-sm text-[#cbb6f8]">Call us at</p>
                    <p class="font-medium">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div class="bg-[#3c1f62] p-3 rounded-full">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <div>
                    <p class="text-sm text-[#cbb6f8]">Visit us</p>
                    <p class="font-medium">123 Heritage Way<br>Global Community Center</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="p-10">
            <!-- Success State -->
            <div v-if="submitted" class="h-full flex flex-col items-center justify-center text-center py-10">
              <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 class="text-2xl font-black text-gray-900 mb-3">Message Sent!</h3>
              <p class="text-gray-500 font-medium mb-8">Thank you for reaching out. Our team will respond within 1–2 business days.</p>
              <button @click="resetForm" class="px-8 py-3 bg-[#5222b0] text-white rounded-xl font-bold text-sm hover:bg-[#3c1f62] transition">
                Send Another Message
              </button>
            </div>

            <!-- Form -->
            <form v-else @submit.prevent="handleSubmit" class="space-y-5" novalidate>
              <h3 class="text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">First Name <span class="text-red-500">*</span></label>
                  <input
                    v-model="form.firstName"
                    type="text"
                    placeholder="Jane"
                    class="w-full rounded-xl border py-3 px-4 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#5222b0]/30"
                    :class="errors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#5222b0]'"
                  />
                  <p v-if="errors.firstName" class="text-xs text-red-500 mt-1">{{ errors.firstName }}</p>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Last Name <span class="text-red-500">*</span></label>
                  <input
                    v-model="form.lastName"
                    type="text"
                    placeholder="Doe"
                    class="w-full rounded-xl border py-3 px-4 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#5222b0]/30"
                    :class="errors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#5222b0]'"
                  />
                  <p v-if="errors.lastName" class="text-xs text-red-500 mt-1">{{ errors.lastName }}</p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Email Address <span class="text-red-500">*</span></label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="jane@example.com"
                  class="w-full rounded-xl border py-3 px-4 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#5222b0]/30"
                  :class="errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#5222b0]'"
                />
                <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email }}</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Subject <span class="text-red-500">*</span></label>
                <select
                  v-model="form.subject"
                  class="w-full rounded-xl border py-3 px-4 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#5222b0]/30 bg-white"
                  :class="errors.subject ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#5222b0]'"
                >
                  <option value="">Select a subject...</option>
                  <option>General Inquiry</option>
                  <option>Volunteer Application</option>
                  <option>Partnership Proposal</option>
                  <option>Resource Submission</option>
                  <option>Technical Support</option>
                  <option>Media & Press</option>
                  <option>Other</option>
                </select>
                <p v-if="errors.subject" class="text-xs text-red-500 mt-1">{{ errors.subject }}</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Message <span class="text-red-500">*</span></label>
                <textarea
                  v-model="form.message"
                  rows="5"
                  placeholder="Write your message here..."
                  class="w-full rounded-xl border py-3 px-4 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#5222b0]/30 resize-y"
                  :class="errors.message ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#5222b0]'"
                ></textarea>
                <div class="flex justify-between mt-1">
                  <p v-if="errors.message" class="text-xs text-red-500">{{ errors.message }}</p>
                  <p class="text-xs text-gray-400 ml-auto">{{ form.message.length }}/500</p>
                </div>
              </div>

              <!-- General Error -->
              <div v-if="submitError" class="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
                <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                {{ submitError }}
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-3"
                :class="loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#5222b0] text-white hover:bg-[#3c1f62] shadow-lg shadow-[#5222b0]/30 hover:-translate-y-0.5'"
              >
                <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                {{ loading ? 'Sending...' : 'Send Message →' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const submitted = ref(false)
const loading = ref(false)
const submitError = ref('')

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: ''
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: ''
})

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const validate = () => {
  let valid = true
  errors.firstName = form.firstName.trim() ? '' : 'First name is required.'
  errors.lastName = form.lastName.trim() ? '' : 'Last name is required.'
  errors.email = !form.email.trim() ? 'Email is required.' : !validateEmail(form.email) ? 'Enter a valid email address.' : ''
  errors.subject = form.subject ? '' : 'Please select a subject.'
  errors.message = !form.message.trim() ? 'Message is required.' : form.message.length < 10 ? 'Message must be at least 10 characters.' : form.message.length > 500 ? 'Message must be under 500 characters.' : ''

  if (errors.firstName || errors.lastName || errors.email || errors.subject || errors.message) {
    valid = false
  }
  return valid
}

const handleSubmit = async () => {
  submitError.value = ''
  if (!validate()) return

  loading.value = true
  try {
    // Simulate API call (replace with real EmailJS or backend call)
    await new Promise(resolve => setTimeout(resolve, 1800))
    submitted.value = true
  } catch (err) {
    submitError.value = 'Something went wrong. Please try again or email us directly.'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  submitted.value = false
  form.firstName = ''
  form.lastName = ''
  form.email = ''
  form.subject = ''
  form.message = ''
  Object.keys(errors).forEach(k => errors[k] = '')
}
</script>
