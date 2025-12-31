import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { createCommunity, getUserData } from '../services/api'
import './EventCreate.css'

const CommunityCreate = () => {
  const { isLoggedIn, userEmail } = useAuth()
  const navigate = useNavigate()
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
      
      const communityId = `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const communityData = {
        id: communityId,
        name: formData.name,
        description: formData.description,
        location: formData.location,
        category: formData.category,
        contact: formData.contact,
        rules: formData.rules,
        image: imagePreview, // Simpan preview sebagai base64
        members_count: 1, // Creator adalah anggota pertama
        creator_email: email.toLowerCase().trim(), // Simpan email creator untuk identifikasi pengurus (normalized)
        created_at: new Date().toISOString()
      }
      
      // Simpan ke localStorage
      const existingCommunities = JSON.parse(localStorage.getItem('localCommunities') || '[]')
      existingCommunities.push(communityData)
      localStorage.setItem('localCommunities', JSON.stringify(existingCommunities))
      
      // Otomatis join komunitas yang dibuat (creator otomatis menjadi pengurus)
      const existingJoins = JSON.parse(localStorage.getItem('communityJoins') || '[]')
      const normalizedEmail = email.toLowerCase().trim()
      const joinRecord = {
        community_id: communityId,
        user_email: normalizedEmail, // Normalized email
        user_name: (() => {
          const userData = getUserData(email) || {}
          return userData.nama_lengkap || email.split('@')[0]
        })(),
        phone: '',
        notes: 'Creator komunitas',
        role: 'pengurus', // Creator otomatis menjadi pengurus
        joined_at: new Date().toISOString()
      }
      
      // Cek apakah sudah join (untuk menghindari duplikasi)
      const alreadyJoined = existingJoins.some(
        j => {
          const joinEmail = (j.user_email || '').toLowerCase().trim()
          return j.community_id === communityId && joinEmail === normalizedEmail
        }
      )
      
      if (!alreadyJoined) {
        existingJoins.push(joinRecord)
        localStorage.setItem('communityJoins', JSON.stringify(existingJoins))
        // Trigger event untuk update my communities
        window.dispatchEvent(new Event('communityJoined'))
        window.dispatchEvent(new Event('localStorageUpdated'))
      }
      
      // Create FormData untuk mengirim file
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('description', formData.description)
      submitData.append('location', formData.location)
      submitData.append('category', formData.category)
      submitData.append('contact', formData.contact)
      submitData.append('rules', formData.rules)
      if (formData.image) {
        submitData.append('image', formData.image)
      }
      
      try {
        await createCommunity(submitData)
      alert('Komunitas berhasil dibuat!')
        // Trigger event untuk update daftar komunitas
        window.dispatchEvent(new Event('localStorageUpdated'))
        // Redirect ke detail komunitas yang baru dibuat
        navigate(`/communities/${communityId}`)
      } catch (backendError) {
        // Jika backend error (termasuk CSRF), tetap anggap berhasil karena data sudah di localStorage
        console.warn('Backend error, but data saved to localStorage:', backendError)
        if (backendError.message && backendError.message.includes('CSRF')) {
          alert('Komunitas berhasil dibuat! (Data tersimpan lokal. Pastikan backend berjalan untuk menyimpan ke database)')
        } else {
          alert('Komunitas berhasil dibuat! (Data tersimpan lokal)')
        }
        // Trigger event untuk update daftar komunitas
        window.dispatchEvent(new Event('localStorageUpdated'))
        // Redirect ke detail komunitas yang baru dibuat
        navigate(`/communities/${communityId}`)
      }
    } catch (error) {
      console.error('Error creating community:', error)
      alert('Gagal membuat komunitas: ' + (error.message || 'Unknown error'))
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

