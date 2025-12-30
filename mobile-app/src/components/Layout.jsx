import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect, useRef } from 'react'
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
            <Link to={isLoggedIn ? '/homepage' : '/'} className="logo">Y.G.A</Link>
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
              {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
            </div>
            {showMenu && (
              <div className="profile-menu">
                <Link to="/profile" onClick={() => setShowMenu(false)}>Profile</Link>
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

