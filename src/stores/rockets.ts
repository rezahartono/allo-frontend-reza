import { defineStore } from 'pinia'

const API_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher/'

export interface Rocket {
  id: number | string
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: number | string | null
  maiden_flight: string | null
  manufacturer: {
    country_code: string | null
  } | null
  isLocal?: boolean
}

interface RocketListResponse {
  results: Rocket[]
}

interface NewRocket {
  full_name: string
  description: string
  image_url: string
  launch_cost: number | null
  maiden_flight: string
  country_code: string
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred.'
}

export const useRocketsStore = defineStore('rockets', {
  state: () => ({
    rockets: [] as Rocket[],
    loading: false,
    error: '',
    detailLoading: false,
    detailError: '',
    detailRequestId: '',
    selectedRocket: null as Rocket | null,
  }),

  actions: {
    async fetchRockets() {
      this.loading = true
      this.error = ''

      try {
        const response = await fetch(
          `${API_URL}?manufacturer__name=SpaceX&mode=detailed&limit=20`,
        )

        if (!response.ok) {
          throw new Error(`Gagal memuat daftar roket (HTTP ${response.status}).`)
        }

        const data = await response.json() as Partial<RocketListResponse>
        if (!Array.isArray(data.results)) {
          throw new Error('The rocket service returned an invalid response.')
        }

        const localRockets = this.rockets.filter((rocket) => rocket.isLocal)
        this.rockets = [...localRockets, ...data.results]
      } catch (error) {
        this.error = getErrorMessage(error)
      } finally {
        this.loading = false
      }
    },

    async fetchRocket(id: string) {
      this.detailRequestId = id
      this.detailLoading = true
      this.detailError = ''
      this.selectedRocket = this.rockets.find((rocket) => String(rocket.id) === id) ?? null

      if (this.selectedRocket) {
        this.detailLoading = false
        return
      }

      try {
        const response = await fetch(`${API_URL}${encodeURIComponent(id)}/?mode=detailed`)

        if (!response.ok) {
          throw new Error(`Gagal memuat detail roket (HTTP ${response.status}).`)
        }

        const rocket = await response.json() as Rocket
        if (this.detailRequestId === id) {
          this.selectedRocket = rocket
        }
      } catch (error) {
        if (this.detailRequestId === id) {
          this.detailError = getErrorMessage(error)
        }
      } finally {
        if (this.detailRequestId === id) {
          this.detailLoading = false
        }
      }
    },

    addRocket(input: NewRocket) {
      const rocket: Rocket = {
        id: `local-${Date.now()}`,
        full_name: input.full_name,
        description: input.description || null,
        image_url: input.image_url || null,
        launch_cost: input.launch_cost,
        maiden_flight: input.maiden_flight || null,
        manufacturer: {
          country_code: input.country_code || null,
        },
        isLocal: true,
      }

      this.rockets = [rocket, ...this.rockets]
      return rocket
    },
  },
})
