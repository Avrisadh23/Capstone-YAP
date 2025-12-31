import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { getUserProfile, getUserData, getFotoProfile } from '../services/api'
import './MemberCard.css'

const MemberCard = () => {
  const { isLoggedIn, userEmail } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isPengurus, setIsPengurus] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
      return
    }

    const loadUserData = async () => {
      try {
        const email = userEmail || localStorage.getItem('userEmail') || ''
        
        if (!email) {
          console.warn('MemberCard - No email found')
          setUser({
            email: '',
            nama_lengkap: 'User',
            tgl_lahir: null,
            foto_profile: null,
            created_at: new Date(),
            id: 1
          })
          return
        }
        
        // Cek localStorage terlebih dahulu
        const userData = getUserData(email)
        const fotoBase64 = getFotoProfile(email)
        
        let fotoProfile = null
        let namaLengkap = null
        let tglLahir = null
        
        if (userData) {
          console.log('MemberCard - Loaded userData:', userData)
          namaLengkap = userData.nama_lengkap
          // Pastikan tgl_lahir di-load dengan benar
          tglLahir = userData.tgl_lahir || null
          console.log('MemberCard - Found tgl_lahir:', tglLahir)
          fotoProfile = fotoBase64 || userData.foto_profile
        } else {
          console.warn('MemberCard - No userData found')
        }
        
        // Jika tidak ada di localStorage, coba fetch dari API
        if (!fotoProfile || !namaLengkap) {
          try {
            const response = await getUserProfile(email)
            if (response && response.success && response.user) {
              namaLengkap = response.user.nama_lengkap || response.user.name || namaLengkap || email.split('@')[0]
              tglLahir = response.user.tgl_lahir || tglLahir
              fotoProfile = response.user.foto_profile_url || fotoProfile || fotoBase64
            }
          } catch (error) {
            console.error('Error fetching user profile:', error)
            // Continue dengan data yang sudah ada
          }
        }
        
        // Pastikan setUser selalu dipanggil dengan data minimal
        setUser({
          email: email,
          nama_lengkap: namaLengkap || email.split('@')[0] || 'User',
          tgl_lahir: tglLahir || null,
          foto_profile: fotoProfile || fotoBase64 || null,
          created_at: new Date(),
          id: 1
        })
        
        // Check if user is pengurus - cek dari komunitas atau event yang dibuat
        const localCommunities = JSON.parse(localStorage.getItem('localCommunities') || '[]')
        const localEvents = JSON.parse(localStorage.getItem('localEvents') || '[]')
        
        const isCommunityCreator = localCommunities.some(comm => {
          if (comm.creator_email) {
            return comm.creator_email.toLowerCase() === email.toLowerCase()
          }
          return false
        })
        
        const isEventCreator = localEvents.some(event => {
          if (event.creator_email) {
            return event.creator_email.toLowerCase() === email.toLowerCase()
          }
          return false
        })
        
        // Atau cek dari join records dengan role pengurus
        const existingJoins = JSON.parse(localStorage.getItem('communityJoins') || '[]')
        const existingEventJoins = JSON.parse(localStorage.getItem('eventJoins') || '[]')
        
        const isPengurusInCommunity = existingJoins.some(j => {
          const joinEmail = j.user_email ? j.user_email.toLowerCase() : ''
          return joinEmail === email.toLowerCase() && (j.role === 'pengurus' || j.role === 'Pengurus')
        })
        
        const isPengurusInEvent = existingEventJoins.some(j => {
          const joinEmail = j.user_email ? j.user_email.toLowerCase() : ''
          return joinEmail === email.toLowerCase() && (j.role === 'pengurus' || j.role === 'Pengurus')
        })
        
        // User adalah pengurus jika membuat komunitas/event atau memiliki role pengurus
        setIsPengurus(isCommunityCreator || isEventCreator || isPengurusInCommunity || isPengurusInEvent)
      } catch (error) {
        console.error('Error loading user data:', error)
        // Set default user data jika error
        const email = userEmail || localStorage.getItem('userEmail') || ''
        setUser({
          email: email,
          nama_lengkap: email.split('@')[0] || 'User',
          tgl_lahir: null,
          foto_profile: null,
          created_at: new Date(),
          id: 1
        })
        setIsPengurus(false)
      }
    }

    loadUserData()

    // Listen untuk perubahan di localStorage (saat user update foto profil)
    const handleStorageChange = () => {
      loadUserData()
    }

    window.addEventListener('localStorageUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('localStorageUpdated', handleStorageChange)
    }
  }, [isLoggedIn, userEmail, navigate])

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    try {
      // Handle format YYYY-MM-DD (dari input date)
      if (dateString.includes('-')) {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return '-'
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
      }
      // Handle format lain
    const date = new Date(dateString)
      if (isNaN(date.getTime())) return '-'
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
    } catch (e) {
      return '-'
    }
  }

  const formatMonthYear = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
  }

  if (!user) {
    return <Layout><div>Loading...</div></Layout>
  }

  const avatarInitial = user.email ? user.email.charAt(0).toUpperCase() : 'U'
  const memberId = String(user.id || 1).padStart(6, '0')

  return (
    <Layout>
      <div className="member-card-page">
        <div className="card-container">
          <div className={`member-card ${isPengurus ? 'pengurus' : 'anggota'}`}>
            <div className="card-header">
              <div className="card-logo">Y.A.P</div>
              <div className="card-badge">{isPengurus ? 'PENGURUS' : 'ANGGOTA'}</div>
            </div>
            <div className="card-body">
              {user.foto_profile ? (
                <img 
                  src={user.foto_profile} 
                  alt="Foto Profile" 
                  className="card-photo"
                  style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    border: '4px solid #fff',
                    display: 'block',
                    margin: '0 auto 20px',
                    background: '#fff'
                  }}
                  onError={(e) => {
                    // Jika gambar gagal load, sembunyikan dan tampilkan fallback
                    e.target.style.display = 'none'
                    const fallback = document.querySelector('.card-photo-fallback')
                    if (fallback) {
                      fallback.style.display = 'flex'
                    }
                  }}
                />
              ) : null}
              <div 
                className="card-photo card-photo-fallback" 
                style={{ 
                  display: user.foto_profile ? 'none' : 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '48px', 
                  color: isPengurus ? '#003087' : '#ff6b35', 
                  background: '#fff',
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  border: '4px solid #fff',
                  margin: '0 auto 20px'
                }}
              >
                  {avatarInitial}
                </div>
              <div className="card-name">{user.nama_lengkap || user.email}</div>
              <div className="card-email">{user.email}</div>
              <div className="card-info">
                <div className="card-info-item">
                  <span className="card-info-label">Tanggal Lahir</span>
                  <span className="card-info-value">{formatDate(user.tgl_lahir)}</span>
                </div>
                <div className="card-info-item">
                  <span className="card-info-label">Member Since</span>
                  <span className="card-info-value">{formatMonthYear(user.created_at)}</span>
                </div>
                <div className="card-info-item">
                  <span className="card-info-label">ID Anggota</span>
                  <span className="card-info-value">#{memberId}</span>
                </div>
              </div>
            </div>
            <div className="card-footer">
              Kartu Anggota Digital Y.A.P Community Platform
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            onClick={handlePrint} 
            className={`btn-primary ${isPengurus ? 'pengurus' : 'anggota'}`}
          >
            🖨️ Cetak PDF
          </button>
          <button 
            onClick={() => navigate('/profile')} 
            className={`btn-secondary ${isPengurus ? 'pengurus' : 'anggota'}`}
          >
            Kembali ke Profile
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default MemberCard
