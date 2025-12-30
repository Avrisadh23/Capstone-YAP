import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './EventsManage.css'

const EventsManage = () => {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
      return
    }

    // Dummy data mirroring homepage/events
    setEvents([
      {
        id: 1,
        title: 'Tournament Futsal Nasional 2025',
        date: '2025-01-20',
        participants_count: 120,
        image_url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80',
      },
      {
        id: 2,
        title: 'Anime Festival Jakarta',
        date: '2025-02-15',
        participants_count: 5000,
        image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
      },
    ])
  }, [isLoggedIn, navigate])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <Layout showBack backUrl="/events">
      <div className="manage-page">
        <section className="manage-section">
          <div className="manage-header">
            <h2 className="manage-title">Kelola Event Saya</h2>
            <button
              className="btn-primary"
              onClick={() => navigate('/events/create')}
            >
              + Buat Event Baru
            </button>
          </div>
          <div className="manage-grid">
            {events.length === 0 ? (
              <div className="empty-state">
                Belum ada event yang dibuat.
              </div>
            ) : (
              events.map(event => (
                <div key={event.id} className="manage-card">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="manage-card-image"
                  />
                  <div className="manage-card-content">
                    <div className="manage-card-title">{event.title}</div>
                    <div className="manage-card-meta">
                      📅 {formatDate(event.date)} • 👥 {event.participants_count} peserta
                    </div>
                    <div className="manage-card-actions">
                      <button
                        className="btn-edit"
                        onClick={() => navigate(`/events/${event.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => {
                          if (window.confirm('Hapus event ini?')) {
                            setEvents(prev => prev.filter(e => e.id !== event.id))
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

export default EventsManage


