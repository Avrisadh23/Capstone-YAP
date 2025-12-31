<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Y.A.P - Homepage</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --blue: #003087;
            --red: #ff3b30;
            --text: #1b1b1b;
            --gray: #5c6574;
            --light: #f6f7fb;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: var(--text); background: #f4f4f4; }
        a { color: inherit; text-decoration: none; }
        .page { max-width: 1200px; margin: 0 auto; background: #fff; }
        header { display: flex; align-items: center; justify-content: space-between; padding: 18px 36px; font-size: 13px; color: #7d7d7d; }
        header nav a { margin-right: 16px; }
        .logo { font-weight: 700; color: var(--blue); font-size: 18px; letter-spacing: 0.5px; }
        .filters { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; background: #003087; color: #fff; padding: 10px 14px; border-radius: 8px; width: calc(100% - 80px); margin: 0 40px 30px; align-items: center; font-size: 12px; }
        .filters .select { background: rgba(255,255,255,0.1); padding: 10px 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; gap: 8px; cursor: pointer; position: relative; }
        .filters .select:hover { background: rgba(255,255,255,0.15); }
        .filters .select select { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
        .filters .go { background: #063a93; padding: 10px 16px; border-radius: 6px; text-align: center; cursor: pointer; }
        .filters .go:hover { background: #052d7a; }
        .section { padding: 60px 40px; }
        .section h2 { font-size: 22px; margin-bottom: 8px; color: #0f1218; }
        .section-title { font-size: 28px; font-weight: 700; margin-bottom: 24px; color: #0f1218; }
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; margin-top: 24px; }
        .card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
        .card-image { width: 100%; height: 180px; object-fit: cover; }
        .card-content { padding: 16px; }
        .card-title { font-size: 16px; font-weight: 700; margin-bottom: 8px; color: #000; }
        .card-description { font-size: 13px; color: var(--gray); margin-bottom: 12px; line-height: 1.5; }
        .card-meta { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--gray); }
        .card-badge { display: inline-block; padding: 4px 8px; background: var(--light); border-radius: 4px; font-size: 11px; font-weight: 600; color: var(--blue); }
        .profile-dropdown { position: relative; }
        .profile-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--blue); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; cursor: pointer; }
        .profile-menu { display: none; position: absolute; top: 100%; right: 0; margin-top: 8px; background: #fff; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.15); min-width: 180px; z-index: 100; }
        .profile-menu.active { display: block; }
        .profile-menu a { display: block; padding: 12px 16px; font-size: 14px; color: #333; transition: background 0.2s; }
        .profile-menu a:hover { background: #f5f5f5; }
        .profile-menu a:first-child { border-radius: 8px 8px 0 0; }
        .profile-menu a:last-child { border-radius: 0 0 8px 8px; }
        footer { padding: 50px 40px 30px; background: #fff; border-top: 1px solid #f0f0f0; color: #777; font-size: 12px; }
        .footer-grid { display: grid; grid-template-columns: 1.4fr repeat(4, 1fr); gap: 30px; }
        .footer-title { color: #000; font-weight: 700; margin-bottom: 14px; font-size: 14px; }
        .footer-col a { display: block; margin-bottom: 10px; }
        @media (max-width: 1024px) {
            .cards-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
            .filters { grid-template-columns: 1fr; width: calc(100% - 40px); margin: 0 20px 30px; }
            .section { padding: 40px 24px; }
            header { padding: 18px 24px; }
        }
    </style>
</head>
<body>
<div class="page">
    <header>
        <div class="logo"><a href="/homepage">Y.A.P</a></div>
        <nav>
            <a href="/homepage">Home</a>
            <a href="/communities">Komunitas</a>
            <a href="/events">Event</a>
            <a href="#partner">Partner With Us</a>
        </nav>
        <div class="profile-dropdown">
            @if(isset($user) && $user && $user->foto_profile)
                <img src="{{ asset('storage/' . $user->foto_profile) }}" alt="Profile" class="profile-avatar" id="profileAvatar" onclick="toggleProfileMenu()" style="object-fit: cover; cursor: pointer;">
            @else
                <div class="profile-avatar" id="profileAvatar" onclick="toggleProfileMenu()">U</div>
            @endif
            <div class="profile-menu" id="profileMenu">
                <a href="/profile">Profile</a>
                <a href="/member-card">Kartu Anggota Digital</a>
                <a href="/events/myevent">Event Saya</a>
                <a href="/communities/mycommunity">Komunitas Saya</a>
                <a href="/events/manage/list">Kelola Event</a>
                <a href="/communities/manage/list">Kelola Komunitas</a>
                <a href="#" onclick="logout(); return false;">Logout</a>
            </div>
        </div>
    </header>

    @if(session('success'))
        <div style="background: #efe; border: 1px solid #cfc; color: #3c3; padding: 12px 16px; margin: 20px 40px; border-radius: 8px; font-size: 14px; display: flex; align-items: center; justify-content: space-between;">
            <span>{{ session('success') }}</span>
            <button onclick="this.parentElement.style.display='none'" style="background: none; border: none; color: #3c3; font-size: 18px; cursor: pointer; padding: 0 8px;">×</button>
        </div>
    @endif

    <div class="filters">
        <div class="select">
            <span style="color: #ff3b30; font-size: 14px; margin-right: 8px;">📍</span>
            <div style="flex: 1;">
                <div style="opacity:.6; font-size:11px;">{{ $filters[0]['label'] }}</div>
                <div style="font-weight:600;" id="aktivitasText">{{ $filters[0]['placeholder'] }}</div>
            </div>
            <span>⌄</span>
            <select onchange="updateFilter('aktivitas', this.value); applyFilters();">
                <option value="">Pilih aktivitas</option>
                <option value="Hobi">Hobi</option>
                <option value="Olahraga">Olahraga</option>
                <option value="Workshop">Workshop</option>
                <option value="Gaming">Gaming</option>
            </select>
        </div>
        <div class="select">
            <span style="color: #ff3b30; font-size: 14px; margin-right: 8px;">📍</span>
            <div style="flex: 1;">
                <div style="opacity:.6; font-size:11px;">{{ $filters[1]['label'] }}</div>
                <div style="font-weight:600;" id="kotaText">{{ $filters[1]['placeholder'] }}</div>
            </div>
            <span>⌄</span>
            <select onchange="updateFilter('kota', this.value); applyFilters();">
                <option value="">Pilih kota</option>
                <option value="Jakarta">Jakarta</option>
                <option value="Surabaya">Surabaya</option>
                <option value="Bandung">Bandung</option>
                <option value="Medan">Medan</option>
                <option value="Semarang">Semarang</option>
                <option value="Makassar">Makassar</option>
                <option value="Palembang">Palembang</option>
                <option value="Depok">Depok</option>
                <option value="Tangerang">Tangerang</option>
                <option value="Bekasi">Bekasi</option>
                <option value="Yogyakarta">Yogyakarta</option>
                <option value="Malang">Malang</option>
                <option value="Denpasar">Denpasar</option>
                <option value="Batam">Batam</option>
                <option value="Pekanbaru">Pekanbaru</option>
                <option value="Bandar Lampung">Bandar Lampung</option>
                <option value="Padang">Padang</option>
                <option value="Pontianak">Pontianak</option>
                <option value="Balikpapan">Balikpapan</option>
                <option value="Manado">Manado</option>
            </select>
        </div>
        <div class="go" onclick="applyFilters()">Temukan →</div>
    </div>

    <section class="section" id="komunitas">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <h2 class="section-title">Daftar Komunitas</h2>
            <a href="/communities" style="color: var(--blue); font-weight: 600; font-size: 14px;">Lihat Semua →</a>
        </div>
        <div class="cards-grid" id="communitiesGrid">
            @foreach($communities as $community)
            <div class="card community-card" data-category="{{ $community['category'] }}" data-location="{{ $community['location'] }}">
                <img src="{{ $community['image'] }}" alt="{{ $community['name'] }}" class="card-image">
                <div class="card-content">
                    <div class="card-title">{{ $community['name'] }}</div>
                    <div class="card-description">{{ $community['description'] }}</div>
                    <div class="card-meta">
                        <span>👥 {{ number_format($community['members']) }} anggota</span>
                        <span class="card-badge">{{ $community['category'] }}</span>
                    </div>
                    <div style="margin-top: 8px; font-size: 12px; color: var(--gray);">📍 {{ $community['location'] }}</div>
                </div>
            </div>
            @endforeach
        </div>
    </section>

    <section class="section" id="event" style="background: #f9f9f9;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <h2 class="section-title">Daftar Event</h2>
            <a href="/events" style="color: var(--blue); font-weight: 600; font-size: 14px;">Lihat Semua →</a>
        </div>
        <div class="cards-grid" id="eventsGrid">
            @foreach($events as $event)
            <div class="card event-card" data-category="{{ $event['category'] }}" data-location="{{ $event['location'] }}">
                <img src="{{ $event['image'] }}" alt="{{ $event['title'] }}" class="card-image">
                <div class="card-content">
                    <div class="card-title">{{ $event['title'] }}</div>
                    <div class="card-description">{{ $event['description'] }}</div>
                    <div class="card-meta">
                        <span>📅 {{ date('d M Y', strtotime($event['date'])) }} • {{ $event['time'] }}</span>
                        <span class="card-badge">{{ $event['category'] }}</span>
                    </div>
                    <div style="margin-top: 8px; font-size: 12px; color: var(--gray);">
                        📍 {{ $event['location'] }}<br>
                        👥 {{ $event['participants'] }} peserta
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </section>

    <footer>
        <div class="footer-grid">
            <div>
                <div class="logo" style="margin-bottom:12px; font-size:20px;">Y.A.P</div>
                <div style="font-size:13px; line-height:1.8; color:#666; margin-bottom:16px;">
                    PT YGA Solutions x PT DASH<br>
                    Jl. Warid No.100<br>
                    Jakarta, Indonesia
                </div>
            </div>
            <div class="footer-col">
                <div class="footer-title">Perusahaan</div>
                <a href="#">Tentang</a>
                <a href="#">Kebijakan & Privasi</a>
                <a href="#">Syarat dan Ketentuan</a>
            </div>
            <div class="footer-col">
                <div class="footer-title">Fitur Kita</div>
                <a href="#">Show Event</a>
                <a href="#">Show Community</a>
                <a href="#">Join Event</a>
                <a href="#">Joint Community</a>
            </div>
            <div class="footer-col">
                <div class="footer-title">Hubungi Kami</div>
                <a href="#">Kontak</a>
            </div>
            <div class="footer-col">
                <div class="footer-title">Unduh Aplikasi</div>
                @foreach($appLinks as $link)
                    <a href="{{ $link->url }}" target="_blank">
                        @if($link->icon === 'apple')
                            <div style="width:120px; height:40px; background:#000; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:20px; font-weight:600;">🍎</div>
                        @else
                            <div style="width:120px; height:40px; background:#000; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:20px; font-weight:600;">▶️</div>
                        @endif
                    </a>
                @endforeach
            </div>
        </div>
        <div style="margin-top:40px; padding-top:24px; border-top:1px solid #f0f0f0; display:flex; justify-content:space-between; align-items:center;">
            <div style="font-size:12px; color:#999;">© 2025 YGA Indonesia. All Rights Reserved.</div>
        </div>
    </footer>
</div>

<script>
    // Helper function to get cookie value
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
    
    // Check if logged in - with delay to allow cookies to be set
    (function() {
        let checkCount = 0;
        const maxChecks = 10; // Check up to 10 times (1 second total)
        
        function checkLogin() {
            checkCount++;
            
            // Get user email from cookie or localStorage
            const cookieEmail = getCookie('user_email');
            const localStorageEmail = localStorage.getItem('userEmail');
            const userEmail = cookieEmail || localStorageEmail;
            
            // If we have email from cookie, always set localStorage
            if (cookieEmail) {
                localStorage.setItem('userEmail', cookieEmail);
                localStorage.setItem('isLoggedIn', 'true');
            }
            
            // Check if user is logged in (either localStorage or cookie)
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || cookieEmail;
            
            if (isLoggedIn) {
                // User is logged in - set everything and continue
                if (cookieEmail && localStorage.getItem('isLoggedIn') !== 'true') {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userEmail', cookieEmail);
                }
                
                // Set user email in profile avatar (only if it's a div, not an img)
                const finalEmail = userEmail || localStorage.getItem('userEmail') || 'user@example.com';
                const avatar = document.getElementById('profileAvatar');
                if (avatar && finalEmail && avatar.tagName === 'DIV') {
                    avatar.textContent = finalEmail.charAt(0).toUpperCase();
                }
                
                // Initialize: show all cards by default
                const allCards = document.querySelectorAll('.community-card, .event-card');
                allCards.forEach(card => {
                    card.style.display = 'block';
                });
            } else {
                // User not logged in yet - check again if we haven't exceeded max checks
                if (checkCount < maxChecks) {
                    setTimeout(checkLogin, 100); // Check again in 100ms
                } else {
                    // After max checks, if still not logged in, redirect
                    window.location.href = '/';
                }
            }
        }
        
        // Start checking after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(checkLogin, 50); // Small initial delay
            });
        } else {
            setTimeout(checkLogin, 50); // DOM already ready
        }
    })();
    
    function toggleProfileMenu() {
        const menu = document.getElementById('profileMenu');
        menu.classList.toggle('active');
    }
    
    function logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        // Clear cookie by setting it to expire
        document.cookie = 'user_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/';
    }
    
    function updateFilter(type, value) {
        if (type === 'aktivitas') {
            document.getElementById('aktivitasText').textContent = value || 'Pilih aktivitas';
        } else if (type === 'kota') {
            document.getElementById('kotaText').textContent = value || 'Pilih kota';
        }
    }
    
    function applyFilters() {
        const aktivitas = document.querySelector('select[onchange*="aktivitas"]').value;
        const kota = document.querySelector('select[onchange*="kota"]').value;
        
        // Filter komunitas
        const communityCards = document.querySelectorAll('.community-card');
        let visibleCommunities = 0;
        
        communityCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardLocation = card.getAttribute('data-location');
            
            let showCard = true;
            
            // Filter by aktivitas/kategori
            if (aktivitas && cardCategory !== aktivitas) {
                showCard = false;
            }
            
            // Filter by lokasi
            if (kota && cardLocation !== kota) {
                showCard = false;
            }
            
            if (showCard) {
                card.style.display = 'block';
                visibleCommunities++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Filter events
        const eventCards = document.querySelectorAll('.event-card');
        let visibleEvents = 0;
        
        eventCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardLocation = card.getAttribute('data-location');
            
            let showCard = true;
            
            // Filter by aktivitas/kategori
            if (aktivitas && cardCategory !== aktivitas) {
                showCard = false;
            }
            
            // Filter by lokasi
            if (kota && cardLocation !== kota) {
                showCard = false;
            }
            
            if (showCard) {
                card.style.display = 'block';
                visibleEvents++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Scroll to komunitas section if filter applied
        if (aktivitas || kota) {
            document.getElementById('komunitas').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // Close profile menu when clicking outside
    document.addEventListener('click', function(e) {
        const dropdown = document.querySelector('.profile-dropdown');
        const menu = document.getElementById('profileMenu');
        if (!dropdown.contains(e.target)) {
            menu.classList.remove('active');
        }
    });
</script>

</body>
</html>

