<template>
  <div class="max-w-7xl mx-auto w-full font-sans text-gray-900 dark:text-gray-100 pb-16 md:pb-10 p-4 md:p-6 lg:p-8 transition-colors duration-300">
    
    <!-- Breadcrumb -->
    <div class="flex items-center gap-1 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 animate-fade-in">
      <span>Portal</span>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="opacity-60"><polyline points="9 18 15 12 9 6"></polyline></svg>
      <span class="text-[#6C2BD9] dark:text-purple-400">Settings</span>
    </div>

    <!-- Main Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
      <div>
        <h1 class="text-3xl font-black text-gray-900 dark:text-gray-50 tracking-tight">Portal Settings</h1>
        <p class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1.5 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-[#6C2BD9] animate-pulse"></span>
          Configure security, notifications, and dynamic curation options
        </p>
      </div>

      <button 
        @click="saveAllSettings"
        class="px-7 py-3.5 bg-[#6C2BD9] dark:bg-purple-700 hover:bg-[#5B21B6] dark:hover:bg-purple-800 text-white font-black text-[11px] tracking-wider uppercase rounded-2xl shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
      >
        <SaveOutlined /> Save All Changes
      </button>
    </div>

    <!-- Two-Column Page Structure -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- LEFT COLUMN: Settings Tabs (3 Cols) -->
      <div class="lg:col-span-4 xl:col-span-3 bg-[#FBFBFF] dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 rounded-[2.2rem] p-6 shadow-sm flex flex-col gap-1.5 animate-fade-up">
        <button 
          v-for="tab in visibleTabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-left text-xs font-black uppercase tracking-wider transition-all duration-200"
          :class="[
            activeTab === tab.id
              ? 'bg-[#F5F3FF] dark:bg-purple-950/60 text-[#6C2BD9] dark:text-purple-400 shadow-[0_2px_8px_rgba(108,43,217,0.04)] scale-[1.01]'
              : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:text-gray-800 dark:hover:text-gray-200'
          ]"
        >
          <component :is="tab.icon" class="text-sm shrink-0" />
          <span>{{ tab.name }}</span>
        </button>
      </div>

      <!-- RIGHT COLUMN: Active Panel Card (9 Cols) -->
      <div class="lg:col-span-8 xl:col-span-9 flex flex-col gap-6 animate-fade-up" style="animation-delay: 0.1s">
        
        <!-- PANEL 1: ACCOUNT PREFERENCES -->
        <div v-if="activeTab === 'account'" class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-[2.5rem] p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.005)] space-y-6">
          <div class="border-b border-gray-100 dark:border-gray-800/80 pb-5">
            <h3 class="text-base font-black text-gray-900 dark:text-gray-50 uppercase tracking-tight">Account Preferences</h3>
            <p class="text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-1">Configure profile and regional synchronization details</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Public Profile Visibility</label>
              <div class="flex items-center justify-between gap-4 bg-[#FBFBFF] dark:bg-gray-850 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div>
                  <span class="text-xs font-black text-gray-850 dark:text-gray-250 block">Make Profile Public</span>
                  <span class="text-[10px] font-medium text-gray-400 dark:text-gray-500">Allow other curators to find your contributions</span>
                </div>
                <!-- Premium Custom Switch -->
                <button 
                  @click="accountForm.publicProfile = !accountForm.publicProfile"
                  class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-sm"
                  :class="accountForm.publicProfile ? 'bg-[#6C2BD9]' : 'bg-gray-200 dark:bg-gray-800'"
                >
                  <span 
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="accountForm.publicProfile ? 'translate-x-5' : 'translate-x-0'"
                  ></span>
                </button>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Primary Server Sync Node</label>
              <select v-model="accountForm.serverNode" class="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-850 rounded-2xl px-4 py-3.5 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-[#6C2BD9]/10 focus:border-[#6C2BD9] text-gray-800 dark:text-gray-200 transition-all">
                <option value="Mekele">Mek'ele Core Node (Active)</option>
                <option value="Aksum">Aksum Regional Node</option>
                <option value="Adigrat">Adigrat Regional Node</option>
              </select>
              
              <!-- Telemetry Badge -->
              <div class="mt-2.5 flex items-center gap-2.5 text-[9px] font-black uppercase tracking-wider text-emerald-500 dark:text-emerald-400 bg-emerald-500/5 px-3 py-2.5 rounded-xl border border-emerald-500/10">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Server Telemetry: 12ms Latency. Synced 2 mins ago.</span>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Default Catalog Language</label>
              <select v-model="accountForm.catalogLanguage" class="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-850 rounded-2xl px-4 py-3.5 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-[#6C2BD9]/10 focus:border-[#6C2BD9] text-gray-800 dark:text-gray-200 transition-all">
                <option value="English">English</option>
                <option value="Tigrinya">Tigrinya (ትግርኛ)</option>
                <option value="Geez">Ge'ez (ግዕዝ)</option>
              </select>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Institution / Association</label>
              <input type="text" v-model="accountForm.institution" placeholder="e.g. Mekelle University" class="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-850 rounded-2xl px-4 py-3.5 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-[#6C2BD9]/10 focus:border-[#6C2BD9] text-gray-800 dark:text-gray-200 transition-all" />
            </div>
          </div>
        </div>

        <!-- PANEL 2: NOTIFICATION MATRIX -->
        <div v-if="activeTab === 'notifications'" class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-[2.5rem] p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.005)] space-y-6">
          <div class="border-b border-gray-100 dark:border-gray-800/80 pb-5">
            <h3 class="text-base font-black text-gray-900 dark:text-gray-50 uppercase tracking-tight">Notification Preference Matrix</h3>
            <p class="text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-1">Select dynamic notification events based on your platform privileges</p>
          </div>

          <div class="space-y-4.5">
            <!-- Row 1: Email Digest -->
            <div class="flex items-center justify-between gap-4 p-5 bg-[#FBFBFF] dark:bg-gray-850 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div class="flex-1">
                <span class="text-xs font-black text-gray-850 dark:text-gray-250 block">Weekly Digest Email Summary</span>
                <span class="text-[10px] font-medium text-gray-400 dark:text-gray-500 mt-0.5 block">Receive weekly roundups of platform curation achievements, top saved assets, and statistics</span>
              </div>
              <button 
                @click="notificationForm.emailDigest = !notificationForm.emailDigest"
                class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-sm"
                :class="notificationForm.emailDigest ? 'bg-[#6C2BD9]' : 'bg-gray-200 dark:bg-gray-800'"
              >
                <span 
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="notificationForm.emailDigest ? 'translate-x-5' : 'translate-x-0'"
                ></span>
              </button>
            </div>

            <!-- Dynamic Admin Row: Vetting Requests -->
            <div v-if="userRole === 'admin' || userRole === 'super_admin'" class="flex items-center justify-between gap-4 p-5 bg-[#FBFBFF] dark:bg-gray-850 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div class="flex-1">
                <span class="text-xs font-black text-gray-850 dark:text-gray-250 block">Vetting & Review Applications</span>
                <span class="text-[10px] font-medium text-gray-400 dark:text-gray-500 mt-0.5 block">Notify instantly when a researcher submits resources requiring editorial approval</span>
              </div>
              <button 
                @click="notificationForm.vettingRequests = !notificationForm.vettingRequests"
                class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-sm"
                :class="notificationForm.vettingRequests ? 'bg-[#6C2BD9]' : 'bg-gray-200 dark:bg-gray-800'"
              >
                <span 
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="notificationForm.vettingRequests ? 'translate-x-5' : 'translate-x-0'"
                ></span>
              </button>
            </div>

            <!-- Dynamic Researcher Row: Citation updates -->
            <div v-if="userRole === 'researcher'" class="flex items-center justify-between gap-4 p-5 bg-[#FBFBFF] dark:bg-gray-850 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div class="flex-1">
                <span class="text-xs font-black text-gray-850 dark:text-gray-250 block">Asset Downloads & Citations</span>
                <span class="text-[10px] font-medium text-gray-400 dark:text-gray-500 mt-0.5 block">Notify instantly whenever your published resources receive 5-star ratings or community downloads</span>
              </div>
              <button 
                @click="notificationForm.citationAlerts = !notificationForm.citationAlerts"
                class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-sm"
                :class="notificationForm.citationAlerts ? 'bg-[#6C2BD9]' : 'bg-gray-200 dark:bg-gray-800'"
              >
                <span 
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="notificationForm.citationAlerts ? 'translate-x-5' : 'translate-x-0'"
                ></span>
              </button>
            </div>

            <!-- Row 3: Comment notices -->
            <div class="flex items-center justify-between gap-4 p-5 bg-[#FBFBFF] dark:bg-gray-850 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div class="flex-1">
                <span class="text-xs font-black text-gray-850 dark:text-gray-250 block">Collection Comments & Notes</span>
                <span class="text-[10px] font-medium text-gray-400 dark:text-gray-500 mt-0.5 block">Alert whenever a peer reviewer or verified curator leaves comments on cataloged items</span>
              </div>
              <button 
                @click="notificationForm.commentNotices = !notificationForm.commentNotices"
                class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-sm"
                :class="notificationForm.commentNotices ? 'bg-[#6C2BD9]' : 'bg-gray-200 dark:bg-gray-800'"
              >
                <span 
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="notificationForm.commentNotices ? 'translate-x-5' : 'translate-x-0'"
                ></span>
              </button>
            </div>
          </div>
        </div>

        <!-- PANEL 3: SECURITY & ACCESS -->
        <div v-if="activeTab === 'security'" class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-[2.5rem] p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.005)] space-y-6">
          <div class="border-b border-gray-100 dark:border-gray-800/80 pb-5">
            <h3 class="text-base font-black text-gray-900 dark:text-gray-50 uppercase tracking-tight">Security & Access Management</h3>
            <p class="text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-1">Harden account defenses and manage active browser session entries</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Current Password</label>
              <input type="password" v-model="securityForm.currentPassword" class="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-850 rounded-2xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-[#6C2BD9]/10 focus:border-[#6C2BD9] transition-all" />
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">New Password</label>
              <input type="password" v-model="securityForm.newPassword" class="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-850 rounded-2xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-[#6C2BD9]/10 focus:border-[#6C2BD9] transition-all" />
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Confirm New Password</label>
              <input type="password" v-model="securityForm.confirmPassword" class="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-850 rounded-2xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-[#6C2BD9]/10 focus:border-[#6C2BD9] transition-all" />
            </div>
          </div>

          <button @click="updatePassword" class="px-6 py-3.5 bg-purple-50 hover:bg-purple-100 text-[#6C2BD9] dark:bg-purple-950/60 dark:text-purple-300 border-none font-black text-[10px] uppercase tracking-wider rounded-xl transition-all">
            Update Access Key
          </button>

          <div class="border-t border-gray-100 dark:border-gray-800/80 pt-6">
            <h4 class="text-xs font-black text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-4">Active Login Sessions</h4>
            
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-gray-100 dark:border-gray-800">
                    <th class="pb-3 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Browser & Device</th>
                    <th class="pb-3 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">IP Address</th>
                    <th class="pb-3 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Last Activity</th>
                    <th class="pb-3 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50 dark:divide-gray-850">
                  <tr v-for="sess in activeSessions" :key="sess.id" class="text-xs font-bold text-gray-600 dark:text-gray-400">
                    <td class="py-5 flex items-center gap-3">
                      <!-- Render premium responsive screen vectors -->
                      <svg v-if="sess.device.includes('Desktop')" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-[#6C2BD9] dark:text-purple-400 shrink-0"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                      <svg v-else-if="sess.device.includes('Mobile')" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-slate-500 shrink-0"><rect x="5" y="2" width="14" height="20" rx="2"></rect><line x1="12" y1="18" x2="12" y2="18"></line></svg>
                      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-slate-500 shrink-0"><rect x="2" y="4" width="20" height="12" rx="2"></rect><line x1="2" y1="20" x2="22" y2="20"></line></svg>
                      
                      <span class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-emerald-500" v-if="sess.current"></span>
                        <span>{{ sess.device }}</span>
                      </span>
                    </td>
                    <td class="py-5">{{ sess.ip }}</td>
                    <td class="py-5">{{ sess.time }}</td>
                    <td class="py-5 text-right">
                      <button 
                        @click="revokeSession(sess.id)"
                        v-if="!sess.current"
                        class="text-[9px] font-black text-red-500 dark:text-red-400 border border-red-200 dark:border-red-900/60 bg-red-50/20 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all uppercase tracking-wider"
                      >
                        Revoke
                      </button>
                      <span v-else class="text-[9px] font-black text-emerald-500 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/60">Current Session</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- PANEL 4: CURATION OPTIONS -->
        <div v-if="activeTab === 'curation'" class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-[2.5rem] p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.005)] space-y-6">
          <div class="border-b border-gray-100 dark:border-gray-800/80 pb-5">
            <h3 class="text-base font-black text-gray-900 dark:text-gray-50 uppercase tracking-tight">Curation & Licensing Standards</h3>
            <p class="text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-1">Configure publishing permissions, licensing templates, and metadata assists</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Default License Protocol</label>
              <select v-model="curationForm.defaultLicense" class="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-850 rounded-2xl px-4 py-3.5 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-[#6C2BD9]/10 focus:border-[#6C2BD9] text-gray-800 dark:text-gray-200 transition-all">
                <option value="CC-BY-NC">Creative Commons BY-NC (Attribution-NonCommercial)</option>
                <option value="CC-BY-SA">Creative Commons BY-SA (Attribution-ShareAlike)</option>
                <option value="PublicDomain">CC0 Public Domain (Unrestricted Academic)</option>
              </select>
            </div>

            <!-- Dynamic Admin Row: AI Metadata Checks -->
            <div class="flex flex-col gap-2" v-if="userRole === 'admin' || userRole === 'super_admin'">
              <label class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Automated AI Vetting Assist</label>
              <div class="flex items-center justify-between gap-4 bg-[#FBFBFF] dark:bg-gray-850 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div>
                  <span class="text-xs font-black text-gray-850 dark:text-gray-250 block">Enable Automated Vetting Checks</span>
                  <span class="text-[10px] font-medium text-gray-400 dark:text-gray-500">Run security, language audits automatically before queueing</span>
                </div>
                <button 
                  @click="curationForm.aiVetting = !curationForm.aiVetting"
                  class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-sm"
                  :class="curationForm.aiVetting ? 'bg-[#6C2BD9]' : 'bg-gray-200 dark:bg-gray-800'"
                >
                  <span 
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="curationForm.aiVetting ? 'translate-x-5' : 'translate-x-0'"
                  ></span>
                </button>
              </div>
            </div>

            <!-- Dynamic Researcher Row: Auto DOI Lookup -->
            <div class="flex flex-col gap-2" v-if="userRole === 'researcher'">
              <label class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Auto DOI metadata lookup</label>
              <div class="flex items-center justify-between gap-4 bg-[#FBFBFF] dark:bg-gray-850 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div>
                  <span class="text-xs font-black text-gray-850 dark:text-gray-250 block">Fetch DOI publication info</span>
                  <span class="text-[10px] font-medium text-gray-400 dark:text-gray-500">Automatically pull indexing metadata when uploading documents</span>
                </div>
                <button 
                  @click="curationForm.autoDoiLookup = !curationForm.autoDoiLookup"
                  class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-sm"
                  :class="curationForm.autoDoiLookup ? 'bg-[#6C2BD9]' : 'bg-gray-200 dark:bg-gray-800'"
                >
                  <span 
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="curationForm.autoDoiLookup ? 'translate-x-5' : 'translate-x-0'"
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- PANEL 5: ACADEMIC DEVELOPER HUB (Admins & Researchers only) -->
        <div v-if="activeTab === 'developer'" class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-[2.5rem] p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.005)] space-y-6">
          <div class="border-b border-gray-100 dark:border-gray-800/80 pb-5">
            <h3 class="text-base font-black text-gray-900 dark:text-gray-50 uppercase tracking-tight">Academic Developer Hub</h3>
            <p class="text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-1">Generate access keys to query raw database collections for automated research scripts</p>
          </div>

          <div class="bg-[#FBFBFF] dark:bg-gray-850 rounded-[1.75rem] p-6 border border-gray-100 dark:border-gray-800">
            <div class="flex items-center gap-2 mb-2 text-[#6C2BD9] dark:text-purple-400">
              <KeyOutlined />
              <h4 class="text-xs font-black uppercase tracking-wider">Active Academic API Access Key</h4>
            </div>
            
            <p class="text-[11px] font-medium text-gray-500 mb-5 leading-relaxed">
              Use this bearer credential inside your scripts to access public manuscripts cataloged in Aksumite collections. Do not share your access token.
            </p>

            <div class="flex flex-col sm:flex-row gap-3">
              <div class="flex-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 rounded-xl px-4 py-3 text-xs font-black select-all text-gray-600 dark:text-gray-300 font-mono tracking-tight flex items-center justify-between">
                <span>{{ showApiKey ? 'trc_live_948a204e1bc2a95e0c5d' : '••••••••••••••••••••••••••••••••' }}</span>
                <button @click="showApiKey = !showApiKey" class="text-[#6C2BD9] hover:underline text-[9px] uppercase tracking-wider shrink-0 ml-2 border-none bg-transparent">
                  {{ showApiKey ? 'Hide' : 'Reveal' }}
                </button>
              </div>

              <button @click="copyApiKey" class="px-5 py-3 bg-[#6C2BD9] text-white hover:bg-[#5B21B6] border-none font-black text-[10px] uppercase tracking-wider rounded-xl transition-all shrink-0">
                Copy Token
              </button>
            </div>
          </div>

          <button @click="generateNewApiKey" class="px-5 py-3 bg-purple-50 hover:bg-purple-100 text-[#6C2BD9] dark:bg-purple-950/60 dark:text-purple-300 border-none font-black text-[10px] uppercase tracking-wider rounded-xl transition-all">
            Regenerate API Access Key
          </button>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { 
  UserOutlined, BellOutlined, LockOutlined, 
  SafetyCertificateOutlined, KeyOutlined, SaveOutlined
} from '@ant-design/icons-vue'
import { useAuthStore } from '@/modules/auth/auth.store'

