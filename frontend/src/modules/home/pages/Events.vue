<template>
  <div class="min-h-screen bg-white font-sans">

    <!-- Hero Section (Synced with Landing Page Design) -->
    <section class="relative h-[65vh] flex items-center overflow-hidden pt-20">
      <!-- Background Effect -->
      <div class="absolute inset-0 z-0 bg-[#1a0b2e]">
        <div class="absolute inset-0" style="background: radial-gradient(ellipse at 70% 30%, rgba(94,53,177,0.40) 0%, transparent 65%);"></div>
        <div class="absolute inset-0 opacity-10" style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 64px 64px;"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 max-w-7xl mx-auto px-6 w-full text-center">
        <div class="max-w-4xl mx-auto animate-fade-up">
          <span class="inline-block px-5 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-black uppercase tracking-[0.3em] text-purple-300 mb-8">Events & Programs</span>
          <h1 class="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter">
            Join the<br/><span class="text-[#b68eff]">Conversation.</span>
          </h1>
          <p class="mt-8 text-xl text-white/60 max-w-2xl mx-auto font-medium mb-12">
            Workshops, symposiums, and community gatherings that connect our heritage to the future.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <button
              v-for="tab in filterTabs"
              :key="tab"
              @click="activeTab = tab"
              class="px-8 py-3.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300"
              :class="activeTab === tab ? 'bg-[#5e35b1] text-white shadow-xl shadow-[#5e35b1]/40' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10'"
            >
              {{ tab }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Events Grid -->
    <section class="py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="mb-16">
          <h2 class="text-xs font-black uppercase tracking-[0.3em] text-[#5e35b1] mb-4">Upcoming Schedule</h2>
          <div class="space-y-8">
            <div
              v-for="event in filteredEvents"
              :key="event.id"
              class="group bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col md:flex-row"
            >
              <!-- Date Block -->
              <div class="flex-shrink-0 flex flex-row md:flex-col items-center justify-center gap-4 md:gap-1 bg-[#1a0b2e] text-white px-10 py-8 md:w-40 md:py-12">
                <span class="text-5xl font-black leading-none">{{ event.day }}</span>
                <span class="text-sm font-black uppercase tracking-widest text-purple-300">{{ event.month }}</span>
                <span class="hidden md:block text-[10px] text-white/30 font-black uppercase tracking-[0.3em] mt-3">{{ event.year }}</span>
              </div>

              <!-- Content -->
              <div class="flex-1 p-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-4">
                    <span class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest" :class="event.tagClass">{{ event.tag }}</span>
                    <span v-if="event.featured" class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100">Featured</span>
                  </div>
                  <h3 class="text-2xl lg:text-3xl font-black text-gray-900 mb-4 tracking-tight group-hover:text-[#5e35b1] transition-colors">{{ event.title }}</h3>
                  <p class="text-gray-500 font-medium leading-relaxed text-base mb-6 max-w-2xl">{{ event.description }}</p>
                  <div class="flex flex-wrap items-center gap-6 text-xs text-gray-400 font-bold uppercase tracking-widest">
                    <span class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-[#5e35b1]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      {{ event.time }}
                    </span>
                    <span class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-[#5e35b1]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      {{ event.location }}
                    </span>
                  </div>
                </div>
                <!-- CTA -->
                <div class="flex-shrink-0 w-full md:w-auto">
                  <button
                    class="w-full md:w-auto px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-wider transition-all duration-300 shadow-xl"
                    :class="event.rsvp ? 'bg-[#5e35b1] text-white hover:bg-[#512da8] shadow-[#5e35b1]/30 hover:-translate-y-0.5' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'"
                  >
                    {{ event.rsvp ? 'RSVP Now →' : 'View Details' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA Section (Synced with Landing Page) -->
    <section class="py-32 bg-[#5e35b1] relative overflow-hidden text-center">
      <div class="absolute inset-0" style="background-image: radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%);"></div>
      <div class="relative z-10 max-w-4xl mx-auto px-6">
        <h2 class="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">Host an Event with TRC</h2>
        <p class="text-xl text-white/70 max-w-xl mx-auto mb-12 font-medium">Partner with us to organize educational, cultural, or community events.</p>
        <RouterLink to="/get-involved" class="inline-flex items-center gap-3 px-12 py-5 bg-white text-[#5e35b1] rounded-2xl font-black text-base uppercase tracking-wider shadow-2xl hover:-translate-y-1 transition-all">
          Get Involved →
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

const filterTabs = ['All', 'Workshop', 'Symposium', 'Community']
const activeTab = ref('All')

const events = [
  {
    id: 1, day: '15', month: 'Oct', year: '2025',
    tag: 'Workshop', tagClass: 'bg-purple-50 text-purple-700',
    featured: true,
    title: 'Digital Archiving Workshop',
    description: 'Best practices for digitizing and cataloging historical documents with hands-on training from our lead curators.',
    time: '10:00 AM – 2:00 PM', location: 'Virtual Event', seats: '50', rsvp: true, category: 'Workshop'
  },
  {
    id: 2, day: '22', month: 'Nov', year: '2025',
    tag: 'Symposium', tagClass: 'bg-blue-50 text-blue-700',
    featured: false,
    title: 'Annual Heritage Symposium',
    description: 'A full-day conference featuring keynote speakers and panel discussions focused on cultural preservation.',
    time: '9:00 AM – 5:00 PM', location: 'Main Hall, TRC HQ', seats: '200', rsvp: false, category: 'Symposium'
  },
  {
    id: 3, day: '05', month: 'Dec', year: '2025',
    tag: 'Community', tagClass: 'bg-green-50 text-green-700',
    featured: false,
    title: 'Community Leadership Forum',
    description: 'An open dialogue for community leaders to share strategies for sustainable development and cultural advocacy.',
    time: '3:00 PM – 6:00 PM', location: 'Addis Ababa, Ethiopia', seats: '120', rsvp: true, category: 'Community'
  },
]

const filteredEvents = computed(() => {
  if (activeTab.value === 'All') return events
  return events.filter(e => e.category === activeTab.value)
})
</script>

<style scoped>
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-up {
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
