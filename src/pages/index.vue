<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRocketsStore } from '@/stores/rockets'
import AddRocketModal from '@/components/AddRocketModal.vue'
import RocketCard from '@/components/RocketCard.vue'

const store = useRocketsStore()
const search = ref('')
const filter = ref<'all' | 'images' | 'incomplete'>('all')
const modalOpen = ref(false)
const filterOptions = [
  { id: 'all', label: 'All rockets' },
  { id: 'images', label: 'With imagery' },
  { id: 'incomplete', label: 'Missing details' },
] as const

const visibleRockets = computed(() => {
  const query = search.value.trim().toLowerCase()

  return store.rockets.filter((rocket) => {
    const matchesSearch = !query
      || rocket.full_name?.toLowerCase().includes(query)
      || rocket.description?.toLowerCase().includes(query)
      || rocket.manufacturer?.country_code?.toLowerCase().includes(query)
    const missingData = !rocket.image_url
      || !rocket.description
      || rocket.launch_cost == null
      || rocket.launch_cost === ''
      || !rocket.maiden_flight
      || !rocket.manufacturer?.country_code

    return matchesSearch
      && (filter.value === 'all'
        || (filter.value === 'images' && Boolean(rocket.image_url))
        || (filter.value === 'incomplete' && missingData))
  })
})

const availableImages = computed(() => store.rockets.filter((rocket) => rocket.image_url).length)

function addRocket(input: Parameters<typeof store.addRocket>[0]) {
  store.addRocket(input)
  modalOpen.value = false
}

