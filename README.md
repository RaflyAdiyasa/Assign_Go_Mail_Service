# AssignGo API Documentation

AssignGo adalah sistem pengajuan surat tugas dengan dua peran utama: User dan Admin. Sistem ini terdiri dari dua service terpisah:
1. User Service - Mengelola pengguna, autentikasi, dan daftar NIM
2. Surat Service - Mengelola surat tugas dan riwayat status

## Base URLs

- User Service: `http://localhost:5000`
- Surat Service: `http://localhost:5001`

## Autentikasi

Semua endpoint yang dilindungi memerlukan token JWT yang dikirimkan melalui header Authorization dalam format:

```
Authorization: Bearer [token]
```

---

## User Service API

### Auth Endpoints

#### Register User

Mendaftarkan pengguna baru dengan NIM yang sudah terdaftar di sistem.

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:
```json
{
  "nim": "123456",
  "username": "johndoe",
  "password": "password123"
}
```

**Success Response**:
- **Code**: 201 Created
- **Content**:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nim": "123456",
    "username": "johndoe",
    "role": "user"
  }
}
```

**Error Responses**:
- **Code**: 400 Bad Request
  - NIM tidak terdaftar di sistem
  - User dengan NIM tersebut sudah ada
- **Code**: 500 Internal Server Error

#### Login

Melakukan autentikasi pengguna.

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:
```json
{
  "nim": "123456",
  "password": "password123"
}
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nim": "123456",
    "username": "johndoe",
    "role": "user"
  }
}
```

**Error Responses**:
- **Code**: 404 Not Found - User tidak ditemukan
- **Code**: 401 Unauthorized - Password salah
- **Code**: 500 Internal Server Error

#### Refresh Token

Memperbaharui token akses menggunakan refresh token.

- **URL**: `/api/auth/refresh-token`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**:
- **Code**: 401 Unauthorized - Refresh token diperlukan
- **Code**: 403 Forbidden - Refresh token tidak valid
- **Code**: 500 Internal Server Error

#### Logout

Menghapus refresh token dari database.

- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Auth Required**: Yes

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "message": "Logout successful"
}
```

**Error Responses**:
- **Code**: 401 Unauthorized - Token tidak ada
- **Code**: 403 Forbidden - Token tidak valid
- **Code**: 404 Not Found - User tidak ditemukan
- **Code**: 500 Internal Server Error

### User Endpoints

#### Get User Profile

Mendapatkan profil pengguna yang sedang login.

- **URL**: `/api/users/profile`
- **Method**: `GET`
- **Auth Required**: Yes

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "user": {
    "id": 1,
    "nim": "123456",
    "username": "johndoe",
    "role": "user",
    "createdAt": "2023-02-15T12:00:00.000Z",
    "updatedAt": "2023-02-15T12:00:00.000Z"
  }
}
```

**Error Responses**:
- **Code**: 401 Unauthorized - Token tidak ada
- **Code**: 403 Forbidden - Token tidak valid
- **Code**: 404 Not Found - User tidak ditemukan
- **Code**: 500 Internal Server Error

#### Update User Profile

Memperbarui profil pengguna.

- **URL**: `/api/users/profile`
- **Method**: `PUT`
- **Auth Required**: Yes

**Request Body**:
```json
{
  "username": "johndoe_updated"
}
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "nim": "123456",
    "username": "johndoe_updated",
    "role": "user"
  }
}
```

**Error Responses**:
- **Code**: 401 Unauthorized - Token tidak ada
- **Code**: 403 Forbidden - Token tidak valid
- **Code**: 404 Not Found - User tidak ditemukan
- **Code**: 500 Internal Server Error

#### Update Password

Memperbarui password pengguna.

- **URL**: `/api/users/password`
- **Method**: `PUT`
- **Auth Required**: Yes

**Request Body**:
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "message": "Password updated successfully"
}
```

**Error Responses**:
- **Code**: 401 Unauthorized - Password saat ini salah
- **Code**: 403 Forbidden - Token tidak valid
- **Code**: 404 Not Found - User tidak ditemukan
- **Code**: 500 Internal Server Error

#### Get All Users (Admin only)

Mendapatkan daftar semua pengguna biasa (bukan admin).

