FROM node:20.10.0

WORKDIR /app

COPY package*.json ./

COPY .env .env

COPY . .

RUN npm install

# RUN npx prisma generate

EXPOSE 3001

ENTRYPOINT [ "bash" ]