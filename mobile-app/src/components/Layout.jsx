import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect, useRef } from 'react'
import { getUserProfile, getUserData, getFotoProfile } from '../services/api'
import './Layout.css'

const Layout = ({
  children,
  showBack = false,
  backUrl = '/',
  onLoginClick,
  onRegisterClick,
}) => {
  const { isLoggedIn, userEmail, logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [fotoProfileUrl, setFotoProfileUrl] = useState(null)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch foto profil saat user login
  useEffect(() => {
    const loadFotoProfile = async () => {
      if (isLoggedIn && userEmail) {
        try {
          // Cek localStorage terlebih dahulu
          const userData = getUserData(userEmail)
          const fotoBase64 = getFotoProfile(userEmail)
          
          if (fotoBase64) {
            setFotoProfileUrl(fotoBase64)
          } else if (userData && userData.foto_profile) {
            setFotoProfileUrl(userData.foto_profile)
          } else {
            // Jika tidak ada di localStorage, coba fetch dari API
            const response = await getUserProfile(userEmail)
            if (response.success && response.user && response.user.foto_profile_url) {
              setFotoProfileUrl(response.user.foto_profile_url)
            }
          }
        } catch (error) {
          console.error('Error loading profile photo:', error)
        }
      } else {
        setFotoProfileUrl(null)
      }
    }

    loadFotoProfile()

    // Listen untuk perubahan di localStorage (saat user update foto profil)
    const handleStorageChange = (e) => {
      if (e.key === 'fotoProfileBase64' || e.key === 'userData') {
        loadFotoProfile()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Juga listen untuk custom event (untuk same-tab updates)
    const handleCustomStorageChange = () => {
      loadFotoProfile()
    }
    
    window.addEventListener('localStorageUpdated', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('localStorageUpdated', handleCustomStorageChange)
    }
  }, [isLoggedIn, userEmail])

  const handleLogout = () => {
    logout()
    navigate('/')
    setShowMenu(false)
  }

  return (
    <div className="layout">
      <header className="header">
        <div className="header-left">
          {showBack ? (
            <Link to={backUrl} className="back-btn">← Kembali</Link>
          ) : (
            <Link to={isLoggedIn ? '/homepage' : '/'} className="logo">Y.A.P</Link>
          )}

          {isLoggedIn && !showBack && (
            <nav className="main-nav">
              <Link to="/homepage">Home</Link>
              <Link to="/communities">Komunitas</Link>
              <Link to="/events">Event</Link>
              <a href="#partner">Partner With Us</a>
            </nav>
          )}
        </div>

        {isLoggedIn ? (
          <div className="profile-dropdown" ref={menuRef}>
            <div 
              className="profile-avatar" 
              onClick={() => setShowMenu(!showMenu)}
            >
              {fotoProfileUrl ? (
                <img 
                  src={fotoProfileUrl} 
                  alt="Profile" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    borderRadius: '50%', 
                    objectFit: 'cover' 
                  }}
                />
              ) : (
                userEmail ? userEmail.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            {showMenu && (
              <div className="profile-menu">
                <Link to="/profile" onClick={() => setShowMenu(false)}>Profile</Link>
                <Link to="/member-card" onClick={() => setShowMenu(false)}>Kartu Anggota Digital</Link>
                <Link to="/events/myevent" onClick={() => setShowMenu(false)}>Event Saya</Link>
                <Link to="/communities/mycommunity" onClick={() => setShowMenu(false)}>Komunitas Saya</Link>
                <Link to="/events/manage/list" onClick={() => setShowMenu(false)}>Kelola Event</Link>
                <Link to="/communities/manage/list" onClick={() => setShowMenu(false)}>Kelola Komunitas</Link>
                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <button
              className="btn-login"
              onClick={() => {
                if (onLoginClick) {
                  onLoginClick()
                } else {
                  navigate('/')
                }
              }}
            >
              Masuk
            </button>
            <button
              className="btn-register"
              onClick={() => {
                if (onRegisterClick) {
                  onRegisterClick()
                } else {
                  navigate('/')
                }
              }}
            >
              Daftar
            </button>
          </div>
        )}
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default Layout

