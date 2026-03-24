# 🦅 Fly Labour Backend — NestJS + PostgreSQL

## 📁 Cấu trúc thư mục

```
fly-labour-backend/
├── src/
│   ├── main.ts                    → Entry point, khởi động server
│   ├── app.module.ts              → Module gốc, kết nối DB
│   ├── common/
│   │   └── guards/
│   │       ├── jwt-auth.guard.ts  → Bảo vệ route cần đăng nhập
│   │       └── admin.guard.ts     → Bảo vệ route chỉ admin
│   ├── modules/
│   │   ├── auth/                  → Đăng nhập, đăng ký, JWT
│   │   ├── users/                 → Quản lý người dùng
│   │   ├── jobs/                  → CRUD bài đăng việc làm
│   │   ├── applications/          → Đơn ứng tuyển
│   │   ├── categories/            → Danh mục ngành nghề
│   │   └── news/                  → Tin tức
│   └── database/
│       └── seeds/run-seeds.ts     → Tạo dữ liệu mẫu
├── uploads/                       → Ảnh upload (tự tạo)
├── .env.example                   → Mẫu file cấu hình
└── package.json
```

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT (làm theo đúng thứ tự)

### Bước 1 — Cài Node.js

Vào https://nodejs.org → tải bản **LTS** → cài đặt bình thường.

Kiểm tra:
```bash
node --version   # cần >= 18
npm --version    # cần >= 9
```

### Bước 2 — Cài PostgreSQL

Vào https://www.postgresql.org/download/ → tải phiên bản phù hợp hệ điều hành → cài đặt.

Khi cài nhớ:
- Đặt **password** cho user `postgres` (ví dụ: `123456`)
- Giữ **port mặc định 5432**

### Bước 3 — Tạo database

Mở **pgAdmin** (cài cùng PostgreSQL) hoặc dùng terminal:

```bash
# Dùng terminal (nếu đã cài psql)
psql -U postgres -c "CREATE DATABASE fly_labour;"

# HOẶC dùng pgAdmin:
# Chuột phải vào "Databases" → Create → Database → đặt tên: fly_labour → Save
```

### Bước 4 — Cấu hình .env

```bash
# Copy file mẫu
cp .env.example .env
```

Mở file `.env` và sửa thông tin:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=123456        ← mật khẩu bạn đặt khi cài Postgres
DB_NAME=fly_labour

JWT_SECRET=fly-labour-super-secret-2025
JWT_EXPIRES_IN=7d

PORT=3000
NODE_ENV=development
```

### Bước 5 — Cài dependencies

```bash
cd fly-labour-backend
npm install
```

### Bước 6 — Chạy backend

```bash
npm run start:dev
```

Thấy output này là thành công:
```
🦅 ================================
🚀 Backend:  http://localhost:3000
📖 API Docs: http://localhost:3000/api
🦅 ================================
```

### Bước 7 — Seed dữ liệu mẫu (chạy 1 lần)

Mở terminal **mới** (giữ terminal backend đang chạy):
```bash
npm run seed
```

Output thành công:
```
✅ Tạo 2 users (admin + user demo)
✅ Tạo 8 danh mục
✅ Tạo 5 việc làm mẫu
✅ Tạo 3 tin tức mẫu
🎉 Seed hoàn tất!
```

---

## 📡 Các API endpoints

| Method | URL | Mô tả |
|--------|-----|-------|
| POST | /auth/register | Đăng ký |
| POST | /auth/login | Đăng nhập → nhận token |
| GET | /auth/me | Thông tin tài khoản |
| GET | /jobs | Danh sách việc làm |
| GET | /jobs/hot | Việc làm hot |
| GET | /jobs/:id | Chi tiết bài đăng |
| POST | /jobs | [Admin] Tạo bài đăng |
| PATCH | /jobs/:id | [Admin] Cập nhật |
| DELETE | /jobs/:id | [Admin] Xóa |
| GET | /categories | Danh mục |
| POST | /applications | Nộp đơn ứng tuyển |
| GET | /applications | [Admin] Tất cả đơn |
| PATCH | /applications/:id/status | [Admin] Cập nhật trạng thái |
| GET | /users | [Admin] Danh sách users |
| GET | /news | Tin tức |

📖 **Xem đầy đủ tại**: http://localhost:3000/api (Swagger UI)

---

## 🔑 Tài khoản demo

| Loại | Email | Mật khẩu |
|------|-------|----------|
| Admin | admin@flylabour.com | Admin@123 |
| User | user@example.com | User@123 |

---

## 🔗 Kết nối Frontend

Frontend đang dùng mock data. Để kết nối với backend thật, sửa file
`fly-labour-frontend/src/services/api.ts` (tạo mới nếu chưa có):

```ts
import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3000',
})

// Tự động gắn token vào header
api.interceptors.request.use(config => {
  const auth = JSON.parse(localStorage.getItem('fly-labour-auth') || '{}')
  if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`
  return config
})
```

---

## ❗ Lỗi thường gặp

**Lỗi: "connect ECONNREFUSED 127.0.0.1:5432"**
→ PostgreSQL chưa chạy. Mở Services (Windows) tìm postgresql → Start

**Lỗi: "password authentication failed"**
→ Sai mật khẩu trong file .env, kiểm tra lại DB_PASSWORD

**Lỗi: "database fly_labour does not exist"**
→ Chưa tạo database, làm lại Bước 3
