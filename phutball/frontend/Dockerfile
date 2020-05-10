FROM node:12 as react

WORKDIR /app/frontend

COPY package.json package-lock.json /app/frontend/
RUN npm install

COPY ./src/ /app/frontend/src
COPY ./public/ /app/frontend/public
RUN npm run build


FROM nginx:latest

#RUN useradd -ms /bin/bash nginx;
#USER nginx;

COPY --from=react --chown=nginx:nginx /app/frontend/ /var/www/frontend/
COPY ./nginx.conf /etc/nginx/