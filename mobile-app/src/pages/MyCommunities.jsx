import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { getCommunities } from '../services/api'
import './Events.css'

const MyCommunities = () => {
  const { isLoggedIn, userEmail } = useAuth()
  const navigate = useNavigate()
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
      return
    }

    const loadMyCommunities = async () => {
      try {
        const email = userEmail || localStorage.getItem('userEmail') || ''
        
        // Ambil komunitas yang user sudah bergabung (dari localStorage)
        const localCommunities = JSON.parse(localStorage.getItem('localCommunities') || '[]')
        const existingJoins = JSON.parse(localStorage.getItem('communityJoins') || '[]')
        
        // Ambil ID komunitas yang user sudah join
        const joinedCommunityIds = existingJoins
          .filter(j => {
            const joinEmail = j.user_email ? j.user_email.toLowerCase() : ''
            return joinEmail === email.toLowerCase()
          })
          .map(j => j.community_id)
        
        // Ambil komunitas yang dibuat user (creator otomatis join)
        const createdCommunityIds = localCommunities
          .filter(comm => {
            if (comm.creator_email) {
              return comm.creator_email.toLowerCase() === email.toLowerCase()
            }
            return false
          })
          .map(comm => comm.id)
        
        // Gabungkan ID komunitas yang di-join dan yang dibuat
        const allJoinedIds = [...new Set([...joinedCommunityIds, ...createdCommunityIds])]
        
        // Ambil detail komunitas yang sudah bergabung
        const myCommunities = localCommunities
          .filter(comm => allJoinedIds.includes(comm.id))
          .map((comm) => {
            // Hitung members count real-time dari join records
            const creatorEmail = comm.creator_email ? comm.creator_email.toLowerCase().trim() : ''
            const membersList = []
            
            // Tambahkan creator sebagai Pengurus (hanya sekali)
            if (creatorEmail) {
              membersList.push({
                user_email: comm.creator_email,
                role: 'Pengurus'
              })
            }
            
            // Tambahkan anggota yang sudah join (tidak termasuk creator)
            const joinedMembers = existingJoins.filter(j => {
              const joinCommId = j.community_id
              const joinEmail = (j.user_email || '').toLowerCase().trim()
              return (joinCommId === comm.id || String(joinCommId) === String(comm.id)) && joinEmail !== creatorEmail
            })
            
            joinedMembers.forEach(j => {
              membersList.push({
                user_email: j.user_email,
                role: j.role || 'Anggota'
              })
            })
            
            const realMembersCount = membersList.length
            
            // Cek apakah user adalah creator (pengurus)
            const isCreator = comm.creator_email && comm.creator_email.toLowerCase() === email.toLowerCase()
            
            return {
              id: comm.id,
              name: comm.name,
              description: comm.description,
              members_count: realMembersCount,
              image_url: comm.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
              category: comm.category,
              location: comm.location,
              contact: comm.contact,
              rules: comm.rules,
              isLocal: true,
              isPengurus: isCreator
            }
          })
        
        // Coba ambil dari API juga (komunitas yang sudah bergabung)
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
        
        // Gabungkan dan remove duplicates
        const allMyCommunities = [...myCommunities, ...apiCommunities]
        const uniqueCommunities = allMyCommunities.filter((comm, index, self) =>
          index === self.findIndex(c => c.id === comm.id)
        )
        
        setCommunities(uniqueCommunities)
      } catch (error) {
        console.error('Error loading my communities:', error)
      } finally {
    setLoading(false)
      }
    }

    loadMyCommunities()

    // Listen untuk perubahan di localStorage
    const handleStorageChange = () => {
      loadMyCommunities()
    }

    window.addEventListener('localStorageUpdated', handleStorageChange)
    window.addEventListener('communityJoined', handleStorageChange)
    
    // Real-time update interval untuk update jumlah anggota secara berkala
    const updateInterval = setInterval(() => {
      loadMyCommunities()
    }, 2000) // Update setiap 2 detik

    return () => {
      clearInterval(updateInterval)
      window.removeEventListener('localStorageUpdated', handleStorageChange)
      window.removeEventListener('communityJoined', handleStorageChange)
    }
  }, [isLoggedIn, navigate, userEmail])

  return (
    <Layout showBack backUrl="/communities">
      <div className="events-page">
        <section className="section">
          <div className="section-header my-page">
          <h2 className="section-title">Komunitas Saya</h2>
            <div className="section-actions">
            <button className="btn-secondary" onClick={() => navigate('/communities')}>
                ← Kembali
            </button>
            <button className="btn-primary" onClick={() => navigate('/communities/create')}>
              + Buat Komunitas
            </button>
          </div>
        </div>

        {loading ? (
            <div className="loading">Memuat...</div>
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
                onClick={() => navigate(`/communities/${community.id}`, { state: { from: 'mycommunities' } })}
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
        </section>
      </div>
    </Layout>
  )
}

export default MyCommunities