- **URL**: `/api/users`
- **Method**: `GET`
- **Auth Required**: Yes (Admin)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "users": [
    {
      "id": 1,
      "nim": "123456",
      "username": "johndoe",
      "createdAt": "2023-02-15T12:00:00.000Z",
      "updatedAt": "2023-02-15T12:00:00.000Z"
    },
    {
      "id": 2,
      "nim": "234567",
      "username": "janedoe",
      "createdAt": "2023-02-16T12:00:00.000Z",
      "updatedAt": "2023-02-16T12:00:00.000Z"
    }
  ]
}
```

**Error Responses**:
- **Code**: 401 Unauthorized - Token tidak ada
- **Code**: 403 Forbidden - Akses admin diperlukan
- **Code**: 500 Internal Server Error

#### Get User Stats (Admin only)

Mendapatkan statistik pengguna.

- **URL**: `/api/users/stats`
- **Method**: `GET`
- **Auth Required**: Yes (Admin)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "totalUsers": 10,
  "monthlyStats": [
    {
      "month": "January",
      "year": 2023,
      "count": 3
    },
    {
      "month": "February",
      "year": 2023,
      "count": 5
    },
    {
      "month": "March",
      "year": 2023,
      "count": 2
    }
  ]
}
```

**Error Responses**:
- **Code**: 401 Unauthorized - Token tidak ada
- **Code**: 403 Forbidden - Akses admin diperlukan
- **Code**: 500 Internal Server Error

### NIM Management Endpoints (Admin only)

#### Add NIM

Menambahkan NIM baru yang dapat digunakan untuk registrasi.

- **URL**: `/api/nims`
- **Method**: `POST`
- **Auth Required**: Yes (Admin)

**Request Body**:
```json
{
  "nim": "123456"
}
```

**Success Response**:
- **Code**: 201 Created
- **Content**:
```json
{
  "message": "NIM registered successfully",
  "nim": {
    "id": 1,
    "nim": "123456",
    "status": true,
    "createdAt": "2023-02-15T12:00:00.000Z",
    "updatedAt": "2023-02-15T12:00:00.000Z"
  }
}
```

**Error Responses**:
- **Code**: 400 Bad Request - NIM sudah terdaftar
- **Code**: 401 Unauthorized - Token tidak ada
- **Code**: 403 Forbidden - Akses admin diperlukan
- **Code**: 500 Internal Server Error

#### Add Multiple NIMs

Menambahkan beberapa NIM sekaligus.

- **URL**: `/api/nims/bulk`
- **Method**: `POST`
- **Auth Required**: Yes (Admin)

**Request Body**:
```json
{
  "nims": ["123456", "234567", "345678"]
}
```

**Success Response**:
- **Code**: 201 Created
- **Content**:
```json
{
  "message": "NIMs registered successfully",
  "total": 3,
  "nims": [
    {
      "id": 1,
      "nim": "123456",
      "status": true,
      "createdAt": "2023-02-15T12:00:00.000Z",
      "updatedAt": "2023-02-15T12:00:00.000Z"
    },
    {
      "id": 2,
      "nim": "234567",
      "status": true,
      "createdAt": "2023-02-15T12:00:00.000Z",
      "updatedAt": "2023-02-15T12:00:00.000Z"
    },
    {
      "id": 3,
      "nim": "345678",
      "status": true,
      "createdAt": "2023-02-15T12:00:00.000Z",
      "updatedAt": "2023-02-15T12:00:00.000Z"
    }
  ]
}
```

**Error Responses**:
- **Code**: 400 Bad Request - Input tidak valid atau semua NIM sudah terdaftar
- **Code**: 401 Unauthorized - Token tidak ada
- **Code**: 403 Forbidden - Akses admin diperlukan
- **Code**: 500 Internal Server Error

#### Get All NIMs

Mendapatkan daftar semua NIM yang terdaftar.

- **URL**: `/api/nims`
- **Method**: `GET`
- **Auth Required**: Yes (Admin)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "nims": [
    {
      "id": 1,
      "nim": "123456",
      "status": true,
      "createdAt": "2023-02-15T12:00:00.000Z"
    },
    {
      "id": 2,
      "nim": "234567",
      "status": true,
      "createdAt": "2023-02-15T12:00:00.000Z"
    }
  ]
}
```

**Error Responses**:
- **Code**: 401 Unauthorized - Token tidak ada
- **Code**: 403 Forbidden - Akses admin diperlukan
- **Code**: 500 Internal Server Error

#### Deactivate NIM

Menonaktifkan NIM agar tidak dapat digunakan untuk registrasi.

- **URL**: `/api/nims/deactivate/:nimId`
- **Method**: `PUT`
- **Auth Required**: Yes (Admin)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "message": "NIM deactivated successfully",
  "nim": {
    "id": 1,
    "nim": "123456",
    "status": false,
    "createdAt": "2023-02-15T12:00:00.000Z",
    "updatedAt": "2023-02-15T13:00:00.000Z"
  }
}
```

**Error Responses**:
- **Code**: 401 Unauthorized - Token tidak ada
- **Code**: 403 Forbidden - Akses admin diperlukan
- **Code**: 404 Not Found - NIM tidak ditemukan
- **Code**: 500 Internal Server Error

#### Activate NIM

