<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Y.G.A - Kelola Event</title>
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
        header { display: flex; align-items: center; justify-content: space-between; padding: 18px 36px; font-size: 13px; border-bottom: 1px solid #f0f0f0; }
        .logo { font-weight: 700; color: var(--blue); font-size: 18px; }
        .section { padding: 40px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .section-title { font-size: 28px; font-weight: 700; }
        .btn-primary { background: var(--blue); color: #fff; padding: 12px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .btn-primary:hover { background: #002766; }
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
        .card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .card-image { width: 100%; height: 180px; object-fit: cover; }
        .card-content { padding: 16px; }
        .card-title { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
        .card-actions { display: flex; gap: 8px; margin-top: 12px; }
        .btn-edit { background: var(--blue); color: #fff; padding: 8px 16px; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; }
        .btn-delete { background: var(--red); color: #fff; padding: 8px 16px; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; }
    </style>
</head>
<body>
<div class="page">
    <header>
        <div class="logo"><a href="/events">← Kembali ke Events</a></div>
    </header>
    <section class="section">
        <div class="section-header">
            <h2 class="section-title">Kelola Event Saya</h2>
            <a href="/events/create" class="btn-primary">+ Buat Event Baru</a>
        </div>
        <div class="cards-grid">
            @forelse($events as $event)
            <div class="card">
                <img src="{{ $event->image_url ?: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80' }}" alt="{{ $event->title }}" class="card-image">
                <div class="card-content">
                    <div class="card-title">{{ $event->title }}</div>
                    <div style="font-size: 12px; color: var(--gray); margin-bottom: 8px;">
                        📅 {{ $event->date->format('d M Y') }} • 👥 {{ $event->participants_count }} peserta
                    </div>
                    <div class="card-actions">
                        <a href="/events/{{ $event->id }}/edit" class="btn-edit">Edit</a>
                        <form method="POST" action="/events/{{ $event->id }}" style="display: inline;" onsubmit="return confirm('Hapus event ini?');">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn-delete">Hapus</button>
                        </form>
                    </div>
                </div>
            </div>
            @empty
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray);">
                Belum ada event yang dibuat.
            </div>
            @endforelse
        </div>
    </section>
</div>
</body>
</html>

