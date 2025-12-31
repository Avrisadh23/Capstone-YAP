import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { getEvent, joinEvent, getCsrfToken, getUserData } from '../services/api'
import './EventDetail.css'

const EventDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn, userEmail } = useAuth()
  const [event, setEvent] = useState(null)
  const [isJoined, setIsJoined] = useState(false)
  const [isPengurus, setIsPengurus] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joinData, setJoinData] = useState({
    user_email: userEmail || '',
    user_name: '',
    phone: '',
    notes: ''
  })
  const [loading, setLoading] = useState(true)

  // Fungsi helper untuk reload peserta (real-time)
  const reloadParticipants = () => {
    const localEvents = JSON.parse(localStorage.getItem('localEvents') || '[]')
    const evt = localEvents.find(e => {
      if (e.id === id) return true
      if (String(e.id) === String(id)) return true
      return false
    })
    
    if (evt) {
      const existingJoins = JSON.parse(localStorage.getItem('eventJoins') || '[]')
      const creatorEmail = evt.creator_email ? evt.creator_email.toLowerCase().trim() : ''
      const participantsList = []
      
      // Tambahkan creator sebagai Pengurus (hanya sekali)
      if (creatorEmail) {
        participantsList.push({
          user_email: evt.creator_email,
          role: 'Pengurus'
        })
      }
      
      // Tambahkan peserta yang sudah join (tidak termasuk creator)
      const joinedParticipants = existingJoins.filter(j => {
        const joinEventId = j.event_id
        const joinEmail = (j.user_email || '').toLowerCase().trim()
        // Filter: harus match event_id DAN bukan creator
        return (joinEventId === id || String(joinEventId) === String(id)) && joinEmail !== creatorEmail
      })
      
      joinedParticipants.forEach(j => {
        participantsList.push({
          user_email: j.user_email,
          role: j.role || 'Anggota'
        })
      })
      
      // Update participants_count real-time dari jumlah peserta yang sebenarnya
      const realParticipantsCount = participantsList.length
      
      // Update di state event menggunakan functional update untuk menghindari dependency
      setEvent(prevEvent => {
        if (prevEvent) {
          return {
            ...prevEvent,
            participants_count: realParticipantsCount
          }
        }
        return prevEvent
      })
      
      // Update di localStorage juga
      const evtIndex = localEvents.findIndex(e => {
        if (e.id === id) return true
        if (String(e.id) === String(id)) return true
        return false
      })
      
      if (evtIndex !== -1) {
        localEvents[evtIndex].participants_count = realParticipantsCount
        localStorage.setItem('localEvents', JSON.stringify(localEvents))
      }
    }
  }

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
      return
    }

    const loadEvent = async () => {
      try {
        const email = userEmail || localStorage.getItem('userEmail') || ''
        
        // Cek apakah ini event dari localStorage
        const localEvents = JSON.parse(localStorage.getItem('localEvents') || '[]')
        const evt = localEvents.find(e => {
          if (e.id === id) return true
          if (String(e.id) === String(id)) return true
          return false
        })
        
        if (evt) {
          const existingJoins = JSON.parse(localStorage.getItem('eventJoins') || '[]')
          const creatorEmail = evt.creator_email ? evt.creator_email.toLowerCase().trim() : ''
          const userEmailLower = email.toLowerCase().trim()
          
          // Hitung participants count real-time
          const participantsList = []
          
          // Tambahkan creator sebagai Pengurus (hanya sekali)
          if (creatorEmail) {
            participantsList.push({
              user_email: evt.creator_email,
              role: 'Pengurus'
            })
          }
          
          // Tambahkan peserta yang sudah join (tidak termasuk creator)
          const joinedParticipants = existingJoins.filter(j => {
            const joinEventId = j.event_id
            const joinEmail = (j.user_email || '').toLowerCase().trim()
            return (joinEventId === id || String(joinEventId) === String(id)) && joinEmail !== creatorEmail
          })
          
          joinedParticipants.forEach(j => {
            participantsList.push({
              user_email: j.user_email,
              role: j.role || 'Anggota'
            })
          })
          
          const realParticipantsCount = participantsList.length
          
    setEvent({
            id: id,
            title: evt.title,
            description: evt.description,
            date: evt.date,
            time: evt.time,
            location: evt.location,
            image_url: evt.image || 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80',
            category: evt.category,
            participants_count: realParticipantsCount,
            max_participants: evt.max_participants || null,
            price: evt.price || 0,
            contact: evt.contact || '',
            requirements: evt.requirements || '',
            creator_email: evt.creator_email
          })
          
          // Update di localStorage juga
          const evtIndex = localEvents.findIndex(e => {
            if (e.id === id) return true
            if (String(e.id) === String(id)) return true
            return false
          })
          
          if (evtIndex !== -1) {
            localEvents[evtIndex].participants_count = realParticipantsCount
            localStorage.setItem('localEvents', JSON.stringify(localEvents))
          }
          
          // Cek apakah user sudah join atau adalah creator
          if (creatorEmail && creatorEmail === userEmailLower) {
            setIsJoined(true)
            setIsPengurus(true)
          } else {
            // Cek apakah user sudah join
            const joined = existingJoins.some(
              j => {
                const joinEmail = (j.user_email || '').toLowerCase().trim()
                const joinEventId = j.event_id
                return (joinEventId === id || String(joinEventId) === String(id)) && joinEmail === userEmailLower
              }
            )
            setIsJoined(joined)
            
            // Cek apakah user adalah pengurus dari join records
            const isPengurusFromJoin = existingJoins.some(
              j => {
                const joinEmail = (j.user_email || '').toLowerCase().trim()
                const joinEventId = j.event_id
                const joinRole = (j.role || '').toLowerCase()
                return (joinEventId === id || String(joinEventId) === String(id)) && 
                       joinEmail === userEmailLower && 
                       (joinRole === 'pengurus' || joinRole === 'Pengurus')
              }
            )
            setIsPengurus(isPengurusFromJoin)
          }
          
          setLoading(false)
          return
        }

        // Jika tidak ada di localStorage, coba ambil dari API
        try {
          const response = await getEvent(id)
          if (response && response.event) {
            setEvent(response.event)
          } else if (response) {
            setEvent(response)
          }
        } catch (error) {
          console.warn('Error fetching event from API:', error)
          alert('Event tidak ditemukan')
          navigate('/events')
        }
      } catch (error) {
        console.error('Error loading event:', error)
        alert('Terjadi kesalahan saat memuat event')
        navigate('/events')
      } finally {
    setLoading(false)
      }
    }

    loadEvent()
    
    // Listen untuk update real-time saat ada perubahan di localStorage
    const handleStorageUpdate = () => {
      // Delay sedikit untuk memastikan localStorage sudah ter-update
      setTimeout(() => {
        reloadParticipants()
      }, 100)
    }
    
    window.addEventListener('eventJoined', handleStorageUpdate)
    window.addEventListener('localStorageUpdated', handleStorageUpdate)
    
    return () => {
      window.removeEventListener('eventJoined', handleStorageUpdate)
      window.removeEventListener('localStorageUpdated', handleStorageUpdate)
    }
  }, [id, isLoggedIn, navigate, userEmail])

  const handleJoin = async () => {
    if (!joinData.user_email) {
      alert('Email harus diisi')
      return
    }
    
    try {
      const email = (userEmail || localStorage.getItem('userEmail') || joinData.user_email || '').trim()
      const normalizedEmail = email.toLowerCase().trim()
      
      // Simpan join record ke localStorage
      const existingJoins = JSON.parse(localStorage.getItem('eventJoins') || '[]')
      
      // Cek apakah sudah join (untuk menghindari duplikasi)
      const alreadyJoined = existingJoins.some(
        j => {
          const joinEmail = (j.user_email || '').toLowerCase().trim()
          const joinEventId = j.event_id
          return (joinEventId === id || String(joinEventId) === String(id)) && joinEmail === normalizedEmail
        }
      )
      
      if (alreadyJoined) {
        alert('Anda sudah bergabung dengan event ini!')
        setIsJoined(true)
        setShowJoinModal(false)
        return
      }
      
      const joinRecord = {
        event_id: id,
        user_email: normalizedEmail,
        user_name: joinData.user_name || (() => {
          const userData = getUserData(email) || {}
          return userData.nama_lengkap || email.split('@')[0]
        })(),
        phone: joinData.phone || '',
        notes: joinData.notes || '',
        role: 'Anggota', // User yang join menjadi anggota
        joined_at: new Date().toISOString()
      }
      
      existingJoins.push(joinRecord)
      localStorage.setItem('eventJoins', JSON.stringify(existingJoins))
      
      // Coba kirim ke backend
      try {
        await joinEvent(id, joinData)
      } catch (backendError) {
        console.warn('Backend error, but join saved to localStorage:', backendError)
      }
      
      alert('Berhasil bergabung dengan event!')
      setIsJoined(true)
      setShowJoinModal(false)
      
      // Reload participants count real-time
      reloadParticipants()
      
      // Trigger event untuk update daftar event
      window.dispatchEvent(new Event('eventJoined'))
      window.dispatchEvent(new Event('localStorageUpdated'))
    } catch (error) {
      // Jika error, tetap anggap berhasil karena sudah di localStorage
      alert('Berhasil bergabung dengan event! (Data tersimpan lokal)')
      setIsJoined(true)
      setShowJoinModal(false)
      
      // Reload participants count real-time
      reloadParticipants()
      
      // Trigger event untuk update daftar event
      window.dispatchEvent(new Event('eventJoined'))
      window.dispatchEvent(new Event('localStorageUpdated'))
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  // Tentukan backUrl berdasarkan dari mana user datang
  const getBackUrl = () => {
    // Cek apakah ada state dari navigasi sebelumnya
    if (location.state && location.state.from === 'myevents') {
      return '/events/myevent'
    }
    if (location.state && location.state.from === 'homepage') {
      return '/homepage'
    }
    // Default ke daftar event
    return '/events'
  }

  const backUrl = getBackUrl()

  if (loading || !event) {
    return (
      <Layout showBack backUrl={backUrl}>
        <div className="event-detail-page">
          <div className="loading">Memuat...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout showBack backUrl={backUrl}>
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
                <>
                  {isPengurus ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button 
                        className="btn-primary" 
                        onClick={() => navigate(`/events/${id}/edit`)}
                      >
                        ✏️ Edit Event
                      </button>
                      <button 
                        className="btn-secondary" 
                        onClick={async () => {
                          if (confirm('Yakin ingin menghapus event ini?')) {
                            try {
                              // Ambil CSRF token
                              const csrfToken = await getCsrfToken()
                              const formData = new FormData()
                              if (csrfToken) {
                                formData.append('_token', csrfToken)
                              }
                              
                              const response = await fetch(`/api/events/${id}`, {
                                method: 'DELETE',
                                body: formData,
                                credentials: 'include',
                                headers: {
                                  'X-XSRF-TOKEN': csrfToken || '',
                                  'X-Requested-With': 'XMLHttpRequest',
                                }
                              })
                              
                              if (response.ok || response.status === 302) {
                                alert('Event berhasil dihapus!')
                                navigate('/events')
                              } else {
                                throw new Error('Gagal menghapus event')
                              }
                            } catch (error) {
                              console.error('Error deleting event:', error)
                              alert('Gagal menghapus event: ' + (error.message || 'Unknown error'))
                            }
                          }
                        }}
                        style={{ background: '#ff3b30', color: '#fff', border: 'none' }}
                      >
                        🗑️ Hapus Event
                      </button>
                    </div>
                  ) : (
                <button className="btn-secondary" disabled>Sudah Bergabung</button>
                  )}
                </>
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

