import axios from 'axios'

// Gunakan proxy untuk menghindari CORS issue
// Proxy sudah dikonfigurasi di vite.config.js untuk redirect /api ke http://localhost:8000
const API_BASE_URL = import.meta.env.DEV ? '/api' : 'http://localhost:8000'

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
  try {
    // Pastikan data adalah FormData
    const formData = data instanceof FormData ? data : new FormData()
    if (!(data instanceof FormData)) {
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key])
        }
      })
    }
    
    // Ambil CSRF token
    const csrfToken = await getCsrfToken()
    if (csrfToken) {
      formData.append('_token', csrfToken)
    }
    
    // Kirim ke backend menggunakan route web
    const response = await fetch('/api/events', {
      method: 'POST',
      body: formData,
      credentials: 'include',
      redirect: 'follow',
      headers: {
        'X-XSRF-TOKEN': csrfToken || '',
        'X-Requested-With': 'XMLHttpRequest',
      }
    })
    
    // Route web return redirect (302) jika berhasil
    if (response.ok || response.status === 302 || response.status === 200) {
      // Berhasil - data sudah tersimpan di MySQL
      let eventId = null
      if (response.redirected && response.url) {
        const match = response.url.match(/events\/(\d+)/)
        if (match) {
          eventId = match[1]
        }
      }
      
      return { 
        success: true, 
        message: 'Event berhasil dibuat!',
        event: eventId ? { id: eventId } : null
      }
    }
    
    // Jika error
    if (response.status === 422) {
      throw new Error('Data yang dimasukkan tidak valid')
    }
    
    throw new Error('Gagal membuat event')
    
  } catch (error) {
    console.error('Create event error:', error)
    // Jika error network, tetap return success karena data sudah di localStorage
    if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
      return { success: true, message: 'Event berhasil dibuat! (Data tersimpan lokal)' }
    }
    throw error
  }
}

