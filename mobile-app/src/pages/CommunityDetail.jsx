import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { getCommunity, joinCommunity } from '../services/api'
import './EventDetail.css'

const CommunityDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn, userEmail } = useAuth()
  const [community, setCommunity] = useState(null)
  const [isJoined, setIsJoined] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joinData, setJoinData] = useState({
    user_email: userEmail || '',
    user_name: '',
    phone: '',
    notes: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
      return
    }

    // Dummy data - replace with API call
    setCommunity({
      id: 1,
      name: 'Komunitas Wibu Jakarta',
      description: 'Komunitas untuk para pecinta anime dan manga di Jakarta. Kami mengadakan meetup rutin setiap bulan dan berbagai event menarik.',
      location: 'Jakarta',
      image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
      category: 'Hobi',
      members_count: 1250,
      contact: '081234567890',
      rules: '1. Hormati semua anggota\n2. Tidak boleh spam\n3. Tetap sopan dalam berkomunikasi'
    })
    setLoading(false)
  }, [id, isLoggedIn, navigate])

  const handleJoin = async () => {
    if (!joinData.user_email) {
      alert('Email harus diisi')
      return
    }
    
    try {
      // await joinCommunity(id, joinData)
      alert('Berhasil bergabung dengan komunitas!')
      setIsJoined(true)
      setShowJoinModal(false)
    } catch (error) {
      alert('Gagal bergabung dengan komunitas')
    }
  }

  if (loading || !community) {
    return (
      <Layout showBack backUrl="/communities">
        <div className="event-detail-page">
          <div className="loading">Memuat...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout showBack backUrl="/communities">
      <div className="event-detail-page">
        <div className="detail-container">
          <div className="detail-header">
            <h1 className="detail-title">{community.name}</h1>
            <div className="detail-meta">
              <span>📍 {community.location}</span>
              <span>🏷️ {community.category}</span>
              <span>👥 {community.members_count} anggota</span>
            </div>
          </div>

          {community.image_url && (
            <img src={community.image_url} alt={community.name} className="detail-image" />
          )}

          <div className="detail-content">
            <div className="detail-main">
              <div className="detail-section">
                <h3>Deskripsi</h3>
                <p>{community.description}</p>
              </div>
              {community.rules && (
                <div className="detail-section">
                  <h3>Aturan Komunitas</h3>
                  <p style={{ whiteSpace: 'pre-line' }}>{community.rules}</p>
                </div>
              )}
            </div>
            <div className="detail-sidebar">
              <div className="info-box">
                <div className="info-box-item">
                  <span>Lokasi</span>
                  <strong>{community.location}</strong>
                </div>
                <div className="info-box-item">
                  <span>Kategori</span>
                  <strong>{community.category}</strong>
                </div>
                <div className="info-box-item">
                  <span>Anggota</span>
                  <strong>{community.members_count}</strong>
                </div>
                {community.contact && (
                  <div className="info-box-item">
                    <span>Kontak</span>
                    <strong>{community.contact}</strong>
                  </div>
                )}
              </div>
              {isJoined ? (
                <button className="btn-secondary" disabled>Sudah Bergabung</button>
              ) : (
                <button className="btn-primary" onClick={() => setShowJoinModal(true)}>
                  Join Komunitas
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowJoinModal(false)}>×</button>
            <h2 style={{ marginBottom: '24px' }}>Join Komunitas</h2>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-input"
                value={joinData.user_email}
                onChange={(e) => setJoinData({...joinData, user_email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nama</label>
              <input 
                type="text" 
                className="form-input"
                value={joinData.user_name}
                onChange={(e) => setJoinData({...joinData, user_name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nomor Telepon</label>
              <input 
                type="tel" 
                className="form-input"
                value={joinData.phone}
                onChange={(e) => setJoinData({...joinData, phone: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Catatan (Opsional)</label>
              <textarea 
                className="form-input"
                rows="3"
                value={joinData.notes}
                onChange={(e) => setJoinData({...joinData, notes: e.target.value})}
              />
            </div>
            <button className="btn-primary" onClick={handleJoin}>
              Konfirmasi Join
            </button>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default CommunityDetail

