<template>
  <div class="faq-page min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden bg-trc-deep">
      <div class="absolute inset-0 z-0">
        <div
          class="absolute inset-0 opacity-[0.08]"
          style="background-image: linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px); background-size: 28px 28px"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-trc-deep/50 via-trc-deep to-trc-deep"></div>
      </div>
      
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase animate-fade-up">
          Frequently Asked <span class="text-trc">Questions</span>
        </h1>
        <p class="text-xl text-white/60 max-w-2xl mx-auto font-medium animate-fade-up" style="animation-delay: 0.2s">
          Find answers to common questions about the Tigray Resource Center, our mission, and how you can get involved.
        </p>
      </div>
    </section>

    <!-- FAQ Categories & Search -->
    <section class="py-20">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Search Bar -->
        <div class="relative mb-20 animate-fade-up" style="animation-delay: 0.4s">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search for a question..." 
            class="w-full px-8 py-6 rounded-[2rem] bg-trc-muted/30 border-2 border-trc/10 focus:border-trc focus:outline-none text-trc-deep font-medium text-lg transition-all shadow-inner"
          />
          <div class="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-trc rounded-2xl flex items-center justify-center text-white shadow-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>

        <!-- FAQ Accordion -->
        <div class="space-y-6">
          <div 
            v-for="(item, index) in filteredFaqs" 
            :key="index"
            class="group border-2 border-trc/5 rounded-[2rem] overflow-hidden transition-all duration-500"
            :class="[activeId === index ? 'border-trc bg-trc-muted/10' : 'hover:border-trc/20 bg-white']"
          >
            <button 
              @click="toggle(index)"
              class="w-full px-8 py-8 flex items-center justify-between text-left transition-all"
            >
              <span class="text-xl font-black text-trc-deep tracking-tight uppercase leading-tight pr-8">
                {{ item.question }}
              </span>
              <div 
                class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500"
                :class="[activeId === index ? 'bg-trc text-white rotate-180' : 'bg-trc-muted text-trc group-hover:bg-trc group-hover:text-white']"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </button>
            
            <div 
              v-show="activeId === index"
              class="px-8 pb-8 animate-fade-in"
            >
              <div class="w-full h-px bg-trc/10 mb-8"></div>
              <p class="text-lg text-gray-500 font-medium leading-relaxed">
                {{ item.answer }}
              </p>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-if="filteredFaqs.length === 0" class="text-center py-20">
          <div class="text-6xl mb-6">🔍</div>
          <h3 class="text-2xl font-black text-trc-deep uppercase tracking-tight">No results found</h3>
          <p class="text-gray-500 mt-2 font-medium">Try searching with different keywords.</p>
        </div>
      </div>
    </section>

    <!-- Still have questions? -->
    <section class="py-32 bg-trc relative overflow-hidden">
      <div
        class="absolute inset-0 opacity-[0.08]"
        style="background-image: linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px); background-size: 28px 28px"
      />
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl md:text-6xl font-black text-white mb-10 tracking-tighter uppercase leading-none">
          Still Have <br/>Questions?
        </h2>
        <p class="text-xl text-white/70 mb-12 max-w-xl mx-auto font-medium">
          Can't find the answer you're looking for? Please chat with our friendly team.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-6">
          <RouterLink to="/contact-us" class="px-12 py-6 bg-white text-trc-deep rounded-2xl font-black text-lg shadow-2xl hover:-translate-y-1 transition-all uppercase tracking-widest">
            Contact Support
          </RouterLink>
          <a href="mailto:info@trc.org" class="px-12 py-6 border-2 border-white/40 text-white rounded-2xl font-black text-lg hover:bg-white hover:text-trc transition-all hover:-translate-y-1 uppercase tracking-widest">
            Email Us
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeId = ref(null)
const searchQuery = ref('')

const faqs = [
  {
    question: "What is the Tigray Resource Center (TRC)?",
    answer: "The Tigray Resource Center is a non-profit organization dedicated to preserving the cultural heritage of Tigray, promoting knowledge through research and education, and supporting sustainable development initiatives for our communities."
  },
  {
    question: "How can I access the digital library?",
    answer: "Our digital library is available to all registered members. You can browse through thousands of manuscripts, photographs, and research papers in our Resources section. Some premium content may require a free account to access."
  },
  {
    question: "How can I support the TRC's mission?",
    answer: "There are many ways to help! You can donate directly through our Support Us page, sign up as a volunteer for our community programs, or contribute historical artifacts and documents to our archive."
  },
  {
    question: "Are your educational resources available in Tigrinya?",
    answer: "Yes, we prioritize providing resources in both Tigrinya and English. Our goal is to make our archives and educational materials accessible to everyone in the community, regardless of language preference."
  },
  {
    question: "How can I volunteer for upcoming events?",
    answer: "Visit our 'Get Involved' page to see active volunteer opportunities. You can register for specific events or join our general volunteer pool to be notified of future needs."
  },
  {
    question: "Is the TRC affiliated with any political organization?",
    answer: "No, the Tigray Resource Center is an independent, non-partisan organization focused solely on cultural preservation, education, and community development."
  }
]

const filteredFaqs = computed(() => {
  if (!searchQuery.value) return faqs
  const query = searchQuery.value.toLowerCase()
  return faqs.filter(f => 
    f.question.toLowerCase().includes(query) || 
    f.answer.toLowerCase().includes(query)
  )
})

const toggle = (id) => {
  activeId.value = activeId.value === id ? null : id
}
</script>

<style scoped>
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-up {
  animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
</style>
