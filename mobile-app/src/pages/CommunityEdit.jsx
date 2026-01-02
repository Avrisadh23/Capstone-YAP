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
    image: null
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
      return
    }

    const loadCommunity = async () => {
      try {
        // Cek apakah ini komunitas dari localStorage - cari berdasarkan ID
        const localCommunities = JSON.parse(localStorage.getItem('localCommunities') || '[]')
        
        const comm = localCommunities.find(c => {
          // Match exact ID
          if (c.id === id) return true
          // Match jika ID adalah string number dan komunitas punya id number
          if (String(c.id) === String(id)) return true
          return false
        })
        
        if (comm) {
          // Set form data dari komunitas yang ditemukan
          setFormData({
            name: comm.name || '',
            description: comm.description || '',
            location: comm.location || '',
            category: comm.category || '',
            rules: comm.rules || '',
            contact: comm.contact || '',
            image: null // File akan di-set saat user upload
          })
          // Set preview dari gambar yang sudah ada (jika ada)
          if (comm.image) {
            setImagePreview(comm.image)
          }
          setLoading(false)
          return
        }

        // Jika tidak ada di localStorage, coba ambil dari API
        try {
          const response = await getCommunity(id)
          if (response && response.community) {
            const commData = response.community
            setFormData({
              name: commData.name || '',
              description: commData.description || '',
              location: commData.location || '',
              category: commData.category || '',
              rules: commData.rules || '',
              contact: commData.contact || '',
              image: null
            })
            // Set preview dari gambar yang sudah ada (jika ada)
            if (commData.image_url) {
              setImagePreview(commData.image_url)
            }
          } else if (response) {
            setFormData({
              name: response.name || '',
              description: response.description || '',
              location: response.location || '',
              category: response.category || '',
              rules: response.rules || '',
              contact: response.contact || '',
              image: null
            })
            // Set preview dari gambar yang sudah ada (jika ada)
            if (response.image_url) {
              setImagePreview(response.image_url)
            }
          } else {
            alert('Komunitas tidak ditemukan')
            navigate('/communities')
          }
        } catch (error) {
          console.warn('Error fetching community from API:', error)
          alert('Komunitas tidak ditemukan')
          navigate('/communities')
        }
      } catch (error) {
        console.error('Error loading community:', error)
        alert('Terjadi kesalahan saat memuat komunitas')
        navigate('/communities')
      } finally {
        setLoading(false)
      }
    }

    loadCommunity()
  }, [id, isLoggedIn, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Update di localStorage terlebih dahulu
      const localCommunities = JSON.parse(localStorage.getItem('localCommunities') || '[]')
      const commIndex = localCommunities.findIndex(c => {
        if (c.id === id) return true
        if (String(c.id) === String(id)) return true
        return false
      })
      
      if (commIndex !== -1) {
        // Update data komunitas di localStorage
        localCommunities[commIndex] = {
          ...localCommunities[commIndex],
          name: formData.name,
          description: formData.description,
          location: formData.location,
          category: formData.category,
          rules: formData.rules,
          contact: formData.contact,
          image: imagePreview || localCommunities[commIndex].image // Gunakan preview baru atau tetap gunakan yang lama
        }
        localStorage.setItem('localCommunities', JSON.stringify(localCommunities))
        
        // Trigger event untuk update real-time
        window.dispatchEvent(new Event('localStorageUpdated'))
      }
      
      // Coba update ke backend juga
      try {
        const submitData = {
          ...formData,
          image_url: imagePreview // Kirim preview sebagai image_url untuk backend
        }
        await updateCommunity(id, submitData)
      } catch (backendError) {
        console.warn('Backend error, but changes saved to localStorage:', backendError)
      }
      
      alert('Komunitas berhasil diperbarui!')
      navigate(`/communities/${id}`)
    } catch (error) {
      console.error('Error updating community:', error)
      alert('Gagal memperbarui komunitas')
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
              <label className="form-label">Gambar Komunitas</label>
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

