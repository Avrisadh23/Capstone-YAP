<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Y.G.A - {{ $event->title }}</title>
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
        .article-container { padding: 40px; max-width: 800px; margin: 0 auto; }
        .article-header { margin-bottom: 32px; }
        .article-title { font-size: 36px; font-weight: 700; margin-bottom: 16px; line-height: 1.2; }
        .article-meta { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 24px; font-size: 14px; color: var(--gray); }
        .article-meta-item { display: flex; align-items: center; gap: 8px; }
        .article-image { width: 100%; max-height: 500px; object-fit: cover; border-radius: 12px; margin-bottom: 32px; }
        .article-content { font-size: 16px; line-height: 1.8; color: var(--text); }
        .article-content p { margin-bottom: 20px; }
        .article-section { margin-top: 40px; }
        .article-section h2 { font-size: 24px; font-weight: 700; margin-bottom: 16px; }
        .article-section h3 { font-size: 20px; font-weight: 600; margin-bottom: 12px; margin-top: 24px; }
        .article-info-box { background: var(--light); padding: 24px; border-radius: 12px; margin-top: 32px; }
        .article-info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e0e0e0; }
        .article-info-row:last-child { border-bottom: none; }
        .article-info-label { font-weight: 600; color: var(--gray); }
        .article-info-value { font-weight: 500; }
        .badge { display: inline-block; padding: 6px 12px; background: var(--blue); color: #fff; border-radius: 6px; font-size: 12px; font-weight: 600; }
        @media (max-width: 1024px) {
            .article-container { padding: 24px; }
            header { padding: 18px 24px; }
            .article-title { font-size: 28px; }
        }
    </style>
</head>
<body>
<div class="page">
    <header>
        <div class="logo"><a href="{{ route('news.index') }}">← Kembali ke News</a></div>
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

    <div class="article-container">
        <div class="article-header">
            <div style="margin-bottom: 16px;">
                <span class="badge">Recap Event</span>
            </div>
            <h1 class="article-title">{{ $event->title }}</h1>
            <div class="article-meta">
                <div class="article-meta-item">
                    <span>📅</span>
                    <span>{{ $event->date->format('d M Y') }}</span>
                </div>
                <div class="article-meta-item">
                    <span>📍</span>
                    <span>{{ $event->location }}</span>
                </div>
                <div class="article-meta-item">
                    <span>🏷️</span>
                    <span>{{ $event->category }}</span>
                </div>
                <div class="article-meta-item">
                    <span>👥</span>
                    <span>{{ $event->participants_count }} peserta</span>
                </div>
            </div>
        </div>

        @if($event->image_url)
        <img src="{{ $event->image_url }}" alt="{{ $event->title }}" class="article-image">
        @endif

        <article class="article-content">
            @if($event->recap)
            <div class="article-section">
                <div style="white-space: pre-wrap; line-height: 1.8;">{{ $event->recap }}</div>
            </div>
            @else
            <div class="article-section">
                <p style="font-size: 18px; font-weight: 500; color: var(--text); margin-bottom: 24px;">
                    Event {{ $event->title }} telah berhasil dilaksanakan pada {{ $event->date->format('d M Y') }} di {{ $event->location }}.
                </p>
                @if($event->description)
                <div style="white-space: pre-wrap; line-height: 1.8;">{{ $event->description }}</div>
                @else
                <p style="color: var(--gray); font-style: italic;">Recap event akan segera tersedia.</p>
                @endif
            </div>
            @endif

            <div class="article-info-box">
                <h3 style="margin-top: 0; margin-bottom: 20px;">Informasi Event</h3>
                <div class="article-info-row">
                    <span class="article-info-label">Tanggal</span>
                    <span class="article-info-value">{{ $event->date->format('d M Y') }}</span>
                </div>
                <div class="article-info-row">
                    <span class="article-info-label">Waktu</span>
                    <span class="article-info-value">{{ \Carbon\Carbon::parse($event->time)->format('H:i') }} WIB</span>
                </div>
                <div class="article-info-row">
                    <span class="article-info-label">Lokasi</span>
                    <span class="article-info-value">{{ $event->location }}</span>
                </div>
                <div class="article-info-row">
                    <span class="article-info-label">Kategori</span>
                    <span class="article-info-value">{{ $event->category }}</span>
                </div>
                <div class="article-info-row">
                    <span class="article-info-label">Jumlah Peserta</span>
                    <span class="article-info-value">{{ $event->participants_count }} peserta</span>
                </div>
                @if($event->max_participants)
                <div class="article-info-row">
                    <span class="article-info-label">Kapasitas</span>
                    <span class="article-info-value">{{ $event->max_participants }} orang</span>
                </div>
                @endif
                @if($event->contact)
                <div class="article-info-row">
                    <span class="article-info-label">Kontak</span>
                    <span class="article-info-value">{{ $event->contact }}</span>
                </div>
                @endif
            </div>
        </article>
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