const authStore = useAuthStore()

// Forms Setup
const accountForm = ref({
  publicProfile: true,
  serverNode: 'Mekele',
  catalogLanguage: 'English',
  institution: authStore.user?.institution || ''
})

const notificationForm = ref({
  emailDigest: true,
  vettingRequests: true,
  citationAlerts: true,
  commentNotices: true
})

const securityForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const curationForm = ref({
  defaultLicense: 'CC-BY-NC',
  aiVetting: true,
  autoDoiLookup: true
})

// UI States
const activeTab = ref('account')
const showApiKey = ref(false)
const userRole = computed(() => authStore.user?.role || 'public_user')

// Dynamic Tab list definition
const allTabs = [
  { id: 'account', name: 'Account Preferences', icon: UserOutlined, roles: ['admin', 'super_admin', 'researcher', 'public_user'] },
  { id: 'notifications', name: 'Notification Matrix', icon: BellOutlined, roles: ['admin', 'super_admin', 'researcher', 'public_user'] },
  { id: 'security', name: 'Security & Access', icon: LockOutlined, roles: ['admin', 'super_admin', 'researcher', 'public_user'] },
  { id: 'curation', name: 'Curation Options', icon: SafetyCertificateOutlined, roles: ['admin', 'super_admin', 'researcher'] },
  { id: 'developer', name: 'Developer Hub', icon: KeyOutlined, roles: ['admin', 'super_admin', 'researcher'] }
]

