import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { getEvents } from '../services/api'
import './Events.css'

const Events = () => {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [aktivitas, setAktivitas] = useState('')
  const [kota, setKota] = useState('')
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
      return
    }

    // Dummy data - replace with API call
    setEvents([
      {
        id: 1,
        title: 'Tournament Futsal Nasional 2025',
        description: 'Kompetisi futsal tingkat nasional dengan hadiah total 50 juta',
        date: '2025-01-20',
        time: '09:00',
        location: 'Jakarta',
        image_url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80',
        category: 'Olahraga',
        participants_count: 120
      },
      {
        id: 2,
        title: 'Anime Festival Jakarta',
        description: 'Festival anime terbesar di Jakarta dengan cosplay competition',
        date: '2025-02-15',
        time: '10:00',
        location: 'Jakarta',
        image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
        category: 'Hobi',
        participants_count: 5000
      },
      {
        id: 3,
        title: 'Workshop Photography Dasar',
        description: 'Belajar teknik dasar fotografi dengan mentor profesional',
        date: '2025-01-25',
        time: '14:00',
        location: 'Yogyakarta',
        image_url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80',
        category: 'Workshop',
        participants_count: 30
      },
    ])
    setLoading(false)
  }, [isLoggedIn, navigate])

  const applyFilters = () => {
    // Filter logic
    console.log('Applying filters:', { aktivitas, kota })
  }

  const filteredEvents = events.filter(e => {
    if (aktivitas && e.category !== aktivitas) return false
    if (kota && e.location !== kota) return false
    return true
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

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
            <h2 className="section-title">Daftar Event</h2>
            <button className="btn-create" onClick={() => navigate('/events/create')}>
              + Buat Event
            </button>
          </div>
          <div className="cards-grid">
            {filteredEvents.length === 0 ? (
              <div className="empty-state">
                Tidak ada event yang ditemukan.
              </div>
            ) : (
              filteredEvents.map(event => (
                <div 
                  key={event.id} 
                  className="card"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <img 
                    src={event.image_url || 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80'} 
                    alt={event.title} 
                    className="card-image" 
                  />
                  <div className="card-content">
                    <div className="card-title">{event.title}</div>
                    <div className="card-description">{event.description}</div>
                    <div className="card-meta">
                      <span>📅 {formatDate(event.date)} • {event.time}</span>
                      <span className="card-badge">{event.category}</span>
                    </div>
                    <div className="card-location">
                      📍 {event.location}<br />
                      👥 {event.participants_count} peserta
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

export default Events

