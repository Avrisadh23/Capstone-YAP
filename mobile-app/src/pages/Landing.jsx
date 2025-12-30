import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import './Landing.css'

const Landing = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('login')
  const [email, setEmail] = useState('')

  const handleNext = () => {
    if (!email.trim()) {
      alert('Harap masukkan nomor ponsel atau email')
      return
    }
    login(email)
    navigate('/homepage')
  }

  const openModal = (type) => {
    setModalType(type)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEmail('')
  }

  return (
    <Layout
      onLoginClick={() => openModal('login')}
      onRegisterClick={() => openModal('register')}
    >
      <div className="landing-page">
        <section className="hero">
          <div className="hero-content">
            <h1>Support Your Community App</h1>
            <p>Platform all-in-one untuk cari Komunitas, atau cari wadah untuk membersamai. Relasi makin luas dan menyenangkan!</p>
            
            <div className="cta-buttons">
              <a className="badge" href="#" target="_blank">
                <span className="icon">🍎</span>
                <span>
                  <div className="badge-text">Download on the</div>
                  <div className="badge-label">App Store</div>
                </span>
              </a>
              <a className="badge" href="#" target="_blank">
                <span className="icon">▶</span>
                <span>
                  <div className="badge-text">GET IT ON</div>
                  <div className="badge-label">Google Play</div>
                </span>
              </a>
            </div>
          </div>
        </section>

        <div className="filters">
          <div className="filter-select" onClick={() => alert('Silakan login terlebih dahulu untuk menggunakan filter')}>
            <span className="filter-icon">📍</span>
            <div className="filter-content">
              <div className="filter-label">Aktivitas</div>
              <div className="filter-value">Pilih aktivitas</div>
            </div>
            <span>⌄</span>
          </div>
          <div className="filter-select" onClick={() => alert('Silakan login terlebih dahulu untuk menggunakan filter')}>
            <span className="filter-icon">📍</span>
            <div className="filter-content">
              <div className="filter-label">Lokasi</div>
              <div className="filter-value">Pilih kota</div>
            </div>
            <span>⌄</span>
          </div>
          <div className="filter-select" onClick={() => alert('Silakan login terlebih dahulu untuk menggunakan filter')}>
            <span className="filter-icon">⚽</span>
            <div className="filter-content">
              <div className="filter-label">Cabang Korwil</div>
              <div className="filter-value">Pilih Cabang Korwil</div>
            </div>
            <span>⌄</span>
          </div>
          <div className="filter-go" onClick={() => alert('Silakan login terlebih dahulu untuk menggunakan filter')}>
            Temukan →
          </div>
        </div>

        <section className="section">
          <div className="section-content">
            <h2>Kelola Komunitas dengan Mudah</h2>
            <p>Platform yang memudahkan Anda untuk mengelola komunitas, mengatur event, dan berinteraksi dengan anggota.</p>
            <a className="link" href="#" onClick={(e) => { e.preventDefault(); openModal('register'); }}>
              Mulai Sekarang →
            </a>
          </div>
          <div className="showcases">
            <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=400&q=80" alt="Showcase 1" />
            <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80" alt="Showcase 2" />
            <img src="https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=400&q=80" alt="Showcase 3" />
          </div>
        </section>

        <section className="section">
          <div className="app-card">
            <img className="phone" src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=320&q=80" alt="Mobile app" />
            <div>
              <div className="section-tag">Ikuti komunitasmu</div>
              <h2>Jelajahi Komunitas</h2>
              <p>Temukan komunitas yang sesuai dengan minat dan hobi Anda. Bergabunglah dengan ribuan anggota lainnya.</p>
              <div className="stats">
                <div>Lebih dari 100 komunitas terdaftar sebagai wadah komunitas.</div>
                <div>Mencakup lebih dari seluruh wilayah di Indonesia.</div>
              </div>
            </div>
          </div>
        </section>

        <section className="testimonial-section">
          <div className="testimonial-card">
            <div className="testimonial-header">
              <div className="testimonial-title">Apa kata mereka?</div>
            </div>
            <div className="testimonial-content">
              <div className="quote-icon">"</div>
              <div className="testimonial-rating">
                <div className="rating-box">
                  <div className="rating-score">4.8</div>
                  <div className="rating-label">dari 5.0</div>
                  <div className="rating-stars">★★★★★</div>
                  <div className="rating-users">2.341 pengguna</div>
                </div>
                <div className="testimonial-details">
                  <div className="testimonial-user">
                    <div className="user-avatar"></div>
                    <div>
                      <div className="user-name">John Doe</div>
                      <div className="user-role">Community Manager</div>
                    </div>
                  </div>
                  <div className="testimonial-quote">
                    Platform yang sangat membantu untuk mengelola komunitas kami. Fitur-fiturnya lengkap dan mudah digunakan.
                  </div>
                  <div className="testimonial-tags">
                    <span>⭐ 4.9 Layanan</span>
                    <span>⭐ 4.8 Fitur</span>
                    <span>⭐ 4.7 Keamanan</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-pagination">
                <button>←</button>
                <span>01 / 03</span>
                <button>→</button>
              </div>
              <div className="quote-icon-bottom">"</div>
            </div>
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
              <div className="footer-social">
                <a href="#">🌐</a>
                <a href="#">📘</a>
                <a href="#">🐦</a>
                <a href="#">💼</a>
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
              <a href="#">Sparring</a>
              <a href="#">Match Berbagi</a>
              <a href="#">Direktori Tim</a>
              <a href="#">Direktori Lapangan</a>
            </div>
            <div className="footer-section">
              <div className="footer-title">Hubungi Kami</div>
              <a href="#">Kontak</a>
            </div>
            <div className="footer-section">
              <div className="footer-title">Unduh Aplikasi</div>
              <a href="#">🍎</a>
              <a href="#">▶️</a>
            </div>
          </div>
          <div className="footer-bottom">
            <div>© 2025 YGA Indonesia. All Rights Reserved.</div>
            <select>
              <option>Bahasa Indonesia</option>
              <option>English</option>
            </select>
          </div>
        </footer>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            {modalType === 'register' ? (
              <>
                <h2 className="modal-title">Daftar</h2>
                <div className="modal-switch">
                  Sudah punya akun Y.G.A? <a href="#" onClick={(e) => { e.preventDefault(); setModalType('login'); }}>Masuk</a>
                </div>
                <input 
                  type="text" 
                  className="modal-input" 
                  placeholder="Nomor Ponsel atau Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className={`modal-button primary ${email.trim() ? 'active' : ''}`} onClick={handleNext}>
                  Selanjutnya
                </button>
                <div className="modal-separator">atau</div>
                <button className="modal-button google" onClick={() => console.log('Register dengan Google')}>
                  <span className="google-icon">G</span>
                  <span>Daftar dengan Google</span>
                </button>
              </>
            ) : (
              <>
                <h2 className="modal-title">Masuk</h2>
                <div className="modal-switch">
                  Belum punya akun? <a href="#" onClick={(e) => { e.preventDefault(); setModalType('register'); }}>Daftar</a>
                </div>
                <input 
                  type="text" 
                  className="modal-input" 
                  placeholder="Nomor Ponsel atau Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className={`modal-button primary ${email.trim() ? 'active' : ''}`} onClick={handleNext}>
                  Selanjutnya
                </button>
                <div className="modal-separator">atau</div>
                <button className="modal-button google" onClick={() => console.log('Login dengan Google')}>
                  <span className="google-icon">G</span>
                  <span>Masuk dengan Google</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Landing