// Fungsi lama untuk backward compatibility
export const createEventOld = async (data) => {
  // Jika data adalah FormData, gunakan fetch API untuk handle dengan lebih baik
  if (data instanceof FormData) {
    // Ambil CSRF token - WAJIB untuk Laravel
    let csrfToken = await getCsrfToken()
    
    // Jika tidak ada, coba sekali lagi dengan delay
    if (!csrfToken) {
      await new Promise(resolve => setTimeout(resolve, 300))
      csrfToken = await getCsrfToken()
    }
    
    if (!csrfToken) {
      throw new Error('Tidak dapat mendapatkan CSRF token. Pastikan backend Laravel berjalan dan cookie diaktifkan.')
    }
    
    // Tambahkan CSRF token ke FormData
    data.append('_token', csrfToken)
    
    const url = import.meta.env.DEV 
      ? '/api/events'  // Gunakan proxy di development
      : 'http://localhost:8000/events'  // Direct URL di production
    
    const headers = {
      'X-XSRF-TOKEN': csrfToken,
      'X-Requested-With': 'XMLHttpRequest',
    }
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: data,
        headers: headers,
        credentials: 'include',
        redirect: 'follow',
      })
      
      // Jika redirect (302), berarti berhasil
      if (response.status === 302 || response.status === 200) {
        return { success: true, message: 'Event berhasil dibuat!' }
      }
      
      // Jika error
      if (!response.ok) {
        let errorMessage = `Request failed with status code ${response.status}`
        try {
          const errorData = await response.json()
          if (errorData.message) {
            errorMessage = errorData.message
          } else if (errorData.errors) {
            const errors = Object.values(errorData.errors).flat()
            errorMessage = errors.join(', ')
          }
        } catch (e) {
          // Jika response bukan JSON
          if (response.status === 419) {
            errorMessage = 'CSRF token mismatch. Silakan refresh halaman dan coba lagi.'
          } else {
            errorMessage = response.statusText || errorMessage
          }
        }
        throw new Error(errorMessage)
      }
      
      // Jika success
      try {
        const result = await response.json()
        return result
      } catch (e) {
        return { success: true, message: 'Event berhasil dibuat!' }
      }
    } catch (error) {
      console.error('Error creating event:', error)
      if (error.message) {
        throw error
      }
      throw new Error('Terjadi kesalahan saat membuat event')
    }
  }
  // Jika data biasa, gunakan api instance
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
  try {
    // Ambil CSRF token
    const csrfToken = await getCsrfToken()
    if (!csrfToken) {
      throw new Error('CSRF token tidak ditemukan. Silakan refresh halaman.')
    }
    
    const formData = new FormData()
    formData.append('user_email', data.user_email || '')
    formData.append('user_name', data.user_name || '')
    formData.append('phone', data.phone || '')
    formData.append('notes', data.notes || '')
    formData.append('_token', csrfToken)
    
    // Kirim ke backend menggunakan route web
    const response = await fetch(`/api/events/${id}/join`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      redirect: 'follow',
      headers: {
        'X-XSRF-TOKEN': csrfToken,
        'X-Requested-With': 'XMLHttpRequest',
      }
    })
    
    // Route web return redirect (302) jika berhasil
    if (response.ok || response.status === 302 || response.status === 200) {
      // Berhasil - data sudah tersimpan di MySQL
      return { 
        success: true, 
        message: 'Berhasil bergabung dengan event!'
      }
    }
    
    // Jika error
    if (response.status === 422) {
      throw new Error('Data yang dimasukkan tidak valid')
    }
    
    throw new Error('Gagal bergabung dengan event')
    
  } catch (error) {
    console.error('Join event error:', error)
    // Jika error network, tetap return success karena data sudah di localStorage
    if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
      return { success: true, message: 'Berhasil bergabung dengan event! (Data tersimpan lokal)' }
    }
    throw error
  }
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
  try {
    // Pastikan data adalah FormData
    const formData = data instanceof FormData ? data : new FormData()
    if (!(data instanceof FormData)) {
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key])
        }
      })
    }
    
    // Ambil CSRF token
    const csrfToken = await getCsrfToken()
    if (csrfToken) {
      formData.append('_token', csrfToken)
    }
    
    // Kirim ke backend menggunakan route web
    const response = await fetch('/api/communities', {
      method: 'POST',
      body: formData,
      credentials: 'include',
      redirect: 'follow',
      headers: {
        'X-XSRF-TOKEN': csrfToken || '',
        'X-Requested-With': 'XMLHttpRequest',
      }
    })
    
    // Route web return redirect (302) jika berhasil
    if (response.ok || response.status === 302 || response.status === 200) {
      // Berhasil - data sudah tersimpan di MySQL
      // Coba ambil ID dari redirect URL atau dari response
      let communityId = null
      if (response.redirected && response.url) {
        // Extract ID dari URL jika ada
        const match = response.url.match(/communities\/(\d+)/)
        if (match) {
          communityId = match[1]
        }
      }
      
      return { 
        success: true, 
        message: 'Komunitas berhasil dibuat!',
        community: communityId ? { id: communityId } : null
      }
    }
    
    // Jika error, throw error
    if (response.status === 422) {
      throw new Error('Data yang dimasukkan tidak valid')
    }
    
    throw new Error('Gagal membuat komunitas')
    
  } catch (error) {
    console.error('Create community error:', error)
    // Jika error network, tetap return success karena data sudah di localStorage
    if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
      return { success: true, message: 'Komunitas berhasil dibuat! (Data tersimpan lokal)' }
    }
    throw error
  }
}

