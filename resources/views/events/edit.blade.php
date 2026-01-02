<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Y.G.A - Edit Event</title>
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
        header { display: flex; align-items: center; justify-content: space-between; padding: 18px 36px; font-size: 13px; background: #f8f8f8; border-bottom: 1px solid #e0e0e0; }
        .logo { font-weight: 700; color: var(--blue); font-size: 18px; }
        .form-container { padding: 40px; max-width: 800px; margin: 0 auto; }
        .form-title { font-size: 28px; font-weight: 700; margin-bottom: 32px; }
        .form-group { margin-bottom: 24px; }
        .form-label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 8px; }
        .form-input, .form-textarea, .form-select { width: 100%; padding: 12px 16px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; font-family: inherit; }
        .form-textarea { resize: vertical; min-height: 100px; }
        .form-input:focus, .form-textarea:focus, .form-select:focus { outline: none; border-color: var(--blue); }
        .btn-primary { background: var(--blue); color: #fff; padding: 12px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .btn-primary:hover { background: #002766; }
        .btn-secondary { background: #f5f5f5; color: #333; padding: 12px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; margin-right: 12px; }
        .btn-secondary:hover { background: #e0e0e0; }
        .btn-danger { background: var(--red); color: #fff; padding: 12px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .btn-danger:hover { background: #cc2e24; }
    </style>
</head>
<body>
<div class="page">
    <header>
        <div class="logo"><a href="/events/{{ $event->id }}">← Kembali</a></div>
    </header>
    <div class="form-container">
        <h1 class="form-title">Edit Event</h1>
        <form method="POST" action="/events/{{ $event->id }}" enctype="multipart/form-data">
            @csrf
            @method('PUT')
            <div class="form-group">
                <label class="form-label">Judul Event *</label>
                <input type="text" name="title" class="form-input" value="{{ $event->title }}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Deskripsi *</label>
                <textarea name="description" class="form-textarea" required>{{ $event->description }}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Tanggal *</label>
                <input type="date" name="date" class="form-input" value="{{ $event->date->format('Y-m-d') }}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Waktu *</label>
                <input type="time" name="time" class="form-input" value="{{ $event->time }}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Lokasi *</label>
                <input type="text" name="location" class="form-input" value="{{ $event->location }}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Kategori *</label>
                <select name="category" class="form-select" required>
                    <option value="">Pilih kategori</option>
                    <option value="Hobi" {{ $event->category === 'Hobi' ? 'selected' : '' }}>Hobi</option>
                    <option value="Olahraga" {{ $event->category === 'Olahraga' ? 'selected' : '' }}>Olahraga</option>
                    <option value="Workshop" {{ $event->category === 'Workshop' ? 'selected' : '' }}>Workshop</option>
                    <option value="Gaming" {{ $event->category === 'Gaming' ? 'selected' : '' }}>Gaming</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Gambar Event</label>
                @if($event->image_url)
                    <div style="margin-bottom: 12px;">
                        <img src="{{ $event->image_url }}" alt="Current Image" style="max-width: 300px; max-height: 200px; border-radius: 8px; border: 2px solid #ddd;">
                        <p style="font-size: 12px; color: #666; margin-top: 8px;">Gambar saat ini</p>
                    </div>
                @endif
                <input type="file" name="image" class="form-input" accept="image/*" onchange="previewImage(this)">
                <div id="imagePreview" style="margin-top: 12px; display: none;">
                    <img id="previewImg" src="" alt="Preview" style="max-width: 300px; max-height: 200px; border-radius: 8px; border: 2px solid #ddd;">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Maksimal Peserta</label>
                <input type="number" name="max_participants" class="form-input" min="1" value="{{ $event->max_participants }}">
            </div>
            <div class="form-group">
                <label class="form-label">Harga (Rp)</label>
                <input type="number" name="price" class="form-input" min="0" step="1000" value="{{ $event->price }}">
            </div>
            <div class="form-group">
                <label class="form-label">Kontak</label>
                <input type="text" name="contact" class="form-input" value="{{ $event->contact }}">
            </div>
            <div class="form-group">
                <label class="form-label">Persyaratan</label>
                <textarea name="requirements" class="form-textarea">{{ $event->requirements }}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Recap Event (Berita/Artikel setelah event selesai)</label>
                <textarea name="recap" class="form-textarea" style="min-height: 200px;" placeholder="Tuliskan recap/berita tentang bagaimana event berjalan, apakah sukses, ada kekurangan, dll...">{{ $event->recap }}</textarea>
                <p style="font-size: 12px; color: var(--gray); margin-top: 8px;">Recap ini akan muncul di halaman News sebagai artikel berita tentang event.</p>
            </div>
            <div style="display: flex; gap: 12px;">
                <a href="/events/{{ $event->id }}" class="btn-secondary">Batal</a>
                <button type="submit" class="btn-primary">Simpan Perubahan</button>
            </div>
        </form>
        <form method="POST" action="/events/{{ $event->id }}" style="margin-top: 24px;" onsubmit="return confirm('Apakah Anda yakin ingin menghapus event ini?');">
            @csrf
            @method('DELETE')
            <button type="submit" class="btn-danger">Hapus Event</button>
        </form>
    </div>
</div>
<script>
    function previewImage(input) {
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(input.files[0]);
        } else {
            preview.style.display = 'none';
        }
    }
</script>
</body>
</html>

