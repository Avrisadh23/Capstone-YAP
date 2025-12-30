import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import './Events.css'

const MyCommunities = () => {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
      return
    }

    // Dummy data - in production, this would fetch from API
    setCommunities([])
    setLoading(false)
  }, [isLoggedIn, navigate])

  return (
    <Layout showBack backUrl="/communities">
      <div className="events-page">
        <div className="section-header">
          <h2 className="section-title">Komunitas Saya</h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="btn-secondary" onClick={() => navigate('/communities')}>
              ← Kembali ke Daftar Komunitas
            </button>
            <button className="btn-primary" onClick={() => navigate('/communities/create')}>
              + Buat Komunitas
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        ) : communities.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h3>Belum Ada Komunitas</h3>
            <p>Anda belum bergabung dengan komunitas manapun. Mulai jelajahi komunitas yang tersedia!</p>
            <button className="btn-primary" onClick={() => navigate('/communities')}>
              Jelajahi Komunitas
            </button>
          </div>
        ) : (
          <div className="cards-grid">
            {communities.map(community => (
              <div 
                key={community.id} 
                className="card"
                onClick={() => navigate(`/communities/${community.id}`)}
              >
                <img src={community.image_url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80'} alt={community.name} className="card-image" />
                <div className="card-content">
                  <div className="card-title">{community.name}</div>
                  <div className="card-description">{community.description}</div>
                  <div className="card-meta">
                    <span>👥 {community.members_count || 0} anggota</span>
                    <span className="card-badge">{community.category}</span>
                  </div>
                  <div className="card-location">📍 {community.location}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default MyCommunities
