import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001; // Port terpisah dari Vite dev server

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup multer untuk file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads', 'profiles');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// Setup LowDB database
const dbPath = path.join(__dirname, 'mobile-app-db.json');
const adapter = new JSONFile(dbPath);
const db = new Low(adapter, {
  users: [],
  communities: [],
  community_joins: [],
  events: [],
  event_joins: []
});

// Initialize database
await db.read();
if (!db.data.users) {
  db.data.users = [];
}
if (!db.data.communities) {
  db.data.communities = [];
}
if (!db.data.community_joins) {
  db.data.community_joins = [];
}
if (!db.data.events) {
  db.data.events = [];
}
if (!db.data.event_joins) {
  db.data.event_joins = [];
}
await db.write();

// Routes
// Register user
app.post('/api/mobile/register', upload.single('foto_profile'), (req, res) => {
  try {
    const { email, nama_lengkap, tgl_lahir } = req.body;
    
    if (!email || !nama_lengkap || !tgl_lahir) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, nama lengkap, dan tanggal lahir harus diisi' 
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    await db.read();
    const existingUser = db.data.users.find(u => u.email === normalizedEmail);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email sudah terdaftar' 
      });
    }

    // Handle foto profile
    let fotoProfilePath = null;
    if (req.file) {
      fotoProfilePath = `/uploads/profiles/${req.file.filename}`;
    }

    // Insert user
    const newUser = {
      id: db.data.users.length + 1,
      email: normalizedEmail,
      name: nama_lengkap,
      nama_lengkap: nama_lengkap,
      tgl_lahir: tgl_lahir,
      foto_profile: fotoProfilePath,
      password: 'password', // Default password
      created_at: new Date().toISOString()
    };
    
    db.data.users.push(newUser);
    await db.write();

    res.json({
      success: true,
      message: 'Registrasi berhasil!',
      user: {
        id: newUser.id,
        email: normalizedEmail,
        nama_lengkap,
        tgl_lahir,
        foto_profile: fotoProfilePath
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan saat registrasi: ' + error.message 
    });
  }
});

// Get user profile
app.get('/api/mobile/user/:email', async (req, res) => {
  try {
    const email = req.params.email.toLowerCase().trim();
    await db.read();
    const user = db.data.users.find(u => u.email === email);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User tidak ditemukan' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        nama_lengkap: user.nama_lengkap,
        tgl_lahir: user.tgl_lahir,
        foto_profile: user.foto_profile,
        foto_profile_url: user.foto_profile ? `http://localhost:${PORT}${user.foto_profile}` : null
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan: ' + error.message 
    });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
app.listen(PORT, () => {
  console.log(`✅ Mobile API server running on http://localhost:${PORT}`);
  console.log(`📁 Database: ${dbPath}`);
  console.log(`💡 Start with: npm run server`);
  console.log(`💡 Or run both server and dev: npm run dev:all`);
});

