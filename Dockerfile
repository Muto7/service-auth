# Gunakan image node.js versi 16 dengan Alpine Linux sebagai base image
FROM node:16-alpine

# Set working directory di dalam container
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json ke dalam working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Salin kode aplikasi Anda ke dalam working directory di dalam container
COPY . .

# Expose port 5000 yang digunakan oleh aplikasi Anda
EXPOSE 5001

# Command untuk menjalankan aplikasi ketika container dijalankan
CMD ["node", "index.js"]