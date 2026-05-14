FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY server.js ./
COPY public/ ./public/

# Copy the Almari kit from the vendored submodule into public/kit/ so prod
# does not depend on the dev-only /kit static mount.
COPY vendor/almari-kit/design/kit/ ./public/kit/

EXPOSE 3000
CMD ["node", "server.js"]