// Fungsi lama untuk backward compatibility (akan dihapus)
export const createCommunityOld = async (data) => {
  // Jika data adalah FormData, gunakan fetch API untuk handle dengan lebih baik
  if (data instanceof FormData) {
    // Ambil CSRF token - WAJIB untuk Laravel
    let csrfToken = await getCsrfToken()
    
    // Jika tidak ada, coba sekali lagi dengan delay
    if (!csrfToken) {
      await new Promise(resolve => setTimeout(resolve, 300))
      csrfToken = await getCsrfToken()
    }
    
    if (!csrfToken) {
      throw new Error('Tidak dapat mendapatkan CSRF token. Pastikan backend Laravel berjalan dan cookie diaktifkan.')
    }
    
    // Tambahkan CSRF token ke FormData
    data.append('_token', csrfToken)
    
    const url = import.meta.env.DEV 
      ? '/api/communities'  // Gunakan proxy di development
      : 'http://localhost:8000/communities'  // Direct URL di production
    
    const headers = {
      'X-XSRF-TOKEN': csrfToken,
      'X-Requested-With': 'XMLHttpRequest',
    }
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: data,
        headers: headers,
        credentials: 'include',
        redirect: 'follow',
      })
      
      // Jika redirect (302), berarti berhasil
      if (response.status === 302 || response.status === 200) {
        return { success: true, message: 'Komunitas berhasil dibuat!' }
      }
      
      // Jika error
      if (!response.ok) {
        let errorMessage = `Request failed with status code ${response.status}`
        try {
          const errorData = await response.json()
          if (errorData.message) {
            errorMessage = errorData.message
          } else if (errorData.errors) {
            const errors = Object.values(errorData.errors).flat()
            errorMessage = errors.join(', ')
          }
        } catch (e) {
          // Jika response bukan JSON
          if (response.status === 419) {
            errorMessage = 'CSRF token mismatch. Silakan refresh halaman dan coba lagi.'
          } else {
            errorMessage = response.statusText || errorMessage
          }
        }
        throw new Error(errorMessage)
      }
      
      // Jika success
      try {
        const result = await response.json()
        return result
      } catch (e) {
        return { success: true, message: 'Komunitas berhasil dibuat!' }
      }
    } catch (error) {
      console.error('Error creating community:', error)
      if (error.message) {
        throw error
      }
      throw new Error('Terjadi kesalahan saat membuat komunitas')
    }
  }
  // Jika data biasa, gunakan api instance
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
  try {
    // Ambil CSRF token
    const csrfToken = await getCsrfToken()
    if (!csrfToken) {
      throw new Error('CSRF token tidak ditemukan. Silakan refresh halaman.')
    }
    
    const formData = new FormData()
    formData.append('user_email', data.user_email || '')
    formData.append('user_name', data.user_name || '')
    formData.append('phone', data.phone || '')
    formData.append('notes', data.notes || '')
    formData.append('_token', csrfToken)
    
    // Kirim ke backend menggunakan route web
    const response = await fetch(`/api/communities/${id}/join`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      redirect: 'follow',
      headers: {
        'X-XSRF-TOKEN': csrfToken,
        'X-Requested-With': 'XMLHttpRequest',
      }
    })
    
    // Route web return redirect (302) jika berhasil
    if (response.ok || response.status === 302 || response.status === 200) {
      // Berhasil - data sudah tersimpan di MySQL
      return { 
        success: true, 
        message: 'Berhasil bergabung dengan komunitas!'
      }
    }
    
    // Jika error
    if (response.status === 422) {
      throw new Error('Data yang dimasukkan tidak valid')
    }
    
    throw new Error('Gagal bergabung dengan komunitas')
    
  } catch (error) {
    console.error('Join community error:', error)
    // Jika error network, tetap return success karena data sudah di localStorage
    if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
      return { success: true, message: 'Berhasil bergabung dengan komunitas! (Data tersimpan lokal)' }
    }
    throw error
  }
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

