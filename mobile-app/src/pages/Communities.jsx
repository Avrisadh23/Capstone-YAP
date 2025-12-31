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

    const loadCommunities = async () => {
      try {
        // Ambil komunitas dari localStorage (yang sudah dibuat)
        const localCommunities = JSON.parse(localStorage.getItem('localCommunities') || '[]')
        
        // Convert local communities ke format yang sama
        const localFormatted = localCommunities.map((comm) => {
          // Hitung members count real-time dari join records
          const existingJoins = JSON.parse(localStorage.getItem('communityJoins') || '[]')
          const creatorEmail = comm.creator_email ? comm.creator_email.toLowerCase().trim() : ''
          const membersList = []
          
          // Tambahkan creator sebagai Pengurus (hanya sekali)
          if (creatorEmail) {
            membersList.push({
              user_email: comm.creator_email,
              role: 'Pengurus'
            })
          }
          
          // Tambahkan anggota yang sudah join (tidak termasuk creator untuk menghindari duplikasi)
          const joinedMembers = existingJoins.filter(j => {
            const joinCommId = j.community_id
            const joinEmail = (j.user_email || '').toLowerCase().trim()
            // Filter: harus match community_id DAN bukan creator
            return (joinCommId === comm.id || String(joinCommId) === String(comm.id)) && joinEmail !== creatorEmail
          })
          
          joinedMembers.forEach(j => {
            membersList.push({
              user_email: j.user_email,
              role: j.role || 'Anggota'
            })
          })
          
          // Real-time members count = creator (1) + anggota yang join
          const realMembersCount = membersList.length
          
          return {
            id: comm.id || `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: comm.name,
            description: comm.description,
            members_count: realMembersCount,
            image_url: comm.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
            category: comm.category,
            location: comm.location,
            contact: comm.contact,
            rules: comm.rules,
            isLocal: true
          }
        })
        
        // Coba ambil dari API
        let apiCommunities = []
        try {
          const response = await getCommunities()
          if (response && Array.isArray(response)) {
            apiCommunities = response
          } else if (response && response.data && Array.isArray(response.data)) {
            apiCommunities = response.data
          }
        } catch (error) {
          console.warn('Error fetching communities from API:', error)
        }
        
        // Dummy data tetap ada
        const dummyCommunities = [
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
        ]
        
        // Gabungkan: local communities (yang baru dibuat) di atas, lalu dummy, lalu API
        const allCommunities = [...localFormatted, ...dummyCommunities, ...apiCommunities]
        setCommunities(allCommunities)
      } catch (error) {
        console.error('Error loading communities:', error)
      } finally {
    setLoading(false)
      }
    }

    loadCommunities()

    // Listen untuk perubahan di localStorage (saat komunitas baru dibuat)
    const handleStorageChange = () => {
      loadCommunities()
    }

    window.addEventListener('localStorageUpdated', handleStorageChange)
    
    // Listen untuk perubahan join community
    const handleJoinUpdate = () => {
      loadCommunities()
    }
    
    window.addEventListener('communityJoined', handleJoinUpdate)

    return () => {
      window.removeEventListener('localStorageUpdated', handleStorageChange)
      window.removeEventListener('communityJoined', handleJoinUpdate)
    }
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

