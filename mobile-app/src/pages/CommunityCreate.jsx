import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { createCommunity } from '../services/api'
import './EventCreate.css'

const CommunityCreate = () => {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    category: '',
    rules: '',
    contact: '',
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
      // await createCommunity(formData)
      alert('Komunitas berhasil dibuat!')
      navigate('/communities')
    } catch (error) {
      alert('Gagal membuat komunitas')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Layout showBack backUrl="/communities">
      <div className="event-create-page">
        <div className="form-container">
          <h1 className="form-title">Buat Komunitas Baru</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nama Komunitas *</label>
              <input 
                type="text" 
                name="name"
                className="form-input"
                placeholder="Masukkan nama komunitas"
                value={formData.name}
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
                placeholder="Masukkan deskripsi komunitas"
                value={formData.description}
                onChange={handleChange}
                required
              />
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
              <label className="form-label">Aturan Komunitas</label>
              <textarea 
                name="rules"
                className="form-input"
                rows="4"
                placeholder="Masukkan aturan komunitas"
                value={formData.rules}
                onChange={handleChange}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => navigate('/communities')}>
                Batal
              </button>
              <button type="submit" className="btn-primary">
                Buat Komunitas
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default CommunityCreate

