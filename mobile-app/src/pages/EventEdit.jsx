import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { getEvent, updateEvent } from '../services/api'
import './EventCreate.css'

const EventEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
      return
    }

    const loadEvent = async () => {
      try {
        // Cek apakah ini event dari localStorage - cari berdasarkan ID
        const localEvents = JSON.parse(localStorage.getItem('localEvents') || '[]')
        
        const evt = localEvents.find(e => {
          // Match exact ID
          if (e.id === id) return true
          // Match jika ID adalah string number dan event punya id number
          if (String(e.id) === String(id)) return true
          return false
        })
        
        if (evt) {
          // Set form data dari event yang ditemukan
          setFormData({
            title: evt.title || '',
            description: evt.description || '',
            date: evt.date || '',
            time: evt.time || '',
            location: evt.location || '',
            category: evt.category || '',
            max_participants: evt.max_participants || '',
            price: evt.price || '',
            contact: evt.contact || '',
            requirements: evt.requirements || '',
            image: null // File akan di-set saat user upload
          })
          // Set preview dari gambar yang sudah ada (jika ada)
          if (evt.image) {
            setImagePreview(evt.image)
          }
          setLoading(false)
          return
        }

        // Jika tidak ada di localStorage, coba ambil dari API
        try {
          const response = await getEvent(id)
          if (response && response.event) {
            const evtData = response.event
            setFormData({
              title: evtData.title || '',
              description: evtData.description || '',
              date: evtData.date || '',
              time: evtData.time || '',
              location: evtData.location || '',
              category: evtData.category || '',
              max_participants: evtData.max_participants || '',
              price: evtData.price || '',
              contact: evtData.contact || '',
              requirements: evtData.requirements || '',
              image: null
            })
            // Set preview dari gambar yang sudah ada (jika ada)
            if (evtData.image_url) {
              setImagePreview(evtData.image_url)
            }
          } else if (response) {
            setFormData({
              title: response.title || '',
              description: response.description || '',
              date: response.date || '',
              time: response.time || '',
              location: response.location || '',
              category: response.category || '',
              max_participants: response.max_participants || '',
              price: response.price || '',
              contact: response.contact || '',
              requirements: response.requirements || '',
              image: null
            })
            // Set preview dari gambar yang sudah ada (jika ada)
            if (response.image_url) {
              setImagePreview(response.image_url)
            }
          } else {
            alert('Event tidak ditemukan')
            navigate('/events')
          }
        } catch (error) {
          console.warn('Error fetching event from API:', error)
          alert('Event tidak ditemukan')
          navigate('/events')
        }
      } catch (error) {
        console.error('Error loading event:', error)
        alert('Terjadi kesalahan saat memuat event')
        navigate('/events')
      } finally {
        setLoading(false)
      }
    }

    loadEvent()
  }, [id, isLoggedIn, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Update di localStorage terlebih dahulu
      const localEvents = JSON.parse(localStorage.getItem('localEvents') || '[]')
      const evtIndex = localEvents.findIndex(e => {
        if (e.id === id) return true
        if (String(e.id) === String(id)) return true
        return false
      })
      
      if (evtIndex !== -1) {
        // Update data event di localStorage
        localEvents[evtIndex] = {
          ...localEvents[evtIndex],
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
          image: imagePreview || localEvents[evtIndex].image // Gunakan preview baru atau tetap gunakan yang lama
        }
        localStorage.setItem('localEvents', JSON.stringify(localEvents))
        
        // Trigger event untuk update real-time
        window.dispatchEvent(new Event('localStorageUpdated'))
      }
      
      // Coba update ke backend juga
      try {
        const submitData = {
          ...formData,
          image_url: imagePreview // Kirim preview sebagai image_url untuk backend
        }
        await updateEvent(id, submitData)
      } catch (backendError) {
        console.warn('Backend error, but changes saved to localStorage:', backendError)
      }
      
      alert('Event berhasil diperbarui!')
      navigate(`/events/${id}`)
    } catch (error) {
      console.error('Error updating event:', error)
      alert('Gagal memperbarui event')
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

  if (loading) {
    return (
      <Layout showBack backUrl={`/events/${id}`}>
        <div className="event-create-page">
          <div className="loading">Memuat...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout showBack backUrl={`/events/${id}`}>
      <div className="event-create-page">
        <div className="form-container">
          <h1 className="form-title">Edit Event</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Judul Event *</label>
              <input 
                type="text" 
                name="title"
                className="form-input"
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
                value={formData.requirements}
                onChange={handleChange}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => navigate(`/events/${id}`)}>
                Batal
              </button>
              <button type="submit" className="btn-primary">
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default EventEdit

