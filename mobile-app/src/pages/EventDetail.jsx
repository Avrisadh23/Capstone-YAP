import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { getEvent, joinEvent } from '../services/api'
import './EventDetail.css'

const EventDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn, userEmail } = useAuth()
  const [event, setEvent] = useState(null)
  const [isJoined, setIsJoined] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joinData, setJoinData] = useState({
    user_email: userEmail || '',
    user_name: '',
    phone: '',
    notes: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
      return
    }

    // Dummy data - replace with API call
    setEvent({
      id: 1,
      title: 'Tournament Futsal Nasional 2025',
      description: 'Kompetisi futsal tingkat nasional dengan hadiah total 50 juta rupiah. Event ini diikuti oleh berbagai tim dari seluruh Indonesia.',
      date: '2025-01-20',
      time: '09:00',
      location: 'Jakarta',
      image_url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80',
      category: 'Olahraga',
      participants_count: 120,
      max_participants: 200,
      price: 50000,
      contact: '081234567890',
      requirements: 'Peserta harus membawa sepatu futsal dan seragam tim.'
    })
    setLoading(false)
  }, [id, isLoggedIn, navigate])

  const handleJoin = async () => {
    if (!joinData.user_email) {
      alert('Email harus diisi')
      return
    }
    
    try {
      // await joinEvent(id, joinData)
      alert('Berhasil bergabung dengan event!')
      setIsJoined(true)
      setShowJoinModal(false)
    } catch (error) {
      alert('Gagal bergabung dengan event')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  if (loading || !event) {
    return (
      <Layout showBack backUrl="/events">
        <div className="event-detail-page">
          <div className="loading">Memuat...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout showBack backUrl="/events">
      <div className="event-detail-page">
        <div className="detail-container">
          <div className="detail-header">
            <h1 className="detail-title">{event.title}</h1>
            <div className="detail-meta">
              <span>📅 {formatDate(event.date)} • {event.time}</span>
              <span>📍 {event.location}</span>
              <span>🏷️ {event.category}</span>
              <span>👥 {event.participants_count} peserta</span>
            </div>
          </div>

          {event.image_url && (
            <img src={event.image_url} alt={event.title} className="detail-image" />
          )}

          <div className="detail-content">
            <div className="detail-main">
              <div className="detail-section">
                <h3>Deskripsi</h3>
                <p>{event.description}</p>
              </div>
              {event.requirements && (
                <div className="detail-section">
                  <h3>Persyaratan</h3>
                  <p>{event.requirements}</p>
                </div>
              )}
            </div>
            <div className="detail-sidebar">
              <div className="info-box">
                <div className="info-box-item">
                  <span>Tanggal</span>
                  <strong>{formatDate(event.date)}</strong>
                </div>
                <div className="info-box-item">
                  <span>Waktu</span>
                  <strong>{event.time}</strong>
                </div>
                <div className="info-box-item">
                  <span>Lokasi</span>
                  <strong>{event.location}</strong>
                </div>
                <div className="info-box-item">
                  <span>Kategori</span>
                  <strong>{event.category}</strong>
                </div>
                {event.max_participants && (
                  <div className="info-box-item">
                    <span>Kapasitas</span>
                    <strong>{event.participants_count} / {event.max_participants}</strong>
                  </div>
                )}
                {event.price > 0 && (
                  <div className="info-box-item">
                    <span>Harga</span>
                    <strong>Rp {event.price.toLocaleString('id-ID')}</strong>
                  </div>
                )}
                {event.contact && (
                  <div className="info-box-item">
                    <span>Kontak</span>
                    <strong>{event.contact}</strong>
                  </div>
                )}
              </div>
              {isJoined ? (
                <button className="btn-secondary" disabled>Sudah Bergabung</button>
              ) : (
                <button className="btn-primary" onClick={() => setShowJoinModal(true)}>
                  Join Event
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowJoinModal(false)}>×</button>
            <h2 style={{ marginBottom: '24px' }}>Join Event</h2>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-input"
                value={joinData.user_email}
                onChange={(e) => setJoinData({...joinData, user_email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nama</label>
              <input 
                type="text" 
                className="form-input"
                value={joinData.user_name}
                onChange={(e) => setJoinData({...joinData, user_name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nomor Telepon</label>
              <input 
                type="tel" 
                className="form-input"
                value={joinData.phone}
                onChange={(e) => setJoinData({...joinData, phone: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Catatan (Opsional)</label>
              <textarea 
                className="form-input"
                rows="3"
                value={joinData.notes}
                onChange={(e) => setJoinData({...joinData, notes: e.target.value})}
              />
            </div>
            <button className="btn-primary" onClick={handleJoin}>
              Konfirmasi Join
            </button>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default EventDetail

