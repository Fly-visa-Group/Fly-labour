FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

# Cài production deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built files
COPY --from=builder /app/dist ./dist

# Tạo thư mục uploads
RUN mkdir -p uploads/jobs uploads/news

EXPOSE 3000
CMD ["node", "dist/main"]