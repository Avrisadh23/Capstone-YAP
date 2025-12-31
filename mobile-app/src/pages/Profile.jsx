import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { getUserProfile, updateUserProfile, getUserData, getFotoProfile } from '../services/api'
import './Profile.css'

const Profile = () => {
  const { isLoggedIn, userEmail } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState(userEmail || '')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [tglLahir, setTglLahir] = useState('')
  const [fotoProfile, setFotoProfile] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(null)
  const [fotoProfileUrl, setFotoProfileUrl] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
      return
    }
    setEmail(userEmail || '')
    
    // Load dari localStorage terlebih dahulu (sama dengan yang di navbar)
    const loadProfileFromStorage = () => {
      const userData = getUserData(userEmail)
      const fotoBase64 = getFotoProfile(userEmail)
      
      if (userData) {
        try {
          console.log('Profile - Loaded userData:', userData)
          setFullName(userData.nama_lengkap || '')
            // Pastikan tgl_lahir di-load dengan benar dari registrasi
            if (userData.tgl_lahir) {
              console.log('Profile - Found tgl_lahir:', userData.tgl_lahir)
              // Format tanggal untuk input type="date" harus YYYY-MM-DD
              const tglLahirValue = userData.tgl_lahir
              // Jika format sudah YYYY-MM-DD, langsung pakai
              if (tglLahirValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
                console.log('Profile - Using tgl_lahir as-is:', tglLahirValue)
                setTglLahir(tglLahirValue)
              } else {
                // Coba parse dan format ulang
                try {
                  const date = new Date(tglLahirValue)
                  if (!isNaN(date.getTime())) {
                    const year = date.getFullYear()
                    const month = String(date.getMonth() + 1).padStart(2, '0')
                    const day = String(date.getDate()).padStart(2, '0')
                    const formattedDate = `${year}-${month}-${day}`
                    console.log('Profile - Formatted tgl_lahir:', formattedDate)
                    setTglLahir(formattedDate)
                  } else {
                    console.warn('Profile - Invalid date:', tglLahirValue)
                    setTglLahir('')
                  }
                } catch (e) {
                  console.error('Profile - Error parsing date:', e)
                  setTglLahir('')
                }
              }
            } else {
              console.warn('Profile - No tgl_lahir in userData')
              setTglLahir('')
            }
          // Gunakan foto dari localStorage yang sama dengan navbar
          // Prioritas: fotoBase64 > userData.foto_profile
          if (fotoBase64) {
            setFotoProfileUrl(fotoBase64)
          } else if (userData.foto_profile) {
            setFotoProfileUrl(userData.foto_profile)
          }
        } catch (error) {
          console.error('Error parsing userData:', error)
        }
      } else {
        console.warn('Profile - No userData found for email:', userEmail)
      }
      
      // Jika tidak ada di storedData atau foto belum di-set, coba ambil dari fotoBase64 langsung
      if (!fotoProfileUrl && fotoBase64) {
        setFotoProfileUrl(fotoBase64)
      }
    }
    
    loadProfileFromStorage()
    
    // Fetch user profile data dari API sebagai fallback
    const fetchUserProfile = async () => {
      if (!userEmail) return
      
      try {
        setLoading(true)
        const response = await getUserProfile(userEmail)
        if (response.success && response.user) {
          if (!fullName) setFullName(response.user.nama_lengkap || response.user.name || '')
          // Update tgl_lahir dari API jika belum ada
          if (!tglLahir && response.user.tgl_lahir) {
            const tglLahirValue = response.user.tgl_lahir
            if (tglLahirValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
              setTglLahir(tglLahirValue)
            } else {
              try {
                const date = new Date(tglLahirValue)
                if (!isNaN(date.getTime())) {
                  const year = date.getFullYear()
                  const month = String(date.getMonth() + 1).padStart(2, '0')
                  const day = String(date.getDate()).padStart(2, '0')
                  setTglLahir(`${year}-${month}-${day}`)
                }
              } catch (e) {
                // ignore
              }
            }
          }
          if (!fotoProfileUrl && response.user.foto_profile_url) {
            setFotoProfileUrl(response.user.foto_profile_url)
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserProfile()
    
    // Listen untuk perubahan di localStorage
    const handleStorageChange = () => {
      loadProfileFromStorage()
    }
    
    window.addEventListener('localStorageUpdated', handleStorageChange)
    
    return () => {
      window.removeEventListener('localStorageUpdated', handleStorageChange)
    }
  }, [isLoggedIn, userEmail, navigate])

  const saveProfile = async () => {
    if (!userEmail) {
      alert('Email tidak ditemukan')
      return
    }
    
    try {
      setLoading(true)
      const response = await updateUserProfile({
        nama_lengkap: fullName,
        tgl_lahir: tglLahir,
        foto_profile: fotoProfile
      })
      
      if (response.success) {
      alert('Profile berhasil disimpan!')
        // Update foto profile URL if new photo was uploaded
        if (response.user && response.user.foto_profile_url) {
          setFotoProfileUrl(response.user.foto_profile_url)
          setFotoPreview(null)
          setFotoProfile(null)
        }
        
        // Trigger custom event untuk update foto profil di Layout
        window.dispatchEvent(new Event('localStorageUpdated'))
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          'Terjadi kesalahan saat menyimpan profile'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleFotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFotoProfile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const changePassword = () => {
    if (!newPassword || !confirmPassword) {
      alert('Harap isi semua field password')
      return
    }
    if (newPassword !== confirmPassword) {
      alert('Password tidak cocok')
      return
    }
    alert('Password berhasil diubah!')
    setNewPassword('')
    setConfirmPassword('')
  }

  const avatarInitial = userEmail ? userEmail.charAt(0).toUpperCase() : 'U'
  
  // Ambil foto dari localStorage (sama dengan navbar)
  const getFotoFromStorage = () => {
    const fotoBase64 = getFotoProfile(userEmail)
    if (fotoBase64) return fotoBase64
    const userData = getUserData(userEmail)
    if (userData && userData.foto_profile) {
      return userData.foto_profile
    }
    return null
  }
  
  // Prioritas: fotoPreview (yang baru dipilih) > fotoProfileUrl (state) > localStorage
  const displayPhoto = fotoPreview || fotoProfileUrl || getFotoFromStorage()

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            {displayPhoto ? (
              <div className="profile-avatar-large" style={{ padding: 0, overflow: 'hidden' }}>
                <img 
                  src={displayPhoto} 
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ) : (
            <div className="profile-avatar-large">{avatarInitial}</div>
            )}
            <div className="profile-info">
              <h1>{fullName || 'User Name'}</h1>
              <p>{email}</p>
            </div>
          </div>

          <div className="profile-section">
            <h2>Informasi Pribadi</h2>
            <div className="form-group">
              <label className="form-label">Foto Profile</label>
              <input 
                type="file" 
                className="form-input" 
                accept="image/*"
                onChange={handleFotoChange}
                style={{ padding: '8px' }}
                disabled={loading}
              />
              {displayPhoto && (
                <div style={{ marginTop: '12px' }}>
                  <img 
                    src={displayPhoto} 
                    alt="Preview" 
                    style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ddd' }}
                  />
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Masukkan nama lengkap"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Lahir</label>
              <input 
                type="date" 
                className="form-input" 
                placeholder="Masukkan tanggal lahir"
                value={tglLahir || ''}
                onChange={(e) => setTglLahir(e.target.value)}
              />
              {tglLahir && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                  Tanggal lahir: {new Date(tglLahir).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
              )}
            </div>
            <button className="btn-primary" onClick={saveProfile} disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>

          <div className="profile-section">
            <h2>Keamanan</h2>
            <div className="form-group">
              <label className="form-label">Password Baru</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Masukkan password baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Konfirmasi Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Konfirmasi password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button className="btn-primary" onClick={changePassword}>
              Ubah Password
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile

