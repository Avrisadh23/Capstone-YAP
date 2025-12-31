import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { getEvents } from '../services/api'
import './Events.css'

const MyEvents = () => {
  const { isLoggedIn, userEmail } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
      return
    }

    const loadMyEvents = async () => {
      try {
        const email = userEmail || localStorage.getItem('userEmail') || ''
        
        // Ambil event yang user sudah bergabung (dari localStorage)
        const localEvents = JSON.parse(localStorage.getItem('localEvents') || '[]')
        const existingJoins = JSON.parse(localStorage.getItem('eventJoins') || '[]')
        
        // Ambil ID event yang user sudah join
        const joinedEventIds = existingJoins
          .filter(j => {
            const joinEmail = j.user_email ? j.user_email.toLowerCase() : ''
            return joinEmail === email.toLowerCase()
          })
          .map(j => j.event_id)
        
        // Ambil event yang dibuat user (creator otomatis join)
        const createdEventIds = localEvents
          .filter(event => {
            if (event.creator_email) {
              return event.creator_email.toLowerCase().trim() === email.toLowerCase().trim()
            }
            return false
          })
          .map(event => event.id)
        
        console.log('MyEvents - Email:', email, 'Created Event IDs:', createdEventIds, 'Joined Event IDs:', joinedEventIds)
        
        // Gabungkan ID event yang di-join dan yang dibuat
        const allJoinedIds = [...new Set([...joinedEventIds, ...createdEventIds])]
        
        // Ambil detail event yang sudah bergabung
        const myEvents = localEvents
          .filter(event => allJoinedIds.includes(event.id))
          .map((event) => {
            // Hitung participants count dari join records
            const joinCount = existingJoins.filter(j => j.event_id === event.id).length
            const participantsCount = (event.participants_count || 0) + joinCount
            
            // Cek apakah user adalah creator (pengurus)
            const isCreator = event.creator_email && event.creator_email.toLowerCase() === email.toLowerCase()
            
            return {
              id: event.id,
              title: event.title,
              description: event.description,
              date: event.date,
              time: event.time,
              location: event.location,
              image_url: event.image || 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80',
              category: event.category,
              participants_count: participantsCount,
              isLocal: true,
              isPengurus: isCreator
            }
          })
        
        // Coba ambil dari API juga (event yang sudah bergabung)
        let apiEvents = []
        try {
          const response = await getEvents()
          if (response && Array.isArray(response)) {
            apiEvents = response
          } else if (response && response.data && Array.isArray(response.data)) {
            apiEvents = response.data
          }
        } catch (error) {
          console.warn('Error fetching events from API:', error)
        }
        
        // Gabungkan dan remove duplicates
        const allMyEvents = [...myEvents, ...apiEvents]
        const uniqueEvents = allMyEvents.filter((event, index, self) =>
          index === self.findIndex(e => e.id === event.id)
        )
        
        setEvents(uniqueEvents)
      } catch (error) {
        console.error('Error loading my events:', error)
      } finally {
    setLoading(false)
      }
    }

    loadMyEvents()

    // Listen untuk perubahan di localStorage
    const handleStorageChange = () => {
      loadMyEvents()
    }

    window.addEventListener('localStorageUpdated', handleStorageChange)
    window.addEventListener('eventJoined', handleStorageChange)

    return () => {
      window.removeEventListener('localStorageUpdated', handleStorageChange)
      window.removeEventListener('eventJoined', handleStorageChange)
    }
  }, [isLoggedIn, navigate, userEmail])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <Layout showBack backUrl="/events">
      <div className="events-page">
        <section className="section">
          <div className="section-header my-page">
            <h2 className="section-title">Event Saya</h2>
            <div className="section-actions">
              <button className="btn-secondary" onClick={() => navigate('/events')}>
                ← Kembali
              </button>
              <button className="btn-primary" onClick={() => navigate('/events/create')}>
                + Buat Event
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading">Memuat...</div>
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
                  onClick={() => navigate(`/events/${event.id}`, { state: { from: 'myevents' } })}
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
        </section>
      </div>
    </Layout>
  )
}

export default MyEvents
