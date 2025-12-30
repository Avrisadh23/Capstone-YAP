<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Y.G.A - Buat Komunitas</title>
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
        header { display: flex; align-items: center; justify-content: space-between; padding: 18px 36px; font-size: 13px; border-bottom: 1px solid #f0f0f0; }
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
    </style>
</head>
<body>
<div class="page">
    <header>
        <div class="logo"><a href="/communities">← Kembali</a></div>
    </header>
    <div class="form-container">
        <h1 class="form-title">Buat Komunitas Baru</h1>
        <form method="POST" action="/communities">
            @csrf
            <div class="form-group">
                <label class="form-label">Nama Komunitas *</label>
                <input type="text" name="name" class="form-input" required>
            </div>
            <div class="form-group">
                <label class="form-label">Deskripsi *</label>
                <textarea name="description" class="form-textarea" required></textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Lokasi *</label>
                <input type="text" name="location" class="form-input" required>
            </div>
            <div class="form-group">
                <label class="form-label">Kategori *</label>
                <select name="category" class="form-select" required>
                    <option value="">Pilih kategori</option>
                    <option value="Hobi">Hobi</option>
                    <option value="Olahraga">Olahraga</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Gaming">Gaming</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">URL Gambar</label>
                <input type="url" name="image_url" class="form-input" placeholder="https://example.com/image.jpg">
            </div>
            <div class="form-group">
                <label class="form-label">Aturan Komunitas</label>
                <textarea name="rules" class="form-textarea"></textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Kontak</label>
                <input type="text" name="contact" class="form-input">
            </div>
            <div style="display: flex; gap: 12px;">
                <a href="/communities" class="btn-secondary">Batal</a>
                <button type="submit" class="btn-primary">Buat Komunitas</button>
            </div>
        </form>
    </div>
</div>
</body>
</html>

