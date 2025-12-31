import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { createEvent, getUserData } from '../services/api'
import './EventCreate.css'

const EventCreate = () => {
  const { isLoggedIn, userEmail } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    max_participants: '',
    price: '',
    contact: '',
    requirements: '',
    image: null
  })
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
    }
  }, [isLoggedIn, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Simpan data ke localStorage terlebih dahulu (backup)
      const email = (userEmail || localStorage.getItem('userEmail') || '').trim()
      if (!email) {
        alert('Email tidak ditemukan. Silakan login terlebih dahulu.')
        return
      }
      
      const eventId = `local-event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const eventData = {
        id: eventId,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        category: formData.category,
        max_participants: formData.max_participants || null,
        price: formData.price || null,
        contact: formData.contact || '',
        requirements: formData.requirements || '',
        image: imagePreview, // Simpan preview sebagai base64
        participants_count: 1, // Creator adalah peserta pertama
        creator_email: email.toLowerCase().trim(), // Simpan email creator untuk identifikasi pengurus
        created_at: new Date().toISOString()
      }
      
      // Simpan ke localStorage
      const existingEvents = JSON.parse(localStorage.getItem('localEvents') || '[]')
      existingEvents.push(eventData)
      localStorage.setItem('localEvents', JSON.stringify(existingEvents))
      
      // Otomatis join event yang dibuat (creator otomatis menjadi pengurus)
      const existingJoins = JSON.parse(localStorage.getItem('eventJoins') || '[]')
      const normalizedEmail = email.toLowerCase().trim()
      const joinRecord = {
        event_id: eventId,
        user_email: normalizedEmail,
        user_name: (() => {
          const userData = getUserData(email) || {}
          return userData.nama_lengkap || email.split('@')[0]
        })(),
        phone: '',
        notes: 'Creator event',
        role: 'pengurus', // Creator otomatis menjadi pengurus
        joined_at: new Date().toISOString()
      }
      
      // Cek apakah sudah join (untuk menghindari duplikasi)
      const alreadyJoined = existingJoins.some(
        j => {
          const joinEmail = (j.user_email || '').toLowerCase().trim()
          return j.event_id === eventId && joinEmail === normalizedEmail
        }
      )
      
      if (!alreadyJoined) {
        existingJoins.push(joinRecord)
        localStorage.setItem('eventJoins', JSON.stringify(existingJoins))
        // Trigger event untuk update my events
        window.dispatchEvent(new Event('eventJoined'))
        window.dispatchEvent(new Event('localStorageUpdated'))
      }
      
      // Create FormData untuk mengirim file
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('date', formData.date)
      submitData.append('time', formData.time)
      submitData.append('location', formData.location)
      submitData.append('category', formData.category)
      submitData.append('max_participants', formData.max_participants || '')
      submitData.append('price', formData.price || '')
      submitData.append('contact', formData.contact || '')
      submitData.append('requirements', formData.requirements || '')
      if (formData.image) {
        submitData.append('image', formData.image)
      }
      
      try {
        await createEvent(submitData)
      alert('Event berhasil dibuat!')
        // Trigger event untuk update daftar event
        window.dispatchEvent(new Event('eventJoined'))
        window.dispatchEvent(new Event('localStorageUpdated'))
        navigate(`/events/${eventId}`)
      } catch (backendError) {
        // Jika backend error (termasuk CSRF), tetap anggap berhasil karena data sudah di localStorage
        console.warn('Backend error, but data saved to localStorage:', backendError)
        if (backendError.message && backendError.message.includes('CSRF')) {
          alert('Event berhasil dibuat! (Data tersimpan lokal. Pastikan backend berjalan untuk menyimpan ke database)')
        } else {
          alert('Event berhasil dibuat! (Data tersimpan lokal)')
        }
        // Trigger event untuk update daftar event
        window.dispatchEvent(new Event('eventJoined'))
        window.dispatchEvent(new Event('localStorageUpdated'))
        navigate(`/events/${eventId}`)
      }
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Gagal membuat event: ' + (error.message || 'Unknown error'))
    }
  }

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0]
      if (file) {
        setFormData({
          ...formData,
          image: file
        })
        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
      }
    } else {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    }
  }

  return (
    <Layout showBack backUrl="/events">
      <div className="event-create-page">
        <div className="form-container">
          <h1 className="form-title">Buat Event Baru</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Judul Event *</label>
              <input 
                type="text" 
                name="title"
                className="form-input"
                placeholder="Masukkan judul event"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Deskripsi *</label>
              <textarea 
                name="description"
                className="form-input"
                rows="4"
                placeholder="Masukkan deskripsi event"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tanggal *</label>
                <input 
                  type="date" 
                  name="date"
                  className="form-input"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Waktu *</label>
                <input 
                  type="time" 
                  name="time"
                  className="form-input"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Lokasi *</label>
              <input 
                type="text" 
                name="location"
                className="form-input"
                placeholder="Masukkan lokasi"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Kategori *</label>
              <select 
                name="category"
                className="form-input"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Pilih kategori</option>
                <option value="Hobi">Hobi</option>
                <option value="Olahraga">Olahraga</option>
                <option value="Workshop">Workshop</option>
                <option value="Gaming">Gaming</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Max Peserta</label>
                <input 
                  type="number" 
                  name="max_participants"
                  className="form-input"
                  placeholder="Opsional"
                  value={formData.max_participants}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Harga (Rp)</label>
                <input 
                  type="number" 
                  name="price"
                  className="form-input"
                  placeholder="0"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Kontak</label>
              <input 
                type="text" 
                name="contact"
                className="form-input"
                placeholder="Nomor telepon atau email"
                value={formData.contact}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gambar Event</label>
              <input 
                type="file" 
                name="image"
                className="form-input"
                accept="image/*"
                onChange={handleChange}
                style={{ padding: '8px' }}
              />
              {imagePreview && (
                <div style={{ marginTop: '12px' }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ 
                      width: '100%', 
                      maxWidth: '400px', 
                      height: '200px', 
                      objectFit: 'cover', 
                      borderRadius: '8px', 
                      border: '2px solid #ddd' 
                    }}
                  />
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Persyaratan</label>
              <textarea 
                name="requirements"
                className="form-input"
                rows="3"
                placeholder="Masukkan persyaratan event"
                value={formData.requirements}
                onChange={handleChange}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => navigate('/events')}>
                Batal
              </button>
              <button type="submit" className="btn-primary">
                Buat Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default EventCreate