onMounted(() => {
  void store.fetchRockets()
})
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
      <nav class="flex items-center gap-3 sm:gap-6">
        <a href="#directory" class="hidden text-sm font-semibold text-slate-500 transition hover:text-slate-950 sm:block">Directory</a>
        <span class="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700 shadow-sm sm:text-[11px]">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Fleet live
        </span>
      </nav>
    </header>

    <main>
      <section class="space-hero relative mt-5 overflow-hidden rounded-[2rem] px-6 py-10 text-white sm:px-10 sm:py-12 lg:mt-7 lg:px-14 lg:py-14">
        <div class="space-hero__glow space-hero__glow--one" />
        <div class="space-hero__glow space-hero__glow--two" />
        <div class="relative z-10 grid items-center gap-8 lg:grid-cols-[1fr_0.85fr] lg:gap-4">
          <div class="max-w-2xl">
            <p class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-200 backdrop-blur sm:text-[11px]">
              <span class="mdi mdi-orbit text-sm" aria-hidden="true" />
              The next frontier
            </p>
            <h1 class="mt-6 text-[2.7rem] font-semibold leading-[1.03] tracking-[-0.055em] sm:text-6xl lg:text-[4.5rem]">
              Space begins<br class="hidden sm:block">
              <span class="hero-gradient-text">with a launch.</span>
            </h1>
            <p class="mt-5 max-w-md text-sm leading-7 text-slate-300 sm:text-base">
              Meet the vehicles rewriting what’s possible, from first orbit to the next great leap.
            </p>
            <div class="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#directory"
                class="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-indigo-50"
              >
                Explore the fleet
                <span class="mdi mdi-arrow-down-right text-base" aria-hidden="true" />
              </a>
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-white/30 hover:bg-white/10"
                @click="modalOpen = true"
              >
                <span class="mdi mdi-plus text-lg" aria-hidden="true" />
                Add a rocket
              </button>
            </div>
          </div>

          <div class="relative mx-auto flex aspect-square w-full max-w-[19rem] items-center justify-center sm:max-w-[23rem] lg:mr-2">
            <div class="orbit-ring orbit-ring--outer" />
            <div class="orbit-ring orbit-ring--middle" />
            <div class="orbit-ring orbit-ring--inner" />
            <div class="orbit-ring orbit-ring--tilt">
              <span class="orbit-dot" />
            </div>
            <div class="orbit-core">
              <span class="mdi mdi-rocket-launch-outline text-6xl text-white sm:text-7xl" aria-hidden="true" />
              <span class="absolute bottom-7 text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-200/80">Go beyond</span>
            </div>
            <div class="absolute bottom-1 left-0 right-0 grid grid-cols-2 divide-x divide-white/10 rounded-2xl border border-white/10 bg-slate-950/45 p-4 shadow-xl shadow-black/10 backdrop-blur-xl sm:bottom-2 sm:left-4 sm:right-4">
              <div class="px-3">
                <p class="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">Configurations</p>
                <p class="mt-1 text-xl font-bold tracking-tight text-white">{{ store.rockets.length || '—' }}</p>
              </div>
              <div class="px-4">
                <p class="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">With imagery</p>
                <p class="mt-1 text-xl font-bold tracking-tight text-white">{{ availableImages || '—' }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="directory" class="scroll-mt-24 mt-12 sm:mt-16">
        <div class="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-600">Explore the collection</p>
            <div class="mt-2 flex flex-wrap items-baseline gap-3">
              <h2 class="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">The fleet</h2>
              <span class="rounded-full bg-slate-200/70 px-2.5 py-1 text-[11px] font-bold tabular-nums text-slate-500">
                {{ store.rockets.length ? String(store.rockets.length).padStart(2, '0') : '—' }}
              </span>
            </div>
            <p class="mt-2 text-sm text-slate-500">A closer look at the machines making history.</p>
          </div>
          <label class="relative block w-full md:max-w-xs">
            <span class="mdi mdi-magnify absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" aria-hidden="true" />
            <input
              v-model="search"
              type="search"
              placeholder="Search rockets..."
              aria-label="Search rockets"
              class="w-full rounded-2xl border border-slate-200/80 bg-white/80 py-3.5 pl-11 pr-4 text-sm shadow-sm shadow-slate-900/[0.02] outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100/80"
            >
          </label>
        </div>

        <div class="mt-7 flex flex-wrap items-center justify-between gap-4">
          <div class="inline-flex flex-wrap gap-1.5 rounded-2xl border border-slate-200/70 bg-white/70 p-1.5 shadow-sm" aria-label="Filter rockets">
            <button
              v-for="option in filterOptions"
              :key="option.id"
              type="button"
              class="rounded-xl px-4 py-2.5 text-xs font-semibold transition"
              :class="filter === option.id
                ? 'bg-slate-950 text-white shadow-md shadow-slate-900/10'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'"
              :aria-pressed="filter === option.id"
              @click="filter = option.id"
            >
              {{ option.label }}
            </button>
          </div>
          <p class="flex items-center gap-2 text-xs font-medium text-slate-500" aria-live="polite">
            <span class="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Showing {{ visibleRockets.length }} {{ visibleRockets.length === 1 ? 'rocket' : 'rockets' }}
          </p>
        </div>

        <div
          v-if="store.error"
          role="alert"
          class="mt-6 flex flex-col gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-start gap-3">
            <span class="mdi mdi-alert-circle-outline mt-0.5 text-xl text-rose-600" aria-hidden="true" />
            <div>
              <p class="font-semibold text-rose-900">We couldn't load the fleet</p>
              <p class="mt-1 text-sm text-rose-700">{{ store.error }}</p>
            </div>
          </div>
          <button
            type="button"
            class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-wait disabled:opacity-60"
            :disabled="store.loading"
            @click="store.fetchRockets()"
          >
            <span class="mdi mdi-refresh" aria-hidden="true" />
            Try again
          </button>
        </div>

        <div
          v-if="store.loading && !store.rockets.length"
          class="grid gap-5 pt-6 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Loading rockets"
        >
          <div v-for="index in 6" :key="index" class="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div class="skeleton h-52" />
            <div class="space-y-3 p-5">
              <div class="skeleton h-5 w-2/3" />
              <div class="skeleton h-4 w-full" />
              <div class="skeleton h-4 w-4/5" />
              <div class="skeleton mt-5 h-8 w-full" />
            </div>
          </div>
        </div>

        <div
          v-else-if="!store.loading && !store.error && visibleRockets.length === 0"
          class="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"
        >
          <span class="mdi mdi-rocket-launch-outline text-5xl text-indigo-300" aria-hidden="true" />
          <h3 class="mt-4 text-lg font-bold text-slate-900">
            {{ store.rockets.length ? 'No rockets match your search' : 'Your fleet is ready to launch' }}
          </h3>
          <p class="mt-2 text-sm text-slate-500">
            {{ store.rockets.length ? 'Try another search or filter.' : 'Add a rocket to get started.' }}
          </p>
          <button
            v-if="!store.rockets.length"
            type="button"
            class="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            @click="modalOpen = true"
          >
            Add your first rocket
          </button>
        </div>

        <div v-else-if="visibleRockets.length" class="grid gap-5 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          <RocketCard v-for="rocket in visibleRockets" :key="rocket.id" :rocket="rocket" />
        </div>
      </section>
    </main>

    <footer class="mt-16 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
      Rocket data provided by Launch Library 2
    </footer>

    <AddRocketModal :open="modalOpen" @close="modalOpen = false" @save="addRocket" />
  </div>
</template>
