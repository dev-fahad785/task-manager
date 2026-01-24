# Development stage
FROM node:18 AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Production stage: Build the Vite React app
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 3: Serve with Nginx
FROM nginx:alpine AS production

# Copy the build output to Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove default Nginx config and replace with custom (optional)
 COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
