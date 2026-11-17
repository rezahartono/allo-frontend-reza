<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  save: [rocket: {
    full_name: string
    description: string
    image_url: string
    launch_cost: number | null
    maiden_flight: string
    country_code: string
  }]
}>()

const form = reactive({
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  maiden_flight: '',
  country_code: '',
})

watch(() => props.open, (open) => {
  if (open) {
    Object.assign(form, {
      full_name: '',
      description: '',
      image_url: '',
      launch_cost: '',
      maiden_flight: '',
      country_code: '',
    })
  }
})

function submit() {
  const cost = Number(form.launch_cost)
  emit('save', {
    full_name: form.full_name.trim(),
    description: form.description.trim(),
    image_url: form.image_url.trim(),
    launch_cost: form.launch_cost && Number.isFinite(cost) ? cost : null,
    maiden_flight: form.maiden_flight,
    country_code: form.country_code.trim().toUpperCase(),
  })
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
      @click.self="emit('close')"
      @keydown.esc="emit('close')"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-rocket-title"
        class="my-auto w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Expand your fleet</p>
            <h2 id="add-rocket-title" class="mt-2 text-2xl font-bold text-slate-900">Add a rocket</h2>
            <p class="mt-1 text-sm text-slate-500">This rocket will be saved for this session only.</p>
          </div>
          <button
            type="button"
            class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close dialog"
            @click="emit('close')"
          >
            <span class="mdi mdi-close text-xl" aria-hidden="true" />
          </button>
        </div>

        <form class="mt-7 space-y-4" @submit.prevent="submit">
          <label class="block text-sm font-semibold text-slate-700">
            Rocket name <span class="text-rose-500">*</span>
            <input
              v-model.trim="form.full_name"
              required
              maxlength="100"
              class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              placeholder="e.g. Starship"
            >
          </label>

          <label class="block text-sm font-semibold text-slate-700">
            Description
            <textarea
              v-model="form.description"
              rows="3"
              maxlength="1000"
              class="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              placeholder="What makes this rocket special?"
            />
          </label>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="block text-sm font-semibold text-slate-700">
              Country code
              <input
                v-model="form.country_code"
                maxlength="3"
                class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal uppercase outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                placeholder="US"
              >
            </label>
            <label class="block text-sm font-semibold text-slate-700">
              Launch cost (USD)
              <input
                v-model="form.launch_cost"
                type="number"
                min="0"
                step="1"
                class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                placeholder="Not required"
              >
            </label>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="block text-sm font-semibold text-slate-700">
              First flight
              <input
                v-model="form.maiden_flight"
                type="date"
                class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              >
            </label>
            <label class="block text-sm font-semibold text-slate-700">
              Image URL
              <input
                v-model="form.image_url"
                type="url"
                class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                placeholder="https://..."
              >
            </label>
          </div>

          <div class="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              class="rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              @click="emit('close')"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
            >
              Add to fleet
            </button>
          </div>
        </form>
      </section>
    </div>
  </Teleport>
</template>
