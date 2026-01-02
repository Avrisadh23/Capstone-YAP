<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Y.G.A - Forum Diskusi {{ $community->name }}</title>
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
        .container { padding: 40px; }
        .forum-header { margin-bottom: 32px; }
        .forum-title { font-size: 32px; font-weight: 700; margin-bottom: 8px; }
        .forum-subtitle { font-size: 14px; color: var(--gray); margin-bottom: 16px; }
        .alert { padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; }
        .alert-success { background: #d4edda; color: #155724; }
        .alert-error { background: #f8d7da; color: #721c24; }
        .post-card { background: #f8f8f8; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
        .post-create-card { background: #f8f8f8; border-radius: 12px; padding: 20px; margin-bottom: 32px; cursor: pointer; transition: background 0.2s; }
        .post-create-card:hover { background: #eeeeee; }
        .post-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .user-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--blue); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; }
        .post-user-info { flex: 1; }
        .post-user-name { font-weight: 600; font-size: 14px; margin-bottom: 2px; }
        .post-time { font-size: 12px; color: var(--gray); }
        .post-content { font-size: 14px; line-height: 1.6; color: var(--text); margin-bottom: 12px; white-space: pre-wrap; }
        .post-image { width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; }
        .post-footer { display: flex; align-items: center; gap: 16px; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0; }
        .post-replies { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--gray); cursor: pointer; }
        .post-replies:hover { color: var(--blue); }
        .event-box { background: #ff3b30; color: #fff; padding: 12px 16px; border-radius: 8px; margin-bottom: 12px; display: flex; align-items: center; gap: 12px; }
        .event-icon { font-size: 20px; }
        .event-date { font-weight: 600; }
        .form-group { margin-bottom: 20px; }
        .form-label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 8px; }
        .form-input, .form-textarea { width: 100%; padding: 12px 16px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; font-family: inherit; }
        .form-textarea { resize: vertical; min-height: 120px; }
        .form-input:focus, .form-textarea:focus { outline: none; border-color: var(--blue); }
        .btn-primary { background: var(--blue); color: #fff; padding: 12px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .btn-primary:hover { background: #002766; }
        .btn-secondary { background: #f5f5f5; color: #333; padding: 12px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .btn-secondary:hover { background: #e0e0e0; }
        .modal-overlay { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; }
        .modal-overlay.active { display: flex; }
        .modal { background: #fff; border-radius: 12px; width: 90%; max-width: 600px; padding: 32px; position: relative; max-height: 90vh; overflow-y: auto; }
        .modal-close { position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 24px; cursor: pointer; color: var(--gray); }
        .modal-close:hover { color: var(--text); }
        .pagination { display: flex; justify-content: center; gap: 8px; margin-top: 32px; }
        .pagination a, .pagination span { padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; color: #333; }
        .pagination .active { background: var(--blue); color: #fff; border-color: var(--blue); }
        @media (max-width: 1024px) {
            .container { padding: 24px; }
            header { padding: 18px 24px; }
        }
    </style>
</head>
<body>
<div class="page">
    <header>
        <div class="logo"><a href="/communities/{{ $community->id }}">← Kembali ke Komunitas</a></div>
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

        <div class="forum-header">
            <h1 class="forum-title">Forum Diskusi</h1>
            <p class="forum-subtitle">{{ $community->name }}</p>
        </div>

        <!-- Create New Post Card -->
        <div class="post-create-card" onclick="openCreateModal()">
            <div class="post-header">
                @if(isset($user) && $user && $user->foto_profile)
                    <img src="{{ asset('storage/' . $user->foto_profile) }}" alt="Profile" class="user-avatar" style="object-fit: cover;">
                @else
                    <div class="user-avatar">{{ isset($user) && $user ? ($user->nama_lengkap ?? $user->name ?? $user->email)[0] : 'U' }}</div>
                @endif
                <div class="post-user-info">
                    <div class="post-user-name">{{ isset($user) && $user ? ($user->nama_lengkap ?? $user->name ?? 'User') : 'User' }}</div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; color: var(--gray);">
                    <span style="font-size: 20px;">+</span>
                    <span>Tulis sesuatu dalam forum ini</span>
                </div>
            </div>
        </div>

        <!-- Posts List -->
        @forelse($posts as $post)
        <div class="post-card" onclick="window.location.href='{{ route('forum.show', [$community->id, $post->id]) }}'">
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
            <div class="post-footer">
                <div class="post-replies">
                    <span>💬</span>
                    <span>{{ $post->replies_count ?? 0 }} balasan</span>
                </div>
            </div>
        </div>
        @empty
        <div class="post-card" style="text-align: center; color: var(--gray);">
            <p>Belum ada post dalam forum ini. Jadilah yang pertama membuat post!</p>
        </div>
        @endforelse

        <!-- Pagination -->
        @if($posts->hasPages())
        <div class="pagination">
            @if($posts->onFirstPage())
                <span>&laquo;</span>
            @else
                <a href="{{ $posts->previousPageUrl() }}">&laquo;</a>
            @endif

            @foreach($posts->getUrlRange(1, $posts->lastPage()) as $page => $url)
                @if($page == $posts->currentPage())
                    <span class="active">{{ $page }}</span>
                @else
                    <a href="{{ $url }}">{{ $page }}</a>
                @endif
            @endforeach

            @if($posts->hasMorePages())
                <a href="{{ $posts->nextPageUrl() }}">&raquo;</a>
            @else
                <span>&raquo;</span>
            @endif
        </div>
        @endif
    </div>
</div>

<!-- Create Post Modal -->
<div class="modal-overlay" id="createModal" onclick="closeCreateModal(event)">
    <div class="modal" onclick="event.stopPropagation()">
        <button class="modal-close" onclick="closeCreateModal()">×</button>
        <h2 style="margin-bottom: 24px; font-size: 24px; font-weight: 700;">Buat Post Baru</h2>
        <form method="POST" action="{{ route('forum.store', $community->id) }}" enctype="multipart/form-data">
            @csrf
            <div class="form-group">
                <label class="form-label">Konten</label>
                <textarea name="content" class="form-textarea" placeholder="Tulis sesuatu..." required></textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Gambar (Opsional)</label>
                <input type="file" name="image" class="form-input" accept="image/*">
            </div>
            <div style="display: flex; gap: 12px;">
                <button type="submit" class="btn-primary">Post</button>
                <button type="button" class="btn-secondary" onclick="closeCreateModal()">Batal</button>
            </div>
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
    });
    
    function toggleProfileMenu() {
        document.getElementById('profileMenu').classList.toggle('active');
    }
    
    function logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        window.location.href = '/';
    }

    function openCreateModal() {
        document.getElementById('createModal').classList.add('active');
    }

    function closeCreateModal(event) {
        if (!event || event.target.id === 'createModal') {
            document.getElementById('createModal').classList.remove('active');
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

