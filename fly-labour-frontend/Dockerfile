# --- Stage 1: Build ---
FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Khai báo để Vite nhận biến môi trường lúc build code
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# --- Stage 2: Serve ---
FROM node:20-slim
WORKDIR /app

# Cài đặt server tĩnh
RUN npm install -g serve

# Copy file tĩnh đã build sang
COPY --from=builder /app/dist ./dist

# Dùng sh -c để lấy biến $PORT động của Railway (nếu không có thì mặc định 8080)
# Thêm tcp://0.0.0.0 để Railway có thể kết nối từ bên ngoài
CMD sh -c "serve -s dist -l tcp://0.0.0.0:${PORT:-8080}"