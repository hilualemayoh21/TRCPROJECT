<template>
  <DashboardLayout>
    <div class="animate-fade-in flex flex-col gap-12 pb-28 md:pb-20">
      
      <!-- Welcome Header (Images 1 & 2) -->
      <section class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div>
          <h1 class="text-[2.6rem] font-extrabold text-[#5B21B6] leading-tight tracking-tight mb-2">Curating the collective memory of Tigray.</h1>
          <p class="text-[1.05rem] font-medium text-gray-500">Welcome back, Curator. Here's what's happening with the resources today.</p>
        </div>
        
        <!-- Header Actions (Image 1) -->
        <div class="flex items-center gap-3">
           <button class="flex items-center gap-2 rounded-xl border border-trc/10 bg-[#f5f3ff] px-6 py-3.5 text-[0.75rem] font-black uppercase tracking-widest text-trc hover:bg-trc hover:text-white transition-all shadow-sm">
             <SyncOutlined /> SYNC ARCHIVE
           </button>
           <button @click="router.push('/upload')" class="flex items-center gap-2 rounded-xl bg-trc px-8 py-3.5 text-[0.75rem] font-black uppercase tracking-widest text-white hover:bg-opacity-90 transition-all shadow-lg shadow-trc/20 cursor-pointer">
             <UploadOutlined /> UPLOAD
           </button>
        </div>
      </section>

      <!-- ── TABLET & DESKTOP SHARED CONTENT ── -->
      
      <!-- Top Metrics Row (Images 1 & 2) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <StatCard label="Total Resources" value="24,812" trend="+12%" updatedAt="2m ago" badgeType="purple" />
          <StatCard label="Downloads" value="142.5k" trend="+8.4%" :chart="75" badgeType="purple" />
          <StatCard label="Active Bookmarks" value="8,902" :avatars="4" />
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <!-- Main Area -->
        <div class="xl:col-span-9 flex flex-col gap-10">
           <!-- Chart Section -->
           <BarChartMockup title="Curation Velocity" :data="velocityData" />
           
           <!-- Activity Feed (Image 1 style) -->
           <ActivityFeed title="Recent Activity" :items="activityItems" />
        </div>

        <!-- Sidebar Panel (Image 1/2) -->
        <div class="xl:col-span-3 flex flex-col gap-8">
           <!-- Critical Alerts (Image 1) -->
           <div class="rounded-3xl bg-[#6C2BD9] p-8 text-white shadow-xl shadow-trc/10 relative overflow-hidden">
              <svg class="absolute -right-4 -top-4 h-32 w-32 text-white/5" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <h3 class="text-xl font-black mb-6">Critical Alerts</h3>
              <div class="space-y-6">
                <div class="flex flex-col gap-1.5 border-l-2 border-white/20 pl-4">
                  <span class="text-[0.65rem] font-black uppercase tracking-widest opacity-60">Storage Warning</span>
                  <p class="text-[0.8rem] font-bold leading-relaxed">Archive node A-4 is reaching 90% capacity.</p>
                </div>
                <div class="flex flex-col gap-1.5 border-l-2 border-white/20 pl-4">
                  <span class="text-[0.65rem] font-black uppercase tracking-widest opacity-60">Security Audit</span>
                  <p class="text-[0.8rem] font-bold leading-relaxed">Quarterly review scheduled for 09:00 AM Monday.</p>
                </div>
              </div>
              <button class="mt-8 w-full rounded-2xl bg-white py-3.5 text-[0.85rem] font-black text-trc shadow-lg transition hover:scale-[1.02]">RESOLVE ALERTS</button>
           </div>

           <!-- Regional Map Node (Image 1) -->
           <div class="rounded-3xl bg-white p-7 shadow-sm border border-gray-50 flex flex-col items-center text-center">
             <div class="h-32 w-full rounded-2xl bg-[#fdfaff] flex flex-col items-center justify-center mb-6 border border-trc/5">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-trc opacity-40 mb-2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
                <span class="text-[10px] font-black uppercase tracking-widest text-trc opacity-40">REGIONAL SERVER NODES</span>
             </div>
             <h4 class="text-[0.95rem] font-black text-gray-900">Active Region: Mek'ele</h4>
             <p class="text-[0.7rem] font-bold text-gray-400 mt-1 uppercase tracking-widest">Connectivity: 98.4ms Latency</p>
           </div>

           <!-- Support Card (Image 1) -->
           <div class="rounded-3xl bg-[#f8f6ff] p-7 border border-trc/5 overflow-hidden">
              <h4 class="text-[0.95rem] font-black text-gray-900 mb-2">Need assistance?</h4>
              <p class="text-[0.75rem] font-medium text-gray-500 mb-6 leading-relaxed">Our curation team is available 24/7 to help you structure your data assets effectively.</p>
              <button class="w-full rounded-xl bg-[#6C2BD9] py-3 text-[0.75rem] font-black uppercase tracking-widest text-white hover:bg-opacity-90 transition">CONTACT SUPPORT</button>
           </div>
        </div>
      </div>

    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { SyncOutlined, UploadOutlined } from '@ant-design/icons-vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import ActivityFeed from '@/components/dashboard/ActivityFeed.vue'
import BarChartMockup from '@/components/dashboard/BarChartMockup.vue'

// --- MOCK DATA (Synced with Image 1/2) ---
const router = useRouter()

const velocityData = [
  { active: 30, archived: 20, label: '' },
  { active: 45, archived: 25, label: '' },
  { active: 40, archived: 22, label: '' },
  { active: 55, archived: 40, label: '' },
  { active: 35, archived: 50, label: '' },
  { active: 75, archived: 30, label: '' },
  { active: 62, archived: 45, label: '' },
]

const activityItems = [
  { title: 'New Manuscript Uploaded', description: '"Historical Resilience of the Ge\'ez Liturgy" has been uploaded for verification.', time: '12 MIN AGO', type: 'upload' },
  { title: 'Community Discussion Peak', description: 'High engagement detected in "Digital Preservation of Aksumite Coins" thread.', time: '1 HOUR AGO', type: 'comment' },
]

const downloads = [
  { name: 'Agricultural_Report_2024.pdf', size: '12.4 MB', time: '2h ago' },
  { name: 'Historical_Axum_Archive.zip', size: '450 MB', time: '5h ago' }
]

const savedItems = [
  { name: 'Tigrinya Grammatical Structures', meta: 'Linguistics', updated: 'Yesterday' },
  { name: 'Irrigation Projects Map 2024', meta: 'Infrastructure', updated: '2d ago' }
]
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>


