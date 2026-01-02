<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Y.G.A - Community App</title>
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
        .auth a { margin-left: 12px; padding: 6px 14px; border-radius: 6px; border: 1px solid #003087; }
        .auth a.primary { background: var(--blue); color: #fff; }
        .hero { position: relative; min-height: 520px; background: url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat; color: #fff; overflow: hidden; display: flex; align-items: flex-end; justify-content: center; }
        .hero::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%); }
        .hero-content { position: relative; z-index: 1; padding: 150px; width: 80%; max-width: 1200px; text-align: center; }
        .hero h1 { font-size: 36px; line-height: 1.1; margin-bottom: 10px; }
        .hero p { font-size: 12px; line-height: 1.5; max-width: 600px; margin: 0 auto 24px; }
        .cta-buttons { display: flex; gap: 10px; margin-bottom: 30px; justify-content: center; }
        .badge { display: inline-flex; align-items: center; background: #fff; color: #000; border-radius: 8px; padding: 10px 14px; min-width: 150px; font-size: 11px; box-shadow: 0 10px 20px rgba(0,0,0,0.15); }
        .badge .icon { width: 26px; height: 26px; background: #000; border-radius: 6px; margin-right: 8px; display: grid; place-items: center; color: #fff; font-size: 14px; }
        .filters { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: #003087; color: #fff; padding: 10px 14px; border-radius: 8px; width: calc(100% - 80px); margin: 0 40px 30px; align-items: center; font-size: 12px; }
        .filters .select { background: rgba(255,255,255,0.1); padding: 10px 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; gap: 8px; }
        .filters .go { background: #063a93; padding: 10px 16px; border-radius: 6px; text-align: center; }
        .section { padding: 60px 40px; }
        .section h2 { font-size: 22px; margin-bottom: 8px; color: #0f1218; }
        .section p { color: var(--gray); font-size: 13px; line-height: 1.6; max-width: 480px; }
        .link { color: var(--blue); font-weight: 600; font-size: 13px; display: inline-flex; align-items: center; margin-top: 10px; }
        .grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px; align-items: center; }
        .showcases { display: flex; flex-direction: column; gap: 0; position: relative; }
        .showcases img { width: calc(100% - 20px); border-radius: 14px; box-shadow: 0 12px 30px rgba(0,0,0,0.12); object-fit: cover; height: 140px; position: relative; margin-bottom: 12px; }
        .showcases img:first-child { z-index: 1; }
        .showcases img:nth-child(2) { margin-top: -40px; margin-left: 20px; z-index: 2; width: calc(100% - 10px); }
        .showcases img:nth-child(3) { margin-top: -40px; margin-left: 40px; z-index: 3; }
        .app-card { display: grid; grid-template-columns: 1fr 1.2fr; gap: 40px; align-items: center; }
        .phone { max-width: 240px; justify-self: center; box-shadow: 0 16px 40px rgba(0,0,0,0.16); border-radius: 24px; }
        .stats { display: flex; gap: 30px; margin-top: 20px; font-size: 13px; color: var(--gray); }
        .testimonial { background: linear-gradient(120deg, #0a265d, #003087); color: #fff; border-radius: 12px; padding: 18px; font-size: 13px; box-shadow: 0 16px 32px rgba(0,48,135,0.2); }
        footer { padding: 50px 40px 30px; background: #fff; border-top: 1px solid #f0f0f0; color: #777; font-size: 12px; }
        .footer-grid { display: grid; grid-template-columns: 1.4fr repeat(4, 1fr); gap: 30px; }
        .footer-title { color: #000; font-weight: 700; margin-bottom: 14px; font-size: 14px; }
        .footer-col a { display: block; margin-bottom: 10px; }
        
        /* Modal Styles */
        .modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }
        .modal-overlay.active {
            display: flex;
        }
        .modal {
            background: #fff;
            border-radius: 12px;
            width: 90%;
            max-width: 420px;
            padding: 32px;
            position: relative;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .modal-close {
            position: absolute;
            top: 16px;
            right: 16px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            transition: background 0.2s;
        }
        .modal-close:hover {
            background: #f5f5f5;
        }
        .modal-title {
            font-size: 24px;
            font-weight: 700;
            color: #000;
            margin-bottom: 8px;
        }
        .modal-switch {
            font-size: 14px;
            color: #666;
            margin-bottom: 24px;
        }
        .modal-switch a {
            color: var(--red);
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
        }
        .modal-switch a:hover {
            text-decoration: underline;
        }
        .modal-input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
            margin-bottom: 16px;
            font-family: inherit;
            transition: border-color 0.2s;
        }
        .modal-input:focus {
            outline: none;
            border-color: var(--blue);
        }
        .modal-button {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
            font-family: inherit;
        }
        .modal-button.primary {
            background: #e0e0e0;
            color: #666;
            margin-bottom: 16px;
        }
        .modal-button.primary:hover {
            background: #d0d0d0;
        }
        .modal-button.primary.active {
            background: var(--blue);
            color: #fff;
        }
        .modal-button.primary.active:hover {
            background: #002766;
        }
        .modal-separator {
            text-align: center;
            color: #999;
            font-size: 14px;
            margin: 16px 0;
            position: relative;
        }
        .modal-separator::before,
        .modal-separator::after {
            content: '';
            position: absolute;
            top: 50%;
            width: calc(50% - 20px);
            height: 1px;
            background: #e0e0e0;
        }
        .modal-separator::before {
            left: 0;
        }
        .modal-separator::after {
            right: 0;
        }
        .modal-button.google {
            background: #fff;
            color: #333;
            border: 1px solid #ddd;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
        }
        .modal-button.google:hover {
            background: #f9f9f9;
        }
        .google-icon {
            width: 20px;
            height: 20px;
            background: #4285F4;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-weight: 700;
            font-size: 12px;
        }
        
        @media (max-width: 1024px) {
            .hero-content { width: 90%; }
            .grid, .app-card, .footer-grid { grid-template-columns: 1fr; }
            .filters { grid-template-columns: 1fr; width: calc(100% - 40px); margin: 0 20px 30px; }
            .section { padding: 40px 24px; }
            header { padding: 18px 24px; }
            #testimoni > div { grid-template-columns: 1fr; }
            .modal {
                padding: 24px;
                max-width: 90%;
            }
        }
    </style>
</head>
<body>
<div class="page">
    <header>
        <div class="logo">Y.G.A</div>
        <nav>
            <a href="#event">Event</a>
            <a href="#komunitas">Komunitas</a>
            <a href="#partner">News</a>
        </nav>
        <div class="auth">
            <a href="#" onclick="openModal('login'); return false;">Masuk</a>
            <a class="primary" href="#" onclick="openModal('register'); return false;">Daftar</a>
        </div>
    </header>

    <section class="hero">
        <div class="hero-content">
            <h1>Support Your Community App</h1>
            <p>Platform all-in-one untuk cari Komunitas, atau cari wadah untuk membersamai. Relasi makin luas dan menyenangkan!</p>

            <div class="cta-buttons">
                @foreach($appLinks as $link)
                    <a class="badge" href="{{ $link->url }}" target="_blank">
                        <span class="icon">{{ $link->icon === 'apple' ? '🍎' : '▶' }}</span>
                        <span>
                            <div style="font-size:10px; opacity:.8;">{{ $link->badge_text ?? '' }}</div>
                            <div style="font-weight:700;">{{ $link->label }}</div>
                        </span>
                    </a>
                @endforeach
            </div>
        </div>
    </section>

    <div class="filters">
        <div class="select" style="position: relative; cursor: not-allowed; opacity: 0.6;" onclick="if(!isLoggedIn()) { alert('Silakan login terlebih dahulu untuk menggunakan filter'); return false; }">
            <span style="color: #ff3b30; font-size: 14px; margin-right: 8px;">📍</span>
            <div style="flex: 1;">
                <div style="opacity:.6; font-size:11px;">{{ $filters[0]['label'] }}</div>
                <div style="font-weight:600;">{{ $filters[0]['placeholder'] }}</div>
            </div>
            <span>⌄</span>
            <select style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: not-allowed;" disabled>
                <option>Pilih aktivitas</option>
                <option>Olahraga</option>
                <option>Komunitas</option>
                <option>Event</option>
                <option>Workshop</option>
            </select>
        </div>
        <div class="select" style="position: relative; cursor: not-allowed; opacity: 0.6;" onclick="if(!isLoggedIn()) { alert('Silakan login terlebih dahulu untuk menggunakan filter'); return false; }">
            <span style="color: #ff3b30; font-size: 14px; margin-right: 8px;">📍</span>
            <div style="flex: 1;">
                <div style="opacity:.6; font-size:11px;">{{ $filters[1]['label'] }}</div>
                <div style="font-weight:600;">{{ $filters[1]['placeholder'] }}</div>
            </div>
            <span>⌄</span>
            <select style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: not-allowed;" disabled>
                <option>Pilih kota</option>
                <option>Jakarta</option>
                <option>Surabaya</option>
                <option>Bandung</option>
                <option>Medan</option>
                <option>Semarang</option>
                <option>Makassar</option>
                <option>Palembang</option>
                <option>Depok</option>
                <option>Tangerang</option>
                <option>Bekasi</option>
                <option>Yogyakarta</option>
                <option>Malang</option>
                <option>Denpasar</option>
                <option>Batam</option>
                <option>Pekanbaru</option>
                <option>Bandar Lampung</option>
                <option>Padang</option>
                <option>Pontianak</option>
                <option>Balikpapan</option>
                <option>Manado</option>
            </select>
        </div>
        <div class="select" style="position: relative; cursor: not-allowed; opacity: 0.6;" onclick="if(!isLoggedIn()) { alert('Silakan login terlebih dahulu untuk menggunakan filter'); return false; }">
            <span style="color: #ff3b30; font-size: 14px; margin-right: 8px;">⚽</span>
            <div style="flex: 1;">
                <div style="opacity:.6; font-size:11px;">{{ $filters[2]['label'] }}</div>
                <div style="font-weight:600;">{{ $filters[2]['placeholder'] }}</div>
            </div>
            <span>⌄</span>
            <select style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: not-allowed;" disabled>
                <option>Pilih Cabang Korwil</option>
                <option>Jawa Barat</option>
                <option>Jawa Tengah</option>
                <option>Jawa Timur</option>
                <option>Sumatera Utara</option>
                <option>Sumatera Selatan</option>
                <option>Sulawesi Selatan</option>
                <option>Kalimantan Timur</option>
                <option>Bali</option>
            </select>
        </div>
        <div class="go" style="cursor: not-allowed; opacity: 0.6;" onclick="if(!isLoggedIn()) { alert('Silakan login terlebih dahulu untuk menggunakan filter'); return false; }">Temukan →</div>
    </div>

    @foreach($features as $index => $feature)
        @if($index === 0)
            <section class="section" id="kelola">
                <div class="grid">
                    <div>
                        <h2>{{ $feature->title }}</h2>
                        <p>{{ $feature->description }}</p>
                        @if($feature->link_url)
                            <a class="link" href="{{ $feature->link_url }}">{{ $feature->link_text }} →</a>
                        @endif
                    </div>
                    <div class="showcases">
                        @foreach($showcases as $showcase)
                            <img src="{{ $showcase->image_url }}" alt="{{ $showcase->alt_text }}">
                        @endforeach
                    </div>
                </div>
            </section>
        @else
            <section class="section" id="komunitas">
                <div class="app-card">
                    <img class="phone" src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=320&q=80" alt="Mobile app mock">
                    <div>
                        <div style="font-size:12px; font-weight:700; color: var(--gray); text-transform: uppercase; letter-spacing: 1px;">Ikuti komunitasmu</div>
                        <h2>{{ $feature->title }}</h2>
                        <p>{{ $feature->description }}</p>
                        <div class="stats">
                            <div>Lebih dari 100 komunitas terdaftar sebagai wadah komunitas.</div>
                            <div>Mencakup lebih dari seluruh wilayah di Indonesia.</div>
                        </div>
                    </div>
                </div>
            </section>
        @endif
    @endforeach

    <section class="section" id="testimoni" style="padding:60px 40px; background:#fff;">
        <div style="display:grid; grid-template-columns: 0.35fr 1fr; gap:0; align-items:stretch; border-radius:12px; overflow:hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <!-- Left: Dark Blue Box -->
            <div style="background: linear-gradient(135deg, #003087 0%, #002766 100%); color:#fff; padding:40px 32px; display:flex; align-items:center; justify-content:center; text-align:center;">
                <div style="font-weight:700; font-size:24px; line-height:1.3;">Apa kata mereka?</div>
            </div>
            <!-- Right: Testimonial Card -->
            <div style="background:#fff; padding:32px 40px; position:relative;">
                @php $currentTestimonial = $testimonials->first(); @endphp
                @if($currentTestimonial)
                    <!-- Opening Quote Icon -->
                    <div style="position:absolute; left:40px; top:32px; font-size:64px; color:#003087; line-height:1; font-weight:300; opacity:0.3;">"</div>
                    
                    <!-- Rating Summary -->
                    <div style="display:flex; align-items:center; gap:18px; margin-bottom:20px;">
                        <div style="background:#f4f7ff; border:1px solid #e0e7ff; padding:14px 18px; border-radius:12px; min-width:140px; text-align:center;">
                            <div style="font-size:28px; font-weight:800; color:#0a2f78; line-height:1;">4.8</div>
                            <div style="font-size:12px; color:#4a4f5b; margin:4px 0;">dari 5.0</div>
                            <div style="color:#f5a524; letter-spacing:2px; font-size:14px;">★★★★★</div>
                            <div style="font-size:12px; color:#4a4f5b; margin-top:4px;">2.341 pengguna</div>
                        </div>
                        <div style="flex:1;">
                            <!-- Content -->
                            <div style="display:flex; gap:16px; align-items:flex-start; margin-bottom:10px;">
                                @if($currentTestimonial->avatar_url)
                                    <img src="{{ $currentTestimonial->avatar_url }}" alt="{{ $currentTestimonial->name }}" style="width:56px; height:56px; border-radius:50%; object-fit:cover; flex-shrink:0;">
                                @else
                                    <div style="width:56px; height:56px; border-radius:50%; background:#e0e0e0; flex-shrink:0;"></div>
                                @endif
                                <div style="flex:1;">
                                    <div style="font-weight:700; font-size:15px; color:#000; margin-bottom:4px;">{{ $currentTestimonial->name }}</div>
                                    <div style="font-size:13px; color:#666;">{{ $currentTestimonial->role }}</div>
                                </div>
                            </div>
                            
                            <!-- Quote Text -->
                            <div style="padding-right:48px; margin-bottom:12px; position:relative; z-index:1;">
                                <p style="font-size:14px; line-height:1.7; color:#333; font-style:italic;">{{ $currentTestimonial->quote }}</p>
                            </div>
                            
                            <!-- Secondary rating info -->
                            <div style="display:flex; gap:12px; flex-wrap:wrap; font-size:12px; color:#4a4f5b;">
                                <span style="display:inline-flex; align-items:center; gap:6px; padding:6px 10px; background:#f7f9ff; border:1px solid #e6ebff; border-radius:8px;">⭐ 4.9 Layanan</span>
                                <span style="display:inline-flex; align-items:center; gap:6px; padding:6px 10px; background:#f7f9ff; border:1px solid #e6ebff; border-radius:8px;">⭐ 4.8 Fitur</span>
                                <span style="display:inline-flex; align-items:center; gap:6px; padding:6px 10px; background:#f7f9ff; border:1px solid #e6ebff; border-radius:8px;">⭐ 4.7 Keamanan</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Pagination -->
                    <div style="display:flex; align-items:center; justify-content:center; gap:12px; margin-top:10px;">
                        <button style="background:none; border:1px solid #ddd; border-radius:6px; width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#666;">←</button>
                        <span style="font-size:13px; color:#666; font-weight:500;">01 / {{ $testimonials->count() < 3 ? '03' : str_pad($testimonials->count(), 2, '0', STR_PAD_LEFT) }}</span>
                        <button style="background:none; border:1px solid #ddd; border-radius:6px; width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#666;">→</button>
                    </div>
                    
                    <!-- Closing Quote Icon -->
                    <div style="position:absolute; right:40px; bottom:32px; font-size:64px; color:#003087; line-height:1; font-weight:300; opacity:0.3;">"</div>
                @endif
            </div>
        </div>
    </section>

    <footer>
        <div class="footer-grid">
            <div>
                <div class="logo" style="margin-bottom:12px; font-size:20px;">Y.G.A</div>
                <div style="font-size:13px; line-height:1.8; color:#666; margin-bottom:16px;">
                    PT YGA Solutions<br>
                    Jl. Warid No.100<br>
                    Jakarta, Indonesia
                </div>
                <div style="display:flex; gap:12px; margin-top:16px;">
                    <a href="#" style="width:32px; height:32px; display:flex; align-items:center; justify-content:center; border-radius:6px; background:#f5f5f5; color:#666; font-size:16px;" title="Website">🌐</a>
                    <a href="#" style="width:32px; height:32px; display:flex; align-items:center; justify-content:center; border-radius:6px; background:#f5f5f5; color:#666; font-size:16px;" title="Facebook">📘</a>
                    <a href="#" style="width:32px; height:32px; display:flex; align-items:center; justify-content:center; border-radius:6px; background:#f5f5f5; color:#666; font-size:16px;" title="Twitter">🐦</a>
                    <a href="#" style="width:32px; height:32px; display:flex; align-items:center; justify-content:center; border-radius:6px; background:#f5f5f5; color:#666; font-size:16px;" title="LinkedIn">💼</a>
                </div>
            </div>
            <div class="footer-col">
                <div class="footer-title">Perusahaan</div>
                <a href="#" style="display:block; margin-bottom:10px; color:#666; font-size:13px;">Tentang</a>
                <a href="#" style="display:block; margin-bottom:10px; color:#666; font-size:13px;">Kebijakan & Privasi</a>
                <a href="#" style="display:block; margin-bottom:10px; color:#666; font-size:13px;">Syarat dan Ketentuan</a>
            </div>
            <div class="footer-col">
                <div class="footer-title">Fitur Kita</div>
                <a href="#" style="display:block; margin-bottom:10px; color:#666; font-size:13px;">Show Event</a>
                <a href="#" style="display:block; margin-bottom:10px; color:#666; font-size:13px;">Join Event</a>
                <a href="#" style="display:block; margin-bottom:10px; color:#666; font-size:13px;">Show Komunitas</a>
                <a href="#" style="display:block; margin-bottom:10px; color:#666; font-size:13px;">Join Komunitas</a>
            </div>
            <div class="footer-col">
                <div class="footer-title">Hubungi Kami</div>
                <a href="#" style="display:block; margin-bottom:10px; color:#666; font-size:13px;">Kontak</a>
            </div>
            <div class="footer-col">
                <div class="footer-title">Unduh Aplikasi</div>
                @foreach($appLinks as $link)
                    <a href="{{ $link->url }}" target="_blank" style="display:inline-block; margin-bottom:10px;">
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
            <div style="position:relative;">
                <select style="padding:8px 32px 8px 12px; border:1px solid #ddd; border-radius:6px; background:#fff; font-size:13px; color:#666; cursor:pointer; appearance:none;">
                    <option>Bahasa Indonesia</option>
                    <option>English</option>
                </select>
                <span style="position:absolute; right:12px; top:50%; transform:translateY(-50%); pointer-events:none; color:#666;">▼</span>
            </div>
        </div>
    </footer>
</div>

<!-- Modal Login/Register -->
<div class="modal-overlay" id="authModal" onclick="closeModalOnOverlay(event)">
    <div class="modal" onclick="event.stopPropagation()">
        <button class="modal-close" onclick="closeModal()">×</button>
        
        <!-- Register Form -->
        <div id="registerForm">
            <h2 class="modal-title">Daftar</h2>
            <div class="modal-switch">
                Sudah punya akun Y.G.A? <a href="#" onclick="switchToLogin(); return false;">Masuk</a>
            </div>
            @if(session('error') && !session('_login_error'))
                <div style="background: #fee; border: 1px solid #fcc; color: #c33; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;">
                    {{ session('error') }}
                </div>
            @endif
            @if($errors->any() && !session('_login_error'))
                <div style="background: #fee; border: 1px solid #fcc; color: #c33; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;">
                    <ul style="margin: 0; padding-left: 20px;">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
            @if(session('success') && !session('_login_success'))
                <div style="background: #efe; border: 1px solid #cfc; color: #3c3; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;">
                    {{ session('success') }}
                </div>
            @endif
            <form id="registerFormData" method="POST" action="/register" enctype="multipart/form-data">
                @csrf
                <input type="email" class="modal-input" name="email" id="registerEmail" placeholder="Email" value="{{ old('email') }}" required>
                <input type="text" class="modal-input" name="nama_lengkap" id="registerNamaLengkap" placeholder="Nama Lengkap" value="{{ old('nama_lengkap') }}" required>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 13px; color: #666; margin-bottom: 6px;">Tanggal Lahir</label>
                    <input type="date" class="modal-input" name="tgl_lahir" id="registerTglLahir" value="{{ old('tgl_lahir') }}" required>
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 13px; color: #666; margin-bottom: 6px;">Foto Profile</label>
                    <input type="file" class="modal-input" name="foto_profile" id="registerFotoProfile" accept="image/*" style="padding: 8px;">
                    <div id="fotoPreview" style="margin-top: 8px; display: none;">
                        <img id="previewImage" src="" alt="Preview" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover; border: 2px solid #ddd;">
                    </div>
                </div>
                <button type="submit" class="modal-button primary active" id="registerNextBtn">Daftar</button>
            </form>
            <div class="modal-separator">atau</div>
            <button class="modal-button google" onclick="handleGoogleAuth('register')">
                <span class="google-icon">G</span>
                <span>Daftar dengan Google</span>
            </button>
        </div>
        
        <!-- Login Form -->
        <div id="loginForm" style="display: none;">
            <h2 class="modal-title">Masuk</h2>
            <div class="modal-switch">
                Belum punya akun? <a href="#" onclick="switchToRegister(); return false;">Daftar</a>
            </div>
            @if(session('error') && session('_login_error'))
                <div style="background: #fee; border: 1px solid #fcc; color: #c33; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;">
                    {{ session('error') }}
                </div>
            @endif
            @if(session('success') && session('_login_success'))
                <div style="background: #efe; border: 1px solid #cfc; color: #3c3; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;">
                    {{ session('success') }}
                </div>
            @endif
            <form id="loginFormData" method="POST" action="/login">
                @csrf
                <input type="email" class="modal-input" id="loginInput" name="email" placeholder="Email" required>
                <button type="submit" class="modal-button primary active" id="loginNextBtn">Selanjutnya</button>
            </form>
            <div class="modal-separator">atau</div>
            <button class="modal-button google" onclick="handleGoogleAuth('login')">
                <span class="google-icon">G</span>
                <span>Masuk dengan Google</span>
            </button>
        </div>
    </div>
</div>

<script>
    function openModal(type) {
        const modal = document.getElementById('authModal');
        modal.classList.add('active');
        
        if (type === 'login') {
            switchToLogin();
        } else {
            switchToRegister();
        }
    }
    
    function closeModal() {
        const modal = document.getElementById('authModal');
        modal.classList.remove('active');
    }
    
    function closeModalOnOverlay(event) {
        if (event.target.id === 'authModal') {
            closeModal();
        }
    }
    
    function switchToLogin() {
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('loginInput').focus();
    }
    
    function switchToRegister() {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
        const registerEmail = document.getElementById('registerEmail');
        if (registerEmail) {
            registerEmail.focus();
        }
    }
    
    
    function handleGoogleAuth(type) {
        console.log(`${type === 'login' ? 'Login' : 'Register'} dengan Google`);
        // Here you can add Google OAuth logic
    }
    
    function isLoggedIn() {
        // Check if user is logged in (you can use session/localStorage)
        return localStorage.getItem('isLoggedIn') === 'true';
    }
    
    function handleNext(type) {
        if (type === 'register') {
            // Register form will be submitted via form submit
            return;
        }
        
        // Login form will be submitted via form submit
        const form = document.getElementById('loginFormData');
        if (form) {
            form.submit();
        }
    }
    
    // Handle foto profile preview
    const fotoInput = document.getElementById('registerFotoProfile');
    if (fotoInput) {
        fotoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('fotoPreview');
                    const previewImage = document.getElementById('previewImage');
                    if (preview && previewImage) {
                        previewImage.src = e.target.result;
                        preview.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Handle form submit - don't block default submission
    const registerForm = document.getElementById('registerFormData');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            // Let form submit normally to backend
            // No need to prevent default
        });
    }
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Auto-open login modal if there's a login error
    @if(session('error') && session('_login_error'))
        document.addEventListener('DOMContentLoaded', function() {
            openModal('login');
        });
    @endif
    
    // Auto-open register modal if there's a register error or validation errors
    @if((session('error') && !session('_login_error')) || ($errors->any() && !session('_login_error')))
        document.addEventListener('DOMContentLoaded', function() {
            openModal('register');
        });
    @endif
    
    // Enable/disable button based on input
    const registerEmail = document.getElementById('registerEmail');
    if (registerEmail) {
        registerEmail.addEventListener('input', function() {
            const btn = document.getElementById('registerNextBtn');
            if (btn) {
                if (this.value.trim()) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            }
        });
    }
    
    const loginInput = document.getElementById('loginInput');
    if (loginInput) {
        loginInput.addEventListener('input', function() {
            const btn = document.getElementById('loginNextBtn');
            if (this.value.trim()) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
</script>

</body>
</html>
