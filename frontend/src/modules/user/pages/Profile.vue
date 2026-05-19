<template>
  <div class="max-w-7xl mx-auto w-full font-sans text-gray-900 dark:text-gray-100 pb-16 md:pb-10 p-4 md:p-6 lg:p-8 transition-colors">
    
    <!-- Cover / Banner Image -->
    <div class="w-full h-44 md:h-56 lg:h-64 rounded-[2rem] bg-gradient-to-br from-purple-800 via-purple-900 to-indigo-950 relative overflow-hidden shadow-lg animate-fade-in">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.2),transparent)]"></div>
      <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
    </div>

    <!-- Profile Identity Area (Overlapping Cover) -->
    <div class="px-2 md:px-8 pb-4 mt-[-60px] md:mt-[-80px] relative z-10 animate-fade-up">
      <div class="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
        
        <!-- Left: Avatar + Name info -->
        <div class="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left">
          
          <!-- Avatar Squircle with Border & Badge -->
          <div class="relative group cursor-pointer" @click="triggerAvatarUpload">
            <img 
              :src="getAvatarUrl(profileForm.avatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileForm.name)}&background=6C2BD9&color=fff`" 
              alt="Profile Picture" 
              class="w-32 h-32 md:w-36 md:h-36 rounded-[2.2rem] border-[6px] border-white dark:border-gray-900 shadow-xl object-cover bg-gray-100 dark:bg-gray-800 transition-all duration-300 group-hover:brightness-75 group-hover:scale-[1.02]"
              :class="{ 'opacity-50': uploadingAvatar }"
              @error="handleImageError"
            />
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <LoadingOutlined v-if="uploadingAvatar" class="text-white text-3xl animate-spin" />
              <CameraOutlined v-else class="text-white text-3xl" />
            </div>
            
            <!-- Tiny Verified badge inside the white border shape -->
            <div class="absolute bottom-1.5 right-1.5 h-8 w-8 bg-purple-700 rounded-xl border-[3px] border-white dark:border-gray-900 flex items-center justify-center shadow-md">
              <CheckOutlined class="text-white text-[10px] font-black" />
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

          <!-- Name, Role & Location Info -->
          <div class="mb-2">
            <h1 class="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-gray-50 flex items-center justify-center md:justify-start gap-2.5">
              {{ profileForm.name }}
            </h1>
            <p class="text-sm font-bold text-purple-700 dark:text-purple-400 mt-1">
              {{ authStore.user?.role === 'super_admin' ? 'Senior Resource Curator' : 'Strategic Resource Contributor' }}
              <span class="text-gray-300 dark:text-gray-700 mx-1.5">•</span>
              <span class="text-gray-500 dark:text-gray-400 font-medium">Digital Preservationist</span>
            </p>
          </div>
        </div>

        <!-- Right: Action Buttons -->
        <div class="flex items-center gap-3 mb-2 shrink-0">
          <button 
            @click="isEditModalOpen = true" 
            class="px-6 py-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-black text-xs tracking-wider uppercase rounded-2xl shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
          >
            <EditOutlined class="text-sm" /> Edit Profile
          </button>
          
          <button 
            @click="copyProfileLink" 
            class="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center shadow-sm transition-all hover:scale-105"
            title="Share Profile"
          >
            <ShareAltOutlined class="text-base" />
          </button>
        </div>
      </div>
    </div>

    <!-- Premium Metrics Row (4 Cards) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 animate-fade-up" style="animation-delay: 0.1s">
      <!-- Card 1: Total Resources -->
      <div class="bg-[#FBFBFF] dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow">
        <p class="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Total Resources</p>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-black text-gray-900 dark:text-gray-50 tracking-tight">1,284</span>
          <span class="px-1.5 py-0.5 bg-purple-50 dark:bg-purple-950/50 text-[#6C2BD9] dark:text-purple-400 text-[0.6rem] font-extrabold rounded-lg">+12%</span>
        </div>
      </div>

      <!-- Card 2: Collection Views -->
      <div class="bg-[#FBFBFF] dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow">
        <p class="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Collection Views</p>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-black text-gray-900 dark:text-gray-50 tracking-tight">42.5k</span>
          <span class="px-1.5 py-0.5 bg-purple-50 dark:bg-purple-950/50 text-[#6C2BD9] dark:text-purple-400 text-[0.6rem] font-extrabold rounded-lg">-8%</span>
        </div>
      </div>

      <!-- Card 3: Network Reach -->
      <div class="bg-[#FBFBFF] dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow">
        <p class="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Network Reach</p>
        <div class="text-2xl font-black text-gray-900 dark:text-gray-50 tracking-tight">
          312 <span class="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-normal ml-0.5">Curators</span>
        </div>
      </div>

      <!-- Card 4: Impact Score -->
      <div class="bg-[#FBFBFF] dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow">
        <p class="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Impact Score</p>
        <div class="text-2xl font-black text-[#6C2BD9] dark:text-purple-400 tracking-tight">
          94 <span class="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-normal ml-0.5">/ 100</span>
        </div>
      </div>
    </div>

    <!-- Tab Section -->
    <div class="mt-8 border-b border-gray-100 dark:border-gray-800 flex overflow-x-auto hide-scrollbar gap-8 animate-fade-up" style="animation-delay: 0.15s">
      <button 
        v-for="tab in ['My Resources', 'Bookmarks', 'Activity History']" 
        :key="tab"
        @click="activeTab = tab"
        :class="[
          'pb-4 font-bold text-sm whitespace-nowrap transition-colors relative',
          activeTab === tab 
            ? 'text-[#6C2BD9] dark:text-purple-400 border-b-2 border-[#6C2BD9] dark:border-purple-400' 
            : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
        ]"
      >
        {{ tab }}
        <span v-if="tab === 'My Resources'" class="ml-1 px-1.5 py-0.5 bg-[#F5F3FF] dark:bg-purple-950/60 text-[#6C2BD9] dark:text-purple-400 text-[10px] font-black rounded-lg">48</span>
        <span v-if="tab === 'Bookmarks'" class="ml-1 px-1.5 py-0.5 bg-[#F5F3FF] dark:bg-purple-950/60 text-[#6C2BD9] dark:text-purple-400 text-[10px] font-black rounded-lg">120</span>
      </button>
    </div>

    <!-- Main Two-Column Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
      
      <!-- LEFT COLUMN: Dynamic Tab Content (9 Cols) -->
      <div class="lg:col-span-8 xl:col-span-9 flex flex-col gap-6 animate-fade-up" style="animation-delay: 0.2s">
        
        <!-- TAB: My Resources -->
        <div v-if="activeTab === 'My Resources'" class="space-y-6">
          
          <!-- Featured Resource Card (Mocked precisely as in design) -->
          <div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-[2rem] p-6 shadow-[0_4px_25px_rgba(0,0,0,0.015)] flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
            
            <!-- Featured Graphic (Abstract organic SVG as in the mockup) -->
            <div class="w-full md:w-[240px] h-[180px] rounded-2xl overflow-hidden shrink-0 relative bg-teal-800">
              <svg viewBox="0 0 200 200" class="w-full h-full object-cover">
                <defs>
                  <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#0F766E" />
                    <stop offset="100%" stop-color="#14B8A6" />
                  </linearGradient>
                </defs>
                <rect width="200" height="200" fill="url(#tealGrad)" />
                <circle cx="60" cy="80" r="45" fill="#0D9488" opacity="0.75" />
                <circle cx="140" cy="120" r="55" fill="#2DD4BF" opacity="0.65" />
                <path d="M 30,160 Q 80,100 130,160 T 230,160" fill="none" stroke="#5EEAD4" stroke-width="8" opacity="0.3" />
              </svg>
            </div>

            <!-- Card Info -->
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <p class="text-[0.65rem] font-black text-purple-700 dark:text-purple-400 uppercase tracking-widest mb-1.5">
                  Cultural Heritage <span class="text-gray-300 dark:text-gray-700 mx-1">•</span> Reviewed 2 days ago
                </p>
                <h3 class="text-lg font-black text-gray-900 dark:text-gray-50 leading-snug hover:text-purple-700 transition-colors cursor-pointer">
                  Digital Preservation of Timbuktu Manuscripts: Volume IV
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed mt-2.5">
                  A comprehensive digital archive documenting the restoration techniques and historical context of the sacred preservation processes...
                </p>
              </div>

              <!-- Bottom Row: Overlapping Avatars & View Link -->
              <div class="flex items-center justify-between mt-4">
                <div class="flex items-center -space-x-2.5">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Collab" class="w-7 h-7 rounded-full border-2 border-white dark:border-gray-900 object-cover" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Collab" class="w-7 h-7 rounded-full border-2 border-white dark:border-gray-900 object-cover" />
                  <div class="w-7 h-7 rounded-full border-2 border-white dark:border-gray-900 bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-[9px] font-black text-[#6C2BD9] dark:text-purple-400">+3</div>
                </div>

                <a href="#" class="inline-flex items-center gap-1.5 text-xs font-black text-[#6C2BD9] dark:text-purple-400 hover:opacity-85 transition-opacity">
                  View Archive 
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Secondary Grid of 2 Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <!-- Card 1: Quarterly Impact Report -->
            <div class="bg-[#FBFBFF] dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 rounded-[1.75rem] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.005)] hover:shadow-md transition-shadow flex items-start gap-4 cursor-pointer">
              <div class="w-11 h-11 bg-purple-50 dark:bg-purple-950 text-[#6C2BD9] dark:text-purple-400 rounded-xl flex items-center justify-center shrink-0">
                <FileTextOutlined class="text-lg" />
              </div>
              <div>
                <h4 class="text-sm font-black text-gray-900 dark:text-gray-50 leading-tight mb-1">Quarterly Impact Report</h4>
                <p class="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3.5">PDF • 12.4 MB • Updated May 2024</p>
                <div class="flex gap-2">
                  <span class="px-2 py-0.5 bg-purple-50 dark:bg-purple-950/60 text-[#6C2BD9] dark:text-purple-400 text-[9px] font-black tracking-widest uppercase rounded">Internal</span>
                  <span class="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[9px] font-black tracking-widest uppercase rounded">Verified</span>
                </div>
              </div>
            </div>

            <!-- Card 2: Oral History Interviews -->
            <div class="bg-[#FBFBFF] dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 rounded-[1.75rem] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.005)] hover:shadow-md transition-shadow flex items-start gap-4 cursor-pointer">
              <div class="w-11 h-11 bg-purple-50 dark:bg-purple-950 text-[#6C2BD9] dark:text-purple-400 rounded-xl flex items-center justify-center shrink-0">
                <AudioOutlined class="text-lg" />
              </div>
              <div>
                <h4 class="text-sm font-black text-gray-900 dark:text-gray-50 leading-tight mb-1">Oral History Interviews</h4>
                <p class="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3.5">WAV • 420 MB • Recorded April 2024</p>
                <div class="flex gap-2">
                  <span class="px-2 py-0.5 bg-purple-50 dark:bg-purple-950/60 text-[#6C2BD9] dark:text-purple-400 text-[9px] font-black tracking-widest uppercase rounded">Audio</span>
                  <span class="px-2 py-0.5 bg-purple-50 dark:bg-purple-950/60 text-[#6C2BD9] dark:text-purple-400 text-[9px] font-black tracking-widest uppercase rounded">Restored</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB: Bookmarks -->
        <div v-else-if="activeTab === 'Bookmarks'" class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 text-center py-16">
          <FolderOpenOutlined class="text-4xl text-purple-300 dark:text-purple-800 mb-4" />
          <h3 class="text-lg font-black text-gray-900 dark:text-gray-100 mb-2">Bookmarked Publications</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto">
            Access and manage all saved studies, critical archives, and strategic documents instantly in this dedicated vault.
          </p>
        </div>

        <!-- TAB: Activity History -->
        <div v-else-if="activeTab === 'Activity History'" class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8">
          <h3 class="text-lg font-black text-gray-900 dark:text-gray-100 mb-6">Recent Curator Actions</h3>
          <div class="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100 dark:before:bg-gray-800">
            <div class="flex gap-4 relative">
              <div class="w-6.5 h-6.5 bg-[#F5F3FF] dark:bg-purple-950/60 border-2 border-white dark:border-gray-900 rounded-full z-10 shrink-0 flex items-center justify-center mt-1">
                <div class="w-2.5 h-2.5 bg-[#6C2BD9] dark:bg-purple-400 rounded-full"></div>
              </div>
              <div>
                <p class="text-sm font-black text-gray-800 dark:text-gray-200">Verified "Quarterly Impact Report" submission</p>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Audit Log • 2 hours ago</p>
              </div>
            </div>
            <div class="flex gap-4 relative">
              <div class="w-6.5 h-6.5 bg-[#F5F3FF] dark:bg-purple-950/60 border-2 border-white dark:border-gray-900 rounded-full z-10 shrink-0 flex items-center justify-center mt-1">
                <div class="w-2.5 h-2.5 bg-[#6C2BD9] dark:bg-purple-400 rounded-full"></div>
              </div>
              <div>
                <p class="text-sm font-black text-gray-800 dark:text-gray-200">Uploaded "Digital Preservation of Timbuktu Manuscripts: Volume IV"</p>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Audit Log • 1 day ago</p>
              </div>
            </div>
            <div class="flex gap-4 relative">
              <div class="w-6.5 h-6.5 bg-[#F5F3FF] dark:bg-purple-950/60 border-2 border-white dark:border-gray-900 rounded-full z-10 shrink-0 flex items-center justify-center mt-1">
                <div class="w-2.5 h-2.5 bg-[#6C2BD9] dark:bg-purple-400 rounded-full"></div>
              </div>
              <div>
                <p class="text-sm font-black text-gray-800 dark:text-gray-200">Completed full email verification sequence</p>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">System • May 18, 2026</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT COLUMN: Insights & Collaborators Sidebars (3 Cols) -->
      <div class="lg:col-span-4 xl:col-span-3 flex flex-col gap-6 animate-fade-up" style="animation-delay: 0.25s">
        
        <!-- Curator Insights Card -->
        <div class="bg-[#FBFBFF] dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 rounded-[2rem] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.005)]">
          <div class="flex items-center gap-2 mb-6">
            <!-- Sparkles Custom SVG Icon -->
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6C2BD9" stroke-width="2.5" class="shrink-0">
              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" stroke-linecap="round"></path>
            </svg>
            <h3 class="text-sm font-black text-gray-900 dark:text-gray-100 tracking-tight">Curator Insights</h3>
          </div>

          <div class="space-y-5">
            <!-- Insight 1: Most Active Category -->
            <div class="pl-3.5 border-l-2 border-[#6C2BD9] dark:border-purple-500">
              <p class="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Most Active Category</p>
              <p class="text-xs font-black text-gray-800 dark:text-gray-200">Archival Linguistics</p>
            </div>
            
            <!-- Insight 2: Verification Status -->
            <div class="pl-3.5 border-l-2 border-[#6C2BD9] dark:border-purple-500">
              <p class="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Verification Status</p>
              <p class="text-xs font-black text-gray-800 dark:text-gray-200">Expert Level 4</p>
            </div>

            <!-- Insight 3: Last Contribution -->
            <div class="pl-3.5 border-l-2 border-[#6C2BD9] dark:border-purple-500">
              <p class="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Last Contribution</p>
              <p class="text-xs font-black text-gray-800 dark:text-gray-200">Yesterday, 4:12 PM</p>
            </div>
          </div>

          <button class="w-full mt-7 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-[#6C2BD9] dark:text-purple-300 border border-gray-200 dark:border-gray-700 font-black text-xs py-3.5 rounded-2xl shadow-sm transition-all hover:scale-[1.01]">
            View Detailed Analytics
          </button>
        </div>

        <!-- Top Collaborators Card -->
        <div class="bg-[#FBFBFF] dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 rounded-[2rem] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.005)]">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-sm font-black text-gray-900 dark:text-gray-100 tracking-tight">Top Collaborators</h3>
            <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
            </button>
          </div>

          <div class="space-y-4">
            <!-- Collaborator 1 -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Dawit M." class="w-9 h-9 rounded-full object-cover shadow-sm bg-gray-100" />
                <div>
                  <h4 class="text-xs font-black text-gray-900 dark:text-gray-100">Dawit M.</h4>
                  <p class="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Lead Archivist</p>
                </div>
              </div>
              <div class="w-6.5 h-6.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-[#6C2BD9] dark:text-purple-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
              </div>
            </div>

            <!-- Collaborator 2 -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Helen K." class="w-9 h-9 rounded-full object-cover shadow-sm bg-gray-100" />
                <div>
                  <h4 class="text-xs font-black text-gray-900 dark:text-gray-100">Helen K.</h4>
                  <p class="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Data Analyst</p>
                </div>
              </div>
              <div class="w-6.5 h-6.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-[#6C2BD9] dark:text-purple-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
              </div>
            </div>
          </div>
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
            <input v-model="profileForm.name" type="text" class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C2BD9]" />
          </div>
          <div>
            <label class="block text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Location / Institution</label>
            <input v-model="profileForm.location" type="text" class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C2BD9]" />
          </div>
          <div>
            <label class="block text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Bio</label>
            <textarea v-model="profileForm.bio" rows="3" class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#6C2BD9]"></textarea>
          </div>
        </div>

        <div class="mt-8 flex gap-3">
          <button @click="isEditModalOpen = false" class="flex-1 py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:opacity-90">Cancel</button>
          <button
            @click="saveProfile"
            :disabled="!hasChanges"
            class="flex-1 py-3.5 bg-purple-700 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
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
  CloseOutlined, LoadingOutlined, FileTextOutlined, AudioOutlined
} from '@ant-design/icons-vue'
import { useAuthStore } from '@/modules/auth/auth.store'
import { userService } from '../user.service'

const authStore = useAuthStore()
const activeTab = ref('My Resources')
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

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileForm.value.name)}&background=6C2BD9&color=fff`
}

const hasChanges = computed(() => {
  return (
    profileForm.value.name.trim() !== originalProfile.value.name.trim() ||
    profileForm.value.location.trim() !== originalProfile.value.location.trim() ||
    profileForm.value.bio.trim() !== originalProfile.value.bio.trim()
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

.bg-grid-pattern {
  background-size: 20px 20px;
  background-image: 
    linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
}
</style>
