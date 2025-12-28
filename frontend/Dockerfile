FROM node:20-alpine

WORKDIR /app

# зависимости
COPY package.json package-lock.json* ./
RUN npm install

# код
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
