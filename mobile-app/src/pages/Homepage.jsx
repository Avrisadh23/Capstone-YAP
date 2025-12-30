import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import './Homepage.css'

const Homepage = () => {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [aktivitas, setAktivitas] = useState('')
  const [kota, setKota] = useState('')
  const [communities, setCommunities] = useState([])
  const [events, setEvents] = useState([])

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
        members: 1250,
        image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
        category: 'Hobi',
        location: 'Jakarta'
      },
      {
        id: 2,
        name: 'Bengkel Motor Racing',
        description: 'Komunitas modifikasi motor dan racing untuk para bikers',
        members: 890,
        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&q=80',
        category: 'Olahraga',
        location: 'Bandung'
      },
      {
        id: 3,
        name: 'Futsal Community Surabaya',
        description: 'Komunitas futsal untuk semua level, dari pemula hingga profesional',
        members: 2100,
        image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80',
        category: 'Olahraga',
        location: 'Surabaya'
      },
      {
        id: 4,
        name: 'Komunitas Photography Yogyakarta',
        description: 'Sharing dan belajar fotografi bersama para fotografer',
        members: 650,
        image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80',
        category: 'Hobi',
        location: 'Yogyakarta'
      },
    ])

    setEvents([
      {
        id: 1,
        title: 'Tournament Futsal Nasional 2025',
        description: 'Kompetisi futsal tingkat nasional dengan hadiah total 50 juta',
        date: '2025-01-20',
        time: '09:00',
        location: 'Jakarta',
        image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80',
        category: 'Olahraga',
        participants: 120
      },
      {
        id: 2,
        title: 'Anime Festival Jakarta',
        description: 'Festival anime terbesar di Jakarta dengan cosplay competition',
        date: '2025-02-15',
        time: '10:00',
        location: 'Jakarta',
        image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
        category: 'Hobi',
        participants: 5000
      },
      {
        id: 3,
        title: 'Workshop Photography Dasar',
        description: 'Belajar teknik dasar fotografi dengan mentor profesional',
        date: '2025-01-25',
        time: '14:00',
        location: 'Yogyakarta',
        image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80',
        category: 'Workshop',
        participants: 30
      },
    ])
  }, [isLoggedIn, navigate])

  const applyFilters = () => {
    // Filter logic would go here
    console.log('Applying filters:', { aktivitas, kota })
  }

  const filteredCommunities = communities.filter(c => {
    if (aktivitas && c.category !== aktivitas) return false
    if (kota && c.location !== kota) return false
    return true
  })

  const filteredEvents = events.filter(e => {
    if (aktivitas && e.category !== aktivitas) return false
    if (kota && e.location !== kota) return false
    return true
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <Layout>
      <div className="homepage">
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
                <option value="Semarang">Semarang</option>
                <option value="Makassar">Makassar</option>
                <option value="Palembang">Palembang</option>
                <option value="Depok">Depok</option>
                <option value="Tangerang">Tangerang</option>
                <option value="Bekasi">Bekasi</option>
                <option value="Yogyakarta">Yogyakarta</option>
                <option value="Malang">Malang</option>
                <option value="Denpasar">Denpasar</option>
                <option value="Batam">Batam</option>
                <option value="Pekanbaru">Pekanbaru</option>
                <option value="Bandar Lampung">Bandar Lampung</option>
                <option value="Padang">Padang</option>
                <option value="Pontianak">Pontianak</option>
                <option value="Balikpapan">Balikpapan</option>
                <option value="Manado">Manado</option>
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
            <a href="/communities" className="section-link">Lihat Semua →</a>
          </div>
          <div className="cards-grid">
            {filteredCommunities.slice(0, 4).map(community => (
              <div 
                key={community.id} 
                className="card"
                onClick={() => navigate(`/communities/${community.id}`)}
              >
                <img src={community.image} alt={community.name} className="card-image" />
                <div className="card-content">
                  <div className="card-title">{community.name}</div>
                  <div className="card-description">{community.description}</div>
                  <div className="card-meta">
                    <span>👥 {community.members.toLocaleString()} anggota</span>
                    <span className="card-badge">{community.category}</span>
                  </div>
                  <div className="card-location">📍 {community.location}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section section-gray">
          <div className="section-header">
            <h2 className="section-title">Daftar Event</h2>
            <a href="/events" className="section-link">Lihat Semua →</a>
          </div>
          <div className="cards-grid">
            {filteredEvents.slice(0, 4).map(event => (
              <div 
                key={event.id} 
                className="card"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <img src={event.image} alt={event.title} className="card-image" />
                <div className="card-content">
                  <div className="card-title">{event.title}</div>
                  <div className="card-description">{event.description}</div>
                  <div className="card-meta">
                    <span>📅 {formatDate(event.date)} • {event.time}</span>
                    <span className="card-badge">{event.category}</span>
                  </div>
                  <div className="card-location">
                    📍 {event.location}<br />
                    👥 {event.participants} peserta
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">Y.G.A</div>
              <div className="footer-address">
                PT YGA Solutions<br />
                Jl. Warid No.100<br />
                Jakarta, Indonesia
              </div>
            </div>
            <div className="footer-section">
              <div className="footer-title">Perusahaan</div>
              <a href="#">Tentang</a>
              <a href="#">Kebijakan & Privasi</a>
              <a href="#">Syarat dan Ketentuan</a>
            </div>
            <div className="footer-section">
              <div className="footer-title">Fitur Kita</div>
              <a href="#">Show Event</a>
              <a href="#">Join Event</a>
              <a href="#">Show Komunitas</a>
              <a href="#">Join Komunitas</a>
            </div>
            <div className="footer-section">
              <div className="footer-title">Hubungi Kami</div>
              <a href="#">Kontak</a>
            </div>
          </div>
          <div className="footer-bottom">
            <div>© 2025 YGA Indonesia. All Rights Reserved.</div>
          </div>
        </footer>
      </div>
    </Layout>
  )
}

export default Homepage

