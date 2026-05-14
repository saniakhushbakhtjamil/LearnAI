FROM node:20-alpine
WORKDIR /app

# better-sqlite3 needs native build tools on alpine. Install, build, and
# clean up in a single layer to keep the image small.
RUN apk add --no-cache --virtual .build-deps python3 make g++

COPY package*.json ./
RUN npm ci --omit=dev \
 && apk del .build-deps

COPY server.js ./
COPY lib/ ./lib/
COPY public/ ./public/

# Copy the Almari kit from the vendored submodule into public/kit/ so prod
# does not depend on the dev-only /kit static mount.
COPY vendor/almari-kit/design/kit/ ./public/kit/

# Mountpoint for the SQLite volume — must exist before the container starts.
RUN mkdir -p /data

EXPOSE 3000
CMD ["node", "server.js"]
