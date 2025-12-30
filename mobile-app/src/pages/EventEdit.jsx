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
    image_url: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
      return
    }

    // Dummy data - replace with API call
    setFormData({
      title: 'Tournament Futsal Nasional 2025',
      description: 'Kompetisi futsal tingkat nasional',
      date: '2025-01-20',
      time: '09:00',
      location: 'Jakarta',
      category: 'Olahraga',
      max_participants: '200',
      price: '50000',
      contact: '081234567890',
      requirements: 'Peserta harus membawa sepatu futsal',
      image_url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80'
    })
    setLoading(false)
  }, [id, isLoggedIn, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // await updateEvent(id, formData)
      alert('Event berhasil diperbarui!')
      navigate(`/events/${id}`)
    } catch (error) {
      alert('Gagal memperbarui event')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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
              <label className="form-label">URL Gambar</label>
              <input 
                type="url" 
                name="image_url"
                className="form-input"
                value={formData.image_url}
                onChange={handleChange}
              />
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

