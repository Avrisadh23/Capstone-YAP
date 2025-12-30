import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Events API
export const getEvents = async (params = {}) => {
  const response = await api.get('/events', { params })
  return response.data
}

export const getEvent = async (id) => {
  const response = await api.get(`/events/${id}`)
  return response.data
}

export const createEvent = async (data) => {
  const response = await api.post('/events', data)
  return response.data
}

export const updateEvent = async (id, data) => {
  const response = await api.put(`/events/${id}`, data)
  return response.data
}

export const deleteEvent = async (id) => {
  const response = await api.delete(`/events/${id}`)
  return response.data
}

export const joinEvent = async (id, data) => {
  const response = await api.post(`/events/${id}/join`, data)
  return response.data
}

// Communities API
export const getCommunities = async (params = {}) => {
  const response = await api.get('/communities', { params })
  return response.data
}

export const getCommunity = async (id) => {
  const response = await api.get(`/communities/${id}`)
  return response.data
}

export const createCommunity = async (data) => {
  const response = await api.post('/communities', data)
  return response.data
}

export const updateCommunity = async (id, data) => {
  const response = await api.put(`/communities/${id}`, data)
  return response.data
}

export const deleteCommunity = async (id) => {
  const response = await api.delete(`/communities/${id}`)
  return response.data
}

export const joinCommunity = async (id, data) => {
  const response = await api.post(`/communities/${id}/join`, data)
  return response.data
}

// Landing page data
export const getLandingData = async () => {
  // For now, return static data matching web structure
  // In production, this should call an API endpoint
  return {
    features: [
      {
        id: 1,
        title: 'Kelola Komunitas dengan Mudah',
        description: 'Platform yang memudahkan Anda untuk mengelola komunitas, mengatur event, dan berinteraksi dengan anggota.',
        link_text: 'Mulai Sekarang',
        link_url: '#'
      },
      {
        id: 2,
        title: 'Jelajahi Komunitas',
        description: 'Temukan komunitas yang sesuai dengan minat dan hobi Anda. Bergabunglah dengan ribuan anggota lainnya.',
        link_text: null,
        link_url: null
      }
    ],
    showcases: [
      {
        id: 1,
        image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=400&q=80',
        alt_text: 'Showcase 1'
      },
      {
        id: 2,
        image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
        alt_text: 'Showcase 2'
      },
      {
        id: 3,
        image_url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=400&q=80',
        alt_text: 'Showcase 3'
      }
    ],
    testimonials: [
      {
        id: 1,
        name: 'John Doe',
        role: 'Community Manager',
        quote: 'Platform yang sangat membantu untuk mengelola komunitas kami. Fitur-fiturnya lengkap dan mudah digunakan.',
        avatar_url: null
      }
    ],
    appLinks: [
      {
        id: 1,
        platform: 'ios',
        label: 'App Store',
        url: '#',
        badge_text: 'Download on the',
        icon: 'apple'
      },
      {
        id: 2,
        platform: 'android',
        label: 'Google Play',
        url: '#',
        badge_text: 'GET IT ON',
        icon: 'play'
      }
    ],
    filters: [
      { label: 'Aktivitas', placeholder: 'Pilih aktivitas' },
      { label: 'Lokasi', placeholder: 'Pilih kota' },
      { label: 'Cabang Korwil', placeholder: 'Pilih Cabang Korwil' }
    ]
  }
}

export const getHomepageData = async () => {
  const response = await api.get('/homepage')
  return response.data
}

export default api

