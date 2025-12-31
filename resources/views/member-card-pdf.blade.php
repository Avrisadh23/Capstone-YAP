<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kartu Anggota Digital - {{ $user->nama_lengkap ?? $user->name }}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Arial', sans-serif; color: #1b1b1b; background: #fff; }
        .member-card { width: 400px; height: 250px; background: linear-gradient(135deg, #003087 0%, #002766 100%); border-radius: 20px; padding: 32px; color: #fff; position: relative; overflow: hidden; margin: 0 auto; }
        .member-card::before { content: ''; position: absolute; top: -50%; right: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; position: relative; z-index: 1; }
        .card-logo { font-size: 24px; font-weight: 700; }
        .card-badge { background: rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .card-body { position: relative; z-index: 1; display: flex; align-items: center; gap: 20px; }
        .card-photo { width: 100px; height: 100px; border-radius: 50%; border: 4px solid #fff; object-fit: cover; flex-shrink: 0; background: #fff; }
        .card-info { flex: 1; }
        .card-name { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
        .card-email { font-size: 13px; opacity: 0.9; margin-bottom: 12px; }
        .card-details { font-size: 12px; }
        .card-detail-item { margin-bottom: 6px; }
        .card-footer { margin-top: 20px; text-align: center; font-size: 10px; opacity: 0.7; position: relative; z-index: 1; }
    </style>
</head>
<body>
    <div class="member-card">
        <div class="card-header">
            <div class="card-logo">Y.A.P</div>
            <div class="card-badge">ANGGOTA</div>
        </div>
        <div class="card-body">
            @if($user && $user->foto_profile)
                <img src="{{ public_path('storage/' . $user->foto_profile) }}" alt="Foto Profile" class="card-photo">
            @else
                <div class="card-photo" style="display: flex; align-items: center; justify-content: center; font-size: 40px; color: #003087; background: #fff;">
                    {{ strtoupper(substr($user->email ?? 'U', 0, 1)) }}
                </div>
            @endif
            <div class="card-info">
                <div class="card-name">{{ $user->nama_lengkap ?? $user->name ?? 'Nama Lengkap' }}</div>
                <div class="card-email">{{ $user->email }}</div>
                <div class="card-details">
                    <div class="card-detail-item">Tanggal Lahir: {{ $user->tgl_lahir ? $user->tgl_lahir->format('d/m/Y') : '-' }}</div>
                    <div class="card-detail-item">Member Since: {{ $user->created_at->format('M Y') }}</div>
                    <div class="card-detail-item">ID: #{{ str_pad($user->id, 6, '0', STR_PAD_LEFT) }}</div>
                </div>
            </div>
        </div>
        <div class="card-footer">
            Kartu Anggota Digital Y.A.P Community Platform
        </div>
    </div>
</body>
</html>

