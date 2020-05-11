FROM node:12 as react

WORKDIR /app/frontend

# Install node packages
COPY ./frontend/package.json ./frontend/package-lock.json /app/frontend/
RUN npm install

# Copy in files
COPY ./frontend/src/    ./src
COPY ./frontend/public/ ./public

# Change the settings to local-prod
RUN mv ./src/settings/settings-local-prod.js ./src/settings/settings.js

# Build
RUN npm run build


# Use only the build directory from above for the nginx server
FROM nginx:latest

COPY --from=react --chown=nginx:nginx /app/frontend/build/ /var/www/frontend/
COPY ./nginx/nginx.conf /etc/nginx/
