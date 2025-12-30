# Y.G.A Mobile App

Aplikasi mobile React untuk platform komunitas Y.G.A. Dibuat dengan React, Vite, dan React Router.

## Instalasi

1. Install dependencies:
```bash
npm install
```

2. Jalankan development server:
```bash
npm run dev
```

3. Build untuk production:
```bash
npm run build
```

## Struktur Project

```
mobile-app/
├── src/
│   ├── components/      # Komponen reusable
│   ├── pages/          # Halaman aplikasi
│   ├── context/        # Context API untuk state management
│   ├── services/       # API services
│   └── App.jsx         # Root component
├── public/             # Static files
└── package.json        # Dependencies
```

## Fitur

- Landing Page
- Homepage dengan filter
- Profile management
- Events (list, detail, create, edit)
- Communities (list, detail, create, edit)
- Authentication dengan localStorage

## Catatan

Aplikasi ini menggunakan dummy data untuk development. Untuk production, pastikan untuk menghubungkan dengan API Laravel backend yang sudah ada.

