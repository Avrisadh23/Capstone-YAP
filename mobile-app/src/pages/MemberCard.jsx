import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
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

    // In production, this would fetch user data from API
    // For now, use localStorage data
    const email = userEmail || localStorage.getItem('userEmail') || ''
    setUser({
      email: email,
      nama_lengkap: localStorage.getItem('namaLengkap') || email.split('@')[0],
      tgl_lahir: localStorage.getItem('tglLahir') || null,
      foto_profile: localStorage.getItem('fotoProfile') || null,
      created_at: new Date(),
      id: 1
    })
    
    // Check if user is pengurus (in production, this would come from API)
    setIsPengurus(false)
  }, [isLoggedIn, userEmail, navigate])

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
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
              <div className="card-logo">Y.G.A</div>
              <div className="card-badge">{isPengurus ? 'PENGURUS' : 'ANGGOTA'}</div>
            </div>
            <div className="card-body">
              {user.foto_profile ? (
                <img 
                  src={user.foto_profile} 
                  alt="Foto Profile" 
                  className="card-photo"
                />
              ) : (
                <div className="card-photo" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '48px', 
                  color: isPengurus ? '#003087' : '#ff6b35', 
                  background: '#fff' 
                }}>
                  {avatarInitial}
                </div>
              )}
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
              Kartu Anggota Digital Y.G.A Community Platform
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
