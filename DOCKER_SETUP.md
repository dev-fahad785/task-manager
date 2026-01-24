# Docker Setup - Development & Production

## 🎯 Solutions Implemented

### Issue 1: Hot-Reload (No More Container Rebuilds!)
✅ **Fixed**: Added volume mounts for source code
- Changes to frontend/backend code now reflect **immediately**
- No need to rebuild containers during development

### Issue 2: Permission Issues with `.wwebjs_auth`
✅ **Fixed**: Container runs as your user (not root)
- No more `sudo chown` commands needed
- Permissions are automatically correct

---

## 🚀 Quick Start

### First Time Setup
1. **Fix existing permissions** (one-time only):
   ```bash
   ./fix-permissions.sh
   ```

2. **Start development environment**:
   ```bash
   docker-compose up
   ```

### Daily Development Workflow
```bash
# Start containers
docker-compose up

# Make changes to your code
# Changes auto-reload! ✨

# Stop containers
docker-compose down
```

---

## 📋 Available Commands

### Development Mode (with hot-reload)
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild if you change dependencies (package.json)
docker-compose up --build
```

### Production Mode (optimized build)
```bash
# Build and run production containers
docker-compose -f docker-compose.prod.yml up --build

# Run in background
docker-compose -f docker-compose.prod.yml up -d

# Stop
docker-compose -f docker-compose.prod.yml down
```

---

## 🔧 What Changed?

### `docker-compose.yml` (Development)
- ✅ Added source code volume mounts for hot-reload
- ✅ Added `user: "${UID:-1000}:${GID:-1000}"` to run as your user
- ✅ Frontend now runs Vite dev server on port **5173**
- ✅ Backend uses nodemon for auto-restart

### `docker-compose.prod.yml` (Production)
- ✅ Builds optimized production images
- ✅ Frontend served via Nginx
- ✅ Backend runs with node (no nodemon)
- ✅ Still includes user mapping for `.wwebjs_auth`

### Dockerfiles
- **Frontend**: Multi-stage build with `development` and `production` targets
- **Backend**: Uses nodemon for development hot-reload

---

## 🎯 Port Mapping

| Service  | Development | Production |
|----------|-------------|------------|
| Frontend | 3000 → 5173 | 3000 → 80  |
| Backend  | 5000 → 5000 | 5000 → 5000|

---

## 🐛 Troubleshooting

### Permission errors still occurring?
```bash
# Run the fix script again
./fix-permissions.sh

# Restart containers
docker-compose down
docker-compose up
```

### Changes not reflecting?
```bash
# For frontend: Check browser console for Vite connection
# For backend: Check logs for nodemon restart messages
docker-compose logs -f backend
```

### Need to rebuild after changing package.json?
```bash
docker-compose up --build
```

---

## 📝 Notes

- **Development**: Use `docker-compose up` for daily work
- **Production**: Use `docker-compose -f docker-compose.prod.yml up` for deployment
- **WhatsApp Auth**: Persisted in `.wwebjs_auth` folder, no need to rescan QR code
- **User Mapping**: Containers run as UID/GID 1000 by default (configurable in `.env`)
