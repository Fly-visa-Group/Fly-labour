FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Cài đặt toàn bộ dependencies (bao gồm cả dev để có nest cli)
RUN npm install

COPY . .

# Build ra thư mục dist
RUN npm run build

# Xóa bớt rác để nhẹ image (tùy chọn)
# RUN npm prune --production

RUN mkdir -p uploads/jobs uploads/news

# Railway tự động inject PORT, không cần EXPOSE cứng 3000
CMD ["node", "dist/main"]