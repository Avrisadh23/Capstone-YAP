<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Y.G.A - {{ $community->name }}</title>
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
        .logo { font-weight: 700; color: var(--blue); font-size: 18px; letter-spacing: 0.5px; }
        .profile-dropdown { position: relative; }
        .profile-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--blue); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; cursor: pointer; }
        .profile-menu { display: none; position: absolute; top: 100%; right: 0; margin-top: 8px; background: #fff; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.15); min-width: 180px; z-index: 100; }
        .profile-menu.active { display: block; }
        .profile-menu a { display: block; padding: 12px 16px; font-size: 14px; color: #333; transition: background 0.2s; }
        .profile-menu a:hover { background: #f5f5f5; }
        .detail-container { padding: 40px; }
        .detail-header { margin-bottom: 32px; }
        .detail-title { font-size: 32px; font-weight: 700; margin-bottom: 16px; }
        .detail-meta { display: flex; gap: 24px; flex-wrap: wrap; margin-bottom: 16px; font-size: 14px; color: var(--gray); }
        .detail-image { width: 100%; max-height: 400px; object-fit: cover; border-radius: 12px; margin-bottom: 32px; }
        .detail-content { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; }
        .detail-section { margin-bottom: 24px; }
        .detail-section h3 { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
        .detail-section p { font-size: 14px; line-height: 1.6; color: var(--gray); }
        .btn-primary { background: var(--blue); color: #fff; padding: 12px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; width: 100%; }
        .btn-primary:hover { background: #002766; }
        .btn-secondary { background: #f5f5f5; color: #333; padding: 12px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; width: 100%; }
        .btn-secondary:hover { background: #e0e0e0; }
        .info-box { background: var(--light); padding: 16px; border-radius: 8px; margin-bottom: 16px; }
        .info-box-item { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
        .info-box-item:last-child { margin-bottom: 0; }
        .modal-overlay { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; }
        .modal-overlay.active { display: flex; }
        .modal { background: #fff; border-radius: 12px; width: 90%; max-width: 500px; padding: 32px; position: relative; }
        .modal-close { position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 24px; cursor: pointer; }
        .form-group { margin-bottom: 20px; }
        .form-label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 8px; }
        .form-input { width: 100%; padding: 12px 16px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; }
        .alert { padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; }
        .alert-success { background: #d4edda; color: #155724; }
        .alert-error { background: #f8d7da; color: #721c24; }
        @media (max-width: 1024px) {
            .detail-content { grid-template-columns: 1fr; }
            .detail-container { padding: 24px; }
        }
    </style>
</head>
<body>
<div class="page">
    <header>
        <div class="logo"><a href="/communities">← Kembali ke Communities</a></div>
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

    <div class="detail-container">
        @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
        @endif
        @if(session('error'))
        <div class="alert alert-error">{{ session('error') }}</div>
        @endif

        <div class="detail-header">
            <h1 class="detail-title">{{ $community->name }}</h1>
            <div class="detail-meta">
                <span>📍 {{ $community->location }}</span>
                <span>🏷️ {{ $community->category }}</span>
                <span>👥 {{ $community->members_count }} anggota</span>
            </div>
        </div>

        @if($community->image_url)
        <img src="{{ $community->image_url }}" alt="{{ $community->name }}" class="detail-image">
        @endif

        <div class="detail-content">
            <div class="detail-main">
                <div class="detail-section">
                    <h3>Deskripsi</h3>
                    <p>{{ $community->description }}</p>
                </div>
                @if($community->rules)
                <div class="detail-section">
                    <h3>Aturan Komunitas</h3>
                    <p>{{ $community->rules }}</p>
                </div>
                @endif
                
                @if($isJoined)
                <div class="detail-section">
                    <h3>Anggota Komunitas</h3>
                    <div style="margin-top: 16px;">
                        @foreach($community->members as $member)
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f9f9f9; border-radius: 8px; margin-bottom: 8px;">
                            <div>
                                <div style="font-weight: 600; margin-bottom: 4px;">{{ $member->user_name ?? $member->user_email }}</div>
                                <div style="font-size: 12px; color: #666;">
                                    @if($member->role === 'pengurus')
                                        <span style="background: #003087; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">Pengurus</span>
                                    @else
                                        <span style="background: #e0e0e0; color: #666; padding: 2px 8px; border-radius: 4px; font-size: 11px;">Anggota</span>
                                    @endif
                                </div>
                            </div>
                            @if($isPengurus && $member->role !== 'pengurus')
                            <form method="POST" action="/communities/{{ $community->id }}/members/{{ $member->id }}" style="margin: 0;" onsubmit="return confirm('Yakin ingin menghapus anggota ini?');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" style="background: #ff3b30; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">Hapus</button>
                            </form>
                            @endif
                        </div>
                        @endforeach
                    </div>
                </div>
                @endif
            </div>
            <div class="detail-sidebar">
                <div class="info-box">
                    <div class="info-box-item">
                        <span>Lokasi</span>
                        <strong>{{ $community->location }}</strong>
                    </div>
                    <div class="info-box-item">
                        <span>Kategori</span>
                        <strong>{{ $community->category }}</strong>
                    </div>
                    <div class="info-box-item">
                        <span>Anggota</span>
                        <strong>{{ $community->members_count }}</strong>
                    </div>
                    @if($community->contact)
                    <div class="info-box-item">
                        <span>Kontak</span>
                        <strong>{{ $community->contact }}</strong>
                    </div>
                    @endif
                </div>
                @if($isJoined)
                    @if($isPengurus)
                        <a href="/communities/{{ $community->id }}/edit" class="btn-primary" style="display: block; text-align: center; margin-bottom: 8px;">Edit Komunitas</a>
                        <button class="btn-secondary" disabled>Anda adalah Pengurus</button>
                    @else
                        <button class="btn-secondary" disabled>Sudah Bergabung</button>
                    @endif
                @else
                <button class="btn-primary" onclick="openJoinModal()">Join Komunitas</button>
                @endif
            </div>
        </div>
    </div>
</div>

<!-- Join Modal -->
<div class="modal-overlay" id="joinModal" onclick="closeJoinModal(event)">
    <div class="modal" onclick="event.stopPropagation()">
        <button class="modal-close" onclick="closeJoinModal()">×</button>
        <h2 style="margin-bottom: 24px;">Join Komunitas</h2>
        <form method="POST" action="/communities/{{ $community->id }}/join">
            @csrf
            <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" name="user_email" class="form-input" value="{{ $userEmail }}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Nama</label>
                <input type="text" name="user_name" class="form-input">
            </div>
            <div class="form-group">
                <label class="form-label">Nomor Telepon</label>
                <input type="tel" name="phone" class="form-input">
            </div>
            <div class="form-group">
                <label class="form-label">Catatan (Opsional)</label>
                <textarea name="notes" class="form-input" rows="3"></textarea>
            </div>
            <button type="submit" class="btn-primary">Konfirmasi Join</button>
        </form>
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
        
        // Update email field in join form with localStorage email
        const emailInput = document.querySelector('input[name="user_email"]');
        if (emailInput) {
            emailInput.value = userEmail;
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
    
    function openJoinModal() {
        // Ensure email is set from localStorage when opening modal
        const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
        const emailInput = document.querySelector('input[name="user_email"]');
        if (emailInput) {
            emailInput.value = userEmail;
        }
        document.getElementById('joinModal').classList.add('active');
    }
    
    function closeJoinModal(event) {
        if (!event || event.target.id === 'joinModal') {
            document.getElementById('joinModal').classList.remove('active');
        }
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

