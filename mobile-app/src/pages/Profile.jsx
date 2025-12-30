import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
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
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
      return
    }
    setEmail(userEmail || '')
  }, [isLoggedIn, userEmail, navigate])

  const saveProfile = () => {
    if (fullName) {
      alert('Profile berhasil disimpan!')
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

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-avatar-large">{avatarInitial}</div>
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
              />
              {fotoPreview && (
                <div style={{ marginTop: '12px' }}>
                  <img 
                    src={fotoPreview} 
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
                value={tglLahir}
                onChange={(e) => setTglLahir(e.target.value)}
              />
            </div>
            <button className="btn-primary" onClick={saveProfile}>
              Simpan Perubahan
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

