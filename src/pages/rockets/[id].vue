<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRocketsStore } from '@/stores/rockets'

const route = useRoute()
const store = useRocketsStore()
const imageFailed = ref(false)

const rocket = computed(() => store.selectedRocket)

function formatCost(cost: number | string | null | undefined) {
  const numericCost = Number(cost)

  return cost != null && cost !== '' && Number.isFinite(numericCost)
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(numericCost)
    : 'Not available'
}

function formatDate(date: string | null | undefined) {
  if (!date) return 'Not available'
  const parsedDate = new Date(`${date}T00:00:00`)

  return Number.isNaN(parsedDate.getTime())
    ? 'Not available'
    : parsedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

watch(
  () => route.params.id,
  (id) => {
    imageFailed.value = false
    void store.fetchRocket(String(id))
  },
  { immediate: true },
)
</script>

<template>
  <div class="mx-auto min-h-screen max-w-[1440px] px-5 pb-16 sm:px-8 lg:px-12">
    <header class="sticky top-0 z-30 -mx-5 flex items-center justify-between border-b border-slate-200/70 bg-[#f7f8fc]/85 px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
      <RouterLink to="/" class="flex items-center gap-3" aria-label="Orbital home">
        <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-600/25 ring-1 ring-white/60">
          <span class="mdi mdi-rocket-launch text-xl" aria-hidden="true" />
        </span>
        <span>
          <span class="block text-lg font-extrabold leading-none tracking-tight text-slate-950">orbital<span class="text-indigo-600">.</span></span>
          <span class="mt-1 hidden text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 sm:block">Spaceflight index</span>
        </span>
      </RouterLink>
      <RouterLink to="/" class="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700">
        <span class="mdi mdi-arrow-left" aria-hidden="true" />
        Back to fleet
      </RouterLink>
    </header>

    <main class="mx-auto max-w-5xl">
      <div v-if="store.detailLoading" class="mt-8 space-y-5 sm:mt-12" aria-label="Loading rocket details">
        <div class="skeleton h-72 rounded-[2rem] sm:h-[26rem]" />
        <div class="skeleton h-8 w-1/2 rounded-xl" />
        <div class="skeleton h-24 w-full rounded-2xl" />
      </div>

      <div v-else-if="store.detailError" role="alert" class="mt-8 rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-center sm:mt-12">
        <span class="mdi mdi-alert-circle-outline text-4xl text-rose-600" aria-hidden="true" />
        <h1 class="mt-3 text-xl font-bold text-rose-900">We couldn't load this rocket</h1>
        <p class="mt-2 text-sm text-rose-700">{{ store.detailError }}</p>
        <button
          type="button"
          class="mt-5 rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
          @click="store.fetchRocket(String(route.params.id))"
        >
          Try again
        </button>
      </div>

      <div v-else-if="rocket" class="mt-7 sm:mt-10">
        <nav aria-label="Breadcrumb" class="mb-5 flex items-center gap-2 text-xs font-medium text-slate-400">
          <RouterLink to="/" class="transition hover:text-indigo-600">Fleet</RouterLink>
          <span class="mdi mdi-chevron-right text-base" aria-hidden="true" />
          <span class="max-w-[14rem] truncate text-slate-600">{{ rocket.full_name || 'Rocket details' }}</span>
        </nav>

        <div class="detail-hero relative flex min-h-80 items-center justify-center overflow-hidden rounded-[2rem] border border-slate-800/10 sm:min-h-[28rem]">
          <div class="detail-hero__glow absolute -left-20 top-0 h-64 w-64 rounded-full bg-indigo-500/25 blur-3xl" />
          <img
            v-if="rocket.image_url && !imageFailed"
            :src="rocket.image_url"
            :alt="rocket.full_name"
            class="absolute inset-0 h-full w-full object-cover"
            @error="imageFailed = true"
          >
          <div v-else class="relative z-10 flex flex-col items-center gap-4 text-indigo-200/70">
            <span class="mdi mdi-rocket-launch-outline text-8xl" aria-hidden="true" />
            <span class="text-[10px] font-semibold uppercase tracking-[0.2em]">Image unavailable</span>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-slate-950/20" />
          <div class="absolute inset-x-5 top-5 flex items-center justify-between sm:inset-x-7 sm:top-7">
            <span class="rounded-full border border-white/15 bg-slate-950/35 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur-md">
              {{ rocket.isLocal ? 'Your addition' : 'SpaceX · Launch vehicle' }}
            </span>
            <span class="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-slate-950/35 text-white/80 backdrop-blur-md">
              <span class="mdi mdi-arrow-top-right text-lg" aria-hidden="true" />
            </span>
          </div>
          <div class="absolute inset-x-6 bottom-6 sm:inset-x-9 sm:bottom-9">
            <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-200">Rocket profile</p>
            <h1 class="mt-2 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl">
              {{ rocket.full_name || 'Unnamed rocket' }}
            </h1>
          </div>
        </div>

        <div class="mt-7 grid gap-6 lg:grid-cols-[1fr_19rem]">
          <article class="rounded-[1.65rem] border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-900/[0.02] sm:p-8">
            <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
              <span class="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              About this vehicle
            </div>
            <p class="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              {{ rocket.description || 'No description is available for this rocket yet.' }}
            </p>
          </article>

          <aside class="rounded-[1.65rem] border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-900/[0.02] sm:p-7">
            <div class="flex items-center justify-between">
              <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Specifications</p>
              <span class="mdi mdi-tune-variant text-lg text-indigo-500" aria-hidden="true" />
            </div>
            <dl class="mt-4 divide-y divide-slate-100">
              <div class="py-4 first:pt-2">
                <dt class="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <span class="mdi mdi-cash-multiple text-base text-indigo-500" aria-hidden="true" />
                  Cost per launch
                </dt>
                <dd class="mt-2 pl-6 text-sm font-bold tabular-nums text-slate-950">{{ formatCost(rocket.launch_cost) }}</dd>
              </div>
              <div class="py-4">
                <dt class="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <span class="mdi mdi-earth text-base text-indigo-500" aria-hidden="true" />
                  Country
                </dt>
                <dd class="mt-2 pl-6 text-sm font-bold text-slate-950">{{ rocket.manufacturer?.country_code || 'Not available' }}</dd>
              </div>
              <div class="py-4 last:pb-0">
                <dt class="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <span class="mdi mdi-calendar-blank-outline text-base text-indigo-500" aria-hidden="true" />
                  First flight
                </dt>
                <dd class="mt-2 pl-6 text-sm font-bold text-slate-950">{{ formatDate(rocket.maiden_flight) }}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </main>
  </div>
</template>
