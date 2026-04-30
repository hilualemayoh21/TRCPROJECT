<template>
  <!-- Centered content section (DashboardLayout is handled by App.vue) -->
  <!-- ── PRODUCTION-GRADE ARCHIVAL DASHBOARD ── -->
  <div class="animate-fade-in mx-auto max-w-[940px] px-6 py-12 mb-20 min-h-[calc(100vh-160px)] flex flex-col">
    
    <!-- ── DYNAMIC ARCHIVAL STEPPER ── -->
    <div class="mb-16 relative flex-shrink-0">
      <div class="absolute top-[1.2rem] left-12 right-12 h-[1px] bg-gray-100 -z-10">
        <div 
          class="h-full bg-trc transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1)" 
          :style="{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }"
        ></div>
      </div>

      <div class="flex justify-between items-center">
        <div 
          v-for="(step, idx) in steps" 
          :key="step.id"
          class="flex flex-col items-center gap-3 transition-all duration-500"
          @click="goToStep(idx+1)"
          :class="[
            currentStep >= idx + 1 ? 'opacity-100 cursor-pointer' : 'opacity-20 pointer-events-none'
          ]"
        >
          <div 
            class="h-10 w-10 rounded-2xl flex items-center justify-center text-[0.85rem] font-black border-2 transition-all duration-500"
            :class="[
              currentStep > idx + 1 ? 'bg-trc border-trc text-white shadow-lg shadow-trc/20' : 
              currentStep === idx + 1 ? 'bg-white border-trc text-trc shadow-2xl shadow-trc/10 scale-110' : 
              'bg-white border-gray-100 text-gray-300'
            ]"
          >
            <CheckOutlined v-if="currentStep > idx + 1" style="font-size: 14px" />
            <span v-else>{{ step.id }}</span>
          </div>
          <span class="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-gray-400 whitespace-nowrap">{{ step.name }}</span>
        </div>
      </div>
    </div>

    <!-- ── SYMMETRIC DUAL-PILLAR GRID (6/6 SPLIT) ── -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch flex-1">
      
      <!-- LEFT: PRODUCTION FORM CORE (6/12 PILLAR) -->
      <main class="lg:col-span-6 flex flex-col items-stretch">
        
        <transition name="fade-slide" mode="out-in">
          <!-- STEP 1: UPLOAD -->
          <section v-if="currentStep === 1" key="step1" class="flex-1 bg-white rounded-3xl p-10 border border-gray-100 shadow-premium flex flex-col">
            <div class="flex-1 flex flex-col min-h-0">
              <div class="mb-10 flex-shrink-0">
                <h2 class="text-2xl font-black text-gray-900 tracking-tight uppercase mb-2">Resource Ingest</h2>
                <p class="text-[0.85rem] font-medium text-gray-400">Initialize the digital archival process by staging your asset.</p>
              </div>

              <!-- STAGED STATE -->
              <div v-if="formData.file" class="flex-1 flex flex-col justify-center border-2 border-dashed border-gray-100 rounded-3xl p-6 md:p-8 group transition-all duration-500 bg-gray-50/30 min-h-0">
                 <!-- Deeply Padded Premium File Box -->
                 <div class="flex flex-col sm:flex-row items-center sm:items-center sm:justify-start gap-4 py-8 px-6 md:px-8 rounded-[2rem] bg-white shadow-premium border border-white relative overflow-hidden group-hover:shadow-2xl transition-all">
                    <div class="absolute -right-10 -top-10 h-40 w-40 bg-trc/5 rounded-full blur-3xl"></div>
                    <div class="h-14 w-14 rounded-2xl bg-trc text-white flex items-center justify-center text-2xl shadow-lg shadow-trc/30 flex-shrink-0 relative z-10 group-hover:scale-110 transition-transform duration-500 mx-auto sm:mx-0"><FilePdfFilled /></div>
                    <div class="flex-1 min-w-0 pr-2 relative z-10 text-center sm:text-left flex flex-col justify-center">
                       <span class="text-[0.65rem] font-black uppercase tracking-widest text-trc mb-1.5 block">Primary Asset Staged</span>
                       <h3 class="text-[1.15rem] leading-tight font-black text-gray-900 truncate block">{{ formData.file.name }}</h3>
                       <p class="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mt-2">{{ (formData.file.size / (1024*1024)).toFixed(2) }} MB • Validated</p>
                    </div>
                 </div>
                 
                 <!-- Actions -->
                 <div class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-2 flex-shrink-0">
                    <span class="text-[0.65rem] font-black text-green-500/80 uppercase tracking-widest flex items-center gap-1.5 text-center sm:text-left"><CheckOutlined /> Ready for Metadata</span>
                    <button @click="formData.file = null" class="text-[0.65rem] font-black uppercase tracking-[0.15em] text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center gap-1.5 hover:bg-red-50 px-3 py-2 rounded-xl active:scale-95 w-full sm:w-auto">
                       <DeleteOutlined class="text-[0.75rem]" /> Purge Resource
                    </button>
                 </div>
              </div>

              <!-- UPLOAD DROPZONE -->
              <div 
                v-else
                class="flex-1 w-full rounded-[2.5rem] border-[3px] border-dashed border-gray-100 bg-gray-50/30 flex flex-col items-center justify-center gap-6 hover:bg-trc/[0.03] hover:border-trc/30 transition-all duration-500 cursor-pointer group relative overflow-hidden min-h-0"
                @click="triggerFileInput"
              >
                <!-- Decorative Ambient Lighting -->
                <div class="absolute -left-10 -bottom-10 h-40 w-40 bg-trc/5 rounded-full blur-3xl group-hover:bg-trc/10 transition-colors duration-700"></div>
                
                <div class="relative z-10 flex flex-col items-center gap-8 pointer-events-none">
                  <div class="h-28 w-28 rounded-[2.5rem] bg-white border border-gray-50 shadow-2xl shadow-gray-200/50 flex items-center justify-center text-trc text-5xl group-hover:-translate-y-2 group-hover:shadow-trc/20 group-hover:border-trc/10 transition-all duration-500">
                    <CloudUploadOutlined />
                  </div>
                  
                  <div class="text-center px-10">
                    <h3 class="text-2xl font-black text-gray-900 tracking-tight uppercase mb-3 text-shadow-sm">Stage Prime Asset</h3>
                    <p class="text-[0.65rem] font-black text-gray-400 uppercase tracking-[0.25em] leading-relaxed">
                      DRAG & DROP OR EXPLORE TERMINAL<br/>
                      <span class="opacity-50 text-[0.55rem] block mt-1 tracking-widest">(PDF, DOCX, ZIP, MEDIA)</span>
                    </p>
                  </div>
                </div>
                <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" />
              </div>
            </div>

            <!-- INTEGRATED PRODUCTION FOOTER -->
            <footer class="flex items-center justify-between w-full pt-8 mt-auto flex-shrink-0 border-t border-gray-100/50 gap-2 overflow-hidden">
              <button @click="prevStep" class="group flex items-center gap-1 sm:gap-2 text-[0.6rem] sm:text-[0.65rem] font-black text-gray-300 hover:text-gray-900 transition-all uppercase tracking-widest whitespace-nowrap overflow-hidden flex-shrink min-w-0">
                <ArrowLeftOutlined class="transition-transform group-hover:-translate-x-1 flex-shrink-0" />
                <span class="truncate">Back</span>
              </button>
              <button class="text-[0.6rem] sm:text-[0.65rem] font-black text-gray-300 hover:text-gray-900 transition-colors uppercase tracking-widest whitespace-nowrap truncate min-w-0 mx-auto px-4">Draft</button>
              <button @click="nextStep" :disabled="!formData.file" class="flex items-center justify-center gap-1 sm:gap-2 bg-trc text-white h-9 sm:h-10 lg:h-11 px-4 sm:px-5 lg:px-6 rounded-lg font-black text-[0.55rem] sm:text-[0.6rem] uppercase tracking-[0.1em] shadow-md shadow-trc/20 hover:shadow-lg hover:shadow-trc/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none whitespace-nowrap flex-shrink-0 min-w-0">
                <span class="truncate max-w-[100px] sm:max-w-[140px] md:max-w-none">Stage Details</span> <ArrowRightOutlined class="text-[0.6rem] sm:text-[0.65rem] mt-[-1px] flex-shrink-0" />
              </button>
            </footer>
          </section>

          <!-- STEP 2: METADATA -->
          <section v-else-if="currentStep === 2" key="step2" class="flex-1 bg-white rounded-3xl p-10 border border-gray-100 shadow-premium flex flex-col">
            <div class="flex-1 flex-shrink-0">
              <div class="mb-10">
                <h2 class="text-2xl font-black text-gray-900 tracking-tight mb-2 uppercase">Archival Metadata</h2>
                <p class="text-[0.85rem] font-medium text-gray-400 tracking-tight">Define the typographic and historical context of the node.</p>
              </div>

              <div class="space-y-6">
                <div class="flex flex-col gap-2 group">
                  <label class="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-400 pl-1 group-focus-within:text-trc transition-colors">Digital Identity (Title)</label>
                  <input v-model="formData.title" type="text" placeholder="e.g. Archaeological Assessment of Axum" class="production-input !text-[0.75rem] !font-sans !font-bold text-gray-700" />
                </div>
                
                <div class="flex flex-col gap-2">
                  <label class="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-400 pl-1">Knowledge Cluster</label>
                  <div class="relative">
                    <select v-model="formData.category" class="production-input appearance-none !pr-14 truncate !text-[0.75rem] !font-sans !font-bold text-gray-700">
                      <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                    </select>
                    <DownOutlined class="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                <div class="flex flex-col gap-2">
                  <label class="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-400 pl-1">Primary Node Origin</label>
                  <div class="relative">
                    <select v-model="formData.institution" class="production-input appearance-none !pr-14 truncate !text-[0.75rem] !font-sans !font-bold text-gray-700">
                      <option v-for="inst in institutions" :key="inst" :value="inst">{{ inst }}</option>
                    </select>
                    <DownOutlined class="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-400 pl-1">Abstract Archival Summary</label>
                  <textarea v-model="formData.abstract" rows="3" class="production-input resize-none !text-[0.75rem] !font-sans !font-bold text-gray-700" placeholder="Provide a concise historiographical summary..."></textarea>
                </div>
              </div>
            </div>
            
            <footer class="flex items-center justify-between w-full pt-8 mt-auto flex-shrink-0 border-t border-gray-100/50 gap-2 overflow-hidden">
              <button @click="prevStep" class="group flex items-center gap-1 sm:gap-2 text-[0.6rem] sm:text-[0.65rem] font-black text-gray-300 hover:text-gray-900 transition-all uppercase tracking-widest whitespace-nowrap overflow-hidden flex-shrink min-w-0">
                <ArrowLeftOutlined class="transition-transform group-hover:-translate-x-1 flex-shrink-0" />
                <span class="truncate">Back</span>
              </button>
              <button class="text-[0.6rem] sm:text-[0.65rem] font-black text-gray-300 hover:text-gray-900 transition-colors uppercase tracking-widest whitespace-nowrap truncate min-w-0 mx-auto px-4">Draft</button>
              <button @click="nextStep" class="flex items-center justify-center gap-1 sm:gap-2 bg-trc text-white h-9 sm:h-10 lg:h-11 px-4 sm:px-5 lg:px-6 rounded-lg font-black text-[0.55rem] sm:text-[0.6rem] uppercase tracking-[0.1em] shadow-md shadow-trc/20 hover:shadow-lg hover:shadow-trc/30 hover:-translate-y-0.5 transition-all whitespace-nowrap flex-shrink-0 min-w-0">
                <span class="truncate max-w-[100px] sm:max-w-[140px] md:max-w-none">Next Step</span> <ArrowRightOutlined class="text-[0.6rem] sm:text-[0.65rem] mt-[-1px] flex-shrink-0" />
              </button>
            </footer>
          </section>

          <!-- STEP 3: AUTHORS -->
          <section v-else-if="currentStep === 3" key="step3" class="flex-1 bg-white rounded-3xl p-10 border border-gray-100 shadow-premium flex flex-col">
            <div class="flex-1 flex-shrink-0">
              <div class="flex items-center justify-between mb-10">
                <div>
                  <h2 class="text-2xl font-black text-gray-900 tracking-tight uppercase mb-2">Contributors</h2>
                  <p class="text-[0.85rem] font-medium text-gray-400">Specify the researchers and guardians of this data.</p>
                </div>
                <button @click="isModalVisible = true" class="h-12 w-12 rounded-2xl bg-trc text-white flex items-center justify-center shadow-lg shadow-trc/30 hover:scale-105 active:scale-95 transition-all"><PlusOutlined class="text-xl" /></button>
              </div>
              
              <div v-if="formData.authors.length > 0" class="space-y-4">
                <transition-group name="list">
                  <div v-for="(author, idx) in formData.authors" :key="author.name" class="flex items-center justify-between p-6 rounded-2xl bg-gray-50/50 border border-gray-100 group hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all">
                    <div class="flex items-center gap-6">
                      <div class="h-14 w-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-trc font-black text-xl shadow-sm">{{ author.name.charAt(0) }}</div>
                      <div>
                        <h4 class="text-[0.9rem] font-black text-gray-900 uppercase tracking-tight">{{ author.name }}</h4>
                        <p class="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider">{{ author.role }}</p>
                      </div>
                    </div>
                    <button @click="removeAuthor(idx)" class="h-10 w-10 flex items-center justify-center rounded-xl text-gray-200 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"><DeleteOutlined /></button>
                  </div>
                </transition-group>
              </div>
              <div v-else class="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 bg-gray-50/30 rounded-3xl py-16 group transition-all duration-500 hover:border-trc/20 hover:bg-trc/5">
                 <div class="h-24 w-24 rounded-[2rem] bg-white border border-gray-50 shadow-xl shadow-gray-200/50 flex items-center justify-center text-gray-300 text-4xl mb-6 group-hover:scale-110 group-hover:shadow-trc/10 group-hover:text-trc transition-all duration-500">
                    <SolutionOutlined />
                 </div>
                 <span class="block text-[0.8rem] font-black text-gray-800 uppercase tracking-wider mb-2">Registry Empty</span>
                 <p class="text-[0.65rem] font-bold text-gray-400 uppercase tracking-[0.2em] text-center px-8 leading-relaxed max-w-[280px]">
                    Click the plus icon above to append archival contributors to this node
                 </p>
              </div>
            </div>
            
            <footer class="flex items-center justify-between w-full pt-8 mt-auto flex-shrink-0 border-t border-gray-100/50 gap-2 overflow-hidden">
              <button @click="prevStep" class="group flex items-center gap-1 sm:gap-2 text-[0.6rem] sm:text-[0.65rem] font-black text-gray-300 hover:text-gray-900 transition-all uppercase tracking-widest whitespace-nowrap overflow-hidden flex-shrink min-w-0">
                <ArrowLeftOutlined class="transition-transform group-hover:-translate-x-1 flex-shrink-0" />
                <span class="truncate">Back</span>
              </button>
              <button class="text-[0.6rem] sm:text-[0.65rem] font-black text-gray-300 hover:text-gray-900 transition-colors uppercase tracking-widest whitespace-nowrap truncate min-w-0 mx-auto px-4">Draft</button>
              <button @click="nextStep" class="flex items-center justify-center gap-1 sm:gap-2 bg-trc text-white h-9 sm:h-10 lg:h-11 px-4 sm:px-5 lg:px-6 rounded-lg font-black text-[0.55rem] sm:text-[0.6rem] uppercase tracking-[0.1em] shadow-md shadow-trc/20 hover:shadow-lg hover:shadow-trc/30 transition-all whitespace-nowrap flex-shrink-0 min-w-0">
                <span class="truncate max-w-[100px] sm:max-w-[140px] md:max-w-none">Preview</span> <ArrowRightOutlined class="text-[0.6rem] sm:text-[0.65rem] mt-[-1px] flex-shrink-0" />
              </button>
            </footer>
          </section>

          <!-- STEP 4: PREVIEW -->
          <section v-else-if="currentStep === 4" key="step4" class="flex-1 bg-white rounded-3xl p-10 border border-gray-100 shadow-premium flex flex-col">
            <div class="flex-1 flex flex-col justify-center flex-shrink-0">
              <div class="mb-12 text-center">
                <h2 class="text-2xl font-black text-gray-900 tracking-tight mb-2 uppercase">Integrity Review</h2>
                <p class="text-[0.85rem] font-medium text-gray-400">Final validation of the digital node before regional archival.</p>
              </div>
              
              <div class="p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all duration-700">
                 <div class="absolute -right-8 -top-8 h-32 w-32 bg-trc/5 rounded-full blur-3xl group-hover:bg-trc/10 transition-colors"></div>
                 <div class="relative z-10 flex flex-col gap-6">
                    <div class="flex flex-col items-start gap-4">
                       <span class="px-4 py-1.5 rounded-lg bg-trc text-white text-[0.6rem] font-black uppercase tracking-[0.2em]">{{ formData.category }}</span>
                       <h3 class="text-2xl font-black text-gray-900 italic leading-snug">{{ formData.title || 'ARCHIVAL_NODE_UNTITLED' }}</h3>
                    </div>
                    <p class="text-[0.95rem] font-medium text-gray-500 leading-relaxed">{{ formData.abstract || 'No summary provided.' }}</p>
                    <div class="flex flex-wrap gap-2 pt-6 border-t border-gray-200/50">
                       <span v-for="tag in formData.tags" :key="tag" class="text-[0.6rem] font-black text-trc uppercase tracking-widest bg-white border border-gray-100 shadow-sm px-3 py-1 rounded-md">#{{ tag }}</span>
                    </div>
                 </div>
              </div>
            </div>
            
            <footer class="flex items-center justify-between w-full pt-8 mt-auto flex-shrink-0 border-t border-gray-100/50 gap-2 overflow-hidden">
              <button @click="prevStep" class="group flex items-center gap-1 sm:gap-2 text-[0.6rem] sm:text-[0.65rem] font-black text-gray-300 hover:text-gray-900 transition-all uppercase tracking-widest whitespace-nowrap overflow-hidden flex-shrink min-w-0">
                <ArrowLeftOutlined class="transition-transform group-hover:-translate-x-1 flex-shrink-0" />
                <span class="truncate">Back</span>
              </button>
              <button class="text-[0.6rem] sm:text-[0.65rem] font-black text-gray-300 hover:text-gray-900 transition-colors uppercase tracking-widest whitespace-nowrap truncate min-w-0 mx-auto px-4">Draft</button>
              <button @click="nextStep" class="flex items-center justify-center gap-1 sm:gap-2 bg-trc text-white h-9 sm:h-10 lg:h-11 px-4 sm:px-5 lg:px-8 rounded-lg font-black text-[0.55rem] sm:text-[0.6rem] lg:text-[0.65rem] uppercase tracking-[0.1em] shadow-lg shadow-trc/30 hover:shadow-xl hover:shadow-trc/40 hover:-translate-y-0.5 transition-all whitespace-nowrap flex-shrink-0 min-w-0">
                <span class="truncate max-w-[120px] sm:max-w-[160px] md:max-w-none">Commit to Archive</span> <ArrowRightOutlined class="text-[0.6rem] sm:text-[0.65rem] mt-[-1px] flex-shrink-0" />
              </button>
            </footer>
          </section>

          <!-- STEP 5: DONE -->
          <section v-else-if="currentStep === 5" key="step5" class="flex-1 bg-white rounded-[4rem] p-16 border border-gray-100 shadow-premium text-center animate-fade-in-up flex flex-col items-center justify-center">
             <div class="h-32 w-32 rounded-[3.5rem] bg-trc text-white flex items-center justify-center mx-auto text-5xl mb-12 shadow-premium shadow-trc/40 animate-bounce-subtle">
                <CheckOutlined />
             </div>
             <h2 class="text-5xl font-black text-gray-900 tracking-tightest mb-4 uppercase">Node Secured.</h2>
             <p class="text-[1.1rem] font-medium text-gray-400 max-w-md mx-auto leading-relaxed mb-16">The digital archival node has been validated, encrypted, and recorded on the regional explorer.</p>
             <button @click="router.push('/dashboard')" class="bg-trc text-white px-16 py-7 rounded-3xl font-black text-sm uppercase tracking-[0.3em] shadow-premium shadow-trc/30 hover:shadow-trc/50 hover:scale-105 active:scale-95 transition-all">Back to Command Center</button>
          </section>
        </transition>

      </main>

      <!-- RIGHT: PRODUCTION SIDEBAR (6/12 PILLAR - ABSOLUTE TRIPLE PARITY) -->
      <aside class="lg:col-span-6 flex flex-col gap-6 items-stretch h-full">
        
        <!-- TRIPLE EQUAL HEIGHT WIDGETS -->
        <div class="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white shadow-premium transition-all hover:shadow-2xl w-full flex-1 min-h-0 flex flex-col justify-start relative overflow-hidden group">
          <div class="absolute top-0 right-0 h-32 w-32 bg-trc/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-trc/10 transition-colors"></div>
          
          <div class="flex items-center gap-4 mb-5 relative z-10 flex-shrink-0">
            <div class="h-10 w-10 rounded-2xl bg-trc/5 text-trc flex items-center justify-center text-lg"><InboxOutlined /></div>
            <h4 class="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-800">Archival Payload</h4>
          </div>

          <div class="relative z-10 flex-1 flex flex-col justify-center">
            <div v-if="formData.file" class="flex items-center gap-6 p-6 rounded-[2rem] bg-white shadow-sm border border-gray-50 group-hover:border-trc/20 transition-all">
              <div class="h-14 w-14 rounded-[1.5rem] bg-trc text-white flex items-center justify-center text-2xl shadow-lg shadow-trc/20 flex-shrink-0"><FilePdfFilled /></div>
              <div class="flex-1 min-w-0 pr-2">
                <span class="text-[0.9rem] font-black text-gray-900 truncate block font-sans tracking-tight mb-1">{{ formData.file.name.slice(0, 30) }}{{ formData.file.name.length > 30 ? '...' : '' }}</span>
                <span class="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest block">Digital Asset Secured</span>
              </div>
            </div>
            <div v-else class="flex w-full flex-col items-center justify-center pt-2 pb-6 text-gray-300">
              <CloudUploadOutlined class="text-5xl mb-5 text-gray-200" />
              <span class="text-[0.65rem] font-black uppercase tracking-[0.25em] text-center italic opacity-80">System awaiting ingest</span>
            </div>
          </div>
        </div>

        <div class="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white shadow-premium transition-all hover:shadow-2xl w-full flex-1 min-h-0 flex flex-col justify-center relative group">
          <div class="absolute bottom-0 left-0 h-32 w-32 bg-trc/5 rounded-full blur-3xl -ml-16 -mb-16 group-hover:bg-trc/10 transition-colors"></div>
          <div class="flex items-center gap-4 mb-8 relative z-10">
            <div class="h-10 w-10 rounded-2xl bg-trc/5 text-trc flex items-center justify-center text-lg"><InfoCircleFilled /></div>
            <h4 class="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-800">Archival Logic</h4>
          </div>
          <p class="text-[0.75rem] font-bold text-gray-400 leading-relaxed border-l-4 border-trc/20 pl-6 py-1 uppercase tracking-wider opacity-90 italic relative z-10 pr-4">
            "Ensure metadata accuracy to facilitate seamless neural indexing across regional nodes."
          </p>
        </div>

        <div class="rounded-[2.5rem] overflow-hidden relative group shadow-premium border border-white w-full transition-all hover:shadow-2xl flex-1 min-h-0">
          <img src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=2070&auto=format&fit=crop" class="absolute inset-0 h-full w-full object-cover transition-all duration-[3s] group-hover:scale-110" alt="Archive" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-10">
            <div class="h-[3px] w-8 bg-trc mb-6 transition-all group-hover:w-16"></div>
            <p class="text-[0.75rem] font-black text-white leading-relaxed uppercase tracking-[0.25em] italic opacity-100 drop-shadow-md">
              "Preserving the collective memory of Tigray."
            </p>
          </div>
        </div>

      </aside>
    </div>

    <!-- ── PRODUCTION AUTHOR MODAL ── -->
    <a-modal v-model:visible="isModalVisible" title="REGISTER ARCHIVAL CONTRIBUTOR" :footer="null" centered width="520px" :bodyStyle="{ padding: '48px' }">
      <div class="space-y-10">
        <div class="flex flex-col gap-3">
          <label class="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-400">Full Archival Identity</label>
          <input v-model="newAuthor.name" type="text" placeholder="e.g. Dr. Alula Tesfay" class="production-input !text-[0.75rem] !font-sans !font-bold text-gray-700" />
        </div>
        <div class="flex flex-col gap-3">
          <label class="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-400">Archival Role</label>
          <input v-model="newAuthor.role" type="text" placeholder="e.g. Lead Historiographer" class="production-input !text-[0.75rem] !font-sans !font-bold text-gray-700" />
        </div>
        <button @click="handleAuthorSubmit" class="w-full bg-trc text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-premium shadow-trc/30 hover:shadow-trc/50 hover:-translate-y-1 active:translate-y-0 transition-all">Record Identity</button>
      </div>
    </a-modal>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { 
  CheckOutlined, 
  DownOutlined, 
  CloseOutlined, 
  PlusOutlined, 
  ArrowRightOutlined, 
  ArrowLeftOutlined, 
  DeleteOutlined, 
  FilePdfFilled, 
  InfoCircleFilled, 
  CloudUploadOutlined, 
  InboxOutlined,
  SolutionOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const currentStep = ref(1)
const fileInput = ref<HTMLInputElement | null>(null)
const isModalVisible = ref(false)

const steps = [
  { id: 1, name: 'Upload' },
  { id: 2, name: 'Metadata' },
  { id: 3, name: 'Authors' },
  { id: 4, name: 'Preview' },
  { id: 5, name: 'Done' },
]

const categories = ['Historical Archives', 'Scientific Research', 'Linguistic Data', 'Legal Documentation', 'Cultural Artifacts']
const institutions = ['Mekelle University', 'Aksum University', 'Bureau of Culture', 'Adigrat University', 'International Partners']

const formData = reactive({
  file: null as any,
  title: '',
  category: 'Historical Archives',
  institution: 'Mekelle University',
  abstract: '',
  tags: ['AKSUM', 'HERITAGE'],
  authors: [] as any[]
})

const newAuthor = reactive({
  name: '',
  role: '',
  institution: ''
})

// Actions
const goToStep = (step: number) => {
   if (step <= currentStep.value) currentStep.value = step
}

const prevStep = () => {
   if (currentStep.value > 1) {
      currentStep.value--
   } else {
      router.back()
   }
}

const nextStep = () => {
   if (currentStep.value < steps.length) {
      currentStep.value++
   } else {
      message.loading({ content: 'Securing archival node...', key: 'upload' })
      setTimeout(() => {
         message.success({ content: 'Digital node recorded.', key: 'upload' })
         router.push('/dashboard')
      }, 2000)
   }
}

const triggerFileInput = () => fileInput.value?.click()

const handleFileUpload = (e: Event) => {
   const file = (e.target as HTMLInputElement).files?.[0]
   if (file) {
      formData.file = { name: file.name, size: file.size }
      message.success(`${file.name} staged successfully.`)
      setTimeout(() => currentStep.value = 2, 1000)
   }
}

const addTag = (e: KeyboardEvent) => {
   const val = (e.target as HTMLInputElement).value.trim().toUpperCase()
   if (val && !formData.tags.includes(val)) {
      formData.tags.push(val)
      ;(e.target as HTMLInputElement).value = ''
   }
}

const removeTag = (idx: number) => formData.tags.splice(idx, 1)

const handleAuthorSubmit = () => {
   if (newAuthor.name && newAuthor.role) {
      formData.authors.push({ ...newAuthor })
      newAuthor.name = ''
      newAuthor.role = ''
      newAuthor.institution = ''
      isModalVisible.value = false
      message.success('Archival identity recorded.')
   } else {
      message.warning('Identity incomplete.')
   }
}

const removeAuthor = (idx: number) => formData.authors.splice(idx, 1)

</script>

<style scoped>
.shadow-premium {
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.02),
    0 10px 15px -3px rgba(0, 0, 0, 0.03),
    0 20px 25px -5px rgba(0, 0, 0, 0.03),
    0 25px 50px -12px rgba(108, 43, 217, 0.05);
}

.production-input {
   @apply w-full rounded-2xl bg-gray-50/50 border border-gray-100/80 py-5 px-8 text-[1rem] font-bold text-gray-900 placeholder:text-gray-300 focus:bg-white focus:border-trc/30 focus:ring-8 focus:ring-trc/5 outline-none transition-all duration-300 shadow-sm font-serif;
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-enter-active, .list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-bounce-subtle {
  animation: bounce-subtle 3s ease-in-out infinite;
}

:deep(.ant-modal-content) {
  border-radius: 3rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 40px 100px -20px rgba(108, 43, 217, 0.15);
}

:deep(.ant-modal-header) {
  background: transparent;
  border-bottom: 1px solid rgba(0,0,0,0.03);
  padding: 32px 48px;
}

:deep(.ant-modal-title) {
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.75rem;
  color: #94a3b8;
}

input::placeholder, textarea::placeholder {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  letter-spacing: 0;
}
</style>
