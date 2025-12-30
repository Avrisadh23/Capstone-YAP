<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Y.G.A - Profile</title>
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
        header { display: flex; align-items: center; justify-content: space-between; padding: 18px 36px; font-size: 13px; color: #7d7d7d; border-bottom: 1px solid #f0f0f0; }
        header nav a { margin-right: 16px; }
        .logo { font-weight: 700; color: var(--blue); font-size: 18px; letter-spacing: 0.5px; }
        .profile-dropdown { position: relative; }
        .profile-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--blue); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; cursor: pointer; }
        .profile-menu { display: none; position: absolute; top: 100%; right: 0; margin-top: 8px; background: #fff; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.15); min-width: 180px; z-index: 100; }
        .profile-menu.active { display: block; }
        .profile-menu a { display: block; padding: 12px 16px; font-size: 14px; color: #333; transition: background 0.2s; }
        .profile-menu a:hover { background: #f5f5f5; }
        .profile-menu a:first-child { border-radius: 8px 8px 0 0; }
        .profile-menu a:last-child { border-radius: 0 0 8px 8px; }
        .profile-container { padding: 60px 40px; max-width: 800px; margin: 0 auto; }
        .profile-header { display: flex; align-items: center; gap: 24px; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 1px solid #f0f0f0; }
        .profile-avatar-large { width: 120px; height: 120px; border-radius: 50%; background: var(--blue); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 48px; flex-shrink: 0; }
        .profile-info h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
        .profile-info p { font-size: 14px; color: var(--gray); }
        .profile-section { margin-bottom: 40px; }
        .profile-section h2 { font-size: 20px; font-weight: 700; margin-bottom: 20px; }
        .form-group { margin-bottom: 20px; }
        .form-label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 8px; color: #000; }
        .form-input { width: 100%; padding: 12px 16px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; font-family: inherit; }
        .form-input:focus { outline: none; border-color: var(--blue); }
        .btn-primary { background: var(--blue); color: #fff; padding: 12px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .btn-primary:hover { background: #002766; }
        .btn-secondary { background: #f5f5f5; color: #333; padding: 12px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .btn-secondary:hover { background: #e0e0e0; }
        @media (max-width: 1024px) {
            .profile-container { padding: 40px 24px; }
            .profile-header { flex-direction: column; text-align: center; }
        }
    </style>
</head>
<body>
<div class="page">
    <header>
        <div class="logo"><a href="/homepage">Y.G.A</a></div>
        <nav>
            <a href="/homepage">Home</a>
            <a href="/homepage#komunitas">Komunitas</a>
            <a href="/homepage#event">Event</a>
            <a href="/homepage#partner">Partner With Us</a>
        </nav>
        <div class="profile-dropdown">
            <div class="profile-avatar" id="headerAvatar" onclick="toggleProfileMenu()">U</div>
            <div class="profile-menu" id="profileMenu">
                <a href="/profile">Profile</a>
                <a href="#" onclick="logout(); return false;">Logout</a>
            </div>
        </div>
    </header>

    <div class="profile-container">
        <div class="profile-header">
            <div class="profile-avatar-large">U</div>
            <div class="profile-info">
                <h1 id="userName">User Name</h1>
                <p id="userEmail">user@example.com</p>
            </div>
        </div>

        <div class="profile-section">
            <h2>Informasi Pribadi</h2>
            <div class="form-group">
                <label class="form-label">Nama Lengkap</label>
                <input type="text" class="form-input" id="fullName" placeholder="Masukkan nama lengkap">
            </div>
            <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-input" id="email" placeholder="Masukkan email">
            </div>
            <div class="form-group">
                <label class="form-label">Nomor Telepon</label>
                <input type="tel" class="form-input" id="phone" placeholder="Masukkan nomor telepon">
            </div>
            <div class="form-group">
                <label class="form-label">Kota</label>
                <select class="form-input" id="city">
                    <option value="">Pilih kota</option>
                    <option value="Jakarta">Jakarta</option>
                    <option value="Surabaya">Surabaya</option>
                    <option value="Bandung">Bandung</option>
                    <option value="Medan">Medan</option>
                    <option value="Semarang">Semarang</option>
                    <option value="Makassar">Makassar</option>
                    <option value="Palembang">Palembang</option>
                    <option value="Yogyakarta">Yogyakarta</option>
                </select>
            </div>
            <button class="btn-primary" onclick="saveProfile()">Simpan Perubahan</button>
        </div>

        <div class="profile-section">
            <h2>Keamanan</h2>
            <div class="form-group">
                <label class="form-label">Password Baru</label>
                <input type="password" class="form-input" id="newPassword" placeholder="Masukkan password baru">
            </div>
            <div class="form-group">
                <label class="form-label">Konfirmasi Password</label>
                <input type="password" class="form-input" id="confirmPassword" placeholder="Konfirmasi password baru">
            </div>
            <button class="btn-primary" onclick="changePassword()">Ubah Password</button>
        </div>
    </div>
</div>

<script>
    // Load user data from localStorage
    window.addEventListener('DOMContentLoaded', function() {
        const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
        document.getElementById('userEmail').textContent = userEmail;
        document.getElementById('email').value = userEmail;
        
        // Set avatar initials
        const headerAvatar = document.getElementById('headerAvatar');
        const profileAvatar = document.querySelector('.profile-avatar-large');
        if (headerAvatar && userEmail) {
            headerAvatar.textContent = userEmail.charAt(0).toUpperCase();
        }
        if (profileAvatar && userEmail) {
            profileAvatar.textContent = userEmail.charAt(0).toUpperCase();
        }
        
        // Check if logged in
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = '/';
        }
    });
    
    function toggleProfileMenu() {
        const menu = document.getElementById('profileMenu');
        menu.classList.toggle('active');
    }
    
    function logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        window.location.href = '/';
    }
    
    function saveProfile() {
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const city = document.getElementById('city').value;
        
        if (fullName) {
            document.getElementById('userName').textContent = fullName;
        }
        if (email) {
            document.getElementById('userEmail').textContent = email;
            localStorage.setItem('userEmail', email);
        }
        
        alert('Profile berhasil disimpan!');
    }
    
    function changePassword() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!newPassword || !confirmPassword) {
            alert('Harap isi semua field password');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('Password tidak cocok');
            return;
        }
        
        alert('Password berhasil diubah!');
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
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

