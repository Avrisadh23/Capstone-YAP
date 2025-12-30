<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Y.G.A - Events</title>
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
        header { display: flex; align-items: center; justify-content: space-between; padding: 18px 36px; font-size: 13px; color: #7d7d7d; border-bottom: 1px solid #f0f0f0; }
        header nav a { margin-right: 16px; }
        .logo { font-weight: 700; color: var(--blue); font-size: 18px; letter-spacing: 0.5px; }
        .profile-dropdown { position: relative; }
        .profile-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--blue); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; cursor: pointer; }
        .profile-menu { display: none; position: absolute; top: 100%; right: 0; margin-top: 8px; background: #fff; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.15); min-width: 180px; z-index: 100; }
        .profile-menu.active { display: block; }
        .profile-menu a { display: block; padding: 12px 16px; font-size: 14px; color: #333; transition: background 0.2s; }
        .profile-menu a:hover { background: #f5f5f5; }
        .filters { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; background: #003087; color: #fff; padding: 10px 14px; border-radius: 8px; width: calc(100% - 80px); margin: 20px 40px 30px; align-items: center; font-size: 12px; }
        .filters .select { background: rgba(255,255,255,0.1); padding: 10px 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; gap: 8px; cursor: pointer; position: relative; }
        .filters .select:hover { background: rgba(255,255,255,0.15); }
        .filters .select select { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
        .filters .go { background: #063a93; padding: 10px 16px; border-radius: 6px; text-align: center; cursor: pointer; }
        .filters .go:hover { background: #052d7a; }
        .section { padding: 40px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .section-title { font-size: 28px; font-weight: 700; color: #0f1218; }
        .btn-primary { background: var(--blue); color: #fff; padding: 12px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .btn-primary:hover { background: #002766; }
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
        .card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
        .card-image { width: 100%; height: 180px; object-fit: cover; }
        .card-content { padding: 16px; }
        .card-title { font-size: 16px; font-weight: 700; margin-bottom: 8px; color: #000; }
        .card-description { font-size: 13px; color: var(--gray); margin-bottom: 12px; line-height: 1.5; }
        .card-meta { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--gray); }
        .card-badge { display: inline-block; padding: 4px 8px; background: var(--light); border-radius: 4px; font-size: 11px; font-weight: 600; color: var(--blue); }
        .pagination { display: flex; justify-content: center; gap: 8px; margin-top: 32px; }
        .pagination a, .pagination span { padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; color: #333; }
        .pagination .active { background: var(--blue); color: #fff; border-color: var(--blue); }
        @media (max-width: 1024px) {
            .cards-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
            .filters { grid-template-columns: 1fr; width: calc(100% - 40px); margin: 20px 20px 30px; }
            .section { padding: 24px; }
            header { padding: 18px 24px; }
        }
    </style>
</head>
<body>
<div class="page">
    <header>
        <div class="logo"><a href="/homepage">Y.G.A</a></div>
        <nav>
            <a href="/homepage">Home</a>
            <a href="/events">Event</a>
            <a href="/communities">Komunitas</a>
            <a href="/homepage#partner">Partner With Us</a>
        </nav>
        <div class="profile-dropdown">
            <div class="profile-avatar" id="profileAvatar" onclick="toggleProfileMenu()">U</div>
            <div class="profile-menu" id="profileMenu">
                <a href="/profile">Profile</a>
                <a href="/events/manage/list">Kelola Event</a>
                <a href="/communities/manage/list">Kelola Komunitas</a>
                <a href="#" onclick="logout(); return false;">Logout</a>
            </div>
        </div>
    </header>

    <div class="filters">
        <div class="select">
            <span style="color: #ff3b30; font-size: 14px; margin-right: 8px;">📍</span>
            <div style="flex: 1;">
                <div style="opacity:.6; font-size:11px;">Aktivitas</div>
                <div style="font-weight:600;" id="aktivitasText">{{ $filters['category'] ?: 'Pilih aktivitas' }}</div>
            </div>
            <span>⌄</span>
            <select onchange="updateFilter('aktivitas', this.value); applyFilters();">
                <option value="">Pilih aktivitas</option>
                <option value="Hobi" {{ $filters['category'] === 'Hobi' ? 'selected' : '' }}>Hobi</option>
                <option value="Olahraga" {{ $filters['category'] === 'Olahraga' ? 'selected' : '' }}>Olahraga</option>
                <option value="Workshop" {{ $filters['category'] === 'Workshop' ? 'selected' : '' }}>Workshop</option>
                <option value="Gaming" {{ $filters['category'] === 'Gaming' ? 'selected' : '' }}>Gaming</option>
            </select>
        </div>
        <div class="select">
            <span style="color: #ff3b30; font-size: 14px; margin-right: 8px;">📍</span>
            <div style="flex: 1;">
                <div style="opacity:.6; font-size:11px;">Lokasi</div>
                <div style="font-weight:600;" id="kotaText">{{ $filters['location'] ?: 'Pilih kota' }}</div>
            </div>
            <span>⌄</span>
            <select onchange="updateFilter('kota', this.value); applyFilters();">
                <option value="">Pilih kota</option>
                <option value="Jakarta" {{ $filters['location'] === 'Jakarta' ? 'selected' : '' }}>Jakarta</option>
                <option value="Surabaya" {{ $filters['location'] === 'Surabaya' ? 'selected' : '' }}>Surabaya</option>
                <option value="Bandung" {{ $filters['location'] === 'Bandung' ? 'selected' : '' }}>Bandung</option>
                <option value="Medan" {{ $filters['location'] === 'Medan' ? 'selected' : '' }}>Medan</option>
                <option value="Yogyakarta" {{ $filters['location'] === 'Yogyakarta' ? 'selected' : '' }}>Yogyakarta</option>
            </select>
        </div>
        <div class="go" onclick="applyFilters()">Temukan →</div>
    </div>

    <section class="section">
        <div class="section-header">
            <h2 class="section-title">Daftar Event</h2>
            <a href="/events/create" class="btn-primary">+ Buat Event</a>
        </div>
        <div class="cards-grid">
            @forelse($events as $event)
            <a href="/events/{{ $event->id }}">
                <div class="card">
                    <img src="{{ $event->image_url ?: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80' }}" alt="{{ $event->title }}" class="card-image">
                    <div class="card-content">
                        <div class="card-title">{{ $event->title }}</div>
                        <div class="card-description">{{ Str::limit($event->description, 100) }}</div>
                        <div class="card-meta">
                            <span>📅 {{ $event->date->format('d M Y') }} • {{ $event->time }}</span>
                            <span class="card-badge">{{ $event->category }}</span>
                        </div>
                        <div style="margin-top: 8px; font-size: 12px; color: var(--gray);">
                            📍 {{ $event->location }}<br>
                            👥 {{ $event->participants_count }} peserta
                        </div>
                    </div>
                </div>
            </a>
            @empty
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray);">
                Tidak ada event yang ditemukan.
            </div>
            @endforelse
        </div>
        <div class="pagination">
            {{ $events->links() }}
        </div>
    </section>
</div>

<script>
    window.addEventListener('DOMContentLoaded', function() {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = '/';
        }
        const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
        const avatar = document.getElementById('profileAvatar');
        if (avatar && userEmail) {
            avatar.textContent = userEmail.charAt(0).toUpperCase();
        }
    });
    
    function toggleProfileMenu() {
        document.getElementById('profileMenu').classList.toggle('active');
    }
    
    function logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
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
        const params = new URLSearchParams();
        if (aktivitas) params.append('category', aktivitas);
        if (kota) params.append('location', kota);
        window.location.href = '/events?' + params.toString();
    }
    
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

