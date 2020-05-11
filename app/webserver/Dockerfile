FROM node:12 as react

WORKDIR /app/frontend

COPY ./frontend/package.json ./frontend/package-lock.json /app/frontend/
RUN npm install

COPY ./frontend/src/    /app/frontend/src
COPY ./frontend/public/ /app/frontend/public
RUN npm run build

FROM nginx:latest

COPY --from=react --chown=nginx:nginx /app/frontend/build/ /var/www/frontend/
COPY ./nginx/nginx.conf /etc/nginx/
