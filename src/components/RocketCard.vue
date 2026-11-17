<script setup lang="ts">
import { ref } from 'vue'
import type { Rocket } from '@/stores/rockets'

defineProps<{
  rocket: Rocket
}>()

const imageFailed = ref(false)

function formatDate(date: string | null | undefined) {
  if (!date) return 'Date unavailable'
  const parsedDate = new Date(`${date}T00:00:00`)

  return Number.isNaN(parsedDate.getTime())
    ? 'Date unavailable'
    : parsedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatCost(cost: number | string | null | undefined) {
  const numericCost = Number(cost)

  return cost != null && cost !== '' && Number.isFinite(numericCost)
    ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          notation: 'compact',
          maximumFractionDigits: 1,
        }).format(numericCost)
    : 'Cost unavailable'
}
</script>

<template>
  <RouterLink
    :to="`/rockets/${rocket.id}`"
    class="rocket-card group flex h-full flex-col overflow-hidden rounded-[1.65rem] border border-slate-200/70 bg-white transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-950/[0.08]"
  >
    <div class="rocket-card__visual relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div class="rocket-card__stars absolute inset-0" />
      <img
        v-if="rocket.image_url && !imageFailed"
        :src="rocket.image_url"
        :alt="rocket.full_name"
          class="relative z-10 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        loading="lazy"
        @error="imageFailed = true"
      >
        <div v-else class="relative z-10 flex flex-col items-center gap-3 text-indigo-200/70" aria-label="Image unavailable">
          <span class="mdi mdi-rocket-launch-outline text-6xl" aria-hidden="true" />
          <span class="text-[10px] font-semibold uppercase tracking-[0.2em]">Image unavailable</span>
      </div>
        <div class="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/65 via-transparent to-slate-950/15" />
        <span class="absolute left-4 top-4 z-20 rounded-full border border-white/20 bg-slate-950/35 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur-md">
          {{ rocket.isLocal ? 'Your addition' : 'SpaceX · Launch vehicle' }}
        </span>
        <span class="absolute right-4 top-4 z-20 rounded-full border border-white/15 bg-slate-950/35 px-3 py-1.5 text-[10px] font-semibold text-white/90 backdrop-blur-md">
          {{ rocket.manufacturer?.country_code || 'Country unknown' }}
        </span>
        <span class="absolute bottom-4 left-5 z-20 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65">
          Explore vehicle
        </span>
        <span class="absolute bottom-3.5 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition group-hover:border-white/50 group-hover:bg-white group-hover:text-slate-950">
          <span class="mdi mdi-arrow-top-right text-base" aria-hidden="true" />
        </span>
    </div>

    <div class="flex flex-1 flex-col p-5 sm:p-6">
      <div class="flex items-start justify-between gap-3">
          <h2 class="text-lg font-bold leading-snug tracking-tight text-slate-950 transition group-hover:text-indigo-700">
          {{ rocket.full_name || 'Unnamed rocket' }}
        </h2>
      </div>
        <p class="mt-2 line-clamp-3 flex-1 text-[13px] leading-6 text-slate-500">
        {{ rocket.description || 'No description is available for this rocket yet.' }}
      </p>
        <div class="mt-5 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
          <span class="flex min-w-0 items-center gap-2 text-xs text-slate-500">
            <span class="mdi mdi-calendar-blank-outline shrink-0 text-base text-indigo-400" aria-hidden="true" />
            <span class="truncate">{{ formatDate(rocket.maiden_flight) }}</span>
        </span>
          <span class="shrink-0 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-bold tabular-nums text-slate-800">
            {{ formatCost(rocket.launch_cost) }}
        </span>
      </div>
    </div>
  </RouterLink>
</template>
