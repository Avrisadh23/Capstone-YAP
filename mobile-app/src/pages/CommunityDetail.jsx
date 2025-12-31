import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { getCommunity, joinCommunity, getCsrfToken, getUserData, getFotoProfile } from '../services/api'
import './EventDetail.css'

const CommunityDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn, userEmail } = useAuth()
  const [community, setCommunity] = useState(null)
  const [isJoined, setIsJoined] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joinData, setJoinData] = useState({
    user_email: userEmail || '',
    user_name: '',
    phone: '',
    notes: ''
  })
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState([]) // Daftar anggota komunitas
  const [isPengurus, setIsPengurus] = useState(false) // Apakah user adalah pengurus komunitas ini
  const [forumMessages, setForumMessages] = useState([]) // Daftar pesan forum
  const [forumInput, setForumInput] = useState('') // Input pesan forum
  const [forumFile, setForumFile] = useState(null) // File yang akan diupload
  const [forumFileName, setForumFileName] = useState('') // Nama file yang dipilih
  const [timeUpdate, setTimeUpdate] = useState(0) // Untuk trigger real-time update waktu

  // Fungsi helper untuk reload anggota (real-time)
  const reloadMembers = () => {
    const localCommunities = JSON.parse(localStorage.getItem('localCommunities') || '[]')
    const comm = localCommunities.find(c => {
      if (c.id === id) return true
      if (String(c.id) === String(id)) return true
      return false
    })
    
    if (comm) {
      const existingJoins = JSON.parse(localStorage.getItem('communityJoins') || '[]')
      const email = (userEmail || localStorage.getItem('userEmail') || '').toLowerCase().trim()
      const userData = getUserData(email) || {}
      const creatorEmail = comm.creator_email ? comm.creator_email.toLowerCase().trim() : ''
      const membersList = []
      
      // Tambahkan creator sebagai Pengurus (hanya sekali)
      if (creatorEmail) {
        membersList.push({
          user_email: comm.creator_email,
          user_name: creatorEmail === email ? (userData.nama_lengkap || comm.creator_email.split('@')[0]) : comm.creator_email.split('@')[0],
          role: 'Pengurus',
          joined_at: comm.created_at || new Date().toISOString()
        })
      }
      
      // Tambahkan anggota yang sudah join (tidak termasuk creator)
      const joinedMembers = existingJoins.filter(j => {
        const joinCommId = j.community_id
        const joinEmail = (j.user_email || '').toLowerCase().trim()
        // Filter: harus match community_id DAN bukan creator
        return (joinCommId === id || String(joinCommId) === String(id)) && joinEmail !== creatorEmail
      })
      
      joinedMembers.forEach(j => {
        membersList.push({
          user_email: j.user_email,
          user_name: j.user_name || j.user_email.split('@')[0],
          role: j.role || 'Anggota',
          joined_at: j.joined_at || new Date().toISOString()
        })
      })
      
      // Update members list
      setMembers(membersList)
      
      // Update members_count real-time dari jumlah anggota yang sebenarnya
      const realMembersCount = membersList.length
      
      // Update di state community
      if (community) {
        setCommunity({
          ...community,
          members_count: realMembersCount
        })
      }
      
      // Update di localStorage juga
      const commIndex = localCommunities.findIndex(c => {
        if (c.id === id) return true
        if (String(c.id) === String(id)) return true
        return false
      })
      
      if (commIndex !== -1) {
        localCommunities[commIndex].members_count = realMembersCount
        localStorage.setItem('localCommunities', JSON.stringify(localCommunities))
      }
    }
  }

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
      return
    }

    const loadCommunity = async () => {
      try {
        console.log('Loading community with ID:', id)
        // Cek apakah ini komunitas dari localStorage - cari berdasarkan ID
        const localCommunities = JSON.parse(localStorage.getItem('localCommunities') || '[]')
        console.log('Local communities:', localCommunities.map(c => ({ id: c.id, name: c.name, creator: c.creator_email })))
        
        const comm = localCommunities.find(c => {
          // Match exact ID
          if (c.id === id) return true
          // Match jika ID adalah string number dan komunitas punya id number
          if (String(c.id) === String(id)) return true
          return false
        })
        
        console.log('Found community:', comm ? { id: comm.id, name: comm.name, creator: comm.creator_email } : 'NOT FOUND')
        
        if (comm) {
          // Set community data awal
          setCommunity({
            id: id,
            name: comm.name,
            description: comm.description,
            location: comm.location,
            image_url: comm.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
            category: comm.category,
            members_count: 1, // Akan di-update oleh reloadMembers
            contact: comm.contact || '',
            rules: comm.rules || ''
          })
          
          // Load daftar anggota komunitas (real-time)
          reloadMembers()
          
          // Cek apakah user sudah join atau adalah creator
          const email = (userEmail || localStorage.getItem('userEmail') || '').toLowerCase().trim()
          const creatorEmail = comm.creator_email ? comm.creator_email.toLowerCase().trim() : ''
          const existingJoins = JSON.parse(localStorage.getItem('communityJoins') || '[]')
          
          if (email && creatorEmail) {
            console.log('Comparing emails - User:', email, 'Creator:', creatorEmail, 'Match:', creatorEmail === email)
            if (creatorEmail === email) {
              console.log('User is creator - setting isJoined to true and isPengurus to true')
              setIsJoined(true)
              setIsPengurus(true)
            } else {
              // Cek apakah user sudah join
              const joined = existingJoins.some(
                j => {
                  const joinEmail = (j.user_email || '').toLowerCase().trim()
                  const joinCommId = j.community_id
                  return (joinCommId === id || String(joinCommId) === String(id)) && joinEmail === email
                }
              )
              console.log('User is not creator, checking join records - Joined:', joined)
              setIsJoined(joined)
              
              // Cek apakah user adalah pengurus dari join records
              const isPengurusFromJoin = existingJoins.some(
                j => {
                  const joinEmail = (j.user_email || '').toLowerCase().trim()
                  const joinCommId = j.community_id
                  const joinRole = (j.role || '').toLowerCase()
                  return (joinCommId === id || String(joinCommId) === String(id)) && 
                         joinEmail === email && 
                         (joinRole === 'pengurus' || joinRole === 'Pengurus')
                }
              )
              setIsPengurus(isPengurusFromJoin)
            }
          } else {
            console.log('Email or creator_email missing - email:', email, 'creator_email:', comm.creator_email)
          }
          
          setLoading(false)
          return
        }

        // Jika tidak ada di localStorage, coba ambil dari API
        try {
          const response = await getCommunity(id)
          if (response && response.community) {
            setCommunity(response.community)
          } else if (response) {
            setCommunity(response)
          } else {
            // Jika tidak ada di API juga, tampilkan error atau redirect
            console.warn('Community not found in API, redirecting...')
            alert('Komunitas tidak ditemukan')
            navigate('/communities')
          }
        } catch (error) {
          console.warn('Error fetching community from API:', error)
          // Jika error dan tidak ada di localStorage, redirect ke daftar komunitas
          alert('Komunitas tidak ditemukan')
          navigate('/communities')
        }
      } catch (error) {
        console.error('Error loading community:', error)
        alert('Terjadi kesalahan saat memuat komunitas')
        navigate('/communities')
      } finally {
        setLoading(false)
      }
    }

    loadCommunity()
    
    // Load forum messages
    const loadForumMessages = () => {
      try {
        const allMessages = JSON.parse(localStorage.getItem('communityForumMessages') || '[]')
        const communityMessages = allMessages.filter(msg => 
          msg.community_id === id || String(msg.community_id) === String(id)
        )
        // Sort by date (newest first)
        communityMessages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        setForumMessages(communityMessages)
      } catch (error) {
        console.error('Error loading forum messages:', error)
        setForumMessages([])
      }
    }
    
    loadForumMessages()
    
    // Listen untuk update forum messages
    const handleForumUpdate = () => {
      loadForumMessages()
    }
    
    window.addEventListener('forumMessageAdded', handleForumUpdate)
    
    // Real-time update untuk waktu (update setiap menit)
    const timeUpdateInterval = setInterval(() => {
      // Force re-render untuk update waktu
      setTimeUpdate(prev => prev + 1)
    }, 60000) // Update setiap 1 menit
    
    // Listen untuk perubahan join (untuk update setelah join)
    const handleJoinUpdate = () => {
      const email = (userEmail || localStorage.getItem('userEmail') || '').toLowerCase().trim()
      if (!email) return
      
      // Cek apakah user adalah creator komunitas ini
      const localCommunities = JSON.parse(localStorage.getItem('localCommunities') || '[]')
      const comm = localCommunities.find(c => {
        if (c.id === id) return true
        if (String(c.id) === String(id)) return true
        return false
      })
      
      if (comm && comm.creator_email) {
        const creatorEmail = comm.creator_email.toLowerCase().trim()
        if (creatorEmail === email) {
          setIsJoined(true)
          // Reload anggota saat update
          reloadMembers()
          return
        }
      }
      
      // Cek apakah user sudah join
      const existingJoins = JSON.parse(localStorage.getItem('communityJoins') || '[]')
      const joined = existingJoins.some(
        j => {
          const joinEmail = (j.user_email || '').toLowerCase().trim()
          const joinCommId = j.community_id
          return (joinCommId === id || String(joinCommId) === String(id)) && joinEmail === email
        }
      )
      setIsJoined(joined)
      
      // Reload anggota saat update
      reloadMembers()
    }
    
    window.addEventListener('communityJoined', handleJoinUpdate)
    window.addEventListener('localStorageUpdated', handleJoinUpdate)

    return () => {
      clearInterval(timeUpdateInterval)
      window.removeEventListener('forumMessageAdded', handleForumUpdate)
      window.removeEventListener('communityJoined', handleJoinUpdate)
      window.removeEventListener('localStorageUpdated', handleJoinUpdate)
    }
  }, [id, isLoggedIn, navigate, userEmail])

  const handleJoin = async () => {
    if (!joinData.user_email) {
      alert('Email harus diisi')
      return
    }
    
    // Simpan ke localStorage terlebih dahulu
    const joinRecord = {
      community_id: id,
      user_email: joinData.user_email,
      user_name: joinData.user_name || joinData.user_email.split('@')[0],
      phone: joinData.phone || '',
      notes: joinData.notes || '',
      role: 'Anggota', // Set role sebagai Anggota untuk yang join
      joined_at: new Date().toISOString()
    }
    
    const existingJoins = JSON.parse(localStorage.getItem('communityJoins') || '[]')
    // Cek apakah sudah join
    const alreadyJoined = existingJoins.some(
      j => {
        const joinEmail = (j.user_email || '').toLowerCase().trim()
        const joinCommId = j.community_id
        return (joinCommId === id || String(joinCommId) === String(id)) && joinEmail === joinData.user_email.toLowerCase().trim()
      }
    )
    
    if (alreadyJoined) {
      alert('Anda sudah bergabung dengan komunitas ini!')
      setIsJoined(true)
      setShowJoinModal(false)
      reloadMembers()
      return
    }
    
    existingJoins.push(joinRecord)
    localStorage.setItem('communityJoins', JSON.stringify(existingJoins))
    
    // Members count akan di-update oleh reloadMembers() secara real-time
    
    try {
      // Coba kirim ke backend
      try {
        await joinCommunity(id, joinData)
      } catch (backendError) {
        console.warn('Backend error, but join saved to localStorage:', backendError)
      }
      
      alert('Berhasil bergabung dengan komunitas!')
      setIsJoined(true)
      setShowJoinModal(false)
      
      // Reload daftar anggota (akan update members_count secara real-time)
      reloadMembers()
      
      // Trigger event untuk update daftar komunitas
      window.dispatchEvent(new Event('communityJoined'))
    } catch (error) {
      // Jika error, tetap anggap berhasil karena sudah di localStorage
      alert('Berhasil bergabung dengan komunitas! (Data tersimpan lokal)')
      setIsJoined(true)
      setShowJoinModal(false)
      
      // Reload daftar anggota (akan update members_count secara real-time)
      reloadMembers()
      
      // Trigger event untuk update daftar komunitas
      window.dispatchEvent(new Event('communityJoined'))
    }
  }

  // Tentukan backUrl berdasarkan dari mana user datang
  const getBackUrl = () => {
    // Cek apakah ada state dari navigasi sebelumnya
    if (location.state && location.state.from === 'mycommunities') {
      return '/communities/mycommunity'
    }
    if (location.state && location.state.from === 'homepage') {
      return '/homepage'
    }
    // Default ke daftar komunitas
    return '/communities'
  }

  const backUrl = getBackUrl()

  // Handle file upload
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForumFile(file)
      setForumFileName(file.name)
    }
  }

  // Handle kirim pesan forum
  const handleSendForumMessage = () => {
    if (!forumInput.trim() && !forumFile) {
      alert('Silakan tulis pesan atau pilih file')
      return
    }

    if (!isJoined) {
      alert('Anda harus bergabung dengan komunitas terlebih dahulu untuk berpartisipasi di forum')
      return
    }

    const email = userEmail || localStorage.getItem('userEmail') || ''
    const userData = getUserData(email) || {}
    const userName = userData.nama_lengkap || email.split('@')[0] || 'User'
    const messageText = forumInput.trim()
    const currentFile = forumFile

    // Function to save message
    const saveMessage = (fileData) => {
      const message = {
        id: `forum-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        community_id: id,
        user_email: email,
        user_name: userName,
        message: messageText,
        file: fileData,
        created_at: new Date().toISOString()
      }

      const allMessages = JSON.parse(localStorage.getItem('communityForumMessages') || '[]')
      allMessages.push(message)
      localStorage.setItem('communityForumMessages', JSON.stringify(allMessages))

      // Update state
      setForumMessages(prev => [message, ...prev])
      setForumInput('')
      setForumFile(null)
      setForumFileName('')
      
      // Reset file input
      const fileInput = document.getElementById('forum-file-input')
      if (fileInput) fileInput.value = ''

      // Trigger event untuk update real-time
      window.dispatchEvent(new Event('forumMessageAdded'))
    }

    // Convert file to base64 if exists
    if (currentFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const fileData = {
          name: currentFile.name,
          type: currentFile.type,
          size: currentFile.size,
          data: reader.result // base64
        }
        saveMessage(fileData)
      }
      reader.onerror = () => {
        alert('Gagal membaca file. Silakan coba lagi.')
      }
      reader.readAsDataURL(currentFile)
    } else {
      saveMessage(null)
    }
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  // Format date dengan real-time update (menggunakan timeUpdate untuk trigger re-render)
  const formatForumDate = (dateString) => {
    // Gunakan timeUpdate untuk trigger re-render
    const _ = timeUpdate
    
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    if (minutes < 1) return 'Baru saja'
    if (minutes < 60) return `${minutes} menit yang lalu`
    if (hours < 24) return `${hours} jam yang lalu`
    if (days === 1) return '1 hari yang lalu'
    if (days < 7) return `${days} hari yang lalu`
    if (weeks === 1) return '1 minggu yang lalu'
    if (weeks < 4) return `${weeks} minggu yang lalu`
    if (months === 1) return '1 bulan yang lalu'
    if (months < 12) return `${months} bulan yang lalu`
    if (years === 1) return '1 tahun yang lalu'
    if (years > 1) return `${years} tahun yang lalu`
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  // Download file
  const handleDownloadFile = (file) => {
    if (file && file.data) {
      const link = document.createElement('a')
      link.href = file.data
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (loading || !community) {
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
            <h1 className="detail-title">{community.name}</h1>
            <div className="detail-meta">
              <span>📍 {community.location}</span>
              <span>🏷️ {community.category}</span>
              <span>👥 {community.members_count} anggota</span>
            </div>
          </div>

          {community.image_url && (
            <img src={community.image_url} alt={community.name} className="detail-image" />
          )}

          <div className="detail-content">
            <div className="detail-main">
              <div className="detail-section">
                <h3>Deskripsi</h3>
                <p>{community.description || 'Tidak ada deskripsi'}</p>
              </div>
              {community.rules && (
                <div className="detail-section">
                  <h3>Aturan Komunitas</h3>
                  <p style={{ whiteSpace: 'pre-line' }}>{community.rules}</p>
                </div>
              )}
              
              {isJoined && members.length > 0 && (
                <div className="detail-section">
                  <h3>Anggota Komunitas</h3>
                  <div className="members-list">
                    {members.map((member, index) => (
                      <div key={index} className="member-item">
                        <div className="member-info">
                          <div className="member-name">{member.user_name || member.user_email.split('@')[0]}</div>
                          <div className="member-role-badge" style={{
                            background: (member.role && member.role.toLowerCase() === 'pengurus') ? '#003087' : '#e0e0e0',
                            color: (member.role && member.role.toLowerCase() === 'pengurus') ? '#fff' : '#666'
                          }}>
                            {member.role || 'Anggota'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="detail-sidebar">
              <div className="info-box">
                <div className="info-box-item">
                  <span>Lokasi</span>
                  <strong>{community.location}</strong>
                </div>
                <div className="info-box-item">
                  <span>Kategori</span>
                  <strong>{community.category}</strong>
                </div>
                <div className="info-box-item">
                  <span>Anggota</span>
                  <strong>{community.members_count}</strong>
                </div>
                {community.contact && (
                  <div className="info-box-item">
                    <span>Kontak</span>
                    <strong>{community.contact}</strong>
                  </div>
                )}
              </div>
              {isJoined ? (
                isPengurus ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button 
                      className="btn-primary" 
                      onClick={() => navigate(`/communities/${id}/edit`)}
                    >
                      ✏️ Edit Komunitas
                    </button>
                    <button 
                      className="btn-secondary" 
                      onClick={async () => {
                        if (confirm('Yakin ingin menghapus komunitas ini?')) {
                          try {
                            // Ambil CSRF token
                            const csrfToken = await getCsrfToken()
                            const formData = new FormData()
                            if (csrfToken) {
                              formData.append('_token', csrfToken)
                            }
                            
                            const response = await fetch(`/api/communities/${id}`, {
                              method: 'DELETE',
                              body: formData,
                              credentials: 'include',
                              headers: {
                                'X-XSRF-TOKEN': csrfToken || '',
                                'X-Requested-With': 'XMLHttpRequest',
                              }
                            })
                            
                            if (response.ok || response.status === 302) {
                              alert('Komunitas berhasil dihapus!')
                              navigate('/communities')
                            } else {
                              throw new Error('Gagal menghapus komunitas')
                            }
                          } catch (error) {
                            console.error('Error deleting community:', error)
                            alert('Gagal menghapus komunitas: ' + (error.message || 'Unknown error'))
                          }
                        }
                      }}
                    >
                      🗑️ Hapus Komunitas
                    </button>
                  </div>
                ) : (
                  <button className="btn-secondary" disabled>Sudah Bergabung</button>
                )
              ) : (
                <button className="btn-primary" onClick={() => setShowJoinModal(true)}>
                  Join Komunitas
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Forum Diskusi */}
        {isJoined && (
          <div className="forum-section">
            <h2 className="forum-title">Forum Diskusi</h2>
            
            {/* Input Area */}
            <div className="forum-input-container">
              <div className="forum-input-header">
                <div className="forum-user-info">
                  {(() => {
                    const email = userEmail || localStorage.getItem('userEmail') || ''
                    const fotoProfile = getFotoProfile(email)
                    const userData = getUserData(email) || {}
                    return fotoProfile ? (
                      <img 
                        src={fotoProfile} 
                        alt="Profile" 
                        className="forum-user-avatar"
                      />
                    ) : (
                      <span className="forum-user-icon">👤</span>
                    )
                  })()}
                  <span className="forum-user-name">
                    {(() => {
                      const email = userEmail || localStorage.getItem('userEmail') || ''
                      const userData = getUserData(email) || {}
                      return userData.nama_lengkap || email.split('@')[0] || 'User'
                    })()}
                  </span>
                </div>
              </div>
              <div className="forum-input-row">
                <label htmlFor="forum-file-input" className="forum-file-button">
                  <span className="forum-plus-icon">+</span>
                  <input
                    id="forum-file-input"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                    accept="image/*"
                  />
                </label>
                <textarea
                  className="forum-input"
                  placeholder="Tulis sesuatu dalam forum ini"
                  value={forumInput}
                  onChange={(e) => setForumInput(e.target.value)}
                  rows="3"
                />
              </div>
              {forumFile && (
                <div className="forum-file-preview">
                  {forumFile.type && forumFile.type.startsWith('image/') ? (
                    <>
                      <img 
                        src={URL.createObjectURL(forumFile)} 
                        alt="Preview" 
                        style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <span className="forum-file-name" style={{ flex: 1, marginLeft: '12px' }}>{forumFileName}</span>
                    </>
                  ) : (
                    <span className="forum-file-name">📎 {forumFileName}</span>
                  )}
                  <button 
                    className="forum-file-remove"
                    onClick={() => {
                      setForumFile(null)
                      setForumFileName('')
                      const fileInput = document.getElementById('forum-file-input')
                      if (fileInput) fileInput.value = ''
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
              <button 
                className="forum-send-button"
                onClick={handleSendForumMessage}
                disabled={!forumInput.trim() && !forumFile}
              >
                Kirim
              </button>
            </div>

            {/* Messages List */}
            <div className="forum-messages">
              {forumMessages.length === 0 ? (
                <div className="forum-empty">
                  <p>Belum ada diskusi. Mulai diskusi pertama!</p>
                </div>
              ) : (
                forumMessages.map((msg) => (
                  <div key={msg.id} className="forum-message">
                    <div className="forum-message-header">
                      <div className="forum-message-user">
                        {(() => {
                          // Cek apakah user ini punya foto profile di localStorage
                          const msgEmail = msg.user_email || ''
                          const fotoProfile = getFotoProfile(msgEmail)
                          if (fotoProfile) {
                            return <img src={fotoProfile} alt="Profile" className="forum-message-avatar" />
                          }
                          // Cek dari userData
                          const userData = getUserData(msgEmail)
                          if (userData && userData.foto_profile) {
                            return <img src={userData.foto_profile} alt="Profile" className="forum-message-avatar" />
                          }
                          // Gunakan icon default
                          return <span className="forum-message-icon">👤</span>
                        })()}
                        <div className="forum-message-user-info">
                          <div className="forum-message-name">{msg.user_name || msg.user_email.split('@')[0]}</div>
                          <div className="forum-message-time">{formatForumDate(msg.created_at)}</div>
                        </div>
                      </div>
                    </div>
                    {msg.file && msg.file.type && msg.file.type.startsWith('image/') && (
                      <div className="forum-message-image-container">
                        <img 
                          src={msg.file.data} 
                          alt={msg.file.name || 'Uploaded image'} 
                          className="forum-message-image"
                        />
                      </div>
                    )}
                    {msg.message && (
                      <div className="forum-message-text">{msg.message}</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowJoinModal(false)}>×</button>
            <h2 style={{ marginBottom: '24px' }}>Join Komunitas</h2>
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

export default CommunityDetail