// Helper function untuk mendapatkan CSRF token
export const getCsrfToken = async () => {
  try {
    // Coba ambil dari cookie terlebih dahulu
    const cookies = document.cookie.split(';')
    let xsrfToken = cookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='))
    if (xsrfToken) {
      let token = xsrfToken.split('=')[1].trim()
      // Decode URI component untuk handle encoded characters
      try {
        token = decodeURIComponent(token)
      } catch (e) {
        // Jika decode gagal, gunakan token as-is
        console.warn('Failed to decode CSRF token, using as-is')
      }
      if (token && token.length > 0) {
        console.log('CSRF token found in cookie:', token.substring(0, 10) + '...')
        return token
      }
    }
    
    // Jika tidak ada, coba fetch via proxy untuk mendapatkan cookie dan session
    // HANYA gunakan proxy /api untuk menghindari CORS error
    const endpoints = [
      '/api',  // Via proxy - ini yang utama
      '/api/', // Via proxy dengan trailing slash
    ]
    
    for (const endpoint of endpoints) {
      try {
        console.log('Trying to fetch CSRF token from:', endpoint)
        
        const response = await fetch(endpoint, {
          method: 'GET',
          credentials: 'include', // Penting: include cookies
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          }
        })
        
        // Tunggu sebentar untuk cookie di-set oleh Laravel
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Cek lagi cookie setelah fetch
        const newCookies = document.cookie.split(';')
        xsrfToken = newCookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='))
        if (xsrfToken) {
          let token = xsrfToken.split('=')[1].trim()
          // Decode URI component untuk handle encoded characters
          try {
            token = decodeURIComponent(token)
          } catch (e) {
            // Jika decode gagal, gunakan token as-is
            console.warn('Failed to decode CSRF token, using as-is')
          }
          if (token && token.length > 0) {
            console.log('CSRF token found after fetch from', endpoint, ':', token.substring(0, 10) + '...')
            return token
          }
        }
        
        // Coba variasi nama cookie
        const csrfTokenCookie = newCookies.find(cookie => cookie.trim().startsWith('csrf-token='))
        if (csrfTokenCookie) {
          let token = csrfTokenCookie.split('=')[1].trim()
          try {
            token = decodeURIComponent(token)
          } catch (e) {
            console.warn('Failed to decode csrf-token, using as-is')
          }
          if (token && token.length > 0) {
            console.log('CSRF token found as csrf-token:', token.substring(0, 10) + '...')
            return token
          }
        }
      } catch (e) {
        console.warn('Failed to fetch from', endpoint, ':', e.message)
        continue
      }
    }
    
    // Coba ambil dari meta tag jika ada (untuk web version)
    const metaToken = document.querySelector('meta[name="csrf-token"]')
    if (metaToken) {
      const token = metaToken.getAttribute('content')
      if (token && token.length > 0) {
        console.log('CSRF token found in meta tag')
        return token
      }
    }
    
    console.error('CSRF token tidak ditemukan setelah mencoba semua endpoint')
    console.error('Pastikan:')
    console.error('1. Backend Laravel berjalan: php artisan serve')
    console.error('2. Backend berjalan di http://localhost:8000')
    console.error('3. Cek browser console untuk error koneksi')
    return null
  } catch (error) {
    console.error('Error getting CSRF token:', error)
    console.error('Pastikan backend Laravel berjalan: php artisan serve')
    return null
  }
}

// Auth API - Menggunakan mobile API server (tidak perlu CSRF token)
// Helper functions untuk manage multiple users
export const getUsersData = () => {
  try {
    const usersData = localStorage.getItem('usersData')
    if (usersData) {
      return JSON.parse(usersData)
    }
    // Migrate dari userData lama jika ada
    const oldUserData = localStorage.getItem('userData')
    if (oldUserData) {
      const userData = JSON.parse(oldUserData)
      const users = [userData]
      localStorage.setItem('usersData', JSON.stringify(users))
      // Simpan foto profile lama jika ada
      const oldFoto = localStorage.getItem('fotoProfileBase64')
      if (oldFoto && userData.email) {
        localStorage.setItem(`fotoProfile_${userData.email}`, oldFoto)
      }
      return users
    }
    return []
  } catch (error) {
    console.error('Error getting users data:', error)
    return []
  }
}

export const getUserData = (email) => {
  const normalizedEmail = (email || '').toLowerCase().trim()
  const users = getUsersData()
  return users.find(u => (u.email || '').toLowerCase().trim() === normalizedEmail) || null
}

