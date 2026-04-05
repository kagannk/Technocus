FROM node:20-alpine

WORKDIR /app

# Sabit bağımlılıkları build aşamasında kopyalayıp kuruyoruz.
# Bu sayede container ayağa kalktığında node_modules eksikliğinden 'next: not found' hatası vermeyecek.
COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
