import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { getCommunity, updateCommunity } from '../services/api'
import './EventCreate.css'

const CommunityEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    category: '',
    rules: '',
    contact: '',
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
      name: 'Komunitas Wibu Jakarta',
      description: 'Komunitas untuk para pecinta anime dan manga di Jakarta',
      location: 'Jakarta',
      category: 'Hobi',
      rules: '1. Hormati semua anggota\n2. Tidak boleh spam',
      contact: '081234567890',
      image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80'
    })
    setLoading(false)
  }, [id, isLoggedIn, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // await updateCommunity(id, formData)
      alert('Komunitas berhasil diperbarui!')
      navigate(`/communities/${id}`)
    } catch (error) {
      alert('Gagal memperbarui komunitas')
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
      <Layout showBack backUrl={`/communities/${id}`}>
        <div className="event-create-page">
          <div className="loading">Memuat...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout showBack backUrl={`/communities/${id}`}>
      <div className="event-create-page">
        <div className="form-container">
          <h1 className="form-title">Edit Komunitas</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nama Komunitas *</label>
              <input 
                type="text" 
                name="name"
                className="form-input"
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
              <label className="form-label">Aturan Komunitas</label>
              <textarea 
                name="rules"
                className="form-input"
                rows="4"
                value={formData.rules}
                onChange={handleChange}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => navigate(`/communities/${id}`)}>
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

export default CommunityEdit