Mengaktifkan kembali NIM yang dinonaktifkan.

- **URL**: `/api/nims/activate/:nimId`
- **Method**: `PUT`
- **Auth Required**: Yes (Admin)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "message": "NIM activated successfully",
  "nim": {
    "id": 1,
    "nim": "123456",
    "status": true,
    "createdAt": "2023-02-15T12:00:00.000Z",
    "updatedAt": "2023-02-15T14:00:00.000Z"
  }
}
```

**Error Responses**:
- **Code**: 401 Unauthorized - Token tidak ada
- **Code**: 403 Forbidden - Akses admin diperlukan
- **Code**: 404 Not Found - NIM tidak ditemukan
- **Code**: 500 Internal Server Error

---

## Surat Service API

### Mail Endpoints

#### Submit Mail (User only)

Mengajukan surat tugas baru.

- **URL**: `/api/mails`
- **Method**: `POST`
- **Auth Required**: Yes (User)

**Request Body**:
```json
{
  "url_file_surat": "https://example.com/surat123.pdf",
  "subject_surat": "Surat Tugas Penelitian"
}
```

**Success Response**:
- **Code**: 201 Created
- **Content**:
```json
{
  "message": "Mail submitted successfully",
  "mail": {
    "id": 1,
    "id_pengirim": 1,
    "url_file_surat": "https://example.com/surat123.pdf",
    "subject_surat": "Surat Tugas Penelitian",
    "tanggal_pengiriman": "2023-02-15T12:00:00.000Z",
    "createdAt": "2023-02-15T12:00:00.000Z",
    "updatedAt": "2023-02-15T12:00:00.000Z"
  }
}
```

**Error Responses**:
- **Code**: 401 Unauthorized - Token tidak ada
- **Code**: 403 Forbidden - Akses user diperlukan
- **Code**: 500 Internal Server Error

#### Get Template Surat Tugas

Mendapatkan template surat tugas.

- **URL**: `/api/mails/template`
- **Method**: `GET`
- **Auth Required**: Yes

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "message": "Template retrieved successfully",
  "templateUrl": "https://example.com/template_surat_tugas.docx"
}
```

**Error Responses**:
- **Code**: 401 Unauthorized - Token tidak ada
- **Code**: 403 Forbidden - Token tidak valid
- **Code**: 500 Internal Server Error

#### Get User's Mails

Mendapatkan daftar surat tugas yang diajukan oleh pengguna yang sedang login.

- **URL**: `/api/mails/user`
- **Method**: `GET`
- **Auth Required**: Yes

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "mails": [
    {
      "id": 1,
      "id_pengirim": 1,
      "url_file_surat": "https://example.com/surat123.pdf",
      "subject_surat": "Surat Tugas Penelitian",
      "tanggal_pengiriman": "2023-02-15T12:00:00.000Z",
      "createdAt": "2023-02-15T12:00:00.000Z",
      "updatedAt": "2023-02-15T12:00:00.000Z",
      "latestStatus": "diproses",
      "alasan": null,
      "tanggal_update": "2023-02-15T12:00:00.000Z"
    },
    {
      "id": 2,
      "id_pengirim": 1,
      "url_file_surat": "https://example.com/surat456.pdf",
      "subject_surat": "Surat Tugas Seminar",
      "tanggal_pengiriman": "2023-02-16T12:00:00.000Z",
      "createdAt": "2023-02-16T12:00:00.000Z",
      "updatedAt": "2023-02-16T12:00:00.000Z",
      "latestStatus": "disetujui",
      "alasan": null,
      "tanggal_update": "2023-02-17T12:00:00.000Z"
    }
  ]
}
```

**Error Responses**:
- **Code**: 401 Unauthorized - Token tidak ada
- **Code**: 403 Forbidden - Token tidak valid
- **Code**: 500 Internal Server Error

#### Get Mail Details

Mendapatkan detail surat tugas tertentu.

- **URL**: `/api/mails/details/:mailId`
- **Method**: `GET`
- **Auth Required**: Yes

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "mail": {
    "id": 1,
    "id_pengirim": 1,
    "url_file_surat": "https://example.com/surat123.pdf",
    "subject_surat": "Surat Tugas Penelitian",
    "tanggal_pengiriman": "2023-02-15T12:00:00.000Z",
    "createdAt": "2023-02-15T12:00:00.000Z",
    "updatedAt": "2023-02-15T12:00:00.000Z",
    "Histories": [
      {
        "id": 1,
        "status": "diproses",
        "alasan": null,
        "tanggal_update": "2023-02-15T12:00:00.000Z"
      }
    ]
  }
}
```

