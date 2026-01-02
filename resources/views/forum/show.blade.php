<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Y.G.A - {{ $post->user_name ?? 'Post' }}</title>
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
        .logo { font-weight: 700; color: var(--blue); font-size: 18px; letter-spacing: 0.5px; }
        .profile-dropdown { position: relative; }
        .profile-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--blue); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; cursor: pointer; }
        .profile-menu { display: none; position: absolute; top: 100%; right: 0; margin-top: 8px; background: #fff; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.15); min-width: 180px; z-index: 100; }
        .profile-menu.active { display: block; }
        .profile-menu a { display: block; padding: 12px 16px; font-size: 14px; color: #333; transition: background 0.2s; }
        .profile-menu a:hover { background: #f5f5f5; }
        .container { padding: 40px; max-width: 800px; margin: 0 auto; }
        .alert { padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; }
        .alert-success { background: #d4edda; color: #155724; }
        .alert-error { background: #f8d7da; color: #721c24; }
        .post-card { background: #f8f8f8; border-radius: 12px; padding: 20px; margin-bottom: 32px; }
        .post-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .user-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--blue); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; }
        .post-user-info { flex: 1; }
        .post-user-name { font-weight: 600; font-size: 14px; margin-bottom: 2px; }
        .post-time { font-size: 12px; color: var(--gray); }
        .post-content { font-size: 14px; line-height: 1.6; color: var(--text); margin-bottom: 12px; white-space: pre-wrap; }
        .post-image { width: 100%; max-height: 500px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; }
        .replies-section { margin-top: 32px; }
        .replies-title { font-size: 20px; font-weight: 700; margin-bottom: 24px; }
        .reply-card { background: #fff; border: 1px solid #e0e0e0; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
        .reply-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .reply-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--blue); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; }
        .reply-user-info { flex: 1; }
        .reply-user-name { font-weight: 600; font-size: 13px; margin-bottom: 2px; }
        .reply-time { font-size: 11px; color: var(--gray); }
        .reply-content { font-size: 14px; line-height: 1.6; color: var(--text); white-space: pre-wrap; }
        .reply-image { width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin-top: 12px; }
        .reply-form { background: #f8f8f8; border-radius: 12px; padding: 20px; margin-top: 32px; }
        .form-group { margin-bottom: 20px; }
        .form-label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 8px; }
        .form-input, .form-textarea { width: 100%; padding: 12px 16px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; font-family: inherit; }
        .form-textarea { resize: vertical; min-height: 100px; }
        .form-input:focus, .form-textarea:focus { outline: none; border-color: var(--blue); }
        .btn-primary { background: var(--blue); color: #fff; padding: 12px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .btn-primary:hover { background: #002766; }
        @media (max-width: 1024px) {
            .container { padding: 24px; }
            header { padding: 18px 24px; }
        }
    </style>
</head>
<body>
<div class="page">
    <header>
        <div class="logo"><a href="{{ route('forum.index', $community->id) }}">← Kembali ke Forum</a></div>
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
                <a href="#" onclick="logout(); return false;">Logout</a>
            </div>
        </div>
    </header>

    <div class="container">
        @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
        @endif
        @if(session('error'))
        <div class="alert alert-error">{{ session('error') }}</div>
        @endif

        <!-- Main Post -->
        <div class="post-card">
            <div class="post-header">
                <div class="user-avatar">{{ $post->user_name ? $post->user_name[0] : ($post->user_email[0] ?? 'U') }}</div>
                <div class="post-user-info">
                    <div class="post-user-name">{{ $post->user_name ?? $post->user_email }}</div>
                    <div class="post-time">{{ $post->created_at->diffForHumans() }}</div>
                </div>
            </div>
            <div class="post-content">{{ $post->content }}</div>
            @if($post->image_url)
            <img src="{{ $post->image_url }}" alt="Post image" class="post-image">
            @endif
        </div>

        <!-- Replies Section -->
        <div class="replies-section">
            <h2 class="replies-title">{{ $post->replies->count() }} Balasan</h2>

            @forelse($post->replies as $reply)
            <div class="reply-card">
                <div class="reply-header">
                    <div class="reply-avatar">{{ $reply->user_name ? $reply->user_name[0] : ($reply->user_email[0] ?? 'U') }}</div>
                    <div class="reply-user-info">
                        <div class="reply-user-name">{{ $reply->user_name ?? $reply->user_email }}</div>
                        <div class="reply-time">{{ $reply->created_at->diffForHumans() }}</div>
                    </div>
                </div>
                <div class="reply-content">{{ $reply->content }}</div>
                @if($reply->image_url)
                <img src="{{ $reply->image_url }}" alt="Reply image" class="reply-image">
                @endif
            </div>
            @empty
            <div class="reply-card" style="text-align: center; color: var(--gray);">
                <p>Belum ada balasan. Jadilah yang pertama membalas!</p>
            </div>
            @endforelse

            <!-- Reply Form -->
            <div class="reply-form">
                <h3 style="margin-bottom: 16px; font-size: 18px; font-weight: 600;">Tambah Balasan</h3>
                <form method="POST" action="{{ route('forum.reply', [$community->id, $post->id]) }}" enctype="multipart/form-data">
                    @csrf
                    <div class="form-group">
                        <label class="form-label">Balasan</label>
                        <textarea name="content" class="form-textarea" placeholder="Tulis balasan Anda..." required></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Gambar (Opsional)</label>
                        <input type="file" name="image" class="form-input" accept="image/*">
                    </div>
                    <button type="submit" class="btn-primary">Kirim Balasan</button>
                </form>
            </div>
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

