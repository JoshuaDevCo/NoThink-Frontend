# Add lockfile and package.json's of isolated subworkspace
FROM node:20-alpine AS installer
WORKDIR /app
COPY package.*json ./
RUN npm i


FROM node:20-alpine AS sourcer
WORKDIR /app
COPY --from=installer /app/package.json package.json
COPY --from=installer /app/node_modules node_modules
COPY .gitignore .gitignore
COPY . .
RUN npm run build

FROM ubuntu as runner

RUN apt-get update
RUN apt-get install nginx -y
EXPOSE 3000
COPY --from=sourcer /app/dist /var/www/html/
COPY --from=sourcer /app/nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]