import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import './Events.css'

const MyEvents = () => {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
      return
    }

    // Dummy data - in production, this would fetch from API
    setEvents([])
    setLoading(false)
  }, [isLoggedIn, navigate])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <Layout showBack backUrl="/events">
      <div className="events-page">
        <div className="section-header">
          <h2 className="section-title">Event Saya</h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="btn-secondary" onClick={() => navigate('/events')}>
              ← Kembali ke Daftar Event
            </button>
            <button className="btn-primary" onClick={() => navigate('/events/create')}>
              + Buat Event
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <h3>Belum Ada Event</h3>
            <p>Anda belum mendaftar ke event manapun. Mulai jelajahi event yang tersedia!</p>
            <button className="btn-primary" onClick={() => navigate('/events')}>
              Jelajahi Event
            </button>
          </div>
        ) : (
          <div className="cards-grid">
            {events.map(event => (
              <div 
                key={event.id} 
                className="card"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <img src={event.image_url || 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80'} alt={event.title} className="card-image" />
                <div className="card-content">
                  <div className="card-title">{event.title}</div>
                  <div className="card-description">{event.description}</div>
                  <div className="card-meta">
                    <span>📅 {formatDate(event.date)} • {event.time}</span>
                    <span className="card-badge">{event.category}</span>
                  </div>
                  <div className="card-location">
                    📍 {event.location}<br />
                    👥 {event.participants_count || 0} peserta
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default MyEvents
