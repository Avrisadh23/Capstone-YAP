import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { getLandingData } from '../services/api'
import './Landing.css'

const Landing = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('login')
  const [email, setEmail] = useState('')
  const [namaLengkap, setNamaLengkap] = useState('')
  const [tglLahir, setTglLahir] = useState('')
  const [fotoProfile, setFotoProfile] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(null)
  const [landingData, setLandingData] = useState(null)
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      const data = await getLandingData()
      setLandingData(data)
    }
    loadData()
  }, [])

  const handleNext = () => {
    if (!email.trim()) {
      alert('Harap masukkan email')
      return
    }
    login(email)
    navigate('/homepage')
  }

  const handleRegister = () => {
    if (!email.trim() || !namaLengkap.trim() || !tglLahir) {
      alert('Harap lengkapi semua field')
      return
    }
    // In production, this would call an API to register
    login(email)
    navigate('/homepage')
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

  const openModal = (type) => {
    setModalType(type)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEmail('')
    setNamaLengkap('')
    setTglLahir('')
    setFotoProfile(null)
    setFotoPreview(null)
  }

  const nextTestimonial = () => {
    if (landingData && landingData.testimonials) {
      setCurrentTestimonialIndex((prev) => 
        (prev + 1) % landingData.testimonials.length
      )
    }
  }

  const prevTestimonial = () => {
    if (landingData && landingData.testimonials) {
      setCurrentTestimonialIndex((prev) => 
        prev === 0 ? landingData.testimonials.length - 1 : prev - 1
      )
    }
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
              {landingData && landingData.appLinks && landingData.appLinks.map((link) => (
                <a key={link.id} className="badge" href={link.url} target="_blank" rel="noopener noreferrer">
                  <span className="icon">{link.icon === 'apple' ? '🍎' : '▶'}</span>
                  <span>
                    {link.badge_text && <div className="badge-text">{link.badge_text}</div>}
                    <div className="badge-label">{link.label}</div>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <div className="filters">
          {landingData && landingData.filters && landingData.filters.map((filter, index) => (
            <div key={index} className="filter-select" onClick={() => alert('Silakan login terlebih dahulu untuk menggunakan filter')}>
              <span className="filter-icon">{index === 2 ? '⚽' : '📍'}</span>
              <div className="filter-content">
                <div className="filter-label">{filter.label}</div>
                <div className="filter-value">{filter.placeholder}</div>
              </div>
              <span>⌄</span>
            </div>
          ))}
          <div className="filter-go" onClick={() => alert('Silakan login terlebih dahulu untuk menggunakan filter')}>
            Temukan →
          </div>
        </div>

        {landingData && landingData.features && landingData.features.map((feature, index) => (
          index === 0 ? (
            <section key={feature.id} className="section" id="kelola">
              <div className="section-content">
                <h2>{feature.title}</h2>
                <p>{feature.description}</p>
                {feature.link_url && (
                  <a className="link" href={feature.link_url} onClick={(e) => { e.preventDefault(); openModal('register'); }}>
                    {feature.link_text} →
                  </a>
                )}
              </div>
              <div className="showcases">
                {landingData.showcases && landingData.showcases.map((showcase) => (
                  <img key={showcase.id} src={showcase.image_url} alt={showcase.alt_text || 'Showcase'} />
                ))}
              </div>
            </section>
          ) : (
            <section key={feature.id} className="section" id="komunitas">
              <div className="app-card">
                <img className="phone" src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=320&q=80" alt="Mobile app" />
                <div>
                  <div className="section-tag">Ikuti komunitasmu</div>
                  <h2>{feature.title}</h2>
                  <p>{feature.description}</p>
                  <div className="stats">
                    <div>Lebih dari 100 komunitas terdaftar sebagai wadah komunitas.</div>
                    <div>Mencakup lebih dari seluruh wilayah di Indonesia.</div>
                  </div>
                </div>
              </div>
            </section>
          )
        ))}

        {landingData && landingData.testimonials && landingData.testimonials.length > 0 && (
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
                    {landingData.testimonials[currentTestimonialIndex] && (
                      <>
                        <div className="testimonial-user">
                          {landingData.testimonials[currentTestimonialIndex].avatar_url ? (
                            <img 
                              src={landingData.testimonials[currentTestimonialIndex].avatar_url} 
                              alt={landingData.testimonials[currentTestimonialIndex].name}
                              className="user-avatar"
                              style={{ borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="user-avatar"></div>
                          )}
                          <div>
                            <div className="user-name">{landingData.testimonials[currentTestimonialIndex].name}</div>
                            <div className="user-role">{landingData.testimonials[currentTestimonialIndex].role || ''}</div>
                          </div>
                        </div>
                        <div className="testimonial-quote">
                          <p>{landingData.testimonials[currentTestimonialIndex].quote}</p>
                        </div>
                      </>
                    )}
                    <div className="testimonial-tags">
                      <span>⭐ 4.9 Layanan</span>
                      <span>⭐ 4.8 Fitur</span>
                      <span>⭐ 4.7 Keamanan</span>
                    </div>
                  </div>
                </div>
                <div className="testimonial-pagination">
                  <button onClick={prevTestimonial}>←</button>
                  <span>
                    {String(currentTestimonialIndex + 1).padStart(2, '0')} / {String(Math.max(landingData.testimonials.length, 3)).padStart(2, '0')}
                  </span>
                  <button onClick={nextTestimonial}>→</button>
                </div>
                <div className="quote-icon-bottom">"</div>
              </div>
            </div>
          </section>
        )}

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
              <a href="#">Show Event</a>
              <a href="#">Join Event</a>
              <a href="#">Show Komunitas</a>
              <a href="#">Join Komunitas</a>
            </div>
            <div className="footer-section">
              <div className="footer-title">Hubungi Kami</div>
              <a href="#">Kontak</a>
            </div>
            <div className="footer-section">
              <div className="footer-title">Unduh Aplikasi</div>
              {landingData && landingData.appLinks && landingData.appLinks.map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.icon === 'apple' ? '🍎' : '▶️'}
                </a>
              ))}
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
                  type="email" 
                  className="modal-input" 
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                  type="text" 
                  className="modal-input" 
                  placeholder="Nama Lengkap"
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                />
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '6px' }}>Tanggal Lahir</label>
                  <input 
                    type="date" 
                    className="modal-input" 
                    value={tglLahir}
                    onChange={(e) => setTglLahir(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '6px' }}>Foto Profile</label>
                  <input 
                    type="file" 
                    className="modal-input" 
                    accept="image/*"
                    onChange={handleFotoChange}
                    style={{ padding: '8px' }}
                  />
                  {fotoPreview && (
                    <div style={{ marginTop: '8px' }}>
                      <img 
                        src={fotoPreview} 
                        alt="Preview" 
                        style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #ddd' }}
                      />
                    </div>
                  )}
                </div>
                <button className={`modal-button primary ${email.trim() && namaLengkap.trim() && tglLahir ? 'active' : ''}`} onClick={handleRegister}>
                  Daftar
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
                  type="email" 
                  className="modal-input" 
                  placeholder="Email"
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