**Error Responses**:
- **Code**: 401 Unauthorized - Token tidak ada
- **Code**: 403 Forbidden - Token tidak valid atau tidak berhak mengakses surat ini
- **Code**: 404 Not Found - Surat tidak ditemukan
- **Code**: 500 Internal Server Error

#### Get All Mails (Admin only)

Mendapatkan daftar semua surat tugas.

- **URL**: `/api/mails`
- **Method**: `GET`
- **Auth Required**: Yes (Admin)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "mails": [
    {
      "id": 1,
      "id_pengirim": 1,
      "url_file_surat": "https://example.com/surat123.pdf",
      "subject_surat": "Surat Tugas Penelitian",
      "tanggal_pengiriman": "2023-02-15T12:00:00.000Z",
      "createdAt": "2023-02-15T12:00:00.000Z",
      "updatedAt": "2023-02-15T12:00:00.000Z",
      "latestStatus": "diproses",
      "alasan": null,
      "tanggal_update": "2023-02-15T12:00:00.000Z"
    },
    {
      "id": 2,
      "id_pengirim": 2,
      "url_file_surat": "https://example.com/surat456.pdf",
      "subject_surat": "Surat Tugas Seminar",
      "tanggal_pengiriman": "2023-02-16T12:00:00.000Z",
      "createdAt": "2023-02-16T12:00:00.000Z",
      "updatedAt": "2023-02-16T12:00:00.000Z",
      "latestStatus": "disetujui",
      "alasan": null,
      "tanggal_update": "2023-02-17T12:00:00.000Z"
    }
  ]
}
```

**Error Responses**:
- **Code**: 401 Unauthorized - Token tidak ada
- **Code**: 403 Forbidden - Akses admin diperlukan
- **Code**: 500 Internal Server Error

#### Get Mail Stats (Admin only)

Mendapatkan statistik surat tugas.

- **URL**: `/api/mails/stats`
- **Method**: `GET`
- **Auth Required**: Yes (Admin)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "totalMails": 10,
  "mailsByStatus": [
    {
      "status": "diproses",
      "count": 3
    },
    {
      "status": "disetujui",
      "count": 5
    },
    {
      "status": "ditolak",
      "count": 2
    }
  ],
  "monthlyStats": [
    {
      "month": "January",
      "year": 2023,
      "count": 4
    },
    {
      "month": "February",
      "year": 2023,
      "count": 6
    }
  ]
}
```

**Error Responses**:
- **Code**: 401 Unauthorized - Token tidak ada
- **Code**: 403 Forbidden - Akses admin diperlukan
- **Code**: 500 Internal Server Error

### History Endpoints

#### Get Mail History

Mendapatkan riwayat status surat tugas tertentu.

- **URL**: `/api/history/:mailId`
- **Method**: `GET`
- **Auth Required**: Yes

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "history": [
    {
      "id": 2,
      "id_surat": 1,
      "status": "disetujui",
      "alasan": null,
      "tanggal_update": "2023-02-17T12:00:00.000Z",
      "createdAt": "2023-02-17T12:00:00.000Z",
      "updatedAt": "2023-02-17T12:00:00.000Z"
    },
    {
      "id": 1,
      "id_surat": 1,
      "status": "diproses",
      "alasan": null,
      "tanggal_update": "2023-02-15T12:00:00.000Z",
      "createdAt": "2023-02-15T12:00:00.000Z",
      "updatedAt": "2023-02-15T12:00:00.000Z"
    }
  ]
}
```

**Error Responses**:
- **Code**: 401 Unauthorized - Token tidak ada
- **Code**: 403 Forbidden - Token tidak valid atau tidak berhak mengakses riwayat surat ini
- **Code**: 404 Not Found - Surat tidak ditemukan
- **Code**: 500 Internal Server Error

#### Update Mail Status (Admin only)

Memperbarui status surat tugas.

- **URL**: `/api/history/:mailId`
- **Method**: `POST`
- **Auth Required**: Yes (Admin)

**Request Body (untuk status disetujui)**:
```json
{
  "status": "disetujui"
}
```

**Request Body (untuk status ditolak)**:
```json
{
  "status": "ditolak",
  "alasan": "Format surat tidak sesuai dengan ketentuan"
}
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "message": "Mail status updated to disetujui",
  "history": {
    "id": 2,
    "id_surat": 1,
    "status": "disetujui",
    "alasan": null,
    "tanggal_update": "2023-02-17T12:00:00.000Z",
    "createdAt": "2023-02-17T12:00:00.000Z",
    "updatedAt": "2023-02-17T12:00:00.000Z"
  }
}
```

**Error Responses**:
- **Code**: 401 Unauthorized - Token tidak ada
- **Code**: 403 Forbidden - Akses admin diperlukan
- **Code**: 404 Not Found - Surat tidak ditemukan
- **Code**: 500 Internal Server Error