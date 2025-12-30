import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { createEvent } from '../services/api'
import './EventCreate.css'

const EventCreate = () => {
  const { isLoggedIn } = useAuth()
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
    image_url: ''
  })

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
    }
  }, [isLoggedIn, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // await createEvent(formData)
      alert('Event berhasil dibuat!')
      navigate('/events')
    } catch (error) {
      alert('Gagal membuat event')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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
              <label className="form-label">URL Gambar</label>
              <input 
                type="url" 
                name="image_url"
                className="form-input"
                placeholder="https://..."
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

