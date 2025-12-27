# # Base image
# FROM node:18

# # Install Chromium dependencies
# RUN apt-get update && apt-get install -y \
#     wget \
#     ca-certificates \
#     fonts-liberation \
#     libappindicator3-1 \
#     libasound2 \
#     libatk-bridge2.0-0 \
#     libatk1.0-0 \
#     libcups2 \
#     libdbus-1-3 \
#     libgdk-pixbuf2.0-0 \
#     libnspr4 \
#     libnss3 \
#     libx11-xcb1 \
#     libxcomposite1 \
#     libxdamage1 \
#     libxrandr2 \
#     xdg-utils \
#     libdrm2 \
#     libgbm1 \
#     libxshmfence1 \
#     libxext6 \
#     libxfixes3 \
#     libglib2.0-0 \
#     libjpeg-dev \
#     --no-install-recommends && \
#     apt-get clean && rm -rf /var/lib/apt/lists/*

# # Create app directory
# WORKDIR /app

# # Install dependencies
# COPY package*.json ./
# RUN npm install --production

# # Copy source code
# COPY . .

# # Expose backend port
# EXPOSE 5000

# # Start the app
# CMD ["node", "index.js"]

FROM node:18

# Install Chromium and dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libdrm2 \
    libgbm1 \
    libxshmfence1 \
    libxext6 \
    libxfixes3 \
    libglib2.0-0 \
    libjpeg-dev \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Puppeteer environment variables
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy app source
COPY . .

# Expose backend port
EXPOSE 5000

# Start the app
CMD ["node", "index.js"]