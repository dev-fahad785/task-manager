#!/bin/bash

# Fix permissions for WhatsApp auth folders
echo "Fixing permissions for WhatsApp auth folders..."

# Get current user and group
CURRENT_USER=$(whoami)
CURRENT_GROUP=$(id -gn)

# Path to the backend folder
BACKEND_PATH="/home/rf-gul/Desktop/New Folder/study/self-learning/1-web/fullstack-projects/5-task-manager/backend"

# Create directories if they don't exist
mkdir -p "$BACKEND_PATH/.wwebjs_auth"
mkdir -p "$BACKEND_PATH/.wwebjs_cache"

# Fix ownership
sudo chown -R $CURRENT_USER:$CURRENT_GROUP "$BACKEND_PATH/.wwebjs_auth"
sudo chown -R $CURRENT_USER:$CURRENT_GROUP "$BACKEND_PATH/.wwebjs_cache"

# Fix permissions
chmod -R u+rwX "$BACKEND_PATH/.wwebjs_auth"
chmod -R u+rwX "$BACKEND_PATH/.wwebjs_cache"

echo "✅ Permissions fixed successfully!"
echo "You can now run: docker-compose up"
