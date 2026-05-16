<template>
  <div class="bg-gray-50 min-h-screen py-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-extrabold text-[#0d1138] sm:text-5xl mb-4">Support Our Mission</h1>
        <p class="text-xl text-gray-600">
          Your generous contributions help us preserve our heritage and support sustainable development.
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="p-8 sm:p-12">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">Make a Donation</h3>
          
          <div class="grid grid-cols-3 gap-4 mb-8">
            <button class="border-2 border-gray-200 rounded-xl py-4 text-xl font-bold text-gray-700 hover:border-[#5222b0] hover:text-[#5222b0] transition focus:border-[#5222b0] focus:ring-1 focus:ring-[#5222b0]">$25</button>
            <button class="border-2 border-[#5222b0] bg-[#f3eef9] rounded-xl py-4 text-xl font-bold text-[#5222b0] transition">$50</button>
            <button class="border-2 border-gray-200 rounded-xl py-4 text-xl font-bold text-gray-700 hover:border-[#5222b0] hover:text-[#5222b0] transition focus:border-[#5222b0] focus:ring-1 focus:ring-[#5222b0]">$100</button>
          </div>

          <div class="mb-8">
            <label class="block text-sm font-medium text-gray-700 mb-2">Custom Amount</label>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-lg">$</span>
              </div>
              <input type="number" class="focus:ring-[#5222b0] focus:border-[#5222b0] block w-full pl-8 pr-12 sm:text-lg border-gray-300 rounded-md py-3" placeholder="0.00">
            </div>
          </div>

          <button class="w-full bg-[#5222b0] text-white rounded-xl py-4 text-lg font-bold hover:bg-[#3c1f62] transition shadow-lg">
            Donate Now
          </button>
          <p class="text-center text-sm text-gray-500 mt-4">Secure payment processing via Stripe. All donations are tax-deductible.</p>
        </div>
        <div class="bg-gray-50 px-8 py-6 border-t border-gray-100">
          <h4 class="font-semibold text-gray-900 mb-2">Other ways to give</h4>
          <p class="text-sm text-gray-600">If you prefer to donate via bank transfer, check, or wire, please <a href="#" class="text-[#5222b0] font-medium hover:underline">contact us</a> for details.</p>
        </div>
      </div>
    </div>
  </div>
</template>