const visibleTabs = computed(() => {
  return allTabs.filter(tab => tab.roles.includes(userRole.value))
})

// Device Active Sessions
const activeSessions = ref([
  { id: 1, device: 'Chrome on Windows 11 (Desktop)', ip: '197.156.98.42', time: 'Active Now', current: true },
  { id: 2, device: 'Safari on iPhone 15 Pro (Mobile)', ip: '197.156.99.11', time: '2 hours ago', current: false },
  { id: 3, device: 'Firefox on macOS Sonoma (Laptop)', ip: '196.188.42.129', time: 'Yesterday, 8:44 PM', current: false }
])

// Actions
const updatePassword = () => {
  if (!securityForm.value.currentPassword || !securityForm.value.newPassword) {
    message.error('Please input password parameters')
    return
  }
  if (securityForm.value.newPassword !== securityForm.value.confirmPassword) {
    message.error('New passwords do not match')
    return
  }
  message.success('System credentials updated successfully!')
  securityForm.value.currentPassword = ''
  securityForm.value.newPassword = ''
  securityForm.value.confirmPassword = ''
}

const revokeSession = (id: number) => {
  activeSessions.value = activeSessions.value.filter(s => s.id !== id)
  message.success('Device access revoked successfully')
}

const copyApiKey = () => {
  navigator.clipboard.writeText('trc_live_948a204e1bc2a95e0c5d')
  message.success('API Key copied to clipboard!')
}

const generateNewApiKey = () => {
  message.success('New Developer access key successfully provisioned!')
}

const saveAllSettings = () => {
  message.success('All preferences synchronized to global server!')
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
.animate-fade-up {
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
