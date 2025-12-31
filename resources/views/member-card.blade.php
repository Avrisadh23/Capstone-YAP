<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Y.A.P - Kartu Anggota Digital</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --blue: #003087;
            --orange: #ff6b35;
            --orange-dark: #e55a2b;
            --red: #ff3b30;
            --text: #1b1b1b;
            --gray: #5c6574;
            --light: #f6f7fb;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: var(--text); background: #f4f4f4; }
        a { color: inherit; text-decoration: none; }
        .page { max-width: 1200px; margin: 0 auto; background: #fff; min-height: 100vh; }
        header { display: flex; align-items: center; justify-content: space-between; padding: 18px 36px; font-size: 13px; color: #7d7d7d; border-bottom: 1px solid #f0f0f0; }
        header nav a { margin-right: 16px; }
        .logo { font-weight: 700; color: var(--blue); font-size: 18px; letter-spacing: 0.5px; }
        .profile-dropdown { position: relative; }
        .profile-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--blue); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; cursor: pointer; }
        .profile-menu { display: none; position: absolute; top: 100%; right: 0; margin-top: 8px; background: #fff; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.15); min-width: 180px; z-index: 100; }
        .profile-menu.active { display: block; }
        .profile-menu a { display: block; padding: 12px 16px; font-size: 14px; color: #333; transition: background 0.2s; }
        .profile-menu a:hover { background: #f5f5f5; }
        .card-container { padding: 60px 40px; display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 200px); }
        .member-card { width: 100%; max-width: 400px; border-radius: 20px; padding: 32px; color: #fff; position: relative; overflow: hidden; }
        .member-card.pengurus { background: linear-gradient(135deg, #003087 0%, #002766 100%); box-shadow: 0 20px 60px rgba(0,48,135,0.3); }
        .member-card.anggota { background: linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%); box-shadow: 0 20px 60px rgba(255,107,53,0.3); }
        .member-card::before { content: ''; position: absolute; top: -50%; right: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; position: relative; z-index: 1; }
        .card-logo { font-size: 24px; font-weight: 700; }
        .card-badge { background: rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .card-body { position: relative; z-index: 1; }
        .card-photo { width: 120px; height: 120px; border-radius: 50%; border: 4px solid #fff; object-fit: cover; margin: 0 auto 20px; display: block; background: #fff; }
        .card-name { font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 8px; }
        .card-email { font-size: 14px; text-align: center; opacity: 0.9; margin-bottom: 24px; }
        .card-info { background: rgba(255,255,255,0.15); border-radius: 12px; padding: 16px; margin-top: 24px; }
        .card-info-item { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px; }
        .card-info-item:last-child { margin-bottom: 0; }
        .card-info-label { opacity: 0.8; }
        .card-info-value { font-weight: 600; }
        .card-footer { margin-top: 24px; text-align: center; font-size: 11px; opacity: 0.7; position: relative; z-index: 1; }
        .action-buttons { margin-top: 32px; display: flex; gap: 12px; justify-content: center; }
        .btn-primary { color: #fff; padding: 12px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .btn-primary.pengurus { background: var(--blue); }
        .btn-primary.pengurus:hover { background: #002766; }
        .btn-primary.anggota { background: var(--orange); }
        .btn-primary.anggota:hover { background: var(--orange-dark); }
        .btn-secondary { background: #fff; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-secondary.pengurus { color: var(--blue); border: 1px solid var(--blue); }
        .btn-secondary.pengurus:hover { background: #f0f4ff; }
        .btn-secondary.anggota { color: var(--orange); border: 1px solid var(--orange); }
        .btn-secondary.anggota:hover { background: #fff5f0; }
        @media print {
            header, .action-buttons { display: none; }
            .card-container { padding: 0; }
            .member-card { box-shadow: none; }
        }
        @media (max-width: 1024px) {
            .card-container { padding: 40px 24px; }
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
                <a href="/events/manage/list">Kelola Event</a>
                <a href="/communities/manage/list">Kelola Komunitas</a>
                <a href="#" onclick="logout(); return false;">Logout</a>
            </div>
        </div>
    </header>

    <div class="card-container">
        <div class="member-card {{ $isPengurus ? 'pengurus' : 'anggota' }}">
            <div class="card-header">
                <div class="card-logo">Y.A.P</div>
                <div class="card-badge">{{ $isPengurus ? 'PENGURUS' : 'ANGGOTA' }}</div>
            </div>
            <div class="card-body">
        @if($user && $user->foto_profile)
            <img src="{{ asset('storage/' . $user->foto_profile) }}" alt="Foto Profile" class="card-photo">
        @else
            <div class="card-photo" style="display: flex; align-items: center; justify-content: center; font-size: 48px; color: {{ $isPengurus ? '#003087' : '#ff6b35' }}; background: #fff;">
                {{ strtoupper(substr($user->email ?? 'U', 0, 1)) }}
            </div>
        @endif
                <div class="card-name">{{ $user->nama_lengkap ?? $user->name ?? 'Nama Lengkap' }}</div>
                <div class="card-email">{{ $user->email }}</div>
                <div class="card-info">
                    <div class="card-info-item">
                        <span class="card-info-label">Tanggal Lahir</span>
                        <span class="card-info-value">{{ $user->tgl_lahir ? $user->tgl_lahir->format('d/m/Y') : '-' }}</span>
                    </div>
                    <div class="card-info-item">
                        <span class="card-info-label">Member Since</span>
                        <span class="card-info-value">{{ $user->created_at->format('M Y') }}</span>
                    </div>
                    <div class="card-info-item">
                        <span class="card-info-label">ID Anggota</span>
                        <span class="card-info-value">#{{ str_pad($user->id, 6, '0', STR_PAD_LEFT) }}</span>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                Kartu Anggota Digital Y.A.P Community Platform
            </div>
        </div>
    </div>

    <div class="action-buttons">
        <button onclick="window.print()" class="btn-primary {{ $isPengurus ? 'pengurus' : 'anggota' }}">🖨️ Cetak PDF</button>
        <a href="/profile" class="btn-secondary {{ $isPengurus ? 'pengurus' : 'anggota' }}">Kembali ke Profile</a>
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

