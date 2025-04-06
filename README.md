# LearnMate

LearnMate adalah platform mentoring online yang menghubungkan mentor dengan mentee untuk sesi pembelajaran interaktif. Platform ini menyediakan sistem booking, integrasi Zoom untuk pertemuan virtual, manajemen profil lengkap, dan sistem pembayaran terintegrasi.

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi](#teknologi)
- [Arsitektur](#arsitektur)
- [Alur Kerja](#alur-kerja)
- [Struktur Proyek](#struktur-proyek)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Instalasi dan Konfigurasi](#instalasi-dan-konfigurasi)
- [Pengembangan ke Depan](#pengembangan-ke-depan)
- [Kontributor](#kontributor)
- [Lisensi](#lisensi)

## Fitur Utama

- 👤 **Manajemen Profil**: Profil lengkap untuk mentor dan mentee dengan pendidikan, pengalaman, dan keahlian
- 🗓️ **Sistem Booking**: Pencarian, pemesanan, dan konfirmasi jadwal mentoring
- 📝 **Preferensi Pembelajaran**: Penyesuaian pengalaman belajar berdasarkan gaya belajar dan tujuan
- 📹 **Integrasi Zoom**: Pembuatan meeting otomatis untuk sesi dengan opsi join melalui browser atau aplikasi
- 💰 **Sistem Pembayaran**: Integrasi dengan gateway pembayaran untuk transaksi sesi mentoring
- ⭐ **Sistem Rating & Review**: Ulasan dan penilaian untuk meningkatkan kualitas mentoring
- 📊 **Dashboard**: Pantau sesi mendatang, riwayat sesi, dan rekomendasi mentor
- 🔍 **Pencarian Lanjutan**: Filter berdasarkan kategori, rating, dan harga

## Teknologi

- **Frontend**: Next.js, React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL dengan Prisma ORM
- **Autentikasi**: NextAuth.js
- **Integrasi**: Zoom API, Midtrans Payment Gateway
- **State Management**: React Context API
- **Styling**: Tailwind CSS dengan theming support

## Arsitektur

### High-Level Architecture

```
├── Client Layer
│   ├── Dashboard Pages (React Components)
│   ├── Authentication UI
│   └── Profile Management UI
│
├── API Layer (Next.js API Routes)
│   ├── Authentication (/api/auth/*)
│   ├── Bookings (/api/v1/bookings/*)
│   ├── Meetings (/api/v1/meetings/*)
│   ├── Reviews (/api/v1/reviews/*)
│   ├── Payments (/api/v1/payment/*)
│   └── Users (/api/v1/users/*)
│
├── Service Layer
│   ├── Authentication Service
│   ├── Booking Service
│   ├── Meeting Service
│   ├── Payment Service
│   └── User Service
│
├── Data Access Layer
│   └── Prisma ORM
│
└── Database
    └── PostgreSQL
```

### Routing Structure

```
/
├── app/
│   ├── auth/         # Authentication pages (login, register)
│   ├── onboarding/   # User onboarding process
│   ├── dashboard/    # Protected dashboard routes
│   │   ├── bookings/ # Booking management
│   │   │   └── confirm/[id]/ # Confirm booking page with payment
│   │   ├── meetings/[id]/ # Meeting details and join options
│   │   ├── mentors/  # Mentor listings
│   │   │   └── [id]/ # Individual mentor profile
│   │   ├── profile/  # User profile management
│   │   ├── reviews/  # Review management
│   │   │   └── create/ # Create review page
│   │   └── search/   # Mentor search page with filters
│   └── api/         # API routes
│       ├── auth/     # Authentication endpoints
│       └── v1/      # API version 1
│           ├── bookings/ # Booking API endpoints
│           ├── meetings/ # Meeting API endpoints
│           ├── mentors/  # Mentor API endpoints
│           ├── reviews/  # Review API endpoints
│           ├── payment/  # Payment API endpoints
│           └── users/    # User API endpoints
├── components/      # Shared UI components
│   ├── ui/          # Base UI components (shadcn/ui)
│   ├── mentor/      # Mentor-specific components
│   ├── meetings/    # Meeting-related components
│   └── profile/     # Profile-specific components
├── hooks/           # Custom React hooks
├── context/         # React context providers
└── lib/            # Utility functions and services
    ├── date-utils.ts  # Utilitas format dan manipulasi tanggal
    ├── session-utils.ts # Session management utilities
    └── utils.ts     # General utility functions
```

## Alur Kerja

### Alur Pengguna Umum

1. **Registrasi/Login**: Pengguna mendaftar sebagai mentor atau mentee
2. **Onboarding**: Pengguna melengkapi profil dengan data diri, pendidikan, pengalaman, dan preferensi
3. **Profil**: Melengkapi profil dengan pengalaman, pendidikan, dan preferensi pembelajaran
4. **Dashboard**: Akses ke fitur platform sesuai dengan jenis pengguna (mentor/mentee)

### Alur Booking dan Sesi

1. **Pencarian**: Mentee mencari mentor berdasarkan keahlian, rating, dan harga
2. **Booking**: Mentee memilih jadwal dan membuat booking dengan mentor
3. **Pembayaran**: Mentee melakukan pembayaran untuk sesi
4. **Konfirmasi**: Mentor mengkonfirmasi booking dan sistem membuat Zoom meeting secara otomatis
5. **Meeting**: Kedua pihak menghadiri meeting melalui link Zoom yang diberikan
6. **Review**: Setelah sesi selesai, mentee memberikan rating dan review untuk mentor

## API Endpoints

### Booking API

#### `GET /api/v1/bookings`

Mengambil semua booking milik user yang sedang login.

**Response**:

```json
{
  "bookings": [
    {
      "id": "clg2u3jk50000v9qt7s8j3l5b",
      "mentorId": "clg2u3jk50000v9qt7s8j3l5a",
      "studentId": "clg2u3jk50000v9qt7s8j3l5c",
      "topic": "JavaScript Fundamentals",
      "date": "2023-06-15T13:00:00Z",
      "duration": 60,
      "status": "confirmed",
      "zoomJoinUrl": "https://zoom.us/j/123456789",
      "zoomStartUrl": "https://zoom.us/s/123456789",
      "zoomPassword": "123456",
      "mentor": {
        "id": "clg2u3jk50000v9qt7s8j3l5a",
        "name": "Budi Santoso",
        "profileImage": "/placeholder.svg?height=200&width=200",
        "expertise": "JavaScript, React, Node.js"
      }
    }
  ]
}
```

#### `GET /api/v1/bookings/:id`

Mengambil detail booking tertentu.

**Response**:

```json
{
  "id": "clg2u3jk50000v9qt7s8j3l5b",
  "mentorId": "clg2u3jk50000v9qt7s8j3l5a",
  "studentId": "clg2u3jk50000v9qt7s8j3l5c",
  "topic": "JavaScript Fundamentals",
  "date": "2023-06-15T13:00:00Z",
  "duration": 60,
  "status": "confirmed",
  "mentor": {
    "id": "clg2u3jk50000v9qt7s8j3l5a",
    "name": "Budi Santoso",
    "profileImage": "/placeholder.svg?height=200&width=200",
    "expertise": "JavaScript, React, Node.js",
    "rate": 350000
  }
}
```

#### `POST /api/v1/bookings/create`

Membuat booking baru dengan mentor.

**Request**:
```json
{
  "mentorId": "clg2u3jk50000v9qt7s8j3l5a",
  "date": "2023-06-15T13:00:00Z",
  "time": "13:00",
  "duration": 60,
  "topic": "JavaScript Fundamentals",
  "notes": "Pertanyaan tentang async/await",
  "orderId": "20230615130012ABCD"
}
```

**Response**:
```json
{
  "id": "clg2u3jk50000v9qt7s8j3l5b",
  "mentorId": "clg2u3jk50000v9qt7s8j3l5a",
  "studentId": "clg2u3jk50000v9qt7s8j3l5c",
  "topic": "JavaScript Fundamentals",
  "date": "2023-06-15T13:00:00Z",
  "duration": 60,
  "status": "pending"
}
```

#### `PUT /api/v1/bookings/:id/confirm`

Mengkonfirmasi booking tertentu.

**Response**:

```json
{
  "success": true,
  "booking": {
    "id": "clg2u3jk50000v9qt7s8j3l5b",
    "status": "confirmed"
  }
}
```

### Reviews API

#### `POST /api/v1/reviews/create`

Membuat ulasan baru untuk mentor.

**Request**:

```json
{
  "mentorId": "clg2u3jk50000v9qt7s8j3l5a",
  "rating": 4.5,
  "comment": "Mentor sangat membantu dalam menjelaskan konsep dasar JavaScript"
}
```

**Response**:

```json
{
  "id": "clg2u3jk50001v9qt7s8j3l5d",
  "mentorId": "clg2u3jk50000v9qt7s8j3l5a",
  "userId": "clg2u3jk50000v9qt7s8j3l5c",
  "rating": 4.5,
  "comment": "Mentor sangat membantu dalam menjelaskan konsep dasar JavaScript",
  "createdAt": "2023-06-16T13:00:00Z"
}
```

### Meeting API

#### `POST /api/v1/meetings/create`

Membuat Zoom meeting untuk booking.

**Request**:

```json
{
  "bookingId": "clg2u3jk50000v9qt7s8j3l5b",
  "mentorId": "clg2u3jk50000v9qt7s8j3l5a",
  "studentId": "clg2u3jk50000v9qt7s8j3l5c",
  "topic": "Sesi Mentoring dengan Budi Santoso",
  "startTime": "2023-06-15T13:00:00Z",
  "duration": 60
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "123456789",
    "join_url": "https://zoom.us/j/123456789",
    "start_url": "https://zoom.us/s/123456789",
    "password": "123456"
  }
}
```

### Payment API

#### `POST /api/v1/payment/token`

Membuat token pembayaran untuk integrasi dengan payment gateway.

**Request**:
```json
{
  "price": 350000,
  "orderId": "clg2u3jk50000v9qt7s8j3l5b"
}
```

**Response**:
```json
{
  "token": "payment-token-string",
  "redirectUrl": "https://payment-gateway.com/checkout"
}
```

## Database Schema

### User

- `id`: String (Primary Key)
- `name`: String
- `email`: String (Unique)
- `emailVerified`: DateTime
- `phone`: String
- `location`: String
- `hasCompletedOnboarding`: Boolean
- `bio`: Text
- `profileImage`: String
- `interests`: String[]
- `isMentor`: Boolean
- `expertise`: String[]
- `rate`: Float
- `rating`: Float
- `reviewCount`: Int
- `completedSessions`: Int
- `totalHours`: Float
- `mentorCount`: Int

### Booking

- `id`: String (Primary Key)
- `mentorId`: String (Foreign Key)
- `studentId`: String (Foreign Key)
- `topic`: String
- `date`: DateTime
- `duration`: Int
- `status`: String (pending, confirmed, completed, cancelled)
- `zoomMeetingId`: String
- `zoomJoinUrl`: Text
- `zoomStartUrl`: Text
- `zoomPassword`: String
- `notes`: Text
- `orderId`: String
- `reviewed`: Boolean

### Review

- `id`: String (Primary Key)
- `mentorId`: String (Foreign Key)
- `userId`: String (Foreign Key)
- `rating`: Float
- `comment`: Text
- `createdAt`: DateTime

### Experience

- `id`: String (Primary Key)
- `userId`: String (Foreign Key)
- `company`: String
- `position`: String
- `duration`: String
- `description`: String

### Education

- `id`: String (Primary Key)
- `userId`: String (Foreign Key)
- `institution`: String
- `degree`: String
- `year`: String

### Availability

- `id`: String (Primary Key)
- `userId`: String (Foreign Key)
- `day`: String
- `slots`: String[]

## Instalasi dan Konfigurasi

1. Clone repositori

   ```bash
   git clone https://github.com/username/learnmate.git
   cd learnmate
   ```

2. Instal dependensi

   ```bash
   npm install
   ```

3. Konfigurasi variabel lingkungan

   ```
   # .env
   DATABASE_URL="postgresql://user:password@localhost:5432/learnmate"
   DIRECT_URL="postgresql://user:password@localhost:5432/learnmate"
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"

   # Zoom API credentials
   ZOOM_CLIENT_ID="your-zoom-client-id"
   ZOOM_CLIENT_SECRET="your-zoom-client-secret"
   ZOOM_ACCOUNT_ID="your-zoom-account-id"
   
   # Payment gateway credentials
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
   MIDTRANS_SERVER_KEY="your-midtrans-server-key"
   ```

4. Siapkan database dan jalankan migrasi

   ```bash
   npx prisma migrate dev
   ```

5. Seed database dengan data awal

   ```bash
   npx prisma db seed
   ```

6. Jalankan aplikasi

   ```bash
   npm run dev
   ```

7. Buka browser dan akses `http://localhost:3000`

## Pengembangan ke Depan

- [ ] Implementasi sistem pembayaran lanjutan dengan metode pembayaran lebih beragam
- [ ] Fitur chat real-time untuk komunikasi mentor-mentee
- [ ] Sistem notifikasi lanjutan dengan email, SMS dan push notifications
- [ ] Rekomendasi mentor berbasis AI berdasarkan profil dan preferensi pengguna
- [ ] Mobile app integration dengan React Native
- [ ] Fitur grup mentoring untuk sesi dengan banyak peserta
- [ ] Integrasi kalender untuk sinkronisasi jadwal
- [ ] Sistem sertifikasi untuk mentor dan mentee

## Kontributor

- Dwi Candra Andika (F55123028)
- Aqilah Nur Aisyah Putri (F55123022)
- Siti Nurvatika (F55123009)
- Fahril Antonio Hande (F55123031)
- Vicram Lambenu (F55123005)

## Lisensi

Hak Cipta © 2025 LearnMate. Seluruh hak dilindungi.

---

Dokumentasi dibuat dengan 💙 untuk LearnMate.
