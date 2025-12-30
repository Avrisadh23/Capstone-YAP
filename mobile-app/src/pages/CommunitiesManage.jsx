import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './EventsManage.css'

const CommunitiesManage = () => {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [communities, setCommunities] = useState([])

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
      return
    }

    setCommunities([
      {
        id: 1,
        name: 'Komunitas Wibu Jakarta',
        members_count: 1250,
        image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
      },
      {
        id: 2,
        name: 'Bengkel Motor Racing',
        members_count: 890,
        image_url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&q=80',
      },
    ])
  }, [isLoggedIn, navigate])

  return (
    <Layout showBack backUrl="/communities">
      <div className="manage-page">
        <section className="manage-section">
          <div className="manage-header">
            <h2 className="manage-title">Kelola Komunitas Saya</h2>
            <button
              className="btn-primary"
              onClick={() => navigate('/communities/create')}
            >
              + Buat Komunitas Baru
            </button>
          </div>
          <div className="manage-grid">
            {communities.length === 0 ? (
              <div className="empty-state">
                Belum ada komunitas yang dibuat.
              </div>
            ) : (
              communities.map(community => (
                <div key={community.id} className="manage-card">
                  <img
                    src={community.image_url}
                    alt={community.name}
                    className="manage-card-image"
                  />
                  <div className="manage-card-content">
                    <div className="manage-card-title">{community.name}</div>
                    <div className="manage-card-meta">
                      👥 {community.members_count} anggota
                    </div>
                    <div className="manage-card-actions">
                      <button
                        className="btn-edit"
                        onClick={() => navigate(`/communities/${community.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => {
                          if (window.confirm('Hapus komunitas ini?')) {
                            setCommunities(prev => prev.filter(c => c.id !== community.id))
                          }
                        }}
                      >
                        Hapus
                      </button>
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

export default CommunitiesManage