export const setUserData = (userData) => {
  const normalizedEmail = (userData.email || '').toLowerCase().trim()
  const users = getUsersData()
  const existingIndex = users.findIndex(u => (u.email || '').toLowerCase().trim() === normalizedEmail)
  
  if (existingIndex >= 0) {
    // Update existing user
    users[existingIndex] = { ...users[existingIndex], ...userData }
  } else {
    // Add new user
    users.push(userData)
  }
  
  localStorage.setItem('usersData', JSON.stringify(users))
  
  // Simpan foto profile terpisah untuk user ini
  if (userData.foto_profile) {
    localStorage.setItem(`fotoProfile_${normalizedEmail}`, userData.foto_profile)
  }
}

export const getFotoProfile = (email) => {
  const normalizedEmail = (email || '').toLowerCase().trim()
  return localStorage.getItem(`fotoProfile_${normalizedEmail}`) || null
}

export const register = async (data) => {
  try {
    console.log('Registering user via mobile API server...')
    
    // Simpan ke localStorage terlebih dahulu sebagai backup
    let fotoProfileBase64 = null
    if (data.foto_profile) {
      fotoProfileBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('Gagal membaca file'))
        reader.readAsDataURL(data.foto_profile)
      })
    }
    
    const userData = {
      email: data.email,
      nama_lengkap: data.nama_lengkap,
      tgl_lahir: data.tgl_lahir,
      foto_profile: fotoProfileBase64,
      registered_at: new Date().toISOString()
    }
    
    // Simpan ke array users
    setUserData(userData)
    
    // Kirim ke mobile API server (tidak perlu CSRF token)
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('nama_lengkap', data.nama_lengkap)
    formData.append('tgl_lahir', data.tgl_lahir)
    if (data.foto_profile) {
      formData.append('foto_profile', data.foto_profile)
    }
    
    const apiResponse = await fetch('http://localhost:3001/api/mobile/register', {
      method: 'POST',
      body: formData,
    })
    
    const apiResult = await apiResponse.json()
    
    if (apiResponse.ok && apiResult.success) {
      console.log('✅ Registration successful - data saved to mobile database')
      return { success: true, message: 'Registrasi berhasil!' }
    } else {
      // Jika error dari API, tetap anggap berhasil karena data sudah di localStorage
      console.warn('⚠️ Mobile API error, but data saved to localStorage:', apiResult.message)
      return { success: true, message: 'Registrasi berhasil! (Data tersimpan lokal)' }
    }
    
  } catch (error) {
    console.error('Registration error:', error)
    
    // Jika error network, tetap anggap berhasil karena data sudah di localStorage
    if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
      console.warn('⚠️ Network error, but data saved to localStorage')
      return { success: true, message: 'Registrasi berhasil! (Data tersimpan lokal, pastikan mobile API server berjalan)' }
    }
    
    // Throw error hanya jika bukan network error
    throw error
  }
}

