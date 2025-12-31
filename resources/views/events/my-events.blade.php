<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Y.A.P - Event Saya</title>
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
        .section { padding: 40px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .section-title { font-size: 28px; font-weight: 700; color: #0f1218; }
        .btn-primary { background: var(--blue); color: #fff; padding: 12px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .btn-primary:hover { background: #002766; }
        .btn-secondary { background: #fff; color: var(--blue); padding: 12px 24px; border: 1px solid var(--blue); border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; margin-right: 12px; }
        .btn-secondary:hover { background: #f0f4ff; }
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
        .empty-state { grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--gray); }
        .empty-state-icon { font-size: 64px; margin-bottom: 16px; }
        .empty-state h3 { font-size: 20px; font-weight: 600; margin-bottom: 8px; color: var(--text); }
        .empty-state p { font-size: 14px; margin-bottom: 24px; }
        @media (max-width: 1024px) {
            .cards-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
            .section { padding: 24px; }
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
            <a href="/events">Event</a>
            <a href="/communities">Komunitas</a>
            <a href="/homepage#partner">Partner With Us</a>
        </nav>
        <div class="profile-dropdown">
            @if(isset($user) && $user && $user->foto_profile)
                <img src="{{ asset('storage/' . $user->foto_profile) }}" alt="Profile" class="profile-avatar" id="profileAvatar" onclick="toggleProfileMenu()" style="object-fit: cover; cursor: pointer;">
            @else
                <div class="profile-avatar" id="profileAvatar" onclick="toggleProfileMenu()">U</div>
            @endif
            <div class="profile-menu" id="profileMenu">
                <a href="/profile">Profile</a>
                <a href="/events/myevent">Event Saya</a>
                <a href="/communities/mycommunity">Komunitas Saya</a>
                <a href="/member-card">Kartu Anggota Digital</a>
                <a href="/events/manage/list">Kelola Event</a>
                <a href="/communities/manage/list">Kelola Komunitas</a>
                <a href="#" onclick="logout(); return false;">Logout</a>
            </div>
        </div>
    </header>

    <section class="section">
        <div class="section-header">
            <h2 class="section-title">Event Saya</h2>
            <div>
                <a href="/events" class="btn-secondary">← Kembali ke Daftar Event</a>
                <a href="/events/create" class="btn-primary">+ Buat Event</a>
            </div>
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
            <div class="empty-state">
                <div class="empty-state-icon">📅</div>
                <h3>Belum Ada Event</h3>
                <p>Anda belum mendaftar ke event manapun. Mulai jelajahi event yang tersedia!</p>
                <a href="/events" class="btn-primary">Jelajahi Event</a>
            </div>
            @endforelse
        </div>
        @if($events->hasPages())
        <div class="pagination">
            {{ $events->links() }}
        </div>
        @endif
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
        
        // Send user_email to backend if not in URL
        if (!window.location.search.includes('user_email')) {
            const url = new URL(window.location);
            url.searchParams.set('user_email', userEmail);
            window.history.replaceState({}, '', url);
            // Reload to send user_email to backend
            window.location.reload();
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

