<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Y.G.A - News</title>
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
        .page { max-width: 1200px; margin: 0 auto; background: #fff; min-height: 100vh; }
        header { display: flex; align-items: center; justify-content: space-between; padding: 18px 36px; font-size: 13px; color: #7d7d7d; background: #f8f8f8; border-bottom: 1px solid #e0e0e0; }
        header nav a { margin-right: 16px; }
        .logo { font-weight: 700; color: var(--blue); font-size: 18px; letter-spacing: 0.5px; }
        .profile-dropdown { position: relative; }
        .profile-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--blue); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; cursor: pointer; }
        .profile-menu { display: none; position: absolute; top: 100%; right: 0; margin-top: 8px; background: #fff; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.15); min-width: 180px; z-index: 100; }
        .profile-menu.active { display: block; }
        .profile-menu a { display: block; padding: 12px 16px; font-size: 14px; color: #333; transition: background 0.2s; }
        .profile-menu a:hover { background: #f5f5f5; }
        .container { padding: 40px; }
        .page-title { font-size: 32px; font-weight: 700; margin-bottom: 8px; }
        .page-subtitle { font-size: 14px; color: var(--gray); margin-bottom: 32px; }
        .section { margin-bottom: 48px; }
        .section-title { font-size: 24px; font-weight: 700; margin-bottom: 24px; }
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
        .card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
        .card-image { width: 100%; height: 180px; object-fit: cover; }
        .card-content { padding: 16px; }
        .card-title { font-size: 16px; font-weight: 700; margin-bottom: 8px; color: #000; }
        .card-description { font-size: 13px; color: var(--gray); margin-bottom: 12px; line-height: 1.5; }
        .card-meta { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--gray); }
        .card-badge { display: inline-block; padding: 4px 8px; background: var(--light); border-radius: 4px; font-size: 11px; font-weight: 600; color: var(--blue); }
        .empty-state { text-align: center; padding: 60px 20px; color: var(--gray); }
        .empty-state-icon { font-size: 48px; margin-bottom: 16px; }
        @media (max-width: 1024px) {
            .container { padding: 24px; }
            header { padding: 18px 24px; }
            .cards-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
        }
    </style>
</head>
<body>
<div class="page">
    <header>
        <div class="logo"><a href="/homepage">Y.G.A</a></div>
        <nav>
            <a href="/homepage">Home</a>
            <a href="/communities">Komunitas</a>
            <a href="/events">Event</a>
            <a href="/news">News</a>
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
                <a href="#" onclick="logout(); return false;">Logout</a>
            </div>
        </div>
    </header>

    <div class="container">
        <h1 class="page-title">News</h1>
        <p class="page-subtitle">Berita dan update terkini tentang event dan komunitas</p>

        <!-- Events Recap Section -->
        <div class="section">
            <h2 class="section-title">Recap Event</h2>
            @if($events->count() > 0)
            <div class="cards-grid">
                @foreach($events as $event)
                <a href="{{ route('news.show', $event->id) }}">
                    <div class="card">
                        @if($event->image_url)
                        <img src="{{ $event->image_url }}" alt="{{ $event->title }}" class="card-image">
                        @else
                        <div class="card-image" style="background: #e0e0e0; display: flex; align-items: center; justify-content: center; color: var(--gray);">No Image</div>
                        @endif
                        <div class="card-content">
                            <div class="card-title">
                                {{ $event->title }}
                                @if($event->recap)
                                <span style="background: #28a745; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; margin-left: 8px;">RECAP</span>
                                @endif
                            </div>
                            <div class="card-description">
                                @if($event->recap)
                                    {{ Str::limit($event->recap, 100) }}
                                @else
                                    {{ Str::limit($event->description, 100) }}
                                @endif
                            </div>
                            <div class="card-meta">
                                <span>📅 {{ $event->date->format('d M Y') }}</span>
                                <span class="card-badge">{{ $event->category }}</span>
                            </div>
                            <div style="margin-top: 8px; font-size: 12px; color: var(--gray);">
                                📍 {{ $event->location }}
                            </div>
                        </div>
                    </div>
                </a>
                @endforeach
            </div>
            @else
            <div class="empty-state">
                <div class="empty-state-icon">📅</div>
                <p>Belum ada event yang telah selesai</p>
            </div>
            @endif
        </div>

        <!-- Communities Section -->
        <div class="section">
            <h2 class="section-title">Komunitas Terbaru</h2>
            @if($communities->count() > 0)
            <div class="cards-grid">
                @foreach($communities as $community)
                <a href="{{ route('communities.show', $community->id) }}">
                    <div class="card">
                        @if($community->image_url)
                        <img src="{{ $community->image_url }}" alt="{{ $community->name }}" class="card-image">
                        @else
                        <div class="card-image" style="background: #e0e0e0; display: flex; align-items: center; justify-content: center; color: var(--gray);">No Image</div>
                        @endif
                        <div class="card-content">
                            <div class="card-title">{{ $community->name }}</div>
                            <div class="card-description">{{ Str::limit($community->description, 100) }}</div>
                            <div class="card-meta">
                                <span>👥 {{ $community->members_count }} anggota</span>
                                <span class="card-badge">{{ $community->category }}</span>
                            </div>
                            <div style="margin-top: 8px; font-size: 12px; color: var(--gray);">
                                📍 {{ $community->location }}
                            </div>
                        </div>
                    </div>
                </a>
                @endforeach
            </div>
            @else
            <div class="empty-state">
                <div class="empty-state-icon">👥</div>
                <p>Belum ada komunitas</p>
            </div>
            @endif
        </div>
    </div>
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