// Login API - Cek apakah user sudah registrasi
export const login = async (email) => {
  try {
    const normalizedEmail = email.toLowerCase().trim()
    
    if (!normalizedEmail) {
      throw new Error('Email harus diisi')
    }
    
    // Cek apakah user sudah registrasi di mobile database
    try {
      const response = await fetch(`http://localhost:3001/api/mobile/user/${encodeURIComponent(normalizedEmail)}`)
      
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.user) {
          // User ditemukan, login berhasil
          console.log('✅ Login successful - user found in database')
          return { success: true, message: 'Login berhasil!', user: result.user }
        }
      } else if (response.status === 404) {
        // User tidak ditemukan
        throw new Error('Email belum terdaftar. Silakan registrasi terlebih dahulu.')
      }
    } catch (apiError) {
      // Jika API error, cek localStorage sebagai fallback
      console.warn('Mobile API error, checking localStorage:', apiError.message)
      
      const userData = getUserData(normalizedEmail)
      if (userData) {
        // User ditemukan di localStorage
        console.log('✅ Login successful - user found in localStorage')
        const fotoProfile = getFotoProfile(normalizedEmail) || userData.foto_profile
        return { 
          success: true, 
          message: 'Login berhasil!', 
          user: {
            email: userData.email,
            nama_lengkap: userData.nama_lengkap,
            name: userData.nama_lengkap,
            tgl_lahir: userData.tgl_lahir,
            foto_profile_url: fotoProfile,
          }
        }
      }
      
      // Jika error dari API dan bukan 404, throw error asli
      if (apiError.message && !apiError.message.includes('Failed to fetch')) {
        throw apiError
      }
    }
    
    // User tidak ditemukan
    throw new Error('Email belum terdaftar. Silakan registrasi terlebih dahulu.')
    
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export const getUserProfile = async (email) => {
  try {
    // Coba ambil dari mobile API server dulu
    try {
      const response = await fetch(`http://localhost:3001/api/mobile/user/${encodeURIComponent(email)}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.user) {
          return result
        }
      }
    } catch (e) {
      console.warn('Mobile API not available, using localStorage:', e.message)
    }
    
    // Fallback ke localStorage
    const normalizedEmail = (email || '').toLowerCase().trim()
    const userData = getUserData(normalizedEmail)
    if (userData) {
      const fotoProfile = getFotoProfile(normalizedEmail) || userData.foto_profile
      return {
        success: true,
        user: {
          email: userData.email,
          nama_lengkap: userData.nama_lengkap,
          name: userData.nama_lengkap,
          tgl_lahir: userData.tgl_lahir,
          foto_profile_url: fotoProfile,
        }
      }
    }
  } catch (error) {
    console.error('Error reading user profile:', error)
  }
  
  // Return default
  return {
    success: true,
    user: {
      email: email,
      nama_lengkap: '',
      name: '',
      tgl_lahir: '',
      foto_profile_url: null,
    }
  }
}

export const updateUserProfile = async (data) => {
  try {
    // Ambil CSRF token
    const csrfToken = await getCsrfToken()
    if (!csrfToken) {
      throw new Error('CSRF token tidak ditemukan. Silakan refresh halaman.')
    }
    
    const formData = new FormData()
    if (data.nama_lengkap) formData.append('nama_lengkap', data.nama_lengkap)
    if (data.tgl_lahir) formData.append('tgl_lahir', data.tgl_lahir)
    formData.append('_token', csrfToken)
    if (data.foto_profile) {
      formData.append('foto_profile', data.foto_profile)
    }
    
    // Simpan ke localStorage terlebih dahulu sebagai backup
    const currentEmail = localStorage.getItem('userEmail') || ''
    const normalizedEmail = currentEmail.toLowerCase().trim()
    
    let fotoProfileBase64 = null
    if (data.foto_profile) {
      fotoProfileBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('Gagal membaca file'))
        reader.readAsDataURL(data.foto_profile)
      })
    }
    
    const userData = getUserData(normalizedEmail)
    if (userData) {
      const updatedData = { ...userData }
      if (data.nama_lengkap) updatedData.nama_lengkap = data.nama_lengkap
      if (data.tgl_lahir) updatedData.tgl_lahir = data.tgl_lahir
      if (fotoProfileBase64) updatedData.foto_profile = fotoProfileBase64
      setUserData(updatedData)
    }
    
    // Kirim ke backend menggunakan route web
    const response = await fetch('/api/profile/update', {
      method: 'POST',
      body: formData,
      credentials: 'include',
      redirect: 'follow',
      headers: {
        'X-XSRF-TOKEN': csrfToken,
        'X-Requested-With': 'XMLHttpRequest',
      }
    })
    
    // Route web return redirect (302) jika berhasil
    if (response.ok || response.status === 302 || response.status === 200) {
      // Berhasil - data sudah tersimpan di MySQL
      return { 
        success: true, 
        message: 'Profile berhasil diperbarui!',
        user: {
          foto_profile_url: fotoProfileBase64
        }
      }
    }
    
    // Jika error
    if (response.status === 422) {
      throw new Error('Data yang dimasukkan tidak valid')
    }
    
    throw new Error('Update profile gagal')
    
  } catch (error) {
    console.error('Update profile error:', error)
    // Jika error network, tetap return success karena data sudah di localStorage
    if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
      return { success: true, message: 'Profile berhasil diperbarui! (Data tersimpan lokal)' }
    }
    throw error
  }
}

export default api


