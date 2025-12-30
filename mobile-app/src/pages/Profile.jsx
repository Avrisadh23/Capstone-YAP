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
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nomor Telepon</label>
              <input 
                type="tel" 
                className="form-input" 
                placeholder="Masukkan nomor telepon"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Kota</label>
              <select 
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">Pilih kota</option>
                <option value="Jakarta">Jakarta</option>
                <option value="Surabaya">Surabaya</option>
                <option value="Bandung">Bandung</option>
                <option value="Medan">Medan</option>
                <option value="Semarang">Semarang</option>
                <option value="Makassar">Makassar</option>
                <option value="Palembang">Palembang</option>
                <option value="Yogyakarta">Yogyakarta</option>
              </select>
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

