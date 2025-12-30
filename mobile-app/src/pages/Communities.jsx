import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { getCommunities } from '../services/api'
import './Events.css'

const Communities = () => {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [aktivitas, setAktivitas] = useState('')
  const [kota, setKota] = useState('')
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
      return
    }

    // Dummy data - replace with API call
    setCommunities([
      {
        id: 1,
        name: 'Komunitas Wibu Jakarta',
        description: 'Komunitas untuk para pecinta anime dan manga di Jakarta',
        members_count: 1250,
        image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
        category: 'Hobi',
        location: 'Jakarta'
      },
      {
        id: 2,
        name: 'Bengkel Motor Racing',
        description: 'Komunitas modifikasi motor dan racing untuk para bikers',
        members_count: 890,
        image_url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&q=80',
        category: 'Olahraga',
        location: 'Bandung'
      },
      {
        id: 3,
        name: 'Futsal Community Surabaya',
        description: 'Komunitas futsal untuk semua level, dari pemula hingga profesional',
        members_count: 2100,
        image_url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80',
        category: 'Olahraga',
        location: 'Surabaya'
      },
    ])
    setLoading(false)
  }, [isLoggedIn, navigate])

  const applyFilters = () => {
    console.log('Applying filters:', { aktivitas, kota })
  }

  const filteredCommunities = communities.filter(c => {
    if (aktivitas && c.category !== aktivitas) return false
    if (kota && c.location !== kota) return false
    return true
  })

  if (loading) {
    return (
      <Layout>
        <div className="events-page">
          <div className="loading">Memuat...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="events-page">
        <div className="filters">
          <div className="filter-select">
            <span className="filter-icon">📍</span>
            <div className="filter-content">
              <div className="filter-label">Aktivitas</div>
              <select 
                className="filter-select-input"
                value={aktivitas}
                onChange={(e) => setAktivitas(e.target.value)}
              >
                <option value="">Pilih aktivitas</option>
                <option value="Hobi">Hobi</option>
                <option value="Olahraga">Olahraga</option>
                <option value="Workshop">Workshop</option>
                <option value="Gaming">Gaming</option>
              </select>
              <div className="filter-value">{aktivitas || 'Pilih aktivitas'}</div>
            </div>
            <span>⌄</span>
          </div>
          <div className="filter-select">
            <span className="filter-icon">📍</span>
            <div className="filter-content">
              <div className="filter-label">Lokasi</div>
              <select 
                className="filter-select-input"
                value={kota}
                onChange={(e) => setKota(e.target.value)}
              >
                <option value="">Pilih kota</option>
                <option value="Jakarta">Jakarta</option>
                <option value="Surabaya">Surabaya</option>
                <option value="Bandung">Bandung</option>
                <option value="Medan">Medan</option>
                <option value="Yogyakarta">Yogyakarta</option>
              </select>
              <div className="filter-value">{kota || 'Pilih kota'}</div>
            </div>
            <span>⌄</span>
          </div>
          <div className="filter-go" onClick={applyFilters}>
            Temukan →
          </div>
        </div>

        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Daftar Komunitas</h2>
            <button className="btn-create" onClick={() => navigate('/communities/create')}>
              + Buat Komunitas
            </button>
          </div>
          <div className="cards-grid">
            {filteredCommunities.length === 0 ? (
              <div className="empty-state">
                Tidak ada komunitas yang ditemukan.
              </div>
            ) : (
              filteredCommunities.map(community => (
                <div 
                  key={community.id} 
                  className="card"
                  onClick={() => navigate(`/communities/${community.id}`)}
                >
                  <img 
                    src={community.image_url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80'} 
                    alt={community.name} 
                    className="card-image" 
                  />
                  <div className="card-content">
                    <div className="card-title">{community.name}</div>
                    <div className="card-description">{community.description}</div>
                    <div className="card-meta">
                      <span>👥 {community.members_count} anggota</span>
                      <span className="card-badge">{community.category}</span>
                    </div>
                    <div className="card-location">
                      📍 {community.location}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default Communities

