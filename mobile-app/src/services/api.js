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
  const response = await api.get('/')
  return response.data
}

export const getHomepageData = async () => {
  const response = await api.get('/homepage')
  return response.data
}

export default api

